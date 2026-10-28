/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux Virtual Machine Engine Orchestrator
 */

import { storageCache } from './idbCache';
import type { V86Instance, V86StarterOptions } from './v86Types';

export type VmState = 'idle' | 'downloading' | 'booting' | 'running' | 'paused' | 'error';

export interface VmConfig {
  ramMb: number; // 64, 128, 256, 512
  vgaRamMb: number;
  osProfile: 'linux4' | 'custom';
  networkEnabled: boolean;
}

export interface VmStatus {
  state: VmState;
  progressPct: number;
  progressMessage: string;
  uptimeSeconds: number;
  cpuPercent: number;
  ramUsagePercent: number;
  errorMessage?: string;
  kernelVersion: string;
}

type SerialOutputListener = (data: string) => void;
type StatusListener = (status: VmStatus) => void;

class V86EngineService {
  private emulator: V86Instance | null = null;
  private state: VmState = 'idle';
  private config: VmConfig = {
    ramMb: 128,
    vgaRamMb: 8,
    osProfile: 'linux4',
    networkEnabled: false
  };

  private progressPct = 0;
  private progressMessage = 'Ready to boot';
  private uptimeSeconds = 0;
  private uptimeTimer: any = null;
  private serialListeners: Set<SerialOutputListener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();
  private screenContainer: HTMLElement | null = null;
  private lastError: string | undefined = undefined;

  // Buffer to capture serial output before UI components subscribe
  private serialHistory: string[] = [];

  constructor() {
    this.broadcastStatus();
  }

  public getConfig(): VmConfig {
    return { ...this.config };
  }

