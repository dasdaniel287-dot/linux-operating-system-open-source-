import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Terminal, 
  FolderTree, 
  Cpu, 
  KeyRound, 
  ShieldCheck,
  Code2,
  Search,
  Layers,
  Settings,
  HardDrive,
  AlertCircle,
  Wrench
} from 'lucide-react';

interface CheatItem {
  cmd: string;
  desc: string;
  category: 'git' | 'aur' | 'systemd' | 'flags' | 'storage' | 'troubleshoot';
}

const CHEAT_ITEMS: CheatItem[] = [
  { cmd: 'sudo dd if=linux.iso of=/dev/sdX bs=4M status=progress oflag=sync', desc: 'Burn bootable ISO to USB block storage with progress', category: 'storage' },
  { cmd: 'lsblk -o NAME,SIZE,TYPE,MOUNTPOINTS,FSTYPE', desc: 'List all block storage devices and identify USB drive letters', category: 'storage' },
  { cmd: 'sudo apt update && sudo apt install --reinstall coreutils', desc: 'Fix "bash: dd: command not found" on Ubuntu/Debian by installing GNU coreutils', category: 'troubleshoot' },
  { cmd: 'sudo pacman -S coreutils', desc: 'Fix "bash: dd: command not found" on Arch Linux', category: 'troubleshoot' },
  { cmd: 'sudo dnf install coreutils', desc: 'Fix "bash: dd: command not found" on Fedora/RHEL', category: 'troubleshoot' },
  { cmd: 'export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"', desc: 'Fix "command not found" caused by broken or missing shell $PATH', category: 'troubleshoot' },
  { cmd: 'gh auth login -w -s repo,read:org', desc: 'Authenticate GitHub CLI via web browser OAuth', category: 'git' },
  { cmd: 'gh release download -p "*.tar.gz"', desc: 'Download specific release tarball asset', category: 'git' },
  { cmd: 'gh repo clone owner/repo -- --depth=1', desc: 'Shallow clone repository with submodules', category: 'git' },
  { cmd: 'git submodule update --init --recursive', desc: 'Initialize all nested C/C++ git submodules', category: 'git' },
  { cmd: 'git config --global init.defaultBranch main', desc: 'Set standard default branch name', category: 'git' },
  { cmd: 'git status -sb', desc: 'Short branch and dirty file summary', category: 'git' },
  { cmd: 'git clone https://aur.archlinux.org/yay.git && cd yay && makepkg -si', desc: 'Install yay AUR helper from source on Arch Linux', category: 'aur' },
  { cmd: 'makepkg -sirc', desc: 'Build and install Arch package with dependencies and clean build directory', category: 'aur' },
  { cmd: 'sudo systemctl daemon-reload', desc: 'Reload systemd manager configuration after adding service unit', category: 'systemd' },
  { cmd: 'systemctl --user enable --now mydaemon.service', desc: 'Enable and start unprivileged user daemon service', category: 'systemd' },
  { cmd: 'journalctl -u mydaemon.service -f -n 50', desc: 'Follow systemd live service log output', category: 'systemd' },
  { cmd: 'CFLAGS="-O3 -march=native -flto"', desc: 'C compiler flags for maximum host hardware performance', category: 'flags' },
  { cmd: 'make -j$(nproc)', desc: 'Compile utilizing all CPU cores in parallel', category: 'flags' },
  { cmd: 'cargo build --release --locked', desc: 'Rust release profile with locked dependency verification', category: 'flags' },
  { cmd: 'go build -ldflags="-s -w"', desc: 'Go compiler flags to strip symbols and reduce binary size', category: 'flags' },
];

