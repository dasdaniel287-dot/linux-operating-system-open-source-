/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - Application Launcher Start Menu
 */

import React, { useState } from 'react';
import { 
  Terminal, 
  Monitor, 
  Folder, 
  FileCode, 
  Activity, 
  Settings, 
  BookOpen, 
  Search, 
  RotateCcw, 
  Power,
  ExternalLink,
  Github,
  Package
} from 'lucide-react';
import { AppId, AppDefinition } from '../../types/desktop';
import { vmEngine } from '../../services/v86Engine';

interface StartMenuProps {
  onLaunchApp: (appId: AppId) => void;
  onClose: () => void;
}

const APPS: AppDefinition[] = [
  {
    id: 'terminal',
    name: 'Terminal Console',
    category: 'System',
    description: 'Direct interactive shell on /dev/ttyS0 with bash & coreutils',
    iconName: 'terminal',
    defaultWidth: 720,
    defaultHeight: 460
  },
  {
    id: 'vga',
    name: 'VGA Hardware Display',
    category: 'System',
    description: 'x86 framebuffer canvas for graphical mode & pointer lock',
    iconName: 'monitor',
    defaultWidth: 680,
    defaultHeight: 480
  },
  {
    id: 'files',
    name: 'File Manager',
    category: 'Utilities',
    description: 'Explore rootfs, upload host files, download backups',
    iconName: 'folder',
    defaultWidth: 640,
    defaultHeight: 420
  },
  {
    id: 'editor',
    name: 'Code & Script Editor',
    category: 'Development',
    description: 'Multi-tab syntax editor with direct Linux execution',
    iconName: 'editor',
    defaultWidth: 680,
    defaultHeight: 440
  },
  {
    id: 'sysmon',
    name: 'System Monitor',
    category: 'System',
    description: 'Real-time CPU telemetry, RAM graphs & /proc process table',
    iconName: 'sysmon',
    defaultWidth: 620,
    defaultHeight: 420
  },
  {
    id: 'settings',
    name: 'System Settings',
    category: 'Utilities',
    description: 'Configure RAM allocation, theme, and IndexedDB cache',
    iconName: 'settings',
    defaultWidth: 580,
    defaultHeight: 420
  },
  {
    id: 'docs',
    name: 'Documentation & Guide',
    category: 'Help',
    description: 'Architecture specs, security sandboxing & tutorials',
    iconName: 'docs',
    defaultWidth: 680,
    defaultHeight: 460
  }
];

export const StartMenu: React.FC<StartMenuProps> = ({ onLaunchApp, onClose }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredApps = APPS.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
                          app.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (id: AppId) => {
    switch (id) {
      case 'terminal': return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'vga': return <Monitor className="w-5 h-5 text-sky-400" />;
      case 'files': return <Folder className="w-5 h-5 text-amber-400" />;
      case 'editor': return <FileCode className="w-5 h-5 text-emerald-400" />;
      case 'sysmon': return <Activity className="w-5 h-5 text-rose-400" />;
      case 'settings': return <Settings className="w-5 h-5 text-purple-400" />;
      case 'docs': return <BookOpen className="w-5 h-5 text-indigo-400" />;
      default: return <Terminal className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div
      data-testid="start-menu-popup"
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-12 left-3 w-80 sm:w-96 bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[520px] select-none text-xs font-sans"
    >
      {/* Header Profile / OS Info */}
      <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-lg shadow-inner">
            🐧
          </div>
          <div>
            <div className="font-extrabold text-slate-100 text-sm">WebLinux OS</div>
            <div className="text-[11px] text-slate-400 font-mono">x86 WebAssembly Kernel</div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => vmEngine.restart()}
            title="Reboot VM"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/40">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs and tools..."
            autoFocus
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1 px-3 py-2 bg-slate-900/20 border-b border-slate-800/60 overflow-x-auto text-[10px] scrollbar-none">
        {['All', 'System', 'Development', 'Utilities', 'Help'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              activeCategory === cat ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredApps.map(app => (
          <button
            key={app.id}
            onClick={() => {
              onLaunchApp(app.id);
              onClose();
            }}
            className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-900 text-left transition-colors group"
          >
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40 transition-colors shrink-0">
              {getIcon(app.id)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-200 group-hover:text-cyan-300 text-xs">
                {app.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                {app.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <a 
          href="https://github.com/copy/v86" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-slate-200 transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
          <span>v86 Engine</span>
        </a>
        <span>Open Source (MIT)</span>
      </div>
    </div>
  );
};
