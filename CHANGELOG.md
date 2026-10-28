# Changelog

All notable changes to **WebLinux** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-28
### Added
- Genuine Linux OS kernel execution in WebAssembly x86 emulator (v86 core).
- Full interactive serial console TTY with `@xterm/xterm` on `/dev/ttyS0`.
- IndexedDB binary caching system for instant cold-boot acceleration.
- Window Manager desktop shell with draggable, resizable, and minimizable windows.
- Desktop Taskbar with start menu, active window switcher, system tray, and clock.
- Built-in apps: Terminal, VGA Framebuffer, File Manager, Text Editor, System Monitor, and Settings.
- 9p VirtFS virtual filesystem mount at `/mnt/host` for bi-directional host-guest file exchange.
- Comprehensive test suite (Vitest + Playwright e2e specification).
- CI/CD automation with GitHub Actions for linting, testing, and GitHub Pages deployment.
