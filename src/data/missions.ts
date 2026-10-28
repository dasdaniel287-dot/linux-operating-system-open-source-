export interface MissionStep {
  id: string;
  instruction: string;
  expectedCommandRegex: RegExp;
  hint: string;
  output: string;
  fileChanges?: { path: string; content?: string }[];
}

export interface TerminalMission {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  steps: MissionStep[];
}

export const TERMINAL_MISSIONS: TerminalMission[] = [
  {
    id: 'fastfetch-source',
    title: 'Compile Fastfetch from GitHub Source',
    duration: '4 min',
    difficulty: 'Intermediate',
    summary: 'Practice installing build tools, cloning a C repository from GitHub, running CMake, and compiling with make.',
    steps: [
      {
        id: 'step1',
        instruction: 'Install the essential C compilation toolchain & CMake with apt:',
        expectedCommandRegex: /^(sudo\s+)?apt\s+install(\s+-y)?\s+(build-essential|cmake).*/i,
        hint: 'Type: sudo apt install -y build-essential cmake pkg-config',
        output: `Reading package lists... Done
Building dependency tree... Done
The following additional packages will be installed:
  gcc-13 g++-13 make cmake-data libpci-dev
0 upgraded, 8 newly installed, 0 to remove.
Setting up gcc-13 (13.2.0-23ubuntu4) ...
Setting up cmake (3.28.3-1build7) ...
Processing triggers for man-db (2.12.0-4build2) ...
✓ Toolchain ready!`
      },
      {
        id: 'step2',
        instruction: 'Clone the Fastfetch GitHub repository to your local workspace:',
        expectedCommandRegex: /^git\s+clone\s+https:\/\/github\.com\/fastfetch-cli\/fastfetch(\.git)?/i,
        hint: 'Type: git clone https://github.com/fastfetch-cli/fastfetch.git',
        output: `Cloning into 'fastfetch'...
remote: Enumerating objects: 19842, done.
remote: Counting objects: 100% (452/452), done.
remote: Compressing objects: 100% (231/231), done.
remote: Total 19842 (delta 289), reused 391 (delta 218), pack-reused 19390
Receiving objects: 100% (19842/19842), 8.14 MiB | 14.20 MiB/s, done.
Resolving deltas: 100% (14820/14820), done.
✓ Repository cloned successfully to ./fastfetch`,
        fileChanges: [{ path: '~/fastfetch' }]
      },
      {
        id: 'step3',
        instruction: 'Enter the cloned directory and configure the project build with CMake:',
        expectedCommandRegex: /(cd\s+fastfetch(\s*&&\s*(mkdir.*&&.*)?cmake.*)?)|(cmake\s+-B\s+build)/i,
        hint: 'Type: cd fastfetch && cmake -B build -DCMAKE_BUILD_TYPE=Release',
        output: `-- The C compiler identification is GNU 13.2.0
-- Check for working C compiler: /usr/bin/gcc - works
-- Detecting C compile features - done
-- Found PkgConfig: /usr/bin/pkg-config (found version "1.8.1")
-- Found Vulkan: /usr/lib/x86_64-linux-gnu/libvulkan.so
-- Configuring done (0.42s)
-- Generating done (0.08s)
-- Build files have been written to: /home/developer/fastfetch/build
✓ CMake configuration completed without errors`,
        fileChanges: [{ path: '~/fastfetch/build' }]
      },
      {
        id: 'step4',
        instruction: 'Compile the project using make or cmake --build with multi-core jobs:',
        expectedCommandRegex: /(cmake\s+--build\s+build)|(make(\s+-C\s+build|\s+-j.*)?)/i,
        hint: 'Type: cmake --build build -j$(nproc)',
        output: `[  2%] Building C object CMakeFiles/libfastfetch.dir/src/common/init.c.o
[  7%] Building C object CMakeFiles/libfastfetch.dir/src/detection/cpu/cpu_linux.c.o
[ 18%] Building C object CMakeFiles/libfastfetch.dir/src/detection/gpu/gpu_linux.c.o
[ 42%] Building C object CMakeFiles/libfastfetch.dir/src/detection/memory/memory_linux.c.o
[ 76%] Building C object CMakeFiles/libfastfetch.dir/src/detection/disk/disk_linux.c.o
[ 91%] Building C object CMakeFiles/libfastfetch.dir/src/logo/builtin.c.o
[100%] Linking C executable fastfetch
[100%] Built target fastfetch
✓ Build successful! Executable generated at build/fastfetch`,
        fileChanges: [{ path: '~/fastfetch/build/fastfetch' }]
      },
      {
        id: 'step5',
        instruction: 'Run your compiled fastfetch executable to view system hardware metrics:',
        expectedCommandRegex: /(\.\/build\/fastfetch|\.\/fastfetch)/i,
        hint: 'Type: ./build/fastfetch',
        output: `      ___          developer@openlinux-box
     /   \\         -----------------------
    /     \\        OS: Linux 6.8.0-45-generic x86_64
   /   _   \\       Host: Modern Workstation Standard
  /   (_)   \\      Kernel: 6.8.0-generic
 /  /  |  \\  \\     Uptime: 2 days, 4 hours, 18 mins
/_ /   |   \\ _\\    Packages: 1420 (dpkg), 1 (custom)
                   Shell: bash 5.2.21
                   Resolution: 2560x1440 @ 144Hz
                   DE: GNOME 46.0 (Wayland)
                   CPU: AMD Ryzen 9 7950X (32) @ 5.70GHz
                   GPU: AMD Radeon RX 7900 XTX [Vulkan]
                   Memory: 4120MiB / 32140MiB (12%)
✓ System fetch benchmark complete!`
      }
    ]
  },
  {
    id: 'github-git-setup',
    title: 'Configure Git, GitHub CLI & SSH on Linux',
    duration: '3 min',
    difficulty: 'Beginner',
    summary: 'Set up global Git identity, generate an Ed25519 SSH key for GitHub authentication, and verify connection.',
    steps: [
      {
        id: 'git1',
        instruction: 'Set your global Git name and email address:',
        expectedCommandRegex: /^git\s+config\s+--global\s+user\.(name|email)/i,
        hint: 'Type: git config --global user.name "Your Name"',
        output: `✓ Git global user configuration written to ~/.gitconfig`
      },
      {
        id: 'git2',
        instruction: 'Generate a high-security Ed25519 SSH key pair for GitHub:',
        expectedCommandRegex: /^ssh-keygen\s+-t\s+ed25519/i,
        hint: 'Type: ssh-keygen -t ed25519 -C "your_email@example.com"',
        output: `Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/developer/.ssh/id_ed25519): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/developer/.ssh/id_ed25519
Your public key has been saved in /home/developer/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:4yJ0fVvL+4yA... your_email@example.com
The key's randomart image is:
+--[ED25519 256]--+
|      .o==.      |
|     .o+*.o      |
|    .o o.o       |
|    ..o o        |
|    .S . +       |
+----[SHA256]-----+
✓ SSH Key generated at ~/.ssh/id_ed25519.pub`
      },
      {
        id: 'git3',
        instruction: 'Display the public SSH key so you can paste it to your GitHub profile:',
        expectedCommandRegex: /^cat\s+~?\/?\.ssh\/id_ed25519\.pub/i,
        hint: 'Type: cat ~/.ssh/id_ed25519.pub',
        output: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG5...your_key_content... your_email@example.com
✓ Copy this public key to: https://github.com/settings/keys`
      },
      {
        id: 'git4',
        instruction: 'Test the authenticated SSH handshake with GitHub servers:',
        expectedCommandRegex: /^ssh\s+(-T\s+)?git@github\.com/i,
        hint: 'Type: ssh -T git@github.com',
        output: `The authenticity of host 'github.com (140.82.121.4)' can't be established.
ED25519 key fingerprint is SHA256:+DiY3wvvV6TuJJhbpZisF/zP...
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'github.com' (ED25519) to the list of known hosts.
Hi developer! You've successfully authenticated, but GitHub does not provide shell access.
✓ SSH Authentication Successful!`
      }
    ]
  },
  {
    id: 'rust-cargo-build',
    title: 'Install Rust & Build Ripgrep from GitHub',
    duration: '4 min',
    difficulty: 'Intermediate',
    summary: 'Install Rustup/Cargo toolchain, clone the ripgrep repository, and build an optimized release binary.',
    steps: [
      {
        id: 'rust1',
        instruction: 'Check the installed Cargo & Rust compiler version:',
        expectedCommandRegex: /^(cargo|rustc)\s+--version/i,
        hint: 'Type: cargo --version',
        output: `cargo 1.82.0 (8f40fc59f 2024-09-04)`
      },
      {
        id: 'rust2',
        instruction: 'Clone the ripgrep repo from GitHub:',
        expectedCommandRegex: /^git\s+clone\s+https:\/\/github\.com\/BurntSushi\/ripgrep(\.git)?/i,
        hint: 'Type: git clone https://github.com/BurntSushi/ripgrep.git',
        output: `Cloning into 'ripgrep'...
remote: Enumerating objects: 11200, done.
remote: Counting objects: 100% (312/312), done.
Receiving objects: 100% (11200/11200), 4.31 MiB | 12.1 MiB/s, done.
Resolving deltas: 100% (8210/8210), done.
✓ Ripgrep cloned`
      },
      {
        id: 'rust3',
        instruction: 'Enter directory and build with release optimizations (LTO enabled):',
        expectedCommandRegex: /(cd\s+ripgrep(\s*&&\s*)?)?cargo\s+build\s+--release/i,
        hint: 'Type: cd ripgrep && cargo build --release',
        output: `   Compiling proc-macro2 v1.0.86
   Compiling unicode-ident v1.0.12
   Compiling libc v0.2.158
   Compiling regex-syntax v0.8.4
   Compiling aho-corasick v1.1.3
   Compiling memchr v2.7.4
   Compiling regex-automata v0.4.7
   Compiling grep-regex v0.1.13
   Compiling ripgrep v14.1.0 (/home/developer/ripgrep)
    Finished \`release\` profile [optimized + lto] in 24.12s
✓ Binary built at target/release/rg`
      },
      {
        id: 'rust4',
        instruction: 'Install the binary into /usr/local/bin so it is accessible in $PATH:',
        expectedCommandRegex: /^(sudo\s+)?(install|cp)\s+.*rg\s+\/usr\/local\/bin/i,
        hint: 'Type: sudo install -m 755 target/release/rg /usr/local/bin/',
        output: `[sudo] password for developer:
✓ Binary installed to /usr/local/bin/rg`
      },
      {
        id: 'rust5',
        instruction: 'Test your new ripgrep binary version:',
        expectedCommandRegex: /^(rg|\/usr\/local\/bin\/rg)\s+--version/i,
        hint: 'Type: rg --version',
        output: `ripgrep 14.1.0
-SIMD -AVX (compiled with Rust 1.82.0)
+PCRE2
✓ Fast regex search engine ready on Linux!`
      }
    ]
  },
  {
    id: 'ollama-local-ai',
    title: 'Deploy Ollama & Local AI LLMs on Linux',
    duration: '3 min',
    difficulty: 'Beginner',
    summary: 'Install Ollama via official Linux script, verify GPU acceleration, pull a lightweight model, and test prompts.',
    steps: [
      {
        id: 'ol1',
        instruction: 'Install Ollama using the official Linux installation script:',
        expectedCommandRegex: /^curl\s+-fsSL\s+https:\/\/ollama\.com\/install\.sh\s+\|\s+(sudo\s+)?sh/i,
        hint: 'Type: curl -fsSL https://ollama.com/install.sh | sh',
        output: `>>> Downloading ollama...
######################################################################## 100.0%
>>> Installing ollama to /usr/local/bin...
>>> Creating ollama user and group...
>>> Adding current user to ollama group...
>>> Creating systemd service file...
>>> Enabling and starting ollama service...
Created symlink /etc/systemd/system/default.target.wants/ollama.service → /etc/systemd/system/ollama.service.
>>> NVIDIA CUDA / AMD ROCm GPU compute detected: CUDA 12.4
✓ Ollama daemon is active and running on port 11434`
      },
      {
        id: 'ol2',
        instruction: 'Verify the installed Ollama CLI version:',
        expectedCommandRegex: /^ollama\s+--version/i,
        hint: 'Type: ollama --version',
        output: `ollama version is 0.4.7`
      },
      {
        id: 'ol3',
        instruction: 'Test running a prompt with a fast local language model:',
        expectedCommandRegex: /^ollama\s+run\s+(llama3|mistral|phi3|qwen|tinyllama).*/i,
        hint: 'Type: ollama run llama3 "Why run Linux on your workstation?"',
        output: `pulling manifest 
pulling 6a079f3ced59... 100% ▕████████████████▏ 4.7 GB                         
verifying sha256 digest 
writing manifest 
removing any unused layers 
success 
Running Linux provides complete kernel control, zero telemetry bloatware, native POSIX terminal integration, and supreme containerized Docker/Kubernetes development performance!
✓ Local LLM inference executed in 1.4s (64.2 tokens/sec)!`
      }
    ]
  },
  {
    id: 'neovim-source-build',
    title: 'Build Neovim from Source with Ninja',
    duration: '5 min',
    difficulty: 'Advanced',
    summary: 'Clone Neovim repository, switch to stable branch, and build with Ninja & CMake for an ultra-fast Lua editor.',
    steps: [
      {
        id: 'nv1',
        instruction: 'Clone the Neovim source code repository from GitHub:',
        expectedCommandRegex: /^git\s+clone\s+https:\/\/github\.com\/neovim\/neovim(\.git)?/i,
        hint: 'Type: git clone https://github.com/neovim/neovim.git',
        output: `Cloning into 'neovim'...
remote: Enumerating objects: 184500, done.
remote: Counting objects: 100% (910/910), done.
Receiving objects: 100% (184500/184500), 78.40 MiB | 18.20 MiB/s, done.
Resolving deltas: 100% (138200/138200), done.
✓ Neovim cloned successfully`,
        fileChanges: [{ path: '~/neovim' }]
      },
      {
        id: 'nv2',
        instruction: 'Checkout the official stable release tag:',
        expectedCommandRegex: /(cd\s+neovim(\s*&&\s*)?)?git\s+checkout\s+stable/i,
        hint: 'Type: cd neovim && git checkout stable',
        output: `Branch 'stable' set up to track remote branch 'stable' from 'origin'.
Switched to a new branch 'stable'
HEAD is now at v0.10.2`
      },
      {
        id: 'nv3',
        instruction: 'Compile Neovim with RelWithDebInfo profile and Ninja build system:',
        expectedCommandRegex: /make\s+CMAKE_BUILD_TYPE=RelWithDebInfo(\s+CMAKE_GENERATOR=Ninja)?/i,
        hint: 'Type: make CMAKE_BUILD_TYPE=RelWithDebInfo CMAKE_GENERATOR=Ninja',
        output: `[1/624] Building C object src/nvim/CMakeFiles/nvim_bin.dir/main.c.o
[240/624] Generating syntax and Lua embedded runtime objects
[480/624] Building Treesitter query parsers
[624/624] Linking C executable bin/nvim
✓ Compilation successful: bin/nvim ready`
      },
      {
        id: 'nv4',
        instruction: 'Install Neovim to /usr/local/bin:',
        expectedCommandRegex: /^(sudo\s+)?make\s+install/i,
        hint: 'Type: sudo make install',
        output: `-- Install configuration: "RelWithDebInfo"
-- Installing: /usr/local/bin/nvim
-- Installing: /usr/local/share/nvim/runtime
-- Installing: /usr/local/share/man/man1/nvim.1
✓ Neovim installed to /usr/local/bin/nvim`
      },
      {
        id: 'nv5',
        instruction: 'Verify your freshly compiled Neovim editor:',
        expectedCommandRegex: /^nvim\s+--version/i,
        hint: 'Type: nvim --version',
        output: `NVIM v0.10.2
Build type: RelWithDebInfo
LuaJIT 2.1.1713484068
Compilation: /usr/bin/gcc-13 -O2 -g -DNDEBUG
Features: +acl +iconv +tui
✓ Modern Lua-powered Neovim editor ready on Linux!`
      }
    ]
  },
  {
    id: 'bootable-usb-dd',
    title: 'Flash Bootable Linux USB with dd & lsblk',
    duration: '3 min',
    difficulty: 'Beginner',
    summary: 'Identify physical USB block devices with lsblk, safely unmount partitions, burn an OS ISO using GNU dd with progress tracking, and sync write buffers.',
    steps: [
      {
        id: 'usb1',
        instruction: 'List all block storage devices to identify your target USB drive letter (e.g., /dev/sdb):',
        expectedCommandRegex: /^lsblk(\s+.*)?$/i,
        hint: 'Type: lsblk',
        output: `NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0   1.8T  0 disk 
├─nvme0n1p1 259:1    0     1G  0 part /boot/efi
├─nvme0n1p2 259:2    0   1.8T  0 part /
└─nvme0n1p3 259:3    0    32G  0 part [SWAP]
sdb           8:16   1  29.8G  0 disk 
└─sdb1        8:17   1  29.8G  0 part /media/developer/LINUX_USB
✓ Target USB flash drive identified: /dev/sdb (29.8 GB)`
      },
      {
        id: 'usb2',
        instruction: 'Unmount any automatically mounted partitions on /dev/sdb before writing raw blocks:',
        expectedCommandRegex: /^(sudo\s+)?umount\s+\/dev\/sdb[0-9*]?/i,
        hint: 'Type: sudo umount /dev/sdb1',
        output: `[sudo] password for developer: 
✓ /dev/sdb1 unmounted successfully. Drive is ready for raw block write.`
      },
      {
        id: 'usb3',
        instruction: 'Burn the Linux ISO image to /dev/sdb using dd with 4MB block size and status progress:',
        expectedCommandRegex: /^(sudo\s+)?dd\s+if=.*\.iso\s+of=\/dev\/sdb(\s+.*)?/i,
        hint: 'Type: sudo dd if=ubuntu-24.04-desktop-amd64.iso of=/dev/sdb bs=4M status=progress oflag=sync',
        output: `1048576000 bytes (1.0 GB, 1000 MiB) copied, 7.82 s, 134 MB/s
2097152000 bytes (2.1 GB, 2000 MiB) copied, 15.64 s, 134 MB/s
3145728000 bytes (3.1 GB, 3000 MiB) copied, 23.46 s, 134 MB/s
4831838208 bytes (4.8 GB, 4.5 GiB) copied, 36.12 s, 134 MB/s
1152+0 records in
1152+0 records out
4831838208 bytes (4.8 GB, 4.5 GiB) copied, 36.211 s, 133 MB/s
✓ Raw ISO bitstream successfully written to /dev/sdb`
      },
      {
        id: 'usb4',
        instruction: 'Flush cached write buffers to ensure all data is physically committed to the flash drive:',
        expectedCommandRegex: /^sync$/i,
        hint: 'Type: sync',
        output: `✓ Storage buffers flushed. All dirty blocks committed to NAND flash.`
      },
      {
        id: 'usb5',
        instruction: 'Inspect the newly written partition layout on /dev/sdb with fdisk or lsblk:',
        expectedCommandRegex: /^(sudo\s+)?(fdisk\s+-l\s+\/dev\/sdb|lsblk\s+\/dev\/sdb)/i,
        hint: 'Type: sudo fdisk -l /dev/sdb',
        output: `Disk /dev/sdb: 29.8 GiB, 32010928128 bytes, 62521344 sectors
Disk model: Ultra USB 3.0   
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: B57E6B8D-2E34-4C3D-81F8-AC50C6A72074

Device       Start      End  Sectors  Size Type
/dev/sdb1       64  9437183  9437120  4.5G Microsoft basic data
/dev/sdb2  9437184  9447423    10240    5M EFI System
/dev/sdb3  9447424  9447999      576  288K BIOS boot
✓ Bootable UEFI/BIOS Linux installation media ready! You can now safely unplug the USB.`
      }
    ]
  }
];
