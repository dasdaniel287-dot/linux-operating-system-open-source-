export interface LinuxDistro {
  id: string;
  name: string;
  version: string;
  codename: string;
  tagline: string;
  family: 'Debian' | 'RedHat' | 'Arch' | 'Independent';
  packageManager: {
    name: string;
    updateCmd: string;
    installCmd: string;
    searchCmd: string;
    removeCmd: string;
  };
  initSystem: 'systemd' | 'OpenRC' | 'runit';
  defaultDesktop: string;
  recommendedAudience: string;
  isoUrl: string;
  sha256VerificationCmd: string;
  essentialBuildToolsCmd: string;
  gitInstallCmd: string;
  ghInstallCmd: string;
  keyAdvantages: string[];
  specsRequirements: {
    minRam: string;
    recRam: string;
    minStorage: string;
    recStorage: string;
  };
  usbGuide: {
    recommendedTool: string;
    ddCommand: string;
  };
  postInstallSteps: string[];
}

export const LINUX_DISTROS: LinuxDistro[] = [
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    version: '24.04 LTS',
    codename: 'Noble Numbat',
    tagline: 'The world\'s most popular Linux desktop and cloud platform with 5 years LTS support.',
    family: 'Debian',
    packageManager: {
      name: 'apt',
      updateCmd: 'sudo apt update && sudo apt upgrade -y',
      installCmd: 'sudo apt install -y',
      searchCmd: 'apt search',
      removeCmd: 'sudo apt remove --purge',
    },
    initSystem: 'systemd',
    defaultDesktop: 'GNOME 46',
    recommendedAudience: 'Developers, beginners, enterprise servers, machine learning workloads.',
    isoUrl: 'https://releases.ubuntu.com/noble/ubuntu-24.04-desktop-amd64.iso',
    sha256VerificationCmd: 'echo "81fae63c0a2...  ubuntu-24.04-desktop-amd64.iso" | sha256sum --check',
    essentialBuildToolsCmd: 'sudo apt install -y build-essential cmake ninja-build git curl wget pkg-config libssl-dev',
    gitInstallCmd: 'sudo apt install -y git',
    ghInstallCmd: `(type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)) \\
&& sudo mkdir -p -m 755 /etc/apt/keyrings \\
&& wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \\
&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \\
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \\
&& sudo apt update \\
&& sudo apt install gh -y`,
    keyAdvantages: [
      'Huge software ecosystem and PPA repository network',
      'Flawless NVIDIA proprietary graphics driver support out-of-the-box',
      'Default target for 99% of GitHub release binaries and deb packages',
      'Robust enterprise stability with 5-10 years of security updates'
    ],
    specsRequirements: {
      minRam: '4 GB',
      recRam: '8 GB - 16 GB',
      minStorage: '25 GB',
      recStorage: '64 GB SSD'
    },
    usbGuide: {
      recommendedTool: 'Ventoy (Drag & drop ISO) or Rufus (GPT / UEFI mode)',
      ddCommand: 'sudo dd if=ubuntu-24.04-desktop-amd64.iso of=/dev/sdX bs=4M status=progress conv=fsync'
    },
    postInstallSteps: [
      'Update software index: sudo apt update && sudo apt upgrade -y',
      'Enable Canonical Partner / Universe: sudo add-apt-repository universe',
      'Install essential compilation toolchain: sudo apt install -y build-essential git curl',
      'Setup firewall: sudo ufw default deny incoming && sudo ufw enable'
    ]
  },
  {
    id: 'fedora',
    name: 'Fedora Workstation',
    version: '41',
    codename: 'Fedora 41',
    tagline: 'Leading-edge Linux with upstream vanilla GNOME, modern Btrfs subvolumes, and pipewire.',
    family: 'RedHat',
    packageManager: {
      name: 'dnf',
      updateCmd: 'sudo dnf upgrade --refresh -y',
      installCmd: 'sudo dnf install -y',
      searchCmd: 'dnf search',
      removeCmd: 'sudo dnf remove',
    },
    initSystem: 'systemd',
    defaultDesktop: 'GNOME 47 (Pure Wayland)',
    recommendedAudience: 'Software engineers, kernel developers, open-source contributors wanting cutting-edge tech.',
    isoUrl: 'https://download.fedoraproject.org/pub/fedora/linux/releases/41/Workstation/x86_64/iso/',
    sha256VerificationCmd: 'sha256sum -c Fedora-Workstation-41-x86_64-CHECKSUM',
    essentialBuildToolsCmd: 'sudo dnf groupinstall -y "Development Tools" "C Development Tools and Libraries" && sudo dnf install -y cmake ninja-build',
    gitInstallCmd: 'sudo dnf install -y git',
    ghInstallCmd: 'sudo dnf install -y \'dnf-command(config-manager)\' && sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo && sudo dnf install -y gh',
    keyAdvantages: [
      'Fast upstream kernel updates with first-class Wayland, PipeWire, and Systemd features',
      'Default Btrfs filesystem with transparent zstd compression and instant snapshots',
      'SELinux pre-configured in Enforcing mode for bulletproof sandboxing',
      'Official upstream home of Podman, Flatpak, and Red Hat engineering'
    ],
    specsRequirements: {
      minRam: '4 GB',
      recRam: '8 GB - 16 GB',
      minStorage: '20 GB',
      recStorage: '50 GB NVMe'
    },
    usbGuide: {
      recommendedTool: 'Fedora Media Writer or dd',
      ddCommand: 'sudo dd if=Fedora-Workstation-Live-x86_64-41.iso of=/dev/sdX bs=4M status=progress conv=fsync'
    },
    postInstallSteps: [
      'Enable RPM Fusion (Free & Non-Free): sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm',
      'Speed up DNF: echo "fastestmirror=True\\nmax_parallel_downloads=10" | sudo tee -a /etc/dnf/dnf.conf',
      'Install development group: sudo dnf groupinstall "Development Tools"'
    ]
  },
  {
    id: 'arch',
    name: 'Arch Linux',
    version: 'Rolling',
    codename: 'Rolling Release',
    tagline: 'A lightweight and flexible Linux distribution that tries to Keep It Simple (KISS).',
    family: 'Arch',
    packageManager: {
      name: 'pacman',
      updateCmd: 'sudo pacman -Syu',
      installCmd: 'sudo pacman -S --noconfirm',
      searchCmd: 'pacman -Ss',
      removeCmd: 'sudo pacman -Rns',
    },
    initSystem: 'systemd',
    defaultDesktop: 'User choice (Hyprland / KDE Plasma / GNOME)',
    recommendedAudience: 'Power users, tinkerers, minimalism enthusiasts, bleeding-edge programmers.',
    isoUrl: 'https://geo.mirror.pkgbuild.com/iso/latest/archlinux-x86_64.iso',
    sha256VerificationCmd: 'sha256sum -c archlinux-x86_64.iso.sha256',
    essentialBuildToolsCmd: 'sudo pacman -S --needed base-devel git cmake ninja rust go clang',
    gitInstallCmd: 'sudo pacman -S --noconfirm git',
    ghInstallCmd: 'sudo pacman -S --noconfirm github-cli',
    keyAdvantages: [
      'The Arch User Repository (AUR): access 80,000+ GitHub projects packaged by community',
      'Rolling release: always have the newest GCC, Clang, Linux kernel, and GPU drivers',
      'Zero bloat: starts with only the core binaries you explicitly chose to install',
      'The ArchWiki: universally recognized as the best Linux documentation on earth'
    ],
    specsRequirements: {
      minRam: '2 GB',
      recRam: '8 GB - 32 GB',
      minStorage: '10 GB',
      recStorage: '40 GB SSD'
    },
    usbGuide: {
      recommendedTool: 'Ventoy or direct dd',
      ddCommand: 'sudo dd if=archlinux-x86_64.iso of=/dev/sdX bs=4M status=progress conv=fsync'
    },
    postInstallSteps: [
      'Run official installer: archinstall (or manual pacstrap /mnt base base-devel linux linux-firmware)',
      'Install AUR Helper (yay): git clone https://aur.archlinux.org/yay.git && cd yay && makepkg -si',
      'Install audio & graphics drivers: sudo pacman -S pipewire pipewire-pulse mesa vulkan-radeon'
    ]
  },
  {
    id: 'debian',
    name: 'Debian GNU/Linux',
    version: '12',
    codename: 'Bookworm',
    tagline: 'The Universal Operating System known for extreme reliability and strict free-software principles.',
    family: 'Debian',
    packageManager: {
      name: 'apt',
      updateCmd: 'sudo apt update && sudo apt upgrade -y',
      installCmd: 'sudo apt install -y',
      searchCmd: 'apt search',
      removeCmd: 'sudo apt purge',
    },
    initSystem: 'systemd',
    defaultDesktop: 'GNOME / XFCE / KDE',
    recommendedAudience: 'Production servers, mission-critical workstations, sysadmins, rock-solid stability seekers.',
    isoUrl: 'https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-12.8.0-amd64-netinst.iso',
    sha256VerificationCmd: 'sha256sum debian-12.8.0-amd64-netinst.iso | grep SHA256SUMS',
    essentialBuildToolsCmd: 'sudo apt install -y build-essential git cmake pkg-config autoconf automake libtool',
    gitInstallCmd: 'sudo apt install -y git',
    ghInstallCmd: `curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \\
&& sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \\
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \\
&& sudo apt update && sudo apt install gh -y`,
    keyAdvantages: [
      'Unmatched rock-solid stability: zero surprise breaking changes during releases',
      'Huge 60,000+ package archive curated with strict quality standards',
      'Foundation of Ubuntu, Linux Mint, Pop!_OS, Raspberry Pi OS, and Docker base images',
      'Low memory footprint and exceptional hardware longevity'
    ],
    specsRequirements: {
      minRam: '2 GB',
      recRam: '4 GB - 8 GB',
      minStorage: '15 GB',
      recStorage: '30 GB'
    },
    usbGuide: {
      recommendedTool: 'Ventoy or dd',
      ddCommand: 'sudo dd if=debian-12.x.x-amd64-netinst.iso of=/dev/sdX bs=4M status=progress'
    },
    postInstallSteps: [
      'Add user to sudoers: su - && usermod -aG sudo $USER',
      'Enable non-free firmware in /etc/apt/sources.list: main contrib non-free non-free-firmware',
      'Update and install build dependencies: sudo apt update && sudo apt install -y build-essential git curl'
    ]
  },
  {
    id: 'mint',
    name: 'Linux Mint',
    version: '22',
    codename: 'Wilma',
    tagline: 'Modern, elegant and comfortable operating system which is both powerful and easy to use.',
    family: 'Debian',
    packageManager: {
      name: 'apt',
      updateCmd: 'sudo apt update && sudo apt upgrade -y',
      installCmd: 'sudo apt install -y',
      searchCmd: 'apt search',
      removeCmd: 'sudo apt remove',
    },
    initSystem: 'systemd',
    defaultDesktop: 'Cinnamon 6.2',
    recommendedAudience: 'Windows switchers, desktop productivity users, creators who want zero configuration.',
    isoUrl: 'https://mirrors.kernel.org/linuxmint/stable/22/linuxmint-22-cinnamon-64bit.iso',
    sha256VerificationCmd: 'sha256sum -b linuxmint-22-cinnamon-64bit.iso',
    essentialBuildToolsCmd: 'sudo apt install -y build-essential git cmake python3-pip curl',
    gitInstallCmd: 'sudo apt install -y git',
    ghInstallCmd: 'sudo apt update && sudo apt install -y gh',
    keyAdvantages: [
      'Familiar traditional desktop layout for effortless transition from Windows',
      'Built-in Driver Manager automatically configures Wi-Fi and NVIDIA drivers',
      'Timeshift system snapshot utility pre-configured for safe rollbacks',
      'Snap-free by default with complete Flatpak and Flathub integration'
    ],
    specsRequirements: {
      minRam: '4 GB',
      recRam: '8 GB',
      minStorage: '25 GB',
      recStorage: '50 GB SSD'
    },
    usbGuide: {
      recommendedTool: 'USB Image Writer (built-in) or Ventoy / Rufus',
      ddCommand: 'sudo dd if=linuxmint-22-cinnamon-64bit.iso of=/dev/sdX bs=4M status=progress'
    },
    postInstallSteps: [
      'Run Update Manager and configure Timeshift snapshot location',
      'Open Driver Manager to install proprietary GPU and Wi-Fi drivers',
      'Install build tools: sudo apt install -y build-essential git curl'
    ]
  },
  {
    id: 'nixos',
    name: 'NixOS',
    version: '24.11',
    codename: 'Vicuna',
    tagline: 'Declarative, reproducible, and atomic Linux operating system configured via code.',
    family: 'Independent',
    packageManager: {
      name: 'nix',
      updateCmd: 'sudo nixos-rebuild switch --upgrade',
      installCmd: 'nix-env -iA nixos.',
      searchCmd: 'nix search nixpkgs',
      removeCmd: 'nix-env -e',
    },
    initSystem: 'systemd',
    defaultDesktop: 'KDE Plasma / GNOME (Configurable in configuration.nix)',
    recommendedAudience: 'DevOps engineers, dotfile perfectionists, developers requiring reproducible environments.',
    isoUrl: 'https://channels.nixos.org/nixos-24.11/latest-nixos-gnome-x86_64-linux.iso',
    sha256VerificationCmd: 'nix-hash --type sha256 latest-nixos-gnome-x86_64-linux.iso',
    essentialBuildToolsCmd: 'nix-shell -p gcc cmake gnumake git pkg-config',
    gitInstallCmd: 'nix-env -iA nixos.git',
    ghInstallCmd: 'nix-env -iA nixos.gh',
    keyAdvantages: [
      'Entire OS configured via single declarative configuration.nix or Nix Flakes',
      'Atomic upgrades with instant rollbacks in bootloader if anything breaks',
      'Nixpkgs has the largest software repository in the world (>100,000 packages)',
      'Isolated development shells without polluting global system paths'
    ],
    specsRequirements: {
      minRam: '4 GB',
      recRam: '16 GB',
      minStorage: '30 GB',
      recStorage: '100 GB SSD'
    },
    usbGuide: {
      recommendedTool: 'dd or Ventoy',
      ddCommand: 'sudo dd if=nixos-gnome-x86_64-linux.iso of=/dev/sdX bs=4M status=progress'
    },
    postInstallSteps: [
      'Generate initial hardware config: nixos-generate-config --root /mnt',
      'Edit configuration file: nano /etc/nixos/configuration.nix',
      'Rebuild system: sudo nixos-rebuild switch'
    ]
  },
  {
    id: 'alpine',
    name: 'Alpine Linux',
    version: '3.20',
    codename: 'Standard',
    tagline: 'Security-oriented, lightweight Linux distribution based on musl libc and busybox.',
    family: 'Independent',
    packageManager: {
      name: 'apk',
      updateCmd: 'sudo apk update && sudo apk upgrade',
      installCmd: 'sudo apk add',
      searchCmd: 'apk search',
      removeCmd: 'sudo apk del',
    },
    initSystem: 'OpenRC',
    defaultDesktop: 'Headless (Minimal) or XFCE/Sway',
    recommendedAudience: 'Containers, embedded hardware, routers, hyper-minimalist server environments.',
    isoUrl: 'https://dl-cdn.alpinelinux.org/alpine/v3.20/releases/x86_64/alpine-standard-3.20.3-x86_64.iso',
    sha256VerificationCmd: 'sha256sum alpine-standard-3.20.3-x86_64.iso',
    essentialBuildToolsCmd: 'sudo apk add build-base git cmake ninja linux-headers',
    gitInstallCmd: 'sudo apk add git',
    ghInstallCmd: 'sudo apk add github-cli',
    keyAdvantages: [
      'Ultra-minimal size: standard installation is ~130MB',
      'Default container base of Docker official images',
      'Musl libc and OpenRC for lightning-fast sub-second boot times',
      'Position Independent Executables (PIE) enabled system-wide for security'
    ],
    specsRequirements: {
      minRam: '512 MB',
      recRam: '2 GB',
      minStorage: '2 GB',
      recStorage: '10 GB'
    },
    usbGuide: {
      recommendedTool: 'dd',
      ddCommand: 'sudo dd if=alpine-standard-3.20.3-x86_64.iso of=/dev/sdX bs=4M status=progress'
    },
    postInstallSteps: [
      'Run setup wizard: setup-alpine',
      'Enable community repository in /etc/apk/repositories',
      'Install build tools: apk add build-base git'
    ]
  }
];
