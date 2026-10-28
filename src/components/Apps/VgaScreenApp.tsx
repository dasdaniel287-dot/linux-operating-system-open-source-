/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - VGA Hardware Framebuffer Canvas Screen
 */

import React, { useEffect, useRef, useState } from 'react';
import { vmEngine, VmStatus } from '../../services/v86Engine';
import { Monitor, Maximize2, MousePointer, RefreshCw, Eye } from 'lucide-react';

export const VgaScreenApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vmStatus, setVmStatus] = useState<VmStatus>(vmEngine.getStatus());
  const [scale, setScale] = useState<number>(1);
  const [pointerLocked, setPointerLocked] = useState(false);

  useEffect(() => {
    const unsub = vmEngine.onStatusChange(setVmStatus);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      vmEngine.attachScreen(containerRef.current);
    }
  }, []);

  const handleRequestPointerLock = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (canvas) {
      canvas.requestPointerLock();
      setPointerLocked(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black select-none font-mono text-xs">
      {/* VGA Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-300 shrink-0">
        <div className="flex items-center gap-2">
          <Monitor className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200">VGA Hardware Display</span>
          <span className="text-slate-600">·</span>
          <span className="text-[10px] text-slate-400">Standard 8MB Video RAM</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestPointerLock}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors ${
              pointerLocked ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Lock mouse cursor inside VGA canvas (Press ESC to release)"
          >
            <MousePointer className="w-3 h-3" />
            <span>{pointerLocked ? 'Cursor Locked' : 'Capture Mouse'}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
            <span className="text-slate-500">Zoom:</span>
            <button onClick={() => setScale(1)} className={`px-1 rounded ${scale === 1 ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>1x</button>
            <button onClick={() => setScale(1.25)} className={`px-1 rounded ${scale === 1.25 ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>1.25x</button>
          </div>
        </div>
      </div>

      {/* Screen Canvas Container */}
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-950 overflow-auto">
        <div
          ref={containerRef}
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          className="relative bg-black border border-slate-800 shadow-2xl rounded overflow-hidden flex flex-col items-center justify-center min-w-[640px] min-h-[400px]"
        >
          {/* Default v86 text output layer */}
          <div style={{ whiteSpace: 'pre', font: '14px monospace', lineHeight: '14px', color: '#38bdf8' }} />
          {/* Default v86 canvas layer */}
          <canvas style={{ display: 'none' }} />

          {vmStatus.state !== 'running' && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <Monitor className="w-10 h-10 text-cyan-400 animate-pulse" />
              <div className="text-sm font-bold text-slate-200">
                {vmStatus.state === 'idle' ? 'VGA Display Offline' : 'Starting Graphics Subsystem...'}
              </div>
              <p className="text-xs text-slate-400 max-w-sm">
                {vmStatus.state === 'idle' 
                  ? 'Boot the Linux kernel to initialize standard VGA text and graphical framebuffer modes.'
                  : vmStatus.progressMessage}
              </p>
              {vmStatus.state === 'idle' && (
                <button
                  onClick={() => vmEngine.boot()}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-cyan-900/30"
                >
                  Boot WebLinux
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
