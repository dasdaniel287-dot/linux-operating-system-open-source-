/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - Kernel Boot Progress Splash Overlay
 */

import React from 'react';
import { Cpu, Terminal, ArrowRight, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { VmStatus, vmEngine } from '../../services/v86Engine';

interface BootOverlayProps {
  status: VmStatus;
  onDismiss: () => void;
}

export const BootOverlay: React.FC<BootOverlayProps> = ({ status, onDismiss }) => {
  if (status.state === 'running' || status.state === 'idle') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-40 flex items-center justify-center p-4 select-none font-sans">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6">
        {/* Header Branding */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-2xl shadow-lg">
            🐧
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100 tracking-tight">
              Booting WebLinux x86 Virtual Machine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Genuine i386 Linux Kernel via WebAssembly
            </p>
          </div>
        </div>

        {/* Status Stage & Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">{status.progressMessage}</span>
            <span className="font-mono text-cyan-400 font-bold">{status.progressPct}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              style={{ width: `${status.progressPct}%` }}
              className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-cyan-400/50"
            />
          </div>
        </div>

        {/* Boot Milestones Checklist */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.progressPct >= 15 ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
              <span>v86 WASM Engine & SeaBIOS 128KB</span>
            </span>
            <span className="text-[10px] text-slate-500">{status.progressPct >= 15 ? 'Ready' : 'Pending'}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.progressPct >= 85 ? 'bg-emerald-400' : status.progressPct >= 35 ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`}></span>
              <span>Linux 4.x ISO Image Cache (IndexedDB)</span>
            </span>
            <span className="text-[10px] text-slate-500">{status.progressPct >= 85 ? 'Cached' : status.progressPct >= 35 ? 'Downloading' : 'Pending'}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.progressPct >= 95 ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
              <span>UART Serial Console & /dev/ttyS0</span>
            </span>
            <span className="text-[10px] text-slate-500">{status.progressPct >= 95 ? 'Active' : 'Pending'}</span>
          </div>
        </div>

        {status.state === 'error' && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{status.errorMessage || 'Boot error encountered. Click Retry below.'}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 font-mono">
            {status.state === 'downloading' ? 'Caching to browser IndexedDB...' : 'Executing virtual CPU instructions...'}
          </span>

          <div className="flex items-center gap-2">
            {status.state === 'error' ? (
              <button
                onClick={() => vmEngine.restart()}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
              >
                Retry Boot
              </button>
            ) : (
              <button
                onClick={onDismiss}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Continue in Background
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
