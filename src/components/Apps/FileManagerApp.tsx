/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - Linux Filesystem & Host-Guest Transfer Explorer
 */

import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Upload, 
  Download, 
  Home, 
  HardDrive, 
  ChevronRight, 
  FileCode, 
  Archive,
  RefreshCw,
  Plus,
  Terminal,
  Share2
} from 'lucide-react';
import { vmEngine } from '../../services/v86Engine';

interface VfsItem {
  name: string;
  type: 'dir' | 'file';
  size: string;
  permissions: string;
  owner: string;
  content?: string;
}

const DEFAULT_FILESYSTEM: Record<string, VfsItem[]> = {
  '/': [
    { name: 'bin', type: 'dir', size: '4.0K', permissions: 'drwxr-xr-x', owner: 'root' },
    { name: 'sbin', type: 'dir', size: '4.0K', permissions: 'drwxr-xr-x', owner: 'root' },
    { name: 'etc', type: 'dir', size: '4.0K', permissions: 'drwxr-xr-x', owner: 'root' },
    { name: 'home', type: 'dir', size: '4.0K', permissions: 'drwxr-xr-x', owner: 'root' },
    { name: 'root', type: 'dir', size: '4.0K', permissions: 'drwx------', owner: 'root' },
    { name: 'mnt', type: 'dir', size: '4.0K', permissions: 'drwxr-xr-x', owner: 'root' },
    { name: 'proc', type: 'dir', size: '0B', permissions: 'dr-xr-xr-x', owner: 'root' },
    { name: 'sys', type: 'dir', size: '0B', permissions: 'dr-xr-xr-x', owner: 'root' },
    { name: 'dev', type: 'dir', size: '0B', permissions: 'drwxr-xr-x', owner: 'root' },
    { name: 'tmp', type: 'dir', size: '4.0K', permissions: 'drwxrwxrwt', owner: 'root' },
    { name: 'var', type: 'dir', size: '4.0K', permissions: 'drwxr-xr-x', owner: 'root' },
  ],
  '/home': [
    { name: 'developer', type: 'dir', size: '4.0K', permissions: 'drwxr-xr-x', owner: 'developer' }
  ],
  '/home/developer': [
    { name: '.bashrc', type: 'file', size: '1.2K', permissions: '-rw-r--r--', owner: 'developer', content: '# WebLinux .bashrc\nexport PS1="\\[\\e[36m\\]weblinux\\[\\e[0m\\]:\\[\\e[34m\\]\\w\\[\\e[0m\\]# "\nalias ll="ls -la --color=auto"\n' },
    { name: '.profile', type: 'file', size: '256B', permissions: '-rw-r--r--', owner: 'developer', content: 'export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"\n' },
    { name: 'welcome.txt', type: 'file', size: '480B', permissions: '-rw-r--r--', owner: 'developer', content: 'Welcome to WebLinux!\nRunning authentic Linux kernel and userland in WebAssembly.\nFiles stored in /mnt/host persist across browser reloads via IndexedDB.\n' },
    { name: 'projects', type: 'dir', size: '4.0K', permissions: 'drwxr-xr-x', owner: 'developer' },
    { name: 'benchmark.sh', type: 'file', size: '320B', permissions: '-rwxr-xr-x', owner: 'developer', content: '#!/bin/sh\necho "Running x86 instruction execution benchmark..."\ntime for i in $(seq 1 1000); do :; done\n' }
  ],
  '/etc': [
    { name: 'inittab', type: 'file', size: '640B', permissions: '-rw-r--r--', owner: 'root', content: '::sysinit:/etc/init.d/rcS\nttyS0::respawn:/bin/sh -l\n' },
    { name: 'hosts', type: 'file', size: '96B', permissions: '-rw-r--r--', owner: 'root', content: '127.0.0.1 localhost weblinux\n' },
    { name: 'passwd', type: 'file', size: '180B', permissions: '-rw-r--r--', owner: 'root', content: 'root:x:0:0:root:/root:/bin/sh\ndeveloper:x:1000:1000:Developer:/home/developer:/bin/sh\n' },
    { name: 'os-release', type: 'file', size: '210B', permissions: '-rw-r--r--', owner: 'root', content: 'NAME="WebLinux"\nID=weblinux\nPRETTY_NAME="WebLinux 4.x x86"\nHOME_URL="https://weblinux.org"\n' }
  ],
  '/mnt': [
    { name: 'host', type: 'dir', size: '4.0K', permissions: 'drwxrwxrwx', owner: 'root' }
  ],
  '/mnt/host': [
    { name: 'shared_readme.txt', type: 'file', size: '210B', permissions: '-rw-rw-rw-', owner: 'developer', content: 'Files dropped into this directory are accessible via VirtIO 9p at /mnt/host in Linux.\n' }
  ]
};

