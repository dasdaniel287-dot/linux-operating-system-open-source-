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
  }
];
