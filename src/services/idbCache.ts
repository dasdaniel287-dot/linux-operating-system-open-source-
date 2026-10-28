/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux IndexedDB Cache & Persistence Layer
 */

const DB_NAME = 'weblinux_vfs_cache';
const DB_VERSION = 1;
const STORE_NAME = 'binary_blobs';
const PERSISTENT_STORE = 'user_files';

class StorageCacheService {
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  private async getDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return null;
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve) => {
        try {
          const req = indexedDB.open(DB_NAME, DB_VERSION);
          req.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME);
            }
            if (!db.objectStoreNames.contains(PERSISTENT_STORE)) {
              db.createObjectStore(PERSISTENT_STORE);
            }
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => {
            console.warn('WebLinux: IndexedDB open failed, operating in memory-only mode.');
            resolve(null);
          };
        } catch {
          resolve(null);
        }
      });
    }

    return this.dbPromise;
  }

  /**
   * Retrieve cached binary ArrayBuffer by URL or key
   */
  async getBlob(key: string): Promise<ArrayBuffer | null> {
    const db = await this.getDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result instanceof ArrayBuffer) {
            resolve(req.result);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  /**
   * Save binary ArrayBuffer to cache
   */
  async putBlob(key: string, buffer: ArrayBuffer): Promise<void> {
    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(buffer, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  /**
   * Fetch a URL with progress reporting, caching result in IndexedDB
   */
  async fetchWithCache(
    url: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<ArrayBuffer> {
    // 1. Try cache first
    const cached = await this.getBlob(url);
    if (cached && cached.byteLength > 0) {
      if (onProgress) onProgress(cached.byteLength, cached.byteLength);
      return cached;
    }

    // 2. Fetch over HTTP with progress
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: HTTP ${response.status} ${response.statusText}`);
    }

    const contentLengthHeader = response.headers.get('content-length');
    const total = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;

    if (!response.body) {
      const buffer = await response.arrayBuffer();
      await this.putBlob(url, buffer);
      return buffer;
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.length;
        if (onProgress && total > 0) {
          onProgress(received, total);
        }
      }
    }

    // Assemble buffer
    const fullBuffer = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      fullBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    const buffer = fullBuffer.buffer as ArrayBuffer;
    await this.putBlob(url, buffer);
    return buffer;
  }

  /**
   * Clear cached binaries to reclaim disk space or force re-download
   */
  async clearCache(): Promise<void> {
    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction([STORE_NAME, PERSISTENT_STORE], 'readwrite');
        tx.objectStore(STORE_NAME).clear();
        tx.objectStore(PERSISTENT_STORE).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}

export const storageCache = new StorageCacheService();
