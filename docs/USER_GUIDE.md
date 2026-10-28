# WebLinux User Guide

Welcome to **WebLinux**, a genuine Linux operating system running right in your web browser!

---

## 1. Quick Start

1. Open WebLinux in your browser: [https://ais-dev-jhj5lgj5sd2fwrda4qeham-576732283051.asia-southeast1.run.app](https://ais-dev-jhj5lgj5sd2fwrda4qeham-576732283051.asia-southeast1.run.app)
2. Click **"Boot WebLinux"** or wait for automatic initialization.
3. Once booted, the **Terminal** window will present a live root shell prompt:
   ```bash
   ~ # uname -a
   Linux weblinux 4.x.x-i386 #1 PREEMPT GNU/Linux
   ```

---

## 2. Desktop Environment & Window Navigation

WebLinux features a complete desktop windowing environment:

- **Move Windows**: Click and drag any window header.
- **Resize Windows**: Drag the lower-right corner or edges.
- **Minimize / Maximize**: Use the `-` and `□` icons in the titlebar, or click the corresponding icon in the bottom taskbar.
- **Close Window**: Click the `✕` button.
- **App Launcher**: Click the **WebLinux** logo in the bottom-left corner to search and launch applications.
- **Virtual Workspaces**: Switch between Workspaces 1, 2, and 3 via the taskbar switcher.

---

## 3. Included Applications

### 3.1. Terminal (xterm.js Serial Console)
- Connected to `/dev/ttyS0` (COM1 serial port).
- Real pipes (`ls -la | grep etc`), redirects (`echo "hello" > test.txt`), and processes (`ps aux`, `top`).
- Full support for `Ctrl+C` (SIGINT), `Ctrl+Z` (SIGTSTP), and `Ctrl+D` (EOF).
- **Copy / Paste**: Use `Ctrl+Shift+C` and `Ctrl+Shift+V` or select text and right-click.

### 3.2. VGA Graphics Display
- Hardware framebuffer rendering for graphical programs.
- Supports pointer lock for mouse capture (press `ESC` to release cursor).

### 3.3. File Manager
- Graphical explorer for the Linux root filesystem (`/`, `/home`, `/etc`, `/var`, `/tmp`).
- Upload files directly from your computer into `/mnt/host`.
- Download any file or directory from the virtual machine.

### 3.4. Code & Text Editor
- Multi-tab text editor with syntax highlighting for Bash, C, Python, JavaScript, JSON, and Markdown.
- Edit configuration files directly (e.g. `/etc/inittab`, `~/.profile`).

### 3.5. System Monitor
- Real-time CPU and Memory utilization graphs.
- Live process table streaming directly from the virtual `/proc` filesystem.

### 3.6. Settings & Snapshot Manager
- **RAM Tuning**: Allocate 64MB, 128MB, 256MB, or 512MB of virtual memory.
- **Themes**: Switch between Dark, Nord, Dracula, Cyber, and High-Contrast Light.
- **Export VM State**: Save your entire virtual machine state to disk.
- **Clear Cache**: Reset the IndexedDB cache if a download was interrupted.

---

## 4. Essential Linux Commands to Try

```bash
# View operating system kernel details
uname -a

# View CPU hardware metrics reported by Linux kernel
cat /proc/cpuinfo

# View RAM allocation
free -m

# View mounted filesystems
df -h

# Check active system processes
ps aux

# Run a quick shell loop benchmark
time for i in $(seq 1 1000); do :; done

# Write and run a shell script
cat << 'EOF' > greet.sh
#!/bin/sh
echo "Welcome to WebLinux running on x86 WebAssembly!"
EOF
chmod +x greet.sh
./greet.sh
```

---

## 5. File Persistence & Exporting

WebLinux provides two ways to retain your work:

1. **Host-Shared Directory (`/mnt/host`)**:
   Files saved here are automatically synchronized with the browser's IndexedDB storage.
2. **Export as Tar Archive**:
   In the File Manager, click **"Export Backup"** to download all files in `/home` as a standard `.tar` archive. You can restore this archive in any session.

---

## 6. Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Alt + T` | Open new Terminal window |
| `Alt + F` | Open File Manager |
| `Alt + E` | Open Text Editor |
| `Alt + M` | Open System Monitor |
| `Ctrl + L` | Clear terminal screen |
| `Ctrl + C` | Send SIGINT interrupt signal |
| `Ctrl + Z` | Send SIGTSTP background signal |