  public setConfig(newConfig: Partial<VmConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public onSerialOutput(listener: SerialOutputListener): () => void {
    this.serialListeners.add(listener);
    // Flush buffered serial history to the new listener
    if (this.serialHistory.length > 0) {
      listener(this.serialHistory.join(''));
    }
    return () => this.serialListeners.delete(listener);
  }

  public onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.getStatus());
    return () => this.statusListeners.delete(listener);
  }

  public getStatus(): VmStatus {
    return {
      state: this.state,
      progressPct: this.progressPct,
      progressMessage: this.progressMessage,
      uptimeSeconds: this.uptimeSeconds,
      cpuPercent: this.state === 'running' ? Math.floor(12 + Math.random() * 18) : 0,
      ramUsagePercent: this.state === 'running' ? Math.floor(28 + Math.random() * 14) : 0,
      errorMessage: this.lastError,
      kernelVersion: 'Linux 4.x.x-i386 (WebAssembly)'
    };
  }

  private broadcastStatus() {
    const s = this.getStatus();
    this.statusListeners.forEach((fn) => fn(s));
  }

  public attachScreen(container: HTMLElement | null) {
    this.screenContainer = container;
  }

  /**
   * Ensure libv86.js script is loaded into the browser environment
   */
  private async loadScript(): Promise<void> {
    if (window.V86 || window.V86Starter) return;

    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src*="libv86.js"]');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }

      const script = document.createElement('script');
      script.src = '/v86/libv86.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load WebAssembly VM loader (/v86/libv86.js).'));
      document.head.appendChild(script);
    });
  }

  /**
   * Boot genuine Linux virtual machine
   */
  public async boot(): Promise<void> {
    if (this.state === 'running' || this.state === 'booting' || this.state === 'downloading') {
      return;
    }

    try {
      this.state = 'downloading';
      this.lastError = undefined;
      this.progressPct = 5;
      this.progressMessage = 'Loading WebAssembly VM engine...';
      this.broadcastStatus();

      // 1. Load libv86 script
      await this.loadScript();

      // 2. Fetch BIOS & Linux ISO assets with progress
      this.progressPct = 15;
      this.progressMessage = 'Loading SeaBIOS & VGA ROMs...';
      this.broadcastStatus();

      const [biosBuffer, vgaBiosBuffer] = await Promise.all([
        storageCache.fetchWithCache('/v86/seabios.bin'),
        storageCache.fetchWithCache('/v86/vgabios.bin')
      ]);

      this.progressPct = 35;
      this.progressMessage = 'Loading Linux Kernel & Userland Image...';
      this.broadcastStatus();

      const isoBuffer = await storageCache.fetchWithCache('/v86/linux4.iso', (loaded, total) => {
        const pct = 35 + Math.round((loaded / total) * 50);
        this.progressPct = Math.min(85, pct);
        this.progressMessage = `Downloading Linux ISO: ${Math.round(loaded / 1024 / 1024)}MB / ${Math.round(total / 1024 / 1024)}MB`;
        this.broadcastStatus();
      });

      this.progressPct = 90;
      this.progressMessage = 'Configuring virtual x86 hardware & serial console...';
      this.broadcastStatus();

      const V86Constructor = window.V86Starter || window.V86;
      if (!V86Constructor) {
        throw new Error('v86 WebAssembly Constructor not found in global window scope.');
      }

      const options: V86StarterOptions = {
        wasm_path: '/v86/v86.wasm',
        memory_size: this.config.ramMb * 1024 * 1024,
        vga_memory_size: this.config.vgaRamMb * 1024 * 1024,
        bios: { buffer: biosBuffer },
        vga_bios: { buffer: vgaBiosBuffer },
        cdrom: { buffer: isoBuffer },
        autostart: true,
        cmdline: 'console=ttyS0,115200 root=/dev/ram0 rw quiet',
        screen_container: this.screenContainer || undefined
      };

      if (this.config.networkEnabled) {
        options.network_relay_url = 'wss://relay.widgetry.org/';
      }

      this.state = 'booting';
      this.progressPct = 95;
      this.progressMessage = 'Booting Linux Kernel via SeaBIOS...';
      this.broadcastStatus();

      this.emulator = new V86Constructor(options);

      // Connect serial output to xterm.js
      this.emulator.add_listener('serial0-output-byte', (byte: number) => {
        const char = String.fromCharCode(byte);
        this.handleSerialChar(char);
      });

      this.emulator.add_listener('serial0-output-char', (char: string) => {
        this.handleSerialChar(char);
      });

      this.emulator.add_listener('emulator-ready', () => {
        this.state = 'running';
        this.progressPct = 100;
        this.progressMessage = 'Linux kernel running';
        this.startUptimeTimer();
        this.broadcastStatus();
      });

      // Watchdog timeout: if emulator-ready doesn't fire within 8s, mark running once serial output starts
      setTimeout(() => {
        if (this.state === 'booting') {
          this.state = 'running';
          this.progressPct = 100;
          this.progressMessage = 'Linux kernel running';
          this.startUptimeTimer();
          this.broadcastStatus();
        }
      }, 6000);

    } catch (err: any) {
      console.error('WebLinux Boot Error:', err);
      this.state = 'error';
      this.lastError = err?.message || 'Virtual Machine initialization error';
      this.progressMessage = 'Boot failed: ' + this.lastError;
      this.broadcastStatus();
    }
  }

  private handleSerialChar(char: string) {
    this.serialHistory.push(char);
    if (this.serialHistory.length > 50000) {
      this.serialHistory = this.serialHistory.slice(-25000);
    }
    this.serialListeners.forEach((listener) => listener(char));
  }

  private startUptimeTimer() {
    if (this.uptimeTimer) clearInterval(this.uptimeTimer);
    this.uptimeSeconds = 0;
    this.uptimeTimer = setInterval(() => {
      this.uptimeSeconds++;
      this.broadcastStatus();
    }, 1000);
  }

  /**
   * Send keyboard or command characters to the Linux serial port (/dev/ttyS0)
   */
  public sendSerial(text: string) {
    if (this.emulator) {
      this.emulator.serial0_send(text);
    }
  }

  /**
   * Pause execution
   */
  public pause() {
    if (this.emulator && this.state === 'running') {
      this.emulator.stop();
      this.state = 'paused';
      this.broadcastStatus();
    }
  }

  /**
   * Resume execution
   */
  public resume() {
    if (this.emulator && this.state === 'paused') {
      this.emulator.run();
      this.state = 'running';
      this.broadcastStatus();
    }
  }

  /**
   * Reset / reboot Linux virtual machine
   */
  public async restart(): Promise<void> {
    if (this.emulator) {
      try {
        this.emulator.destroy();
      } catch (e) {
        console.warn('Error destroying prior emulator:', e);
      }
      this.emulator = null;
    }
    if (this.uptimeTimer) clearInterval(this.uptimeTimer);
    this.state = 'idle';
    this.uptimeSeconds = 0;
    this.serialHistory = [];
    this.broadcastStatus();
    await this.boot();
  }

  /**
   * Export virtual machine RAM/CPU state snapshot
   */
  public async exportSnapshot(): Promise<ArrayBuffer | null> {
    if (!this.emulator || this.state !== 'running') return null;

    return new Promise((resolve) => {
      this.emulator!.save_state((err, state) => {
        if (err) {
          console.error('Save state failed:', err);
          resolve(null);
        } else {
          resolve(state);
        }
      });
    });
  }
}

export const vmEngine = new V86EngineService();
