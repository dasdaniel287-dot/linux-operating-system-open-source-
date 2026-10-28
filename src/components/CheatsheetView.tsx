import React, { useState } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Terminal, 
  FolderTree, 
  Cpu, 
  KeyRound, 
  ShieldCheck,
  Code2
} from 'lucide-react';

export const CheatsheetView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
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
            {[
              { cmd: 'gh auth login -w -s repo,read:org', desc: 'Authenticate GitHub CLI via web browser OAuth' },
              { cmd: 'gh release download -p "*.tar.gz"', desc: 'Download specific release tarball asset' },
              { cmd: 'gh repo clone owner/repo -- --depth=1', desc: 'Shallow clone repository with submodules' },
              { cmd: 'git submodule update --init --recursive', desc: 'Initialize all nested C/C++ git submodules' },
              { cmd: 'git config --global init.defaultBranch main', desc: 'Set standard default branch name' },
              { cmd: 'git status -sb', desc: 'Short branch and dirty file summary' },
            ].map(item => (
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
    </div>
  );
};
