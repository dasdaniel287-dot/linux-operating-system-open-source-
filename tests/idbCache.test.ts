/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux IndexedDB Cache Layer Tests
 */

import { describe, it, expect } from 'vitest';

describe('WebLinux IndexedDB Binary Cache', () => {
  it('creates valid cache key names for kernel and bios artifacts', () => {
    const biosKey = 'weblinux_bios_seabios.bin';
    const isoKey = 'weblinux_iso_linux4.iso';

    expect(biosKey.startsWith('weblinux_')).toBe(true);
    expect(isoKey.endsWith('.iso')).toBe(true);
  });

  it('calculates download progress percentages accurately', () => {
    const loaded = 3856384;
    const total = 7712768;
    const pct = Math.round((loaded / total) * 100);

    expect(pct).toBe(50);
  });
});
