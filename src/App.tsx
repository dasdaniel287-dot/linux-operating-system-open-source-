/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopBar, ActiveTab } from './components/TopBar';
import { DistroGuideView } from './components/DistroGuideView';
import { GitHubCatalogView } from './components/GitHubCatalogView';
import { RepoAnalyzerView } from './components/RepoAnalyzerView';
import { TerminalSimulatorView } from './components/TerminalSimulatorView';
import { BootstrapBuilderView } from './components/BootstrapBuilderView';
import { CheatsheetView } from './components/CheatsheetView';
import { OpenSourceProject } from './data/openSourceProjects';
import { Terminal, ExternalLink, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('distros');
  const [activeMissionId, setActiveMissionId] = useState<string>('fastfetch-source');

  const handleSimulateInTerminal = (project: OpenSourceProject) => {
    if (project.id === 'fastfetch') {
      setActiveMissionId('fastfetch-source');
    } else if (project.id === 'ripgrep') {
      setActiveMissionId('rust-cargo-build');
    } else if (project.id === 'gh-cli') {
      setActiveMissionId('github-git-setup');
    } else {
      setActiveMissionId('fastfetch-source');
    }
    setActiveTab('terminal');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar following Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLaunchTerminal={() => {
          setActiveMissionId('fastfetch-source');
          setActiveTab('terminal');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'distros' && (
          <DistroGuideView
            onOpenTerminalMission={missionId => {
              setActiveMissionId(missionId);
              setActiveTab('terminal');
            }}
          />
        )}

        {activeTab === 'catalog' && (
          <GitHubCatalogView
            onSimulateInTerminal={handleSimulateInTerminal}
          />
        )}

        {activeTab === 'analyzer' && (
          <RepoAnalyzerView />
        )}

        {activeTab === 'terminal' && (
          <TerminalSimulatorView
            initialMissionId={activeMissionId}
          />
        )}

        {activeTab === 'bootstrap' && (
          <BootstrapBuilderView />
        )}

        {activeTab === 'cheatsheet' && (
          <CheatsheetView />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">OpenLinux GitForge</span>
            <span aria-hidden="true">·</span>
            <span>Open Source Linux Workstation & GitHub Compilation Suite</span>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://kernel.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>Kernel.org</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a 
              href="https://wiki.archlinux.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>ArchWiki</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
