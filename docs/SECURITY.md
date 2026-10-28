# Security Policy for WebLinux

## Security Architecture & Philosophy

WebLinux is built on a **Zero-Trust, Zero-Server-Side-Execution** security model.

1. **Client-Side Isolation**:
   - The entire virtual machine, x86 CPU emulator, memory heap, and virtual hard disk run exclusively within the client's browser WebAssembly sandbox.
   - No shell commands, keystrokes, or filesystem modifications are transmitted to any remote server.
2. **Browser Sandbox Protections**:
   - The Linux kernel operates inside an unprivileged WebAssembly memory buffer (`WebAssembly.Memory`).
   - Even if arbitrary binary code or malware is executed inside the guest Linux environment, it cannot break out of the browser's sandbox or access the host operating system's files, cameras, or microphones without explicit browser permission prompts.
3. **Storage Isolation**:
   - Persistent disk data is stored in the browser's origin-isolated `IndexedDB`. No other domain or website can read WebLinux storage.
4. **Content Security Policy (CSP)**:
   - WebLinux enforces strict CSP rules:
     ```http
     default-src 'self';
     script-src 'self' 'wasm-unsafe-eval';
     style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
     font-src 'self' https://fonts.gstatic.com;
     connect-src 'self' https://copy.sh wss://relay.widgetry.org;
     ```

## Reporting a Security Vulnerability

If you discover a security vulnerability in WebLinux, please report it privately:

- **Email**: `security@weblinux.org` (or open a confidential security advisory on GitHub).
- **Response SLA**: You will receive an acknowledgment within 24 hours and regular status updates until a patch is issued.
- **Responsible Disclosure**: Please do not file public GitHub issues for critical zero-day vulnerabilities prior to patch publication.
