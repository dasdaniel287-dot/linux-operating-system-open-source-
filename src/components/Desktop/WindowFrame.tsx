/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux - Draggable, Resizable Window Frame
 */

import React, { useRef, useState, useEffect } from 'react';
import { Minus, Square, Copy, X, LucideIcon } from 'lucide-react';
import { WindowState } from '../../types/desktop';

interface WindowFrameProps {
  window: WindowState;
  icon?: React.ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  onUpdateSize: (w: number, h: number) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  icon,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onUpdatePosition,
  onUpdateSize,
  children
}) => {
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; winX: number; winY: number }>({ x: 0, y: 0, winX: 0, winY: 0 });
  const resizeStartRef = useRef<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });

  // Handle titlebar drag
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    onFocus();
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      winX: win.x,
      winY: win.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.x;
      const dy = moveEvent.clientY - dragStartRef.current.y;
      const newX = Math.max(0, Math.min(document.documentElement.clientWidth - 100, dragStartRef.current.winX + dx));
      const newY = Math.max(0, Math.min(document.documentElement.clientHeight - 80, dragStartRef.current.winY + dy));
      onUpdatePosition(newX, newY);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle window resize handle
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    e.stopPropagation();
    onFocus();
    isResizingRef.current = true;
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: win.width,
      h: win.height
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const dw = moveEvent.clientX - resizeStartRef.current.x;
      const dh = moveEvent.clientY - resizeStartRef.current.y;
      const newW = Math.max(340, resizeStartRef.current.w + dw);
      const newH = Math.max(220, resizeStartRef.current.h + dh);
      onUpdateSize(newW, newH);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (win.isMinimized) {
    return null;
  }

  const frameStyle: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 44, // above taskbar
        width: '100vw',
        height: 'calc(100vh - 44px)',
        zIndex: win.zIndex
      }
    : {
        position: 'absolute',
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex
      };

  return (
    <div
      style={frameStyle}
      onClick={onFocus}
      data-testid={`window-${win.appId}`}
      className="flex flex-col bg-slate-950 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden transition-all duration-75 select-none"
    >
      {/* Window Titlebar */}
      <div
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={onToggleMaximize}
        className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 cursor-move text-xs select-none shrink-0"
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {icon && <span className="text-cyan-400 shrink-0">{icon}</span>}
          <span className="font-semibold text-slate-100 truncate text-[12px]">{win.title}</span>
        </div>

        {/* Traffic Light Window Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={onMinimize}
            data-testid={`btn-minimize-${win.appId}`}
            title="Minimize"
            className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 flex items-center justify-center transition-colors group"
          >
            <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100" />
          </button>

          <button
            onClick={onToggleMaximize}
            title={win.isMaximized ? 'Restore' : 'Maximize'}
            className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 flex items-center justify-center transition-colors group"
          >
            <Square className="w-1.5 h-1.5 text-emerald-950 opacity-0 group-hover:opacity-100" />
          </button>

          <button
            onClick={onClose}
            title="Close"
            className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-400 flex items-center justify-center transition-colors group"
          >
            <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
      </div>

      {/* Window Application Body */}
      <div className="flex-1 w-full h-full overflow-hidden relative">
        {children}
      </div>

      {/* Resize Grip (lower right corner) */}
      {!win.isMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-20 flex items-end justify-end p-0.5"
        >
          <div className="w-1.5 h-1.5 border-r border-b border-slate-500" />
        </div>
      )}
    </div>
  );
};
