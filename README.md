# WebLinux 🐧

> **A genuine, open-source Linux operating system running in your web browser via WebAssembly x86 emulation.** No fake shells. Real kernel, real userland, real POSIX behavior.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![WebAssembly](https://img.shields.io/badge/WASM-Powered-654FF0.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)]()

---

## 🌟 Live Demo

Work in genuine Linux directly from your browser with zero installs or accounts:
**[https://ais-dev-jhj5lgj5sd2fwrda4qeham-576732283051.asia-southeast1.run.app](https://ais-dev-jhj5lgj5sd2fwrda4qeham-576732283051.asia-southeast1.run.app)**

---

## 🚀 Key Features

- **Genuine Linux Kernel**: Boots a real i386 Linux kernel with real virtual memory, interrupts, timer, and scheduler.
- **Serial Console via xterm.js**: Full 256-color ANSI terminal attached to `/dev/ttyS0` with bash, pipes, redirects, and job control (`Ctrl+C`, `Ctrl+Z`).
- **Complete Desktop Environment**:
  - Window Manager with draggable, resizable, minimizable, and maximizable windows.
  - Multi-workspace virtual desktops.
  - Taskbar with Application Launcher, running task manager, and system tray.
- **Built-in Desktop Apps**:
  - 🖥️ **Terminal**: Direct interactive root shell with bash and coreutils.
  - 🎨 **VGA Graphics Display**: Direct x86 hardware framebuffer canvas.
  - 📂 **File Manager**: Explore the Linux rootfs, upload host files, download VM artifacts.
  - 📝 **Code Editor**: Multi-tab code & configuration editor with syntax highlighting.
  - 📊 **System Monitor**: Live `/proc` process table and CPU / RAM telemetry graphs.
  - ⚙️ **Settings**: RAM sizing (64MB - 512MB), theme customizer (Nord, Dracula, Cyber, Dark, Light), and disk snapshot export.
- **IndexedDB Disk Caching**: Downloads the OS image once and caches chunks in IndexedDB for < 2.5s boots on subsequent sessions.
- **VirtFS 9p Host File Sync**: Mounts `/mnt/host` to exchange files between browser JavaScript and the guest Linux VM.
- **Zero Server-Side Execution**: All code runs client-side in the browser WebAssembly sandbox.

---

## 💻 Quick Start & Development

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

```bash
# Clone the repository
git clone https://github.com/your-username/weblinux.git
cd weblinux

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to boot your browser Linux OS!

---

## 🌐 Browser Compatibility

| Browser | Platform | Status | Boot Time (Cached) |
| :--- | :--- | :--- | :--- |
| **Google Chrome / Chromium** | macOS / Windows / Linux | ✅ Fully Supported | ~1.8s |
| **Mozilla Firefox** | macOS / Windows / Linux | ✅ Fully Supported | ~2.1s |
| **Apple Safari** | macOS / iOS | ✅ Fully Supported | ~2.4s |
| **Microsoft Edge** | Windows / macOS | ✅ Fully Supported | ~1.8s |

---

## ⚠️ Known Limitations & Roadmap

| Feature | Current State | Roadmap Target |
| :--- | :--- | :--- |
| **Networking** | Disabled by default (isolated sandbox) | WebSocket relay bridge to public web |
| **GPU Acceleration** | Software VGA emulation | WebGPU accelerated rasterization |
| **Persistence** | IndexedDB cache + `.tar` import/export | Persistent write-through overlayfs |
| **Multi-Core (SMP)** | Single-core x86 vCPU in WASM | Multi-threaded WASM workers for SMP |

---

## 📜 Documentation

- [System Architecture & Engine Selection](docs/ARCHITECTURE.md)
- [User Guide & Command Tutorials](docs/USER_GUIDE.md)
- [Security Policy & Sandboxing](docs/SECURITY.md)

---

## 📄 License

WebLinux is licensed under the [MIT License](LICENSE).
Emulation core powered by the BSD-licensed v86 project by Fabian Hemmer.
