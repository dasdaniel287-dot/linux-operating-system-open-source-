import React, { useState } from 'react';
import { 
  GitBranch, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Settings2, 
  ExternalLink,
  Code2,
  Cpu,
  Shield,
  FileCode,
  Box,
  Workflow
} from 'lucide-react';

interface QuickPreset {
  name: string;
  repo: string;
  build: 'cargo' | 'go' | 'cmake' | 'make' | 'release';
  desc: string;
}

const PRESETS: QuickPreset[] = [
  { name: 'astral-sh/uv', repo: 'astral-sh/uv', build: 'cargo', desc: 'Blazing-fast Python package installer in Rust' },
  { name: 'sharkdp/fd', repo: 'sharkdp/fd', build: 'cargo', desc: 'Simple, fast and user-friendly alternative to find' },
  { name: 'charmbracelet/glow', repo: 'charmbracelet/glow', build: 'go', desc: 'Render markdown on the CLI with glamour' },
  { name: 'zellij-org/zellij', repo: 'zellij-org/zellij', build: 'cargo', desc: 'Terminal workspace and multiplexer with layout tiles' },
  { name: 'zyedidia/micro', repo: 'zyedidia/micro', build: 'go', desc: 'Modern terminal-based text editor with intuitive shortcuts' },
  { name: 'muesli/duf', repo: 'muesli/duf', build: 'go', desc: 'Disk Usage/Free utility with colorized tables' },
  { name: 'tmux/tmux', repo: 'tmux/tmux', build: 'make', desc: 'Terminal multiplexer workspace daemon' },
  { name: 'dandavison/delta', repo: 'dandavison/delta', build: 'cargo', desc: 'Syntax-highlighting pager for git diffs' },
];

