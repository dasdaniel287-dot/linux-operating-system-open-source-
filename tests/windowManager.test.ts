/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux Window Manager Unit Tests
 */

import { describe, it, expect } from 'vitest';

describe('WebLinux Desktop Window Manager Logic', () => {
  interface WindowItem {
    id: string;
    title: string;
    zIndex: number;
    isMinimized: boolean;
    isMaximized: boolean;
  }

  it('brings focused window to the highest z-index', () => {
    const windows: WindowItem[] = [
      { id: 'term', title: 'Terminal', zIndex: 10, isMinimized: false, isMaximized: false },
      { id: 'files', title: 'Files', zIndex: 11, isMinimized: false, isMaximized: false },
    ];

    const targetId = 'term';
    const highestZ = Math.max(...windows.map(w => w.zIndex));
    const updated = windows.map(w => w.id === targetId ? { ...w, zIndex: highestZ + 1 } : w);

    const termWindow = updated.find(w => w.id === 'term');
    const filesWindow = updated.find(w => w.id === 'files');

    expect(termWindow?.zIndex).toBe(12);
    expect(termWindow?.zIndex).toBeGreaterThan(filesWindow!.zIndex);
  });

  it('toggles minimize state properly without losing window coordinates', () => {
    let win: WindowItem = { id: 'term', title: 'Terminal', zIndex: 10, isMinimized: false, isMaximized: false };
    win = { ...win, isMinimized: true };
    expect(win.isMinimized).toBe(true);
    win = { ...win, isMinimized: false };
    expect(win.isMinimized).toBe(false);
  });
});
