/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - v86 x86 Emulator TypeScript Interfaces
 */

export interface V86BiosConfig {
  url?: string;
  buffer?: ArrayBuffer;
  async?: boolean;
}

export interface V86DiskConfig {
  url?: string;
  buffer?: ArrayBuffer;
  size?: number;
  async?: boolean;
}

export interface V86FilesystemConfig {
  baseurl?: string;
  basefs?: string | object;
}

export interface V86StarterOptions {
  wasm_path: string;
  memory_size?: number;
  vga_memory_size?: number;
  screen_container?: HTMLElement | null;
  serial_container_xterm?: HTMLElement | null;
  bios?: V86BiosConfig;
  vga_bios?: V86BiosConfig;
  cdrom?: V86DiskConfig;
  hda?: V86DiskConfig;
  bzimage?: V86DiskConfig;
  initrd?: V86DiskConfig;
  filesystem?: V86FilesystemConfig;
  cmdline?: string;
  autostart?: boolean;
  disable_keyboard?: boolean;
  disable_mouse?: boolean;
  network_relay_url?: string;
  preserve_mac_from_state_image?: boolean;
  initial_state?: { url?: string; buffer?: ArrayBuffer };
}

export interface V86Instance {
  add_listener(event: string, callback: (...args: any[]) => void): void;
  remove_listener(event: string, callback: (...args: any[]) => void): void;
  serial0_send(data: string): void;
  keyboard_send_scancodes(codes: number[]): void;
  keyboard_send_text(text: string): void;
  run(): void;
  stop(): void;
  restart(): void;
  destroy(): void;
  is_running(): boolean;
  save_state(callback: (error: Error | null, state: ArrayBuffer) => void): void;
  restore_state(state: ArrayBuffer, callback?: (error: Error | null) => void): void;
  set_scale(scaleX: number, scaleY: number): void;
}

declare global {
  interface Window {
    V86?: new (options: V86StarterOptions) => V86Instance;
    V86Starter?: new (options: V86StarterOptions) => V86Instance;
  }
}