export const CheatsheetView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return CHEAT_ITEMS;
    const q = searchQuery.toLowerCase();
    return CHEAT_ITEMS.filter(item => 
      item.cmd.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Linux Engineering Knowledge Vault</span>
            <span aria-hidden="true">·</span>
            <span>Open Source Systems</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            Linux OS & GitHub Cheatsheet
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Essential commands, compiler flags, directory standards, and authentication workflows for building open-source code on Linux.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search commands, flags..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Quick Search Results if active */}
      {searchQuery && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Search Results ({filteredItems.length} commands found)</span>
            <button onClick={() => setSearchQuery('')} className="text-cyan-400 hover:underline">Clear</button>
          </div>
          <div className="space-y-2">
            {filteredItems.map(item => (
              <div key={item.cmd} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <div className="text-cyan-300 font-semibold">{item.cmd}</div>
                  <div className="text-[11px] text-slate-400 font-sans mt-0.5">{item.desc}</div>
                </div>
                <button
                  onClick={() => handleCopy(item.cmd, `search-${item.cmd}`)}
                  className="text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
                >
                  {copiedKey === `search-${item.cmd}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Cheatsheet Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: Filesystem Hierarchy for GitHub Software */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <span>Linux Filesystem Hierarchy (FHS) for Installers</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Where should GitHub open-source software and compiled binaries be placed on Linux?
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-mono font-semibold text-cyan-300">
                <span>/usr/local/bin</span>
                <span className="text-[11px] text-slate-400">System-wide (Root)</span>
              </div>
              <p className="text-slate-300">
                The standard Linux location for manually compiled or non-packaged binaries. Overrides package manager defaults in standard <code className="text-cyan-400 font-mono">$PATH</code> order.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-mono font-semibold text-emerald-300">
                <span>~/.local/bin</span>
                <span className="text-[11px] text-slate-400">User-only (No Root)</span>
              </div>
              <p className="text-slate-300">
                Best for personal user utilities installed with <code className="text-cyan-400 font-mono">cargo install</code>, <code className="text-cyan-400 font-mono">pipx</code>, or user scripts. Requires <code className="text-cyan-400 font-mono">export PATH="$HOME/.local/bin:$PATH"</code>.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-mono font-semibold text-amber-300">
                <span>/opt/&lt;appname&gt;</span>
                <span className="text-[11px] text-slate-400">Self-Contained Bundles</span>
              </div>
              <p className="text-slate-300">
                Reserved for large multi-file applications (e.g. Neovim nightly bundle, Chrome, JetBrains IDEs). Symlink main binary to <code className="text-cyan-400 font-mono">/usr/local/bin</code>.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-mono font-semibold text-purple-300">
                <span>~/.local/share/applications</span>
                <span className="text-[11px] text-slate-400">Desktop Launchers</span>
              </div>
              <p className="text-slate-300">
                Store user <code className="text-cyan-400 font-mono">.desktop</code> entries here so applications appear in GNOME, KDE, or Rofi application menus.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Git & GitHub CLI (gh) Commands */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>GitHub CLI (gh) & Git Power Commands</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Essential terminal commands for cloning, downloading releases, and managing pull requests.
          </p>

          <div className="space-y-2 text-xs font-mono">
            {CHEAT_ITEMS.filter(i => i.category === 'git').map(item => (
              <div key={item.cmd} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <div className="text-cyan-300 font-semibold">{item.cmd}</div>
                  <div className="text-[11px] text-slate-400 font-sans mt-0.5">{item.desc}</div>
                </div>
                <button
                  onClick={() => handleCopy(item.cmd, item.cmd)}
                  className="text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
                >
                  {copiedKey === item.cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Compiler Flags & Optimization */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>C/C++, Rust & Go Compiler Optimization Flags</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Maximize execution performance when compiling open-source GitHub code on Linux:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono text-cyan-300 font-semibold block">CFLAGS="-O3 -march=native -flto"</span>
              <p className="text-slate-300">
                <code className="text-cyan-400 font-mono">-O3</code> max optimizations, <code className="text-cyan-400 font-mono">-march=native</code> targets exact host CPU instruction sets (AVX2, AVX-512), and <code className="text-cyan-400 font-mono">-flto</code> enables cross-module Link-Time Optimization.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono text-cyan-300 font-semibold block">make -j$(nproc)</span>
              <p className="text-slate-300">
                Compiles utilizing all available physical and logical CPU cores in parallel to speed up builds by 4x-16x.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono text-cyan-300 font-semibold block">cargo build --release --locked</span>
              <p className="text-slate-300">
                Rust compiler with full optimizations and locked dependency tree verification.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono text-cyan-300 font-semibold block">go build -ldflags="-s -w"</span>
              <p className="text-slate-300">
                Strips DWARF debugging information and symbol tables, reducing Go binary sizes by up to 40%.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: SSH Key Setup & Verification */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>High-Security Ed25519 SSH Setup for GitHub</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Industry standard for cryptographic authentication without entering passwords.
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px] font-sans">1. Generate key pair:</div>
              <div className="text-cyan-300 font-semibold mt-0.5">ssh-keygen -t ed25519 -C "your_email@example.com"</div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px] font-sans">2. Start agent & add key:</div>
              <div className="text-cyan-300 font-semibold mt-0.5">eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519</div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px] font-sans">3. Print public key to paste on GitHub:</div>
              <div className="text-cyan-300 font-semibold mt-0.5">cat ~/.ssh/id_ed25519.pub</div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px] font-sans">4. Test connection:</div>
              <div className="text-cyan-300 font-semibold mt-0.5">ssh -T git@github.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting System Errors: bash: dd: command not found & Missing Tools */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Diagnostic & Troubleshooting Guide</span>
              <span aria-hidden="true">·</span>
              <span>Root Cause & Verified Fixes</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Resolving "bash: &lt;command&gt;: command not found" on Linux
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              When bash reports a command cannot be found, it is either missing from the system's package registry, stripped in a minimal container/chroot, or your user <code className="text-cyan-300 font-mono">$PATH</code> environment variable is broken.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg shrink-0">
            System Coreutils
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Issue 1: bash: dd: command not found */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-xs font-mono font-bold text-slate-200">bash: dd: command not found</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Cause:</strong> <code className="text-cyan-300">dd</code> is part of GNU <strong className="text-slate-300">coreutils</strong> (located at <code className="text-cyan-300">/usr/bin/dd</code>). Missing in stripped minimal images, or <code className="text-cyan-300">$PATH</code> is missing <code className="text-cyan-300">/bin</code>.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
              <div className="text-slate-400 text-[10px] font-sans font-semibold">Ubuntu / Debian / Mint:</div>
              <div className="bg-slate-900 p-2 rounded flex items-center justify-between text-cyan-300">
                <span className="truncate">sudo apt install --reinstall coreutils</span>
                <button
                  onClick={() => handleCopy('sudo apt update && sudo apt install --reinstall coreutils', 'fix-dd-deb')}
                  className="text-slate-400 hover:text-cyan-400 ml-2"
                >
                  {copiedKey === 'fix-dd-deb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-slate-400 text-[10px] font-sans font-semibold">Arch Linux:</div>
              <div className="bg-slate-900 p-2 rounded flex items-center justify-between text-cyan-300">
                <span className="truncate">sudo pacman -S coreutils</span>
                <button
                  onClick={() => handleCopy('sudo pacman -S coreutils', 'fix-dd-arch')}
                  className="text-slate-400 hover:text-cyan-400 ml-2"
                >
                  {copiedKey === 'fix-dd-arch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-slate-400 text-[10px] font-sans font-semibold">Alpine Linux:</div>
              <div className="bg-slate-900 p-2 rounded flex items-center justify-between text-cyan-300">
                <span className="truncate">apk add coreutils</span>
                <button
                  onClick={() => handleCopy('apk add coreutils', 'fix-dd-alpine')}
                  className="text-slate-400 hover:text-cyan-400 ml-2"
                >
                  {copiedKey === 'fix-dd-alpine' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Issue 2: Broken $PATH environment */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-xs font-mono font-bold text-slate-200">Corrupted $PATH Variable</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Cause:</strong> Overwriting <code className="text-cyan-300">PATH="..."</code> in <code className="text-cyan-300">~/.bashrc</code> without appending <code className="text-cyan-300">:$PATH</code> breaks all binary discovery.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
              <div className="text-slate-400 text-[10px] font-sans font-semibold">Immediate Shell Recovery:</div>
              <div className="bg-slate-900 p-2 rounded flex items-center justify-between text-emerald-300">
                <span className="truncate">export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"</span>
                <button
                  onClick={() => handleCopy('export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"', 'fix-path')}
                  className="text-slate-400 hover:text-cyan-400 ml-2"
                >
                  {copiedKey === 'fix-path' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-slate-400 text-[10px] font-sans font-semibold">Verify Location of dd:</div>
              <div className="bg-slate-900 p-2 rounded flex items-center justify-between text-cyan-300">
                <span className="truncate">/bin/dd --version</span>
                <button
                  onClick={() => handleCopy('/bin/dd --version', 'fix-bin-dd')}
                  className="text-slate-400 hover:text-cyan-400 ml-2"
                >
                  {copiedKey === 'fix-bin-dd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Issue 3: bash: sudo: command not found */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span className="text-xs font-mono font-bold text-slate-200">bash: sudo: command not found</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Cause:</strong> Minimal Debian installations or containers ship without the sudo binary package.
              </p>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
              <div className="text-slate-400 text-[10px] font-sans font-semibold">1. Switch to root & install sudo:</div>
              <div className="bg-slate-900 p-2 rounded flex items-center justify-between text-cyan-300">
                <span className="truncate">su -c "apt update && apt install -y sudo"</span>
                <button
                  onClick={() => handleCopy('su -c "apt update && apt install -y sudo"', 'fix-sudo')}
                  className="text-slate-400 hover:text-cyan-400 ml-2"
                >
                  {copiedKey === 'fix-sudo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-slate-400 text-[10px] font-sans font-semibold">2. Add your user to sudo group:</div>
              <div className="bg-slate-900 p-2 rounded flex items-center justify-between text-cyan-300">
                <span className="truncate">usermod -aG sudo $USER</span>
                <button
                  onClick={() => handleCopy('usermod -aG sudo $USER', 'fix-sudo-group')}
                  className="text-slate-400 hover:text-cyan-400 ml-2"
                >
                  {copiedKey === 'fix-sudo-group' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linux GPU Compute & Local AI Workstation Graphics Showcase */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <span>Hardware Acceleration & Neural Runtimes</span>
              <span aria-hidden="true">·</span>
              <span>Linux CUDA / ROCm / Vulkan</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Linux GPU Acceleration & Local Open-Source AI Architecture
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              Why Linux dominates AI & deep learning: direct bare-metal PCIe GPU memory mapping, unthrottled CUDA/ROCm runtimes, and sub-millisecond tensor kernel execution for Ollama, llama.cpp, and PyTorch.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-auto">
            Direct Hardware DMA
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
            <img 
              src="/src/assets/images/local_ai_linux_gpu_1793210649205.jpg" 
              alt="Linux AI Workstation with GPU Accelerator running Ollama and Local LLMs"
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-5 space-y-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <h3 className="text-sm font-semibold text-cyan-300">NVIDIA CUDA Toolkit & Driver</h3>
              <p className="text-slate-300 leading-relaxed">
                Linux provides native proprietary kernel modules (`nvidia-smi`, `libcuda.so`) with Unified Memory Architecture and FlashAttention-2 support.
              </p>
              <code className="text-[11px] font-mono text-cyan-400 block pt-1">sudo apt install -y nvidia-driver-550 cuda-toolkit-12</code>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <h3 className="text-sm font-semibold text-emerald-300">AMD ROCm & HIP Runtimes</h3>
              <p className="text-slate-300 leading-relaxed">
                Open-source Heterogeneous-compute Interface for Portability (HIP) enables running PyTorch directly on Radeon RX 7000/6000 and Instinct accelerators.
              </p>
              <code className="text-[11px] font-mono text-emerald-400 block pt-1">sudo usermod -aG render,video $USER</code>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <h3 className="text-sm font-semibold text-amber-300">Cross-Vendor Vulkan Kompute</h3>
              <p className="text-slate-300 leading-relaxed">
                Universal fallback across Intel Arc, AMD, and NVIDIA using Vulkan SPIR-V compute shaders for llama.cpp without proprietary SDK lock-in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
