export type CategoryId = 
  | 'cli-tools' 
  | 'system-monitors' 
  | 'ai-dev' 
  | 'editors-dev' 
  | 'containers-devops' 
  | 'shells-terminals';

export type BuildSystem = 'cmake' | 'cargo' | 'go' | 'make' | 'release-binary' | 'shell' | 'docker';

export interface OpenSourceProject {
  id: string;
  name: string;
  repo: string;
  githubUrl: string;
  stars: number;
  category: CategoryId;
  license: string;
  description: string;
  whyUseIt: string;
  buildSystem: BuildSystem;
  prerequisites: {
    ubuntu: string;
    fedora: string;
    arch: string;
    alpine: string;
  };
  installFromSource: string[];
  installFromRelease: string[];
  installViaPackage: {
    ubuntu: string;
    fedora: string;
    arch: string;
    alpine: string;
  };
  verifyCommand: string;
  uninstallCommand: string;
  binaryPath: string;
}

export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    id: 'fastfetch',
    name: 'Fastfetch',
    repo: 'fastfetch-cli/fastfetch',
    githubUrl: 'https://github.com/fastfetch-cli/fastfetch',
    stars: 12400,
    category: 'system-monitors',
    license: 'MIT',
    description: 'An actively maintained, lightning-fast neofetch alternative written in pure C for system information.',
    whyUseIt: 'Executes in under 15ms with full hardware sensors, GPU detection, and customizable JSON/chafa logos.',
    buildSystem: 'cmake',
    prerequisites: {
      ubuntu: 'sudo apt install -y build-essential cmake pkg-config libpci-dev libvulkan-dev',
      fedora: 'sudo dnf install -y gcc cmake pkgconf pciutils-devel vulkan-loader-devel',
      arch: 'sudo pacman -S --needed base-devel cmake pciutils vulkan-icd-loader',
      alpine: 'sudo apk add build-base cmake pkgconf pciutils-dev'
    },
    installFromSource: [
      'git clone https://github.com/fastfetch-cli/fastfetch.git',
      'cd fastfetch',
      'mkdir -p build && cd build',
      'cmake .. -DCMAKE_BUILD_TYPE=Release -DENABLE_SYSTEM_INFO=ON',
      'make -j$(nproc)',
      'sudo make install'
    ],
    installFromRelease: [
      'TAG=$(curl -s https://api.github.com/repos/fastfetch-cli/fastfetch/releases/latest | grep "tag_name" | cut -d\'"\' -f4)',
      'curl -sLO "https://github.com/fastfetch-cli/fastfetch/releases/download/${TAG}/fastfetch-linux-amd64.tar.gz"',
      'tar -xzf fastfetch-linux-amd64.tar.gz',
      'sudo install -m 755 fastfetch-linux-amd64/usr/bin/fastfetch /usr/local/bin/'
    ],
    installViaPackage: {
      ubuntu: 'sudo add-apt-repository ppa:zhangsongcui3371/fastfetch -y && sudo apt update && sudo apt install -y fastfetch',
      fedora: 'sudo dnf install -y fastfetch',
      arch: 'sudo pacman -S --noconfirm fastfetch',
      alpine: 'sudo apk add fastfetch'
    },
    verifyCommand: 'fastfetch --version',
    uninstallCommand: 'sudo rm -f /usr/local/bin/fastfetch /usr/local/share/fastfetch',
    binaryPath: '/usr/local/bin/fastfetch'
  },
  {
    id: 'neovim',
    name: 'Neovim',
    repo: 'neovim/neovim',
    githubUrl: 'https://github.com/neovim/neovim',
    stars: 84300,
    category: 'editors-dev',
    license: 'Apache-2.0',
    description: 'Vim-fork focused on extensibility, Lua plugins, built-in LSP client, and asynchronous architecture.',
    whyUseIt: 'The bedrock of modern hyper-productive CLI developer workflows like LazyVim, LunarVim, and AstroNvim.',
    buildSystem: 'cmake',
    prerequisites: {
      ubuntu: 'sudo apt install -y ninja-build gettext cmake unzip curl build-essential',
      fedora: 'sudo dnf install -y ninja-build cmake gcc make unzip gettext curl',
      arch: 'sudo pacman -S --needed base-devel cmake unzip ninja curl',
      alpine: 'sudo apk add build-base cmake coreutils curl unzip gettext-tiny-dev'
    },
    installFromSource: [
      'git clone https://github.com/neovim/neovim.git',
      'cd neovim',
      'git checkout stable',
      'make CMAKE_BUILD_TYPE=RelWithDebInfo -j$(nproc)',
      'sudo make install'
    ],
    installFromRelease: [
      'curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim-linux-x86_64.tar.gz',
      'sudo rm -rf /opt/nvim',
      'sudo tar -C /opt -xzf nvim-linux-x86_64.tar.gz',
      'sudo ln -sf /opt/nvim-linux-x86_64/bin/nvim /usr/local/bin/nvim'
    ],
    installViaPackage: {
      ubuntu: 'sudo apt install -y neovim',
      fedora: 'sudo dnf install -y neovim',
      arch: 'sudo pacman -S --noconfirm neovim',
      alpine: 'sudo apk add neovim'
    },
    verifyCommand: 'nvim --version | head -n 2',
    uninstallCommand: 'sudo rm -f /usr/local/bin/nvim && sudo rm -rf /opt/nvim-linux-x86_64 /usr/local/share/nvim',
    binaryPath: '/usr/local/bin/nvim'
  },
  {
    id: 'btop',
    name: 'Btop++',
    repo: 'aristocratos/btop',
    githubUrl: 'https://github.com/aristocratos/btop',
    stars: 22800,
    category: 'system-monitors',
    license: 'Apache-2.0',
    description: 'Resource monitor that shows usage and stats for processor, memory, disks, network, and processes in C++.',
    whyUseIt: 'Gorgeously responsive terminal UI with full mouse support, real-time battery stats, and GPU load graph.',
    buildSystem: 'make',
    prerequisites: {
      ubuntu: 'sudo apt install -y coreutils sed git build-essential',
      fedora: 'sudo dnf install -y gcc-c++ git make',
      arch: 'sudo pacman -S --needed base-devel git',
      alpine: 'sudo apk add build-base git'
    },
    installFromSource: [
      'git clone https://github.com/aristocratos/btop.git',
      'cd btop',
      'make -j$(nproc)',
      'sudo make install PREFIX=/usr/local'
    ],
    installFromRelease: [
      'TAG=$(curl -s https://api.github.com/repos/aristocratos/btop/releases/latest | grep "tag_name" | cut -d\'"\' -f4)',
      'curl -LO "https://github.com/aristocratos/btop/releases/download/${TAG}/btop-x86_64-linux-musl.tbz"',
      'tar -xjf btop-x86_64-linux-musl.tbz',
      'cd btop && sudo make install'
    ],
    installViaPackage: {
      ubuntu: 'sudo apt install -y btop',
      fedora: 'sudo dnf install -y btop',
      arch: 'sudo pacman -S --noconfirm btop',
      alpine: 'sudo apk add btop'
    },
    verifyCommand: 'btop --version',
    uninstallCommand: 'sudo make -C btop uninstall PREFIX=/usr/local || sudo rm -f /usr/local/bin/btop',
    binaryPath: '/usr/local/bin/btop'
  },
  {
    id: 'gh-cli',
    name: 'GitHub CLI (gh)',
    repo: 'cli/cli',
    githubUrl: 'https://github.com/cli/cli',
    stars: 38200,
    category: 'cli-tools',
    license: 'MIT',
    description: 'The official command-line tool for GitHub: manage PRs, issues, releases, gists, and repos from terminal.',
    whyUseIt: 'Essential for Linux developers: clone repos with gh repo clone, download release assets, and manage CI/CD.',
    buildSystem: 'go',
    prerequisites: {
      ubuntu: 'sudo apt install -y golang-go git make',
      fedora: 'sudo dnf install -y golang git make',
      arch: 'sudo pacman -S --needed go git make',
      alpine: 'sudo apk add go git make'
    },
    installFromSource: [
      'git clone https://github.com/cli/cli.git gh-cli',
      'cd gh-cli',
      'make',
      'sudo install -m 755 bin/gh /usr/local/bin/'
    ],
    installFromRelease: [
      'TAG=$(curl -s https://api.github.com/repos/cli/cli/releases/latest | grep "tag_name" | cut -d\'"\' -f4 | sed "s/v//")',
      'curl -LO "https://github.com/cli/cli/releases/download/v${TAG}/gh_${TAG}_linux_amd64.tar.gz"',
      'tar -xzf "gh_${TAG}_linux_amd64.tar.gz"',
      'sudo install -m 755 "gh_${TAG}_linux_amd64/bin/gh" /usr/local/bin/'
    ],
    installViaPackage: {
      ubuntu: 'sudo apt install -y gh',
      fedora: 'sudo dnf install -y gh',
      arch: 'sudo pacman -S --noconfirm github-cli',
      alpine: 'sudo apk add github-cli'
    },
    verifyCommand: 'gh --version',
    uninstallCommand: 'sudo rm -f /usr/local/bin/gh',
    binaryPath: '/usr/local/bin/gh'
  },
  {
    id: 'ripgrep',
    name: 'Ripgrep (rg)',
    repo: 'BurntSushi/ripgrep',
    githubUrl: 'https://github.com/BurntSushi/ripgrep',
    stars: 48900,
    category: 'cli-tools',
    license: 'MIT / UNLICENSE',
    description: 'Ultra-fast line-oriented search tool that recursively searches directories for regex patterns in Rust.',
    whyUseIt: 'Respects .gitignore rules automatically and out-benchmarks grep, ack, and ag across large repos.',
    buildSystem: 'cargo',
    prerequisites: {
      ubuntu: 'curl --proto \'=https\' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && source "$HOME/.cargo/env"',
      fedora: 'sudo dnf install -y cargo rust',
      arch: 'sudo pacman -S --needed rust',
      alpine: 'sudo apk add cargo rust'
    },
    installFromSource: [
      'git clone https://github.com/BurntSushi/ripgrep.git',
      'cd ripgrep',
      'cargo build --release',
      'sudo install -m 755 target/release/rg /usr/local/bin/'
    ],
    installFromRelease: [
      'TAG=$(curl -s https://api.github.com/repos/BurntSushi/ripgrep/releases/latest | grep "tag_name" | cut -d\'"\' -f4)',
      'curl -LO "https://github.com/BurntSushi/ripgrep/releases/download/${TAG}/ripgrep-${TAG}-x86_64-unknown-linux-musl.tar.gz"',
      'tar -xzf "ripgrep-${TAG}-x86_64-unknown-linux-musl.tar.gz"',
      'sudo install -m 755 "ripgrep-${TAG}-x86_64-unknown-linux-musl/rg" /usr/local/bin/'
    ],
    installViaPackage: {
      ubuntu: 'sudo apt install -y ripgrep',
      fedora: 'sudo dnf install -y ripgrep',
      arch: 'sudo pacman -S --noconfirm ripgrep',
      alpine: 'sudo apk add ripgrep'
    },
    verifyCommand: 'rg --version',
    uninstallCommand: 'sudo rm -f /usr/local/bin/rg',
    binaryPath: '/usr/local/bin/rg'
  },
  {
    id: 'fzf',
    name: 'FZF (Fuzzy Finder)',
    repo: 'junegunn/fzf',
    githubUrl: 'https://github.com/junegunn/fzf',
    stars: 65400,
    category: 'cli-tools',
    license: 'MIT',
    description: 'General-purpose interactive command-line fuzzy finder written in Go, integrations for bash and zsh.',
    whyUseIt: 'Instant interactive file selection, command history search (Ctrl+R), and directory jumping (Alt+C).',
    buildSystem: 'go',
    prerequisites: {
      ubuntu: 'sudo apt install -y git golang-go',
      fedora: 'sudo dnf install -y git golang',
      arch: 'sudo pacman -S --needed git go',
      alpine: 'sudo apk add git go'
    },
    installFromSource: [
      'git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf',
      '~/.fzf/install --all'
    ],
    installFromRelease: [
      'TAG=$(curl -s https://api.github.com/repos/junegunn/fzf/releases/latest | grep "tag_name" | cut -d\'"\' -f4 | sed "s/v//")',
      'curl -LO "https://github.com/junegunn/fzf/releases/download/v${TAG}/fzf-${TAG}-linux_amd64.tar.gz"',
      'tar -xzf "fzf-${TAG}-linux_amd64.tar.gz"',
      'sudo install -m 755 fzf /usr/local/bin/'
    ],
    installViaPackage: {
      ubuntu: 'sudo apt install -y fzf',
      fedora: 'sudo dnf install -y fzf',
      arch: 'sudo pacman -S --noconfirm fzf',
      alpine: 'sudo apk add fzf'
    },
    verifyCommand: 'fzf --version',
    uninstallCommand: 'rm -rf ~/.fzf && sudo rm -f /usr/local/bin/fzf',
    binaryPath: '/usr/local/bin/fzf'
  },
  {
    id: 'ollama',
    name: 'Ollama',
    repo: 'ollama/ollama',
    githubUrl: 'https://github.com/ollama/ollama',
    stars: 108000,
    category: 'ai-dev',
    license: 'MIT',
    description: 'Get up and running with large language models locally on Linux (Llama 3, DeepSeek, Mistral, Qwen).',
    whyUseIt: 'Full GPU acceleration on Linux (NVIDIA CUDA / AMD ROCm), simple REST API, and single binary distribution.',
    buildSystem: 'go',
    prerequisites: {
      ubuntu: 'sudo apt install -y golang-go cmake gcc g++ pciutils',
      fedora: 'sudo dnf install -y golang cmake gcc-c++ pciutils',
      arch: 'sudo pacman -S --needed go cmake gcc pciutils',
      alpine: 'sudo apk add go cmake g++ pciutils'
    },
    installFromSource: [
      'git clone https://github.com/ollama/ollama.git',
      'cd ollama',
      'go generate ./...',
      'go build .',
      'sudo install -m 755 ollama /usr/local/bin/'
    ],
    installFromRelease: [
      'curl -fsSL https://ollama.com/install.sh | sh'
    ],
    installViaPackage: {
      ubuntu: 'curl -fsSL https://ollama.com/install.sh | sh',
      fedora: 'curl -fsSL https://ollama.com/install.sh | sh',
      arch: 'sudo pacman -S --noconfirm ollama-cuda # or ollama-rocm',
      alpine: 'curl -fsSL https://ollama.com/install.sh | sh'
    },
    verifyCommand: 'ollama --version',
    uninstallCommand: 'sudo systemctl stop ollama && sudo rm -f /usr/local/bin/ollama /etc/systemd/system/ollama.service',
    binaryPath: '/usr/local/bin/ollama'
  },
  {
    id: 'starship',
    name: 'Starship',
    repo: 'starship/starship',
    githubUrl: 'https://github.com/starship/starship',
    stars: 46200,
    category: 'shells-terminals',
    license: 'ISC',
    description: 'The minimal, blazing-fast, and infinitely customizable cross-shell prompt for any Linux shell.',
    whyUseIt: 'Shows Git branch & dirty status, runtime versions (Node, Rust, Go, Python), AWS profile, and exit codes.',
    buildSystem: 'cargo',
    prerequisites: {
      ubuntu: 'sudo apt install -y curl git',
      fedora: 'sudo dnf install -y curl git',
      arch: 'sudo pacman -S --needed curl git',
      alpine: 'sudo apk add curl git'
    },
    installFromSource: [
      'git clone https://github.com/starship/starship.git',
      'cd starship',
      'cargo build --release',
      'sudo install -m 755 target/release/starship /usr/local/bin/'
    ],
    installFromRelease: [
      'curl -sS https://starship.rs/install.sh | sh -s -- -y'
    ],
    installViaPackage: {
      ubuntu: 'sudo snap install starship --classic # or curl script',
      fedora: 'sudo dnf install -y starship',
      arch: 'sudo pacman -S --noconfirm starship',
      alpine: 'sudo apk add starship'
    },
    verifyCommand: 'starship --version',
    uninstallCommand: 'sudo rm -f /usr/local/bin/starship',
    binaryPath: '/usr/local/bin/starship'
  },
  {
    id: 'lazygit',
    name: 'Lazygit',
    repo: 'jesseduffield/lazygit',
    githubUrl: 'https://github.com/jesseduffield/lazygit',
    stars: 52100,
    category: 'cli-tools',
    license: 'MIT',
    description: 'A simple terminal UI for git commands that makes interactive rebasing and staging an absolute joy.',
    whyUseIt: 'Stage hunk-by-hunk, resolve merge conflicts visually in terminal, stash, push, and view branch DAGs.',
    buildSystem: 'go',
    prerequisites: {
      ubuntu: 'sudo apt install -y golang-go git',
      fedora: 'sudo dnf install -y golang git',
      arch: 'sudo pacman -S --needed go git',
      alpine: 'sudo apk add go git'
    },
    installFromSource: [
      'git clone https://github.com/jesseduffield/lazygit.git',
      'cd lazygit',
      'go build',
      'sudo install -m 755 lazygit /usr/local/bin/'
    ],
    installFromRelease: [
      'LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po \'"tag_name": "v\\K[^\"]*\')',
      'curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"',
      'tar -xf lazygit.tar.gz lazygit',
      'sudo install lazygit /usr/local/bin'
    ],
    installViaPackage: {
      ubuntu: 'sudo apt update && sudo apt install -y lazygit',
      fedora: 'sudo dnf copr enable atim/lazygit -y && sudo dnf install -y lazygit',
      arch: 'sudo pacman -S --noconfirm lazygit',
      alpine: 'sudo apk add lazygit'
    },
    verifyCommand: 'lazygit --version',
    uninstallCommand: 'sudo rm -f /usr/local/bin/lazygit',
    binaryPath: '/usr/local/bin/lazygit'
  },
  {
    id: 'bat',
    name: 'Bat (Cat with wings)',
    repo: 'sharkdp/bat',
    githubUrl: 'https://github.com/sharkdp/bat',
    stars: 49800,
    category: 'cli-tools',
    license: 'MIT / Apache-2.0',
    description: 'A cat(1) clone with syntax highlighting for dozens of languages, Git integration, and automatic paging.',
    whyUseIt: 'Replaces cat with beautiful colored output, line numbers, and inline git modification diff indicators.',
    buildSystem: 'cargo',
    prerequisites: {
      ubuntu: 'sudo apt install -y cargo rustc git',
      fedora: 'sudo dnf install -y cargo rust git',
      arch: 'sudo pacman -S --needed rust git',
      alpine: 'sudo apk add cargo rust git'
    },
    installFromSource: [
      'git clone https://github.com/sharkdp/bat.git',
      'cd bat',
      'cargo build --release',
      'sudo install -m 755 target/release/bat /usr/local/bin/'
    ],
    installFromRelease: [
      'TAG=$(curl -s https://api.github.com/repos/sharkdp/bat/releases/latest | grep "tag_name" | cut -d\'"\' -f4)',
      'curl -LO "https://github.com/sharkdp/bat/releases/download/${TAG}/bat-${TAG}-x86_64-unknown-linux-musl.tar.gz"',
      'tar -xzf "bat-${TAG}-x86_64-unknown-linux-musl.tar.gz"',
      'sudo install -m 755 "bat-${TAG}-x86_64-unknown-linux-musl/bat" /usr/local/bin/'
    ],
    installViaPackage: {
      ubuntu: 'sudo apt install -y bat && sudo ln -sf /usr/bin/batcat /usr/local/bin/bat',
      fedora: 'sudo dnf install -y bat',
      arch: 'sudo pacman -S --noconfirm bat',
      alpine: 'sudo apk add bat'
    },
    verifyCommand: 'bat --version',
    uninstallCommand: 'sudo rm -f /usr/local/bin/bat',
    binaryPath: '/usr/local/bin/bat'
  },
  {
    id: 'eza',
    name: 'Eza (Modern ls)',
    repo: 'eza-community/eza',
    githubUrl: 'https://github.com/eza-community/eza',
    stars: 21500,
    category: 'cli-tools',
    license: 'European Union Public License 1.2',
    description: 'A modern, maintained replacement for ls with colors, git status, tree view, and file metadata icons.',
    whyUseIt: 'The community fork of exa: shows file permissions, exact byte sizes, symlink targets, and tree diagrams.',
    buildSystem: 'cargo',
    prerequisites: {
      ubuntu: 'sudo apt install -y cargo rustc libgit2-dev',
      fedora: 'sudo dnf install -y cargo rust libgit2-devel',
      arch: 'sudo pacman -S --needed rust libgit2',
      alpine: 'sudo apk add cargo rust libgit2-dev'
    },
    installFromSource: [
      'git clone https://github.com/eza-community/eza.git',
      'cd eza',
      'cargo build --release',
      'sudo install -m 755 target/release/eza /usr/local/bin/'
    ],
    installFromRelease: [
      'TAG=$(curl -s https://api.github.com/repos/eza-community/eza/releases/latest | grep "tag_name" | cut -d\'"\' -f4)',
      'curl -LO "https://github.com/eza-community/eza/releases/download/${TAG}/eza_x86_64-unknown-linux-gnu.tar.gz"',
      'tar -xzf eza_x86_64-unknown-linux-gnu.tar.gz',
      'sudo install -m 755 eza /usr/local/bin/'
    ],
    installViaPackage: {
      ubuntu: 'sudo apt install -y gpg && sudo mkdir -p /etc/apt/keyrings && wget -qO- https://raw.githubusercontent.com/eza-community/eza/main/deb.asc | sudo gpg --dearmor -o /etc/apt/keyrings/gierens.gpg && echo "deb [signed-by=/etc/apt/keyrings/gierens.gpg] http://deb.gierens.de stable main" | sudo tee /etc/apt/sources.list.d/gierens.list && sudo apt update && sudo apt install -y eza',
      fedora: 'sudo dnf install -y eza',
      arch: 'sudo pacman -S --noconfirm eza',
      alpine: 'sudo apk add eza'
    },
    verifyCommand: 'eza --version',
    uninstallCommand: 'sudo rm -f /usr/local/bin/eza',
    binaryPath: '/usr/local/bin/eza'
  },
  {
    id: 'zoxide',
    name: 'Zoxide (Smarter cd)',
    repo: 'ajeetdsouza/zoxide',
    githubUrl: 'https://github.com/ajeetdsouza/zoxide',
    stars: 23400,
    category: 'cli-tools',
    license: 'MIT',
    description: 'A smarter cd command inspired by z and autojump, written in Rust. It remembers your most used directories.',
    whyUseIt: 'Jump to any deep nested directory instantly with "z project" instead of typing 6 directory levels.',
    buildSystem: 'cargo',
    prerequisites: {
      ubuntu: 'sudo apt install -y cargo rustc git',
      fedora: 'sudo dnf install -y cargo rust git',
      arch: 'sudo pacman -S --needed rust git',
      alpine: 'sudo apk add cargo rust git'
    },
    installFromSource: [
      'git clone https://github.com/ajeetdsouza/zoxide.git',
      'cd zoxide',
      'cargo build --release',
      'sudo install -m 755 target/release/zoxide /usr/local/bin/'
    ],
    installFromRelease: [
      'curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh'
    ],
    installViaPackage: {
      ubuntu: 'sudo apt install -y zoxide',
      fedora: 'sudo dnf install -y zoxide',
      arch: 'sudo pacman -S --noconfirm zoxide',
      alpine: 'sudo apk add zoxide'
    },
    verifyCommand: 'zoxide --version',
    uninstallCommand: 'sudo rm -f /usr/local/bin/zoxide ~/.local/bin/zoxide',
    binaryPath: '/usr/local/bin/zoxide'
  },
  {
    id: 'hyprland',
    name: 'Hyprland Compositor',
    repo: 'hyprwm/Hyprland',
    githubUrl: 'https://github.com/hyprwm/Hyprland',
    stars: 26800,
    category: 'shells-terminals',
    license: 'BSD-3-Clause',
    description: 'A dynamic tiling Wayland compositor with fluid animations, rounded corners, dual-borders, and blur.',
    whyUseIt: 'The reigning crown jewel of modern Linux desktop ricing with custom C++ shaders and socket IPC.',
    buildSystem: 'cmake',
    prerequisites: {
      ubuntu: 'sudo apt install -y ninja-build cmake meson libwayland-dev wayland-protocols libinput-dev libxkbcommon-dev',
      fedora: 'sudo dnf install -y ninja-build cmake meson wayland-devel wayland-protocols-devel libinput-devel',
      arch: 'sudo pacman -S --needed base-devel cmake ninja wayland wayland-protocols libinput',
      alpine: 'sudo apk add build-base cmake ninja wayland-dev wayland-protocols libinput-dev'
    },
    installFromSource: [
      'git clone --recursive https://github.com/hyprwm/Hyprland',
      'cd Hyprland',
      'make all',
      'sudo make install'
    ],
    installFromRelease: [
      '# In Arch Linux or Fedora COPR:',
      'sudo pacman -S --noconfirm hyprland # or sudo dnf copr enable solopasha/hyprland && sudo dnf install -y hyprland'
    ],
    installViaPackage: {
      ubuntu: '# Hyprland requires PPA on Ubuntu 24.04:\nsudo add-apt-repository ppa:hyprwm/hyprland -y && sudo apt update && sudo apt install -y hyprland',
      fedora: 'sudo dnf copr enable solopasha/hyprland -y && sudo dnf install -y hyprland',
      arch: 'sudo pacman -S --noconfirm hyprland kitty waybar wofi',
      alpine: 'sudo apk add hyprland'
    },
    verifyCommand: 'Hyprland --version',
    uninstallCommand: 'sudo rm -f /usr/local/bin/Hyprland /usr/local/share/wayland-sessions/hyprland.desktop',
    binaryPath: '/usr/local/bin/Hyprland'
  },
  {
    id: 'alacritty',
    name: 'Alacritty',
    repo: 'alacritty/alacritty',
    githubUrl: 'https://github.com/alacritty/alacritty',
    stars: 56900,
    category: 'shells-terminals',
    license: 'Apache-2.0',
    description: 'A cross-platform, OpenGL-accelerated terminal emulator written in Rust with sensible defaults.',
    whyUseIt: 'Extreme rendering throughput with negligible latency, zero bloat, and simple TOML configuration.',
    buildSystem: 'cargo',
    prerequisites: {
      ubuntu: 'sudo apt install -y cmake pkg-config libfreetype6-dev libfontconfig1-dev libxcb-xfixes0-dev libxkbcommon-dev python3',
      fedora: 'sudo dnf install -y cmake freetype-devel fontconfig-devel libxcb-devel libxkbcommon-devel python3',
      arch: 'sudo pacman -S --needed cmake freetype2 fontconfig pkg-config make libxcb libxkbcommon python',
      alpine: 'sudo apk add cmake freetype-dev fontconfig-dev pkgconf libxcb-dev libxkbcommon-dev python3'
    },
    installFromSource: [
      'git clone https://github.com/alacritty/alacritty.git',
      'cd alacritty',
      'cargo build --release',
      'sudo install -m 755 target/release/alacritty /usr/local/bin/'
    ],
    installFromRelease: [
      'TAG=$(curl -s https://api.github.com/repos/alacritty/alacritty/releases/latest | grep "tag_name" | cut -d\'"\' -f4)',
      'curl -LO "https://github.com/alacritty/alacritty/releases/download/${TAG}/Alacritty-${TAG}-x86_64.AppImage"',
      'chmod +x Alacritty-${TAG}-x86_64.AppImage',
      'sudo mv Alacritty-${TAG}-x86_64.AppImage /usr/local/bin/alacritty'
    ],
    installViaPackage: {
      ubuntu: 'sudo apt install -y alacritty',
      fedora: 'sudo dnf install -y alacritty',
      arch: 'sudo pacman -S --noconfirm alacritty',
      alpine: 'sudo apk add alacritty'
    },
    verifyCommand: 'alacritty --version',
    uninstallCommand: 'sudo rm -f /usr/local/bin/alacritty',
    binaryPath: '/usr/local/bin/alacritty'
  },
  {
    id: 'docker-ce',
    name: 'Docker Community Edition',
    repo: 'moby/moby',
    githubUrl: 'https://github.com/moby/moby',
    stars: 69800,
    category: 'containers-devops',
    license: 'Apache-2.0',
    description: 'The open-source application container engine for building, shipping, and running distributed applications.',
    whyUseIt: 'Essential standard for building reproducible Linux software, testing microservices, and sandboxing builds.',
    buildSystem: 'shell',
    prerequisites: {
      ubuntu: 'sudo apt install -y ca-certificates curl gnupg lsb-release',
      fedora: 'sudo dnf install -y dnf-plugins-core',
      arch: 'sudo pacman -S --needed iptables device-mapper',
      alpine: 'sudo apk add cgroups udev'
    },
    installFromSource: [
      '# Docker is typically installed via official distribution repository scripts:',
      'curl -fsSL https://get.docker.com -o get-docker.sh',
      'sudo sh get-docker.sh',
      'sudo usermod -aG docker $USER'
    ],
    installFromRelease: [
      'curl -fsSL https://get.docker.com | sudo sh',
      'sudo systemctl enable --now docker'
    ],
    installViaPackage: {
      ubuntu: 'sudo apt install -y docker.io docker-compose-v2',
      fedora: 'sudo dnf install -y docker-ce docker-ce-cli containerd.io',
      arch: 'sudo pacman -S --noconfirm docker docker-compose',
      alpine: 'sudo apk add docker docker-compose && sudo rc-update add docker boot'
    },
    verifyCommand: 'docker --version',
    uninstallCommand: 'sudo apt-get purge -y docker-ce docker-ce-cli containerd.io # or distro equivalent',
    binaryPath: '/usr/bin/docker'
  }
];
