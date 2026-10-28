# WebLinux Architecture & Design Specification

## 1. Executive Overview

**WebLinux** is an open-source, client-side, zero-install Linux operating system running genuine Linux kernels and userlands entirely inside modern web browsers. Unlike mock terminal web apps that simulate shell commands via JavaScript regexes or dictionary objects, WebLinux executes authentic x86 machine instructions via WebAssembly.

Every command entered in WebLinux (`ls`, `grep`, `bash`, `python`, `apk`, `pipes`, `signals`, `fork`) is processed by a genuine Linux kernel running POSIX system calls against a real virtual memory space, interrupt controller, and virtual block storage.

---

## 2. Emulation Engine Selection: v86 vs. CheerpX

When architecting a client-side x86 virtual machine in WebAssembly, two primary engines were evaluated: **v86** (by Fabian Hemmer) and **CheerpX** (by Leaning Technologies).

| Feature / Metric | v86 (Selected) | CheerpX / WebVM | Rationale for Selection |
| :--- | :--- | :--- | :--- |
| **Open Source License** | **BSD 2-Clause (100% Free & Open Source)** | Proprietary / Non-commercial license restrictions | Mandatory for a true open-source community project |
| **Air-gapped / Self-Hosted** | Completely self-contained static WASM asset | Requires proprietary cloud backend / licensing servers | Allows air-gapped deployment, local Docker, and GitHub Pages |
| **Virtual Hardware Emulation** | Full PC: CPU (Ring 0-3), SeaBIOS, PIC, PIT, Serial COM1, IDE, VirtIO, VGA | Syscall translation layer (userland only) | v86 boots real kernels (`bzImage`, ISO, disk images) |
| **Serial TTY Integration** | Direct byte streams via `/dev/ttyS0` to xterm.js | Terminal emulation via syscall intercept | Raw serial console provides 100% native POSIX TTY behavior |
| **Storage & 9p VirtFS** | VirtIO 9p filesystem sharing between host and guest | Ext2 image over HTTP with range requests | Enables bi-directional host-to-guest file transfer |
| **Browser Compatibility** | Any browser with WASM & SharedArrayBuffer (Chrome, Firefox, Safari, Edge) | WebAssembly with specific memory extensions | Broadest cross-device reliability |

**Architectural Decision**: v86 was selected because it is 100% open-source, runs fully offline without proprietary telemetry, emulates hardware at ring-0 (allowing custom kernel compilation), and provides battle-tested serial and VGA framebuffer abstractions.

---

## 3. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Web Browser (Host Environment)                   │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    WebLinux React Desktop Shell                  │  │
│  │  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐  ┌───────┐  │  │
│  │  │ WindowManager│  │ Taskbar/Tray│  │ File Manager │  │Editor │  │  │
│  │  └──────┬───────┘  └──────┬──────┘  └──────┬───────┘  └───┬───┘  │  │
│  └─────────┼─────────────────┼────────────────┼──────────────┼──────┘  │
│            ▼                 ▼                ▼              ▼         │
│  ┌───────────────────┐ ┌──────────────┐ ┌───────────────────────────┐  │
│  │ xterm.js Terminal │ │ VGA Canvas   │ │ 9p VirtFS / IndexedDB Sync│  │
│  └─────────┬─────────┘ └──────┬───────┘ └─────────────┬─────────────┘  │
│            │ (Serial Bytes)   │ (Framebuffer)         │ (Filesystem)   │
│            ▼                  ▼                       ▼                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                       v86 WebAssembly Core                       │  │
│  │  ┌──────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │  │
│  │  │ x86 CPU JIT  │  │ SeaBIOS     │  │ VirtIO Block & Serial   │  │  │
│  │  │ Interpreter  │  │ 128KB ROM   │  │ Emulation Drivers       │  │  │
│  │  └──────────────┘  └─────────────┘  └─────────────────────────┘  │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      ▼
             ┌─────────────────────────────────────────────────┐
             │       Genuine Guest Linux Virtual Machine       │
             │                                                 │
             │  ┌───────────────────────────────────────────┐  │
             │  │   Linux Kernel 4.x / 6.x (i386 / x86_64)  │  │
             │  │   - Virtual Memory & Paging               │  │
             │  │   - Scheduler & Process Tree              │  │
             │  │   - Serial Console Driver (/dev/ttyS0)    │  │
             │  │   - 9p VirtFS Client (/mnt/host)          │  │
             │  └─────────────────────┬─────────────────────┘  │
             │                        ▼                        │
             │  ┌───────────────────────────────────────────┐  │
             │  │   GNU / Busybox Linux Userland            │  │
             │  │   - bash, sh, coreutils, sed, awk         │  │
             │  │   - apk / apt package manager             │  │
             │  │   - gcc, python, lua, curl, git           │  │
             │  │   - /proc, /sys, /dev, /etc, /home        │  │
             │  └───────────────────────────────────────────┘  │
             └─────────────────────────────────────────────────┘
