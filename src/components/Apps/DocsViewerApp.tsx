/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - In-App Documentation Viewer
 */

import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Cpu, Terminal, ExternalLink, Copy, Check } from 'lucide-react';

export const DocsViewerApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'arch' | 'user' | 'security'>('arch');
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans text-xs select-text overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('arch')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'arch' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Architecture & Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('user')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'user' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>User Guide & Commands</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'security' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Security & Sandbox</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-500 font-mono">docs/v0.1.0</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl mx-auto leading-relaxed text-slate-300">
        {activeTab === 'arch' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>WebLinux Architecture & v86 WebAssembly Engine</span>
            </h2>
            <p>
              WebLinux is an open-source, client-side, zero-install Linux operating system running genuine Linux kernels and userlands entirely inside modern web browsers. Unlike mock terminal web apps that simulate shell commands via JavaScript regexes or dictionary objects, WebLinux executes authentic x86 machine instructions via WebAssembly.
            </p>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <h3 className="font-semibold text-cyan-300">Why v86 was chosen over CheerpX/WebVM:</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li><strong>100% Free & Open-Source (BSD-2-Clause)</strong>: No proprietary license or cloud server dependency.</li>
                <li><strong>Complete Ring-0 Hardware Emulation</strong>: Runs real SeaBIOS, PIC, PIT, IDE, VirtIO, and 8250 serial UART.</li>
                <li><strong>Air-Gapped Operation</strong>: Boots offline from local cached ISO images in IndexedDB.</li>
                <li><strong>Direct POSIX Serial Console</strong>: Connects `/dev/ttyS0` directly to xterm.js for authentic terminal semantics.</li>
              </ul>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 font-mono text-[11px]">
              <div className="text-slate-400 font-sans font-semibold">Boot Commandline Parameters:</div>
              <code className="text-cyan-300 block bg-slate-950 p-2 rounded border border-slate-800">
                console=ttyS0,115200 root=/dev/ram0 rw quiet
              </code>
            </div>
          </div>
        )}

        {activeTab === 'user' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>User Guide & Core Commands</span>
            </h2>
            <p>
              Once WebLinux is booted, the terminal connects to an interactive root shell. You can test pipes, redirection, processes, and scripting.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-cyan-300 font-semibold">uname -a</div>
                <div className="text-slate-400 font-sans mt-0.5">Prints kernel version, hostname, and CPU arch.</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-cyan-300 font-semibold">cat /proc/cpuinfo</div>
                <div className="text-slate-400 font-sans mt-0.5">Inspects virtual x86 CPU model and flags.</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-cyan-300 font-semibold">free -m / df -h</div>
                <div className="text-slate-400 font-sans mt-0.5">Monitors RAM and rootfs storage utilization.</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="text-cyan-300 font-semibold">ps aux / top</div>
                <div className="text-slate-400 font-sans mt-0.5">Inspects all active Linux processes in /proc.</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Zero-Server Execution & Browser Sandbox</span>
            </h2>
            <p>
              WebLinux operates with zero server-side command execution. The entire Linux guest, its virtual memory pages, and its disk storage run inside the browser's WebAssembly sandbox.
            </p>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 text-slate-400 text-[11px]">
              <p>
                Even if malicious x86 code is compiled and executed within the guest environment, WebAssembly memory bounds checking guarantees that the guest cannot access host files, memory, or peripherals without explicit user interaction.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
