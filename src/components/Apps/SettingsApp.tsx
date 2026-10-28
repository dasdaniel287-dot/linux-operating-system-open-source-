/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - System Settings & VM Tuner
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Cpu, 
  Palette, 
  Trash2, 
  Download, 
  RotateCcw, 
  Check, 
  Volume2, 
  VolumeX, 
  Layers,
  Globe
} from 'lucide-react';
import { vmEngine, VmConfig } from '../../services/v86Engine';
import { storageCache } from '../../services/idbCache';
import { DesktopTheme } from '../../types/desktop';

interface SettingsAppProps {
  currentTheme: DesktopTheme;
  onThemeChange: (theme: DesktopTheme) => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ currentTheme, onThemeChange }) => {
  const [config, setConfigState] = useState<VmConfig>(vmEngine.getConfig());
  const [cacheCleared, setCacheCleared] = useState(false);
  const [snapshotStatus, setSnapshotStatus] = useState<string | null>(null);

  const handleRamChange = (ramMb: number) => {
    vmEngine.setConfig({ ramMb });
    setConfigState(vmEngine.getConfig());
  };

  const handleNetworkToggle = () => {
    const next = !config.networkEnabled;
    vmEngine.setConfig({ networkEnabled: next });
    setConfigState(vmEngine.getConfig());
  };

  const handleClearCache = async () => {
    await storageCache.clearCache();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const handleExportSnapshot = async () => {
    setSnapshotStatus('Capturing RAM/CPU state...');
    const snapshot = await vmEngine.exportSnapshot();
    if (snapshot) {
      const blob = new Blob([snapshot], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weblinux_snapshot_${Date.now()}.bin`;
      a.click();
      URL.revokeObjectURL(url);
      setSnapshotStatus('Snapshot saved!');
    } else {
      setSnapshotStatus('Snapshot requires running VM');
    }
    setTimeout(() => setSnapshotStatus(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans text-xs select-none overflow-y-auto p-4 space-y-6">
      {/* Hardware / RAM Allocation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Virtual Machine RAM Allocation</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Allocates WebAssembly linear memory (`WebAssembly.Memory`) to the virtual x86 chipset. Changes take effect on next boot.
        </p>
        <div className="grid grid-cols-4 gap-2 pt-1">
          {[64, 128, 256, 512].map(mb => (
            <button
              key={mb}
              onClick={() => handleRamChange(mb)}
              className={`p-2.5 rounded-lg border text-center transition-colors ${
                config.ramMb === mb
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="text-sm">{mb} MB</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {mb === 128 ? 'Default' : mb >= 256 ? 'High' : 'Low'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Theme Customizer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Palette className="w-4 h-4 text-emerald-400" />
          <span>Desktop Theme & Styling</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {([
            { id: 'dark', label: 'Slate Dark', color: 'bg-slate-950 border-slate-700' },
            { id: 'nord', label: 'Nordic Frost', color: 'bg-slate-900 border-sky-600' },
            { id: 'dracula', label: 'Dracula', color: 'bg-purple-950 border-purple-700' },
            { id: 'cyber', label: 'Cyberpunk', color: 'bg-black border-cyan-500' },
            { id: 'light', label: 'Clean Light', color: 'bg-slate-100 border-slate-300 text-slate-900' }
          ] as const).map(theme => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`p-2.5 rounded-lg border text-center transition-all ${
                currentTheme === theme.id ? 'ring-2 ring-cyan-400 font-bold' : 'opacity-80 hover:opacity-100'
              } ${theme.color}`}
            >
              <span className="text-xs">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Networking Relay Option */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>WebSocket Network Bridge</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-md">
            Routes guest ethernet packets via a public WebSocket slirp relay (`wss://relay.widgetry.org/`).
          </p>
        </div>
        <button
          onClick={handleNetworkToggle}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            config.networkEnabled ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {config.networkEnabled ? 'Enabled' : 'Disabled (Airgapped)'}
        </button>
      </div>

      {/* Maintenance & Cache Controls */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="text-slate-200 font-semibold">Maintenance & Snapshot Management</div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 transition-colors"
          >
            {cacheCleared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Trash2 className="w-3.5 h-3.5 text-rose-400" />}
            <span>{cacheCleared ? 'Cache Cleared!' : 'Clear IndexedDB Cache'}</span>
          </button>

          <button
            onClick={handleExportSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Machine State (.bin)</span>
          </button>

          <button
            onClick={() => vmEngine.restart()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Hard Reboot Virtual Machine</span>
          </button>
        </div>
        {snapshotStatus && (
          <div className="text-[11px] text-cyan-300 font-mono">{snapshotStatus}</div>
        )}
      </div>
    </div>
  );
};
