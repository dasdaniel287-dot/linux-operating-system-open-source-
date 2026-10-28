/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - System Monitor & Process Viewer
 */

import React, { useEffect, useState } from 'react';
import { Activity, Cpu, HardDrive, RefreshCw, Layers, Shield } from 'lucide-react';
import { vmEngine, VmStatus } from '../../services/v86Engine';

interface ProcessItem {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  command: string;
  stat: string;
}

const SAMPLE_PROCESSES: ProcessItem[] = [
  { pid: 1, user: 'root', cpu: 0.1, mem: 0.8, command: '/sbin/init', stat: 'Ss' },
  { pid: 2, user: 'root', cpu: 0.0, mem: 0.0, command: '[kthreadd]', stat: 'S' },
  { pid: 3, user: 'root', cpu: 0.0, mem: 0.0, command: '[rcu_gp]', stat: 'I< ' },
  { pid: 14, user: 'root', cpu: 0.2, mem: 1.2, command: '/sbin/syslogd -n', stat: 'S' },
  { pid: 18, user: 'root', cpu: 0.1, mem: 0.9, command: '/sbin/klogd -n', stat: 'S' },
  { pid: 42, user: 'root', cpu: 0.0, mem: 1.1, command: '/usr/sbin/crond -f', stat: 'S' },
  { pid: 104, user: 'root', cpu: 0.8, mem: 2.4, command: '/bin/sh -l (ttyS0)', stat: 'S+' },
  { pid: 112, user: 'developer', cpu: 0.0, mem: 1.8, command: '9p_virtfs_daemon', stat: 'Sl' },
];

export const SystemMonitorApp: React.FC = () => {
  const [vmStatus, setVmStatus] = useState<VmStatus>(vmEngine.getStatus());
  const [historyCpu, setHistoryCpu] = useState<number[]>([15, 20, 18, 22, 19, 25, 20, 18, 24, 21]);
  const [historyMem, setHistoryMem] = useState<number[]>([35, 35, 36, 36, 37, 37, 38, 38, 38, 39]);
  const [filterUser, setFilterUser] = useState<'all' | 'root' | 'developer'>('all');

  useEffect(() => {
    const unsub = vmEngine.onStatusChange(setVmStatus);
    const interval = setInterval(() => {
      const s = vmEngine.getStatus();
      setHistoryCpu(prev => [...prev.slice(1), s.cpuPercent]);
      setHistoryMem(prev => [...prev.slice(1), s.ramUsagePercent]);
    }, 2000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const filteredProcesses = SAMPLE_PROCESSES.filter(p => {
    if (filterUser === 'all') return true;
    return p.user === filterUser;
  });

  const config = vmEngine.getConfig();
  const totalRamMb = config.ramMb;
  const usedRamMb = Math.round((totalRamMb * vmStatus.ramUsagePercent) / 100);

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans text-xs select-none">
      {/* Top Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-900 border-b border-slate-800 shrink-0">
        {/* CPU Card */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>x86 vCPU Load</span>
            </span>
            <span className="font-mono text-cyan-300 font-bold">{vmStatus.cpuPercent}%</span>
          </div>

          {/* Mini Sparkline Bar Chart */}
          <div className="flex items-end gap-1 h-8 mt-2">
            {historyCpu.map((val, i) => (
              <div
                key={i}
                style={{ height: `${Math.max(10, val)}%` }}
                className="flex-1 bg-cyan-500/70 hover:bg-cyan-400 rounded-sm transition-all"
                title={`${val}%`}
              />
            ))}
          </div>
        </div>

        {/* Memory Card */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>RAM Allocation</span>
            </span>
            <span className="font-mono text-emerald-300 font-bold">
              {usedRamMb}MB / {totalRamMb}MB
            </span>
          </div>

          {/* Memory Bar */}
          <div className="space-y-1.5 mt-2">
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                style={{ width: `${vmStatus.ramUsagePercent}%` }}
                className="bg-emerald-500 h-full rounded-full transition-all"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{vmStatus.ramUsagePercent}% Used</span>
              <span>{totalRamMb - usedRamMb}MB Free</span>
            </div>
          </div>
        </div>

        {/* Storage Card */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 font-semibold text-slate-200">
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span>Virtual Rootfs</span>
            </span>
            <span className="font-mono text-amber-300 font-bold">12.4 MB</span>
          </div>
          <div className="space-y-1 mt-2 text-[10px] text-slate-400 font-mono">
            <div>Rootfs: tmpfs (RAM disk)</div>
            <div>Mount: /mnt/host (VirtIO 9p)</div>
          </div>
        </div>
      </div>

      {/* Filter and Process Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border-b border-slate-800 text-[11px]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200">Active Linux Processes (/proc)</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500">Filter:</span>
          {(['all', 'root', 'developer'] as const).map(user => (
            <button
              key={user}
              onClick={() => setFilterUser(user)}
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold transition-colors ${
                filterUser === user ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {user}
            </button>
          ))}
        </div>
      </div>

      {/* Process Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-[11px] font-mono">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 sticky top-0">
            <tr>
              <th className="py-1.5 px-3">PID</th>
              <th className="py-1.5 px-3">USER</th>
              <th className="py-1.5 px-3">STAT</th>
              <th className="py-1.5 px-3 text-right">%CPU</th>
              <th className="py-1.5 px-3 text-right">%MEM</th>
              <th className="py-1.5 px-3">COMMAND</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-slate-300">
            {filteredProcesses.map(p => (
              <tr key={p.pid} className="hover:bg-slate-900/40">
                <td className="py-1.5 px-3 text-cyan-400 font-semibold">{p.pid}</td>
                <td className="py-1.5 px-3 text-slate-400">{p.user}</td>
                <td className="py-1.5 px-3 text-amber-400">{p.stat}</td>
                <td className="py-1.5 px-3 text-right tabular-nums">{p.cpu.toFixed(1)}</td>
                <td className="py-1.5 px-3 text-right tabular-nums">{p.mem.toFixed(1)}</td>
                <td className="py-1.5 px-3 text-slate-100 truncate max-w-xs">{p.command}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-t border-slate-800 text-[10px] font-mono text-slate-500 shrink-0">
        <span>Uptime: {Math.floor(vmStatus.uptimeSeconds / 60)}m {vmStatus.uptimeSeconds % 60}s</span>
        <span>Virtual Cores: 1 x86 (WASM JIT)</span>
      </div>
    </div>
  );
};
