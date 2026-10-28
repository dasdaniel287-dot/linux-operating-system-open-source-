import React from 'react';
import { Terminal, Download, Sparkles } from 'lucide-react';

export type ActiveTab = 'weblinux' | 'distros' | 'catalog' | 'analyzer' | 'terminal' | 'bootstrap' | 'cheatsheet';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLaunchTerminal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onLaunchTerminal,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-6 px-6 py-3 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Brand title, single line text element */}
      <div 
        onClick={() => setActiveTab('weblinux')}
        className="flex items-center gap-2.5 cursor-pointer text-slate-100 font-bold text-lg tracking-tight whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Terminal className="w-4 h-4" />
        </span>
        <span>WebLinux & GitForge</span>
      </div>

      {/* Zone 2: Concise nav links, single-line with subtle hover underlines */}
      <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('weblinux')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 flex items-center gap-1.5 ${
            activeTab === 'weblinux' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          <span>WebLinux (Live OS)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            x86 WASM
          </span>
        </button>
        <button
          onClick={() => setActiveTab('distros')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'distros' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          OS Install Guide
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'catalog' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          GitHub Catalog
        </button>
        <button
          onClick={() => setActiveTab('analyzer')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'analyzer' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          Repo Script Generator
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'terminal' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          Terminal Sandbox
        </button>
        <button
          onClick={() => setActiveTab('bootstrap')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'bootstrap' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          Bootstrap Builder
        </button>
        <button
          onClick={() => setActiveTab('cheatsheet')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'cheatsheet' ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : ''
          }`}
        >
          Cheatsheet
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('weblinux')}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          <span className="text-sm">🐧</span>
          <span>{activeTab === 'weblinux' ? 'WebLinux Active' : 'Boot WebLinux OS'}</span>
        </button>
      </div>
    </header>
  );
};
