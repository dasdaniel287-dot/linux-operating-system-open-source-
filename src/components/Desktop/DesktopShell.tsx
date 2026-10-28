/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - Master Desktop Shell & Window Manager
 */

import React, { useState, useEffect } from 'react';
import { WindowState, AppId, DesktopTheme } from '../../types/desktop';
import { WindowFrame } from './WindowFrame';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { BootOverlay } from './BootOverlay';
import { TerminalApp } from '../Apps/TerminalApp';
import { VgaScreenApp } from '../Apps/VgaScreenApp';
import { FileManagerApp } from '../Apps/FileManagerApp';
import { TextEditorApp } from '../Apps/TextEditorApp';
import { SystemMonitorApp } from '../Apps/SystemMonitorApp';
import { SettingsApp } from '../Apps/SettingsApp';
import { DocsViewerApp } from '../Apps/DocsViewerApp';
import { vmEngine, VmStatus } from '../../services/v86Engine';
import { 
  Terminal, 
  Monitor, 
  Folder, 
  FileCode, 
  Activity, 
  Settings, 
  BookOpen 
} from 'lucide-react';

const INITIAL_WINDOWS: WindowState[] = [
  {
    id: 'win-term-1',
    appId: 'terminal',
    title: 'Terminal (/dev/ttyS0 - bash)',
    x: 40,
    y: 40,
    width: 740,
    height: 480,
    zIndex: 10,
    isMinimized: false,
    isMaximized: false,
    workspaceId: 1
  }
];