```

---

## 4. Subsystem Specifications

### 4.1. Boot Sequence & Memory Allocation
1. **Host Boot Initialization**:
   - The user loads WebLinux. The boot coordinator checks the browser's `IndexedDB` (`weblinux_vfs_cache`) for cached copies of `seabios.bin`, `vgabios.bin`, and the kernel disk image (`linux4.iso`).
   - If not cached, assets are streamed with an HTTP Range/Progress callback updating the GUI boot progress bar.
   - Once fetched, assets are persisted in IndexedDB, reducing subsequent load times to < 2.5 seconds.
2. **Virtual Machine Launch**:
   - v86 instantiates with configured memory (`default: 128MB`, configurable up to `512MB`).
   - The virtual CPU resets, executes SeaBIOS POST routines, detects the virtual CD-ROM/IDE controller, and loads the isolinux/syslinux bootloader.
3. **Kernel Decompression**:
   - The Linux kernel uncompresses into physical memory and mounts the initial ramdisk (`initrd`).
   - The kernel initializes drivers: IDE controller, timer, serial driver (`8250`), keyboard (`i8042`), and framebuffer.
   - The kernel spawns PID 1 (`/sbin/init`), which executes `/etc/init.d/rcS` and opens a login shell on `/dev/ttyS0`.

### 4.2. Terminal & Serial Bridge
- Standard web emulators often fail because they map DOM keyboard events to mock JavaScript handlers.
- In WebLinux, `@xterm/xterm` is directly hooked to v86's COM1 UART:
  - When the user presses keys, `xterm.onData(data)` converts keystrokes into UTF-8 byte streams and calls `emulator.serial0_send(data)`.
  - When the Linux kernel produces stdout/stderr output, v86 fires `serial0-output-byte`, feeding raw bytes into `xterm.write(new Uint8Array(bytes))`.
  - ANSI escape codes, cursor repositioning, colors, and line-drawing characters are rendered natively by xterm.js.

### 4.3. Persistence & Host-Guest File Transfer (9p VirtFS)
- The guest operating system mounts a virtual 9p filesystem over VirtIO:
  ```bash
  mount -t 9p -o trans=virtio,version=9p2000.L host9p /mnt/host
  ```
- Any file dropped onto the WebLinux desktop file manager is serialized into the browser's IndexedDB and immediately visible inside the Linux guest terminal at `/mnt/host`.
- Files created or edited in Linux can be exported directly as a `.tar.gz` bundle or single downloads.

### 4.4. Networking Architecture (WebSocket Relay)
- Web browsers cannot open raw TCP sockets due to sandbox security restrictions.
- WebLinux supports an optional VirtIO network card connected to a WebSocket bridge:
  ```
  Linux Guest (virtio-net) ──> v86 Ethernet ──> WebSocket ──> Relay Proxy ──> Real Internet
  ```
- When disabled (default for security and privacy), all networking is contained locally. When enabled, users can connect to IRC, download packages, and ping remote endpoints.

---

## 5. Security & Isolation Model
- **Zero Server-Side Execution**: All code runs inside the user's browser WebAssembly runtime. No commands are sent to a remote server.
- **Same-Origin Policy**: Files stored in IndexedDB are sandboxed strictly to the hosting domain.
- **Content Security Policy (CSP)**: Disallows unauthorized third-party script injection.
- **Fail-Safe Crash Recovery**: If a kernel panic occurs or memory runs out, the watchdog timer catches the error, frees WASM memory, and offers a single-click clean reboot with cache preservation.
