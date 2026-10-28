/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - xterm.js Serial Console Terminal
 */

import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { vmEngine, VmStatus } from '../../services/v86Engine';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Trash2, 
  Terminal as TerminalIcon,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const TerminalApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [vmStatus, setVmStatus] = useState<VmStatus>(vmEngine.getStatus());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubStatus = vmEngine.onStatusChange(setVmStatus);
    return () => unsubStatus();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize xterm.js terminal instance
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 13,
      lineHeight: 1.25,
      theme: {
        background: '#020617', // slate-950
        foreground: '#f8fafc',
        cursor: '#38bdf8', // sky-400
        selectionBackground: 'rgba(56, 189, 248, 0.3)',
        black: '#0f172a',
        red: '#f43f5e',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#d946ef',
        cyan: '#06b6d4',
        white: '#f1f5f9',
        brightBlack: '#475569',
        brightRed: '#fb7185',
        brightGreen: '#34d399',
        brightYellow: '#fbbf24',
        brightBlue: '#60a5fa',
        brightMagenta: '#e879f9',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff'
      },
      convertEol: true,
      scrollback: 10000
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();

    termRef.current = term;
    fitAddonRef.current = fitAddon;

    // Hook keyboard input -> send to Linux serial port
    const disposable = term.onData((data) => {
      vmEngine.sendSerial(data);
    });

    // Hook Linux serial output -> render in xterm
    const unsubSerial = vmEngine.onSerialOutput((text) => {
      term.write(text);
    });

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch {
        // ignore detached resize errors
      }
    });
    resizeObserver.observe(containerRef.current);

    // Initial greeting if VM is already idle or waiting
    if (vmEngine.getStatus().state === 'idle') {
      term.writeln('\x1b[1;36m=== WebLinux x86 WebAssembly Serial Console ===\x1b[0m');
      term.writeln('\x1b[90mConnected to virtual COM1 (/dev/ttyS0). Click "Boot Kernel" or select a quick command to start.\x1b[0m\r\n');
    }

    return () => {
      disposable.dispose();
      unsubSerial();
      resizeObserver.disconnect();
      term.dispose();
    };
  }, []);

  const handleQuickCommand = (cmd: string) => {
    if (vmStatus.state === 'idle') {
      vmEngine.boot().then(() => {
        setTimeout(() => vmEngine.sendSerial(cmd + '\n'), 4000);
      });
    } else {
      vmEngine.sendSerial(cmd + '\n');
    }
  };

  const handleCopyAll = () => {
    if (!termRef.current) return;
    termRef.current.selectAll();
    const selection = termRef.current.getSelection();
    navigator.clipboard.writeText(selection);
    termRef.current.clearSelection();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    termRef.current?.clear();
  };

  const handleSendCtrlC = () => {
    vmEngine.sendSerial('\x03'); // ASCII 3 = ETX = Ctrl+C
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 select-text font-mono text-xs">
      {/* Terminal Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-slate-400">
            <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">/dev/ttyS0</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${
            vmStatus.state === 'running' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : vmStatus.state === 'booting' || vmStatus.state === 'downloading'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
              : 'bg-slate-800 text-slate-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              vmStatus.state === 'running' ? 'bg-emerald-400' : vmStatus.state === 'idle' ? 'bg-slate-500' : 'bg-amber-400'
            }`}></span>
            <span className="capitalize">{vmStatus.state}</span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          {vmStatus.state === 'idle' && (
            <button
              onClick={() => vmEngine.boot()}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Boot Kernel</span>
            </button>
          )}

          <button
            onClick={handleSendCtrlC}
            title="Send SIGINT (Ctrl+C)"
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
          >
            ^C
          </button>

          <button
            onClick={handleCopyAll}
            title="Copy entire buffer"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleClear}
            title="Clear screen buffer"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => vmEngine.restart()}
            title="Reboot Linux Kernel"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Command Pills */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto text-[10px] scrollbar-none shrink-0">
        <span className="text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Quick:</span>
        </span>
        {[
          'uname -a',
          'cat /proc/cpuinfo',
          'free -m',
          'df -h',
          'ls -la /',
          'ps aux',
          'uptime',
          'cat /etc/os-release',
          'clear'
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleQuickCommand(cmd)}
            className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 transition-colors shrink-0"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* xterm.js DOM Mount Point */}
      <div 
        ref={containerRef} 
        className="flex-1 w-full h-full p-1 overflow-hidden" 
        style={{ minHeight: '180px' }}
      />
    </div>
  );
};