export const RepoAnalyzerView: React.FC = () => {
  const [repoInput, setRepoInput] = useState<string>('astral-sh/uv');
  const [buildSystem, setBuildSystem] = useState<'cargo' | 'go' | 'cmake' | 'make' | 'release'>('cargo');
  const [installDir, setInstallDir] = useState<'/usr/local/bin' | '~/.local/bin'>('/usr/local/bin');
  const [createDesktopEntry, setCreateDesktopEntry] = useState<boolean>(false);
  const [createSystemdUnit, setCreateSystemdUnit] = useState<boolean>(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'install' | 'docker' | 'github_actions' | 'uninstall'>('install');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Normalize owner/repo
  const cleanRepo = repoInput.replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').trim();
  const repoParts = cleanRepo.split('/');
  const owner = repoParts[0] || 'owner';
  const repoName = repoParts[1] || 'repository';
  const binaryName = repoName.toLowerCase().replace(/[^a-z0-9_-]/g, '');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate robust bash installer
  const isUserSpace = installDir === '~/.local/bin';
  const sudoPrefix = isUserSpace ? '' : 'sudo ';

  let buildSteps = '';
  if (buildSystem === 'cargo') {
    buildSteps = `# Build with Rust Cargo toolchain
echo -e "\\033[1;34m[3/5]\\033[0m Compiling release binary with cargo..."
if ! command -v cargo &>/dev/null; then
    echo "Cargo is not installed. Installing Rustup toolchain..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
fi
cargo build --release --locked
TARGET_BIN="target/release/${binaryName}"`;
  } else if (buildSystem === 'go') {
    buildSteps = `# Build with Go toolchain
echo -e "\\033[1;34m[3/5]\\033[0m Compiling binary with Go..."
if ! command -v go &>/dev/null; then
    echo "ERROR: Go compiler not found. Please install golang." >&2
    exit 1
fi
go build -ldflags="-s -w" -o "${binaryName}" .
TARGET_BIN="${binaryName}"`;
  } else if (buildSystem === 'cmake') {
    buildSteps = `# Build with CMake & Make
echo -e "\\033[1;34m[3/5]\\033[0m Configuring and compiling with CMake..."
mkdir -p build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j"$(nproc)"
TARGET_BIN="${binaryName}"`;
  } else if (buildSystem === 'make') {
    buildSteps = `# Build with Makefile
echo -e "\\033[1;34m[3/5]\\033[0m Compiling with Make..."
if [ -f "autogen.sh" ]; then ./autogen.sh; fi
if [ -f "configure" ]; then ./configure --prefix=${isUserSpace ? '$HOME/.local' : '/usr/local'}; fi
make -j"$(nproc)"
TARGET_BIN="${binaryName}"`;
  } else {
    // Release binary
    buildSteps = `# Download precompiled release asset via GitHub Releases API
echo -e "\\033[1;34m[3/5]\\033[0m Querying GitHub Releases API for latest asset..."
LATEST_TAG=$(curl -s "https://api.github.com/repos/${cleanRepo}/releases/latest" | grep -Po '"tag_name": "\\K.*?(?=")')
echo "Found release tag: \${LATEST_TAG}"
DOWNLOAD_URL=$(curl -s "https://api.github.com/repos/${cleanRepo}/releases/latest" | grep -Po '"browser_download_url": "\\K.*?linux.*?x86_64.*?(?=")' | head -n 1)

if [ -z "\${DOWNLOAD_URL}" ]; then
    DOWNLOAD_URL=$(curl -s "https://api.github.com/repos/${cleanRepo}/releases/latest" | grep -Po '"browser_download_url": "\\K.*?amd64.*?(?=")' | head -n 1)
fi

echo "Downloading from: \${DOWNLOAD_URL}"
curl -sLO "\${DOWNLOAD_URL}"
ARCHIVE_NAME=$(basename "\${DOWNLOAD_URL}")

if [[ "\${ARCHIVE_NAME}" == *.tar.gz ]] || [[ "\${ARCHIVE_NAME}" == *.tgz ]]; then
    tar -xzf "\${ARCHIVE_NAME}"
elif [[ "\${ARCHIVE_NAME}" == *.tar.xz ]]; then
    tar -xJf "\${ARCHIVE_NAME}"
elif [[ "\${ARCHIVE_NAME}" == *.zip ]]; then
    unzip -q "\${ARCHIVE_NAME}"
fi

TARGET_BIN=$(find . -type f -name "${binaryName}" -o -name "${binaryName}*" | head -n 1)`;
  }

  const generatedScript = `#!/usr/bin/env bash
# ==============================================================================
# Automated GitHub Open-Source Installer for: ${cleanRepo}
# Generated by OpenLinux GitForge
# Target Distro: Linux (x86_64 / arm64)
# ==============================================================================

set -euo pipefail

RED='\\033[0;31m'
GREEN='\\033[0;32m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

echo -e "\${BLUE}==> Initiating installation of ${cleanRepo} <==\${NC}"

# 1. Dependency Check
echo -e "\${BLUE}[1/5]\${NC} Checking core utilities..."
for cmd in git curl tar; do
    if ! command -v "\$cmd" &>/dev/null; then
        echo -e "\${RED}Missing required dependency: \$cmd. Please install it first.\${NC}" >&2
        exit 1
    fi
done

# 2. Setup Temporary Workspace
TMP_DIR=$(mktemp -d -t ${binaryName}-install-XXXXXX)
trap 'rm -rf "\$TMP_DIR"' EXIT
cd "\$TMP_DIR"

echo -e "\${BLUE}[2/5]\${NC} Fetching repository from GitHub..."
git clone --depth 1 "https://github.com/${cleanRepo}.git" repo
cd repo

${buildSteps}

# 4. Install Binary
echo -e "\${BLUE}[4/5]\${NC} Installing binary to ${installDir}..."
mkdir -p "${installDir.replace('~', '$HOME')}"
${sudoPrefix}install -m 755 "\$TARGET_BIN" "${installDir.replace('~', '$HOME')}/${binaryName}"

${createDesktopEntry ? `# Create Desktop Launcher
echo -e "\${BLUE}[+]\\033[0m Creating desktop launcher..."
mkdir -p "$HOME/.local/share/applications"
cat << 'EOF' > "$HOME/.local/share/applications/${binaryName}.desktop"
[Desktop Entry]
Name=${binaryName}
Comment=Launched from ${cleanRepo}
Exec=${installDir.replace('~', '$HOME')}/${binaryName}
Terminal=true
Type=Application
Categories=Development;Utility;
EOF
` : ''}
${createSystemdUnit ? `# Create Systemd User Service
echo -e "\${BLUE}[+]\\033[0m Creating Systemd user service unit..."
mkdir -p "$HOME/.config/systemd/user"
cat << 'EOF' > "$HOME/.config/systemd/user/${binaryName}.service"
[Unit]
Description=${binaryName} daemon service
After=network.target

[Service]
ExecStart=${installDir.replace('~', '$HOME')}/${binaryName}
Restart=always
RestartSec=5s

[Install]
WantedBy=default.target
EOF
systemctl --user daemon-reload
echo "To start: systemctl --user start ${binaryName}.service"
` : ''}

# 5. Verify Installation
echo -e "\${BLUE}[5/5]\${NC} Verifying installation..."
if command -v "${binaryName}" &>/dev/null; then
    echo -e "\${GREEN}✓ Successfully installed ${binaryName}!\${NC}"
    "${binaryName}" --version || "${binaryName}" -v || echo "Binary executable verified."
else
    echo -e "\${GREEN}✓ Installed at: ${installDir}/${binaryName}\${NC}"
    echo "Note: If '${binaryName}' is not recognized, ensure ${installDir} is in your \\$PATH:"
    echo "export PATH=\\"\\$PATH:${installDir}\\" >> ~/.bashrc && source ~/.bashrc"
fi
`;

  const uninstallerScript = `#!/usr/bin/env bash
# Uninstaller for ${binaryName}
set -e
echo "Removing ${binaryName} from ${installDir}..."
${sudoPrefix}rm -f "${installDir.replace('~', '$HOME')}/${binaryName}"
${createDesktopEntry ? `rm -f "$HOME/.local/share/applications/${binaryName}.desktop"` : ''}
${createSystemdUnit ? `systemctl --user stop ${binaryName}.service 2>/dev/null || true
rm -f "$HOME/.config/systemd/user/${binaryName}.service"
systemctl --user daemon-reload` : ''}
echo "✓ ${binaryName} successfully uninstalled."
`;

  const dockerfileContent = `# Multi-stage lightweight Linux container build for ${cleanRepo}
${buildSystem === 'cargo' ? `FROM rust:1.82-alpine AS builder
WORKDIR /app
RUN apk add --no-cache musl-dev git
RUN git clone --depth 1 https://github.com/${cleanRepo}.git .
RUN cargo build --release --locked

FROM alpine:3.20
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/target/release/${binaryName} /usr/local/bin/${binaryName}
ENTRYPOINT ["/usr/local/bin/${binaryName}"]` : buildSystem === 'go' ? `FROM golang:1.23-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git
RUN git clone --depth 1 https://github.com/${cleanRepo}.git .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o ${binaryName} .

FROM alpine:3.20
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/${binaryName} /usr/local/bin/${binaryName}
ENTRYPOINT ["/usr/local/bin/${binaryName}"]` : `FROM debian:bookworm-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential cmake git ca-certificates
RUN git clone --depth 1 https://github.com/${cleanRepo}.git .
RUN mkdir build && cd build && cmake .. -DCMAKE_BUILD_TYPE=Release && make -j$(nproc)

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/build/${binaryName} /usr/local/bin/${binaryName}
ENTRYPOINT ["/usr/local/bin/${binaryName}"]`}
`;

  const githubActionsContent = `name: Build & Release Linux Binaries
on:
  push:
    tags:
      - 'v*'

jobs:
  build-linux:
    name: Build Linux x86_64
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      ${buildSystem === 'cargo' ? `- name: Setup Rust Toolchain
        uses: dtolnay/rust-toolchain@stable
      - name: Build Release Binary
        run: cargo build --release --locked
      - name: Package Binary
        run: |
          tar -czvf ${binaryName}-linux-x86_64.tar.gz -C target/release ${binaryName}` : buildSystem === 'go' ? `- name: Setup Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.23'
      - name: Compile Go Binary
        run: go build -ldflags="-s -w" -o ${binaryName} .
      - name: Package Binary
        run: tar -czvf ${binaryName}-linux-x86_64.tar.gz ${binaryName}` : `- name: Install Dependencies
        run: sudo apt-get update && sudo apt-get install -y cmake ninja-build
      - name: Compile with CMake
        run: |
          mkdir build && cd build
          cmake .. -DCMAKE_BUILD_TYPE=Release
          make -j$(nproc)
      - name: Package Binary
        run: tar -czvf ${binaryName}-linux-x86_64.tar.gz -C build ${binaryName}`}

      - name: Upload Release Asset
        uses: softprops/action-gh-release@v2
        with:
          files: ${binaryName}-linux-x86_64.tar.gz
`;

  const getActiveTabContent = () => {
    switch (activeOutputTab) {
      case 'install':
        return { content: generatedScript, filename: `install_${binaryName}.sh`, lang: 'bash' };
      case 'docker':
        return { content: dockerfileContent, filename: 'Dockerfile', lang: 'dockerfile' };
      case 'github_actions':
        return { content: githubActionsContent, filename: 'build-linux.yml', lang: 'yaml' };
      case 'uninstall':
        return { content: uninstallerScript, filename: `uninstall_${binaryName}.sh`, lang: 'bash' };
    }
  };

  const currentTabInfo = getActiveTabContent();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <span>Universal GitHub Builder</span>
          <span aria-hidden="true">·</span>
          <span>Automated Bash, Docker & CI Generator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
          GitHub Repository Installer Architect
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Enter any open-source GitHub repository URL or slug to generate an idempotent, production-grade Linux bash installer script, Dockerfile, or GitHub Actions CI workflow.
        </p>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Quick Preset Repositories:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESETS.map(p => (
            <button
              key={p.repo}
              onClick={() => {
                setRepoInput(p.repo);
                setBuildSystem(p.build);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                repoInput === p.repo
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-medium'
                  : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-mono font-semibold truncate">{p.name}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input & Options Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-cyan-400" />
            <span>Target Configuration</span>
          </h2>

          {/* Repo Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              GitHub Repository (owner/repo or URL)
            </label>
            <div className="relative">
              <input
                type="text"
                value={repoInput}
                onChange={e => setRepoInput(e.target.value)}
                placeholder="e.g. BurntSushi/ripgrep or https://github.com/..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-100"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Parsed binary: {binaryName}</span>
              <a
                href={`https://github.com/${cleanRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Build System Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              Build & Compilation System
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cargo', label: 'Rust (Cargo)' },
                { id: 'go', label: 'Go (Golang)' },
                { id: 'cmake', label: 'CMake / C++' },
                { id: 'make', label: 'Makefile' },
                { id: 'release', label: 'GitHub Release' },
              ].map(b => (
                <button
                  key={b.id}
                  onClick={() => setBuildSystem(b.id as any)}
                  className={`py-2 px-2 text-xs font-mono rounded-lg border text-center transition-colors ${
                    buildSystem === b.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Directory */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              Installation Destination Directory
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInstallDir('/usr/local/bin')}
                className={`p-2.5 text-xs rounded-lg border text-left transition-colors ${
                  installDir === '/usr/local/bin'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-mono">/usr/local/bin</div>
                <div className="text-[11px] text-slate-500">System-wide (requires sudo)</div>
              </button>
              <button
                onClick={() => setInstallDir('~/.local/bin')}
                className={`p-2.5 text-xs rounded-lg border text-left transition-colors ${
                  installDir === '~/.local/bin'
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-mono">~/.local/bin</div>
                <div className="text-[11px] text-slate-500">User-only (no root needed)</div>
              </button>
            </div>
          </div>

          {/* Optional Attachments */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Additional Artifacts
            </span>
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={createDesktopEntry}
                onChange={e => setCreateDesktopEntry(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 text-cyan-500 focus:ring-0 bg-slate-950"
              />
              <span>Generate XDG Desktop Entry (.desktop launcher file)</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={createSystemdUnit}
                onChange={e => setCreateSystemdUnit(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 text-cyan-500 focus:ring-0 bg-slate-950"
              />
              <span>Generate Systemd user service unit (for daemons & background tasks)</span>
            </label>
          </div>
        </div>

        {/* Generated Output Tabs & Code Viewer */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
          {/* Output Selector Tabs */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setActiveOutputTab('install')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeOutputTab === 'install'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>install.sh</span>
              </button>
              <button
                onClick={() => setActiveOutputTab('docker')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeOutputTab === 'docker'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Dockerfile</span>
              </button>
              <button
                onClick={() => setActiveOutputTab('github_actions')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeOutputTab === 'github_actions'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>GitHub Actions CI</span>
              </button>
              <button
                onClick={() => setActiveOutputTab('uninstall')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeOutputTab === 'uninstall'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>uninstall.sh</span>
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(currentTabInfo.content, activeOutputTab)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
              >
                {copiedKey === activeOutputTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === activeOutputTab ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => handleDownload(currentTabInfo.filename, currentTabInfo.content)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-[500px]">
            <code>{currentTabInfo.content}</code>
          </pre>

          {/* Quick Execution Tip for Install script */}
          {activeOutputTab === 'install' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">Run on your Linux machine:</span>
                <button
                  onClick={() => handleCopy(`bash install_${binaryName}.sh`, 'oneliner')}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedKey === 'oneliner' ? 'Copied!' : 'Copy command'}
                </button>
              </div>
              <code className="text-emerald-300 font-mono block">
                chmod +x install_{binaryName}.sh && ./install_{binaryName}.sh
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