interface FileManagerAppProps {
  onOpenFileInEditor?: (path: string, content: string) => void;
}

export const FileManagerApp: React.FC<FileManagerAppProps> = ({ onOpenFileInEditor }) => {
  const [currentPath, setCurrentPath] = useState<string>('/home/developer');
  const [fileSystem, setFileSystem] = useState(DEFAULT_FILESYSTEM);
  const [selectedItem, setSelectedItem] = useState<VfsItem | null>(null);

  const items = fileSystem[currentPath] || [];

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSelectedItem(null);
  };

  const navigateUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const parent = '/' + parts.join('/');
    navigateTo(parent);
  };

  const handleItemClick = (item: VfsItem) => {
    setSelectedItem(item);
  };

  const handleItemDoubleClick = (item: VfsItem) => {
    if (item.type === 'dir') {
      const nextPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      navigateTo(nextPath);
    } else {
      if (onOpenFileInEditor) {
        const fullPath = `${currentPath}/${item.name}`;
        onOpenFileInEditor(fullPath, item.content || '');
      }
    }
  };

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const newItem: VfsItem = {
        name: file.name,
        type: 'file',
        size: `${Math.round(file.size / 1024)}K`,
        permissions: '-rw-r--r--',
        owner: 'developer',
        content
      };

      setFileSystem(prev => {
        const currentList = prev[currentPath] || [];
        return {
          ...prev,
          [currentPath]: [...currentList.filter(f => f.name !== file.name), newItem]
        };
      });

      // Synchronize with VM serial prompt by echoing into /mnt/host
      vmEngine.sendSerial(`cat << 'EOF' > /mnt/host/${file.name}\n${content}\nEOF\n`);
    };
    reader.readAsText(file);
  };

  const handleExportBackup = () => {
    const jsonBlob = new Blob([JSON.stringify(fileSystem, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weblinux_filesystem_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans text-xs select-none">
      {/* File Manager Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5 flex-1 min-w-0 mr-3">
          <button
            onClick={() => navigateTo('/')}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Root (/)"
          >
            <HardDrive className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('/home/developer')}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Home (~)"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={navigateUp}
            disabled={currentPath === '/'}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 font-mono text-[11px]"
          >
            ..
          </button>

          {/* Breadcrumb path bar */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 rounded-md border border-slate-800 text-[11px] font-mono text-cyan-300 flex-1 truncate">
            <span>{currentPath}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer text-xs font-medium transition-colors">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload to VM</span>
            <input type="file" onChange={handleUploadFile} className="hidden" />
          </label>

          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            title="Export full rootfs as JSON archive"
          >
            <Archive className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Archive</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Quick Navigation Tree */}
        <div className="w-44 bg-slate-900/60 border-r border-slate-800 p-2.5 space-y-1 overflow-y-auto shrink-0 hidden sm:block text-xs">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">Favorites</div>
          <button
            onClick={() => navigateTo('/home/developer')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
              currentPath === '/home/developer' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span>Home</span>
          </button>
          <button
            onClick={() => navigateTo('/mnt/host')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
              currentPath === '/mnt/host' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Host Shared (9p)</span>
          </button>
          <button
            onClick={() => navigateTo('/')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
              currentPath === '/' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>Root Filesystem</span>
          </button>
          <button
            onClick={() => navigateTo('/etc')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
              currentPath === '/etc' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            <span>/etc (Config)</span>
          </button>
        </div>

        {/* File Grid View */}
        <div className="flex-1 p-4 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
              <Folder className="w-8 h-8 opacity-40" />
              <p className="text-xs">Directory is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {items.map((item) => {
                const isSelected = selectedItem?.name === item.name;
                return (
                  <div
                    key={item.name}
                    onClick={() => handleItemClick(item)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-colors text-center group ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200'
                        : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60 text-slate-200'
                    }`}
                  >
                    {item.type === 'dir' ? (
                      <Folder className="w-10 h-10 text-cyan-400 group-hover:scale-105 transition-transform" />
                    ) : item.name.endsWith('.sh') ? (
                      <Terminal className="w-10 h-10 text-emerald-400 group-hover:scale-105 transition-transform" />
                    ) : (
                      <FileText className="w-10 h-10 text-slate-400 group-hover:scale-105 transition-transform" />
                    )}
                    <span className="text-xs font-medium truncate max-w-full mt-2 font-mono">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {item.size}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-t border-slate-800 text-[11px] font-mono text-slate-400 shrink-0">
        <div>
          <span>{items.length} items</span>
          {selectedItem && (
            <span className="ml-3 text-cyan-300">
              Selected: {selectedItem.name} ({selectedItem.permissions} · {selectedItem.owner})
            </span>
          )}
        </div>
        <div>
          <span>9p VirtFS Ready</span>
        </div>
      </div>
    </div>
  );
};
