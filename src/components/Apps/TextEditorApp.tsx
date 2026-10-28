/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - Integrated Code & Text Editor
 */

import React, { useState } from 'react';
import { Save, Play, Download, Plus, X, FileCode, Check } from 'lucide-react';
import { vmEngine } from '../../services/v86Engine';

interface EditorTab {
  id: string;
  filename: string;
  content: string;
  isModified: boolean;
}

const DEFAULT_TABS: EditorTab[] = [
  {
    id: 'script-1',
    filename: 'welcome.sh',
    content: `#!/bin/sh
# WebLinux Demo Script
echo "================================================"
echo "Hello from WebLinux inside WebAssembly!"
echo "Kernel: $(uname -s -r -m)"
echo "Current Directory: $(pwd)"
echo "Memory Available: $(free -m | grep Mem | awk '{print $4}') MB"
echo "================================================"
`,
    isModified: false
  },
  {
    id: 'script-2',
    filename: 'system_info.py',
    content: `#!/usr/bin/env python3
import sys
import platform

print("Python Version:", sys.version.split()[0])
print("Platform Architecture:", platform.machine())
print("Operating System:", platform.system())
`,
    isModified: false
  }
];

export const TextEditorApp: React.FC = () => {
  const [tabs, setTabs] = useState<EditorTab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState<string>('script-1');
  const [savedNotification, setSavedNotification] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleContentChange = (newContent: string) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, content: newContent, isModified: true } : t));
  };

  const handleSaveToVM = () => {
    if (!activeTab) return;
    // Push file to guest Linux VM
    const escapedContent = activeTab.content;
    vmEngine.sendSerial(`cat << 'EOF' > /home/developer/${activeTab.filename}\n${escapedContent}\nEOF\nchmod +x /home/developer/${activeTab.filename}\n`);
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, isModified: false } : t));
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const handleRunInTerminal = () => {
    handleSaveToVM();
    setTimeout(() => {
      vmEngine.sendSerial(`/home/developer/${activeTab.filename}\n`);
    }, 400);
  };

  const handleDownload = () => {
    if (!activeTab) return;
    const blob = new Blob([activeTab.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewTab = () => {
    const newId = `script-${Date.now()}`;
    const newTab: EditorTab = {
      id: newId,
      filename: `untitled_${tabs.length + 1}.sh`,
      content: '#!/bin/sh\n# New script\necho "Running..."\n',
      isModified: true
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const remaining = tabs.filter(t => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[0].id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-xs select-none">
      {/* Tab bar */}
      <div className="flex items-center justify-between bg-slate-900 border-b border-slate-800 px-2 pt-1 shrink-0 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1">
          {tabs.map(tab => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg border-t border-x cursor-pointer transition-colors text-xs ${
                  isActive
                    ? 'bg-slate-950 border-slate-800 text-cyan-300 font-semibold'
                    : 'bg-slate-900/60 border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{tab.filename}{tab.isModified ? ' *' : ''}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
          <button
            onClick={handleNewTab}
            title="New File"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 ml-1"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 pb-1">
          <button
            onClick={handleSaveToVM}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-xs transition-colors"
            title="Save into Linux guest at /home/developer"
          >
            {savedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{savedNotification ? 'Saved to VM' : 'Save to VM'}</span>
          </button>

          <button
            onClick={handleRunInTerminal}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-sans text-xs font-medium transition-colors"
            title="Save and execute in Linux terminal"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run in Linux</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            title="Download file to computer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Textarea with line numbers */}
      <div className="flex-1 flex overflow-hidden bg-slate-950 p-2 font-mono text-xs select-text">
        <textarea
          value={activeTab.content}
          onChange={(e) => handleContentChange(e.target.value)}
          spellCheck={false}
          className="flex-1 w-full h-full bg-transparent text-slate-200 focus:outline-none resize-none font-mono text-[13px] leading-relaxed p-2"
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-400 shrink-0">
        <div className="flex items-center gap-3">
          <span>Target: /home/developer/{activeTab.filename}</span>
          <span>Lines: {activeTab.content.split('\n').length}</span>
          <span>Chars: {activeTab.content.length}</span>
        </div>
        <div>
          <span>UTF-8 · LF</span>
        </div>
      </div>
    </div>
  );
};
