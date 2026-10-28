/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - Desktop Taskbar & System Tray
 */

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Monitor, 
  Folder, 
  FileCode, 
  Activity, 
  Settings, 
  Layers, 
  Cpu, 
  Power,
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { WindowState, AppId } from '../../types/desktop';
import { vmEngine, VmStatus } from '../../services/v86Engine';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  startMenuOpen: boolean;
  activeWorkspace: number;
  onToggleStartMenu: () => void;
  onSelectWindow: (id: string) => void;
  onSelectWorkspace: (ws: number) => void;
  onLaunchApp: (appId: AppId) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  startMenuOpen,
  activeWorkspace,
  onToggleStartMenu,
  onSelectWindow,
  onSelectWorkspace,
  onLaunchApp
}) => {
  const [vmStatus, setVmStatus] = useState<VmStatus>(vmEngine.getStatus());
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const unsub = vmEngine.onStatusChange(setVmStatus);
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    }, 1000);

    const now = new Date();
    setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setCurrentDate(now.toLocaleDateString([], { month: 'short', day: 'numeric' }));

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  const getAppIcon = (appId: AppId) => {
    switch (appId) {
      case 'terminal': return <Terminal className="w-3.5 h-3.5 text-cyan-400" />;
      case 'vga': return <Monitor className="w-3.5 h-3.5 text-sky-400" />;
      case 'files': return <Folder className="w-3.5 h-3.5 text-amber-400" />;
      case 'editor': return <FileCode className="w-3.5 h-3.5 text-emerald-400" />;
      case 'sysmon': return <Activity className="w-3.5 h-3.5 text-rose-400" />;
      case 'settings': return <Settings className="w-3.5 h-3.5 text-purple-400" />;
      case 'docs': return <BookOpen className="w-3.5 h-3.5 text-indigo-400" />;
      default: return <Terminal className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div 
      data-testid="desktop-taskbar"
      className="fixed bottom-0 left-0 right-0 h-11 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-between px-3 z-50 select-none text-xs"
    >
      {/* Left: Start Menu Button + Workspace Switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleStartMenu}
          data-testid="start-menu-button"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
            startMenuOpen 
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
              : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700/80'
          }`}
        >
          {/* Linux Tux Silhouette */}
          <span className="text-sm">🐧</span>
          <span className="font-extrabold tracking-tight">WebLinux</span>
        </button>

        {/* Workspace Switcher */}
        <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
          {[1, 2, 3].map(ws => (
            <button
              key={ws}
              onClick={() => onSelectWorkspace(ws)}
              className={`w-6 h-6 flex items-center justify-center rounded text-[11px] font-mono font-semibold transition-colors ${
                activeWorkspace === ws
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ws}
            </button>
          ))}
        </div>

        {/* Quick Launch Shortcuts */}
        <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-slate-800">
          <button
            onClick={() => onLaunchApp('terminal')}
            title="Terminal"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={() => onLaunchApp('files')}
            title="File Manager"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Folder className="w-4 h-4" />
          </button>
          <button
            onClick={() => onLaunchApp('editor')}
            title="Code Editor"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <FileCode className="w-4 h-4" />
          </button>
          <button
            onClick={() => onLaunchApp('sysmon')}
            title="System Monitor"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle: Active Window Chips */}
      <div className="flex-1 flex items-center gap-1.5 px-3 overflow-x-auto scrollbar-none">
        {windows
          .filter(w => w.workspaceId === activeWorkspace)
          .map(w => {
            const isActive = w.id === activeWindowId && !w.isMinimized;
            return (
              <button
                key={w.id}
                onClick={() => onSelectWindow(w.id)}
                data-testid={`taskbar-item-${w.appId}`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] max-w-[160px] truncate transition-colors ${
                  isActive
                    ? 'bg-slate-800 border-cyan-500/40 text-cyan-300 font-semibold shadow-sm'
                    : w.isMinimized
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {getAppIcon(w.appId)}
                <span className="truncate">{w.title}</span>
              </button>
            );
          })}
      </div>

      {/* Right: System Tray & Clock */}
      <div className="flex items-center gap-3 shrink-0 text-slate-400 text-[11px] font-mono">
        {/* Telemetry pill */}
        <div 
          onClick={() => onLaunchApp('sysmon')}
          className="hidden md:flex items-center gap-2 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700"
          title="CPU & RAM telemetry"
        >
          <div className="flex items-center gap-1 text-cyan-400">
            <Cpu className="w-3 h-3" />
            <span>{vmStatus.cpuPercent}%</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1 text-emerald-400">
            <Layers className="w-3 h-3" />
            <span>{vmStatus.ramUsagePercent}%</span>
          </div>
        </div>

        {/* VM State Indicator Badge */}
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-sans ${
          vmStatus.state === 'running'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : vmStatus.state === 'idle'
            ? 'bg-slate-900 text-slate-400 border border-slate-800'
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            vmStatus.state === 'running' ? 'bg-emerald-400' : vmStatus.state === 'idle' ? 'bg-slate-500' : 'bg-amber-400'
          }`}></span>
          <span className="capitalize">{vmStatus.state}</span>
        </div>

        {/* Clock & Date */}
        <div className="flex flex-col items-end leading-tight pr-1">
          <span className="text-slate-200 font-semibold text-xs">{currentTime}</span>
          <span className="text-[10px] text-slate-500 font-sans">{currentDate}</span>
        </div>
      </div>
    </div>
  );
};