export const DesktopShell: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<string | null>('win-term-1');
  const [activeWorkspace, setActiveWorkspace] = useState<number>(1);
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<DesktopTheme>('dark');
  const [vmStatus, setVmStatus] = useState<VmStatus>(vmEngine.getStatus());
  const [bootOverlayDismissed, setBootOverlayDismissed] = useState<boolean>(false);

  // Sync VM status
  useEffect(() => {
    const unsub = vmEngine.onStatusChange(setVmStatus);
    return () => unsub();
  }, []);

  // Bring window to front
  const focusWindow = (id: string) => {
    setWindows(prev => {
      const highestZ = Math.max(...prev.map(w => w.zIndex), 10);
      return prev.map(w => w.id === id ? { ...w, zIndex: highestZ + 1, isMinimized: false } : w);
    });
    setActiveWindowId(id);
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const toggleMaximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const updateWindowPosition = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  };

  const updateWindowSize = (id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
  };

  // Launch app by ID (or focus if already open)
  const launchApp = (appId: AppId) => {
    const existing = windows.find(w => w.appId === appId && w.workspaceId === activeWorkspace);
    if (existing) {
      focusWindow(existing.id);
      return;
    }

    const appTitles: Record<AppId, string> = {
      terminal: 'Terminal (/dev/ttyS0 - bash)',
      vga: 'VGA Hardware Display',
      files: 'File Manager (/mnt/host)',
      editor: 'Script & Code Editor',
      sysmon: 'System Monitor & Telemetry',
      settings: 'WebLinux System Settings',
      packages: 'Package Explorer',
      docs: 'Documentation & Architecture'
    };

    const newId = `win-${appId}-${Date.now()}`;
    const highestZ = Math.max(...windows.map(w => w.zIndex), 10);
    const offset = (windows.length % 5) * 28;

    const newWin: WindowState = {
      id: newId,
      appId,
      title: appTitles[appId] || appId,
      x: Math.min(60 + offset, Math.max(20, document.documentElement.clientWidth - 700)),
      y: Math.min(50 + offset, Math.max(20, document.documentElement.clientHeight - 500)),
      width: appId === 'terminal' || appId === 'docs' ? 740 : 640,
      height: appId === 'terminal' || appId === 'vga' ? 480 : 440,
      zIndex: highestZ + 1,
      isMinimized: false,
      isMaximized: false,
      workspaceId: activeWorkspace
    };

    setWindows(prev => [...prev, newWin]);
    setActiveWindowId(newId);
    setStartMenuOpen(false);
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'nord': return 'bg-slate-900 text-slate-100';
      case 'dracula': return 'bg-[#1e1b2e] text-[#f8f8f2]';
      case 'cyber': return 'bg-black text-cyan-300';
      case 'light': return 'bg-slate-100 text-slate-900';
      default: return 'bg-slate-950 text-slate-100';
    }
  };

  const desktopIcons: { id: AppId; name: string; icon: React.ReactNode }[] = [
    { id: 'terminal', name: 'Terminal', icon: <Terminal className="w-6 h-6 text-cyan-400" /> },
    { id: 'vga', name: 'VGA Screen', icon: <Monitor className="w-6 h-6 text-sky-400" /> },
    { id: 'files', name: 'Files', icon: <Folder className="w-6 h-6 text-amber-400" /> },
    { id: 'editor', name: 'Editor', icon: <FileCode className="w-6 h-6 text-emerald-400" /> },
    { id: 'sysmon', name: 'SysMonitor', icon: <Activity className="w-6 h-6 text-rose-400" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-6 h-6 text-purple-400" /> },
    { id: 'docs', name: 'Docs', icon: <BookOpen className="w-6 h-6 text-indigo-400" /> }
  ];

  return (
    <div 
      onClick={() => setStartMenuOpen(false)}
      className={`relative w-screen h-screen overflow-hidden select-none font-sans ${getThemeClass()}`}
    >
      {/* Desktop Background Wallpaper with Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-90" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Desktop Watermark Branding */}
      <div className="absolute bottom-14 right-6 pointer-events-none text-right opacity-30 select-none hidden sm:block">
        <div className="text-3xl font-extrabold tracking-tighter text-slate-400">WebLinux</div>
        <div className="text-[11px] font-mono text-cyan-400">Genuine x86 WebAssembly OS</div>
      </div>

      {/* Desktop Shortcut Icons */}
      <div className="relative z-10 p-5 grid grid-flow-col grid-rows-6 gap-3 w-max select-none">
        {desktopIcons.map(item => (
          <button
            key={item.id}
            onClick={() => launchApp(item.id)}
            className="flex flex-col items-center justify-center w-20 h-20 rounded-xl hover:bg-slate-800/50 p-2 text-center transition-colors group"
          >
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 group-hover:border-cyan-500/40 group-hover:scale-110 transition-all shadow-md">
              {item.icon}
            </div>
            <span className="text-[11px] text-slate-200 font-medium truncate max-w-full mt-1.5 drop-shadow">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      {/* Render Open Windows for the Active Workspace */}
      {windows
        .filter(w => w.workspaceId === activeWorkspace)
        .map(win => (
          <WindowFrame
            key={win.id}
            window={win}
            onFocus={() => focusWindow(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onToggleMaximize={() => toggleMaximizeWindow(win.id)}
            onUpdatePosition={(x, y) => updateWindowPosition(win.id, x, y)}
            onUpdateSize={(w, h) => updateWindowSize(win.id, w, h)}
          >
            {win.appId === 'terminal' && <TerminalApp />}
            {win.appId === 'vga' && <VgaScreenApp />}
            {win.appId === 'files' && (
              <FileManagerApp
                onOpenFileInEditor={(path, content) => {
                  launchApp('editor');
                }}
              />
            )}
            {win.appId === 'editor' && <TextEditorApp />}
            {win.appId === 'sysmon' && <SystemMonitorApp />}
            {win.appId === 'settings' && (
              <SettingsApp
                currentTheme={theme}
                onThemeChange={setTheme}
              />
            )}
            {win.appId === 'docs' && <DocsViewerApp />}
          </WindowFrame>
        ))}

      {/* Start Menu Popup */}
      {startMenuOpen && (
        <StartMenu
          onLaunchApp={launchApp}
          onClose={() => setStartMenuOpen(false)}
        />
      )}

      {/* Boot Splash Overlay if VM is downloading or booting */}
      {!bootOverlayDismissed && (
        <BootOverlay
          status={vmStatus}
          onDismiss={() => setBootOverlayDismissed(true)}
        />
      )}

      {/* Bottom Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        startMenuOpen={startMenuOpen}
        activeWorkspace={activeWorkspace}
        onToggleStartMenu={() => setStartMenuOpen(prev => !prev)}
        onSelectWindow={focusWindow}
        onSelectWorkspace={setActiveWorkspace}
        onLaunchApp={launchApp}
      />
    </div>
  );
};
