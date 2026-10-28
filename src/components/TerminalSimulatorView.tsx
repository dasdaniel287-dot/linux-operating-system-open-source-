import React, { useState, useEffect, useRef } from 'react';
import { TERMINAL_MISSIONS, TerminalMission } from '../data/missions';
import { 
  Terminal as TerminalIcon, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Sparkles, 
  ListCheck,
  Maximize2
} from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system';
  content: string;
  cwd?: string;
}

interface TerminalSimulatorViewProps {
  initialMissionId?: string;
}

export const TerminalSimulatorView: React.FC<TerminalSimulatorViewProps> = ({ initialMissionId }) => {
  const [selectedMissionId, setSelectedMissionId] = useState<string>(initialMissionId || 'fastfetch-source');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const [inputVal, setInputVal] = useState<string>('');
  const [cwd, setCwd] = useState<string>('~');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      content: 'Linux Workstation OS 6.8.0-45-generic x86_64 GNU/Linux\nType "help" for a list of commands or follow the interactive mission steps below.'
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentMission = TERMINAL_MISSIONS.find(m => m.id === selectedMissionId) || TERMINAL_MISSIONS[0];
  const currentStep = currentMission.steps[currentStepIndex];

  useEffect(() => {
    if (initialMissionId && initialMissionId !== selectedMissionId) {
      setSelectedMissionId(initialMissionId);
      setCurrentStepIndex(0);
      setCompletedSteps(new Set());
      setCwd('~');
    }
  }, [initialMissionId]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLine = (line: TerminalLine) => {
    setLines(prev => [...prev, line]);
  };

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Add to history
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    // Record user command in output
    addLine({
      id: Math.random().toString(),
      type: 'input',
      content: cmd,
      cwd: cwd
    });

    setInputVal('');

    // Check if command satisfies current mission step
    if (currentStep && currentStep.expectedCommandRegex.test(cmd)) {
      setTimeout(() => {
        addLine({
          id: Math.random().toString(),
          type: 'output',
          content: currentStep.output
        });

        // Update virtual directory state if relevant
        if (cmd.includes('cd fastfetch/build') || cmd.includes('cd build')) {
          setCwd('~/fastfetch/build');
        } else if (cmd.includes('cd fastfetch')) {
          setCwd('~/fastfetch');
        } else if (cmd.includes('cd ripgrep')) {
          setCwd('~/ripgrep');
        } else if (cmd.includes('cd neovim')) {
          setCwd('~/neovim');
        }

        // Mark step complete
        const nextSet = new Set(completedSteps);
        nextSet.add(currentStepIndex);
        setCompletedSteps(nextSet);

        if (currentStepIndex + 1 < currentMission.steps.length) {
          setCurrentStepIndex(currentStepIndex + 1);
        }
      }, 150);
      return;
    }

    // Generic simulated Linux bash commands
    setTimeout(() => {
      let response = '';

      // Normalize command and detect sudo
      const isSudo = cmd.startsWith('sudo ');
      const cleanCmd = isSudo ? cmd.replace(/^sudo\s+/, '') : cmd;
      const [cmdBase, ...args] = cleanCmd.split(/\s+/);
      const argStr = args.join(' ');

      if (cmd === 'clear') {
        setLines([]);
        return;
      } else if (cmd === 'help') {
        response = `Available simulated commands:
  sudo dd if=<iso> of=<dev> bs=4M   - Burn bootable USB flash drive with progress
  lsblk / sudo fdisk -l / sync      - Inspect, partition, and sync storage devices
  sudo umount /dev/sdX1             - Safely unmount flash drive partitions
  which <binary>                    - Locate binary executable in $PATH (e.g., which dd)
  sudo apt [update|install <pkg>]   - Debian/Ubuntu package manager (e.g. coreutils)
  sudo pacman [-Syu|-S <pkg>]       - Arch Linux package manager
  sudo dnf [install|upgrade]        - Fedora package manager
  git clone <url>                   - Clone GitHub repositories
  cmake -B build / make             - Configure & compile C/C++ projects
  cargo build / cargo install       - Rust package toolchain
  gh [--version|auth login|repo]    - Official GitHub CLI
  ollama [run|--version]            - Local AI engine
  systemctl [status|start <svc>]    - Linux service manager
  fastfetch / btop / nvim           - Modern developer CLI tools
  cat <file> / ls / cd / pwd        - Standard Linux coreutils
  clear / whoami / uname -a         - Shell utilities`;
      } else if (cmd === 'pwd') {
        response = cwd === '~' ? '/home/developer' : `/home/developer/${cwd.replace('~/', '')}`;
      } else if (cmd === 'whoami' || cleanCmd === 'whoami') {
        response = isSudo ? 'root' : 'developer';
      } else if (cleanCmd === 'su' || cleanCmd === '-i') {
        response = '[sudo] password for developer: \nSwitched to superuser (root). Operating with elevated permissions.';
      } else if (cmd === 'uname -a' || cmd === 'uname -r' || cleanCmd === 'uname -a') {
        response = 'Linux openlinux-station 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
      } else if (cleanCmd === 'uptime') {
        response = ' 10:48:12 up 2 days,  4:18,  2 users,  load average: 0.18, 0.22, 0.15';
      } else if (cleanCmd.startsWith('cat /etc/os-release')) {
        response = `NAME="Ubuntu"
VERSION="24.04 LTS (Noble Numbat)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 24.04 LTS"
VERSION_ID="24.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"`;
      } else if (cleanCmd.startsWith('cat /etc/hosts')) {
        response = `127.0.0.1 localhost\n127.0.1.1 openlinux-station\n::1 localhost ip6-localhost ip6-loopback`;
      } else if (cleanCmd.startsWith('cat ~/.bashrc')) {
        response = `# ~/.bashrc: executed by bash(1) for non-login shells.
export PATH="$HOME/.local/bin:$PATH"
export EDITOR="nvim"
eval "$(starship init bash 2>/dev/null)" || true`;
      } else if (cleanCmd.startsWith('cat ~/.gitconfig')) {
        response = `[user]
\tname = Linux Developer
\temail = developer@example.com
[init]
\tdefaultBranch = main`;
      } else if (cleanCmd.startsWith('cat ~/.ssh/id_ed25519.pub')) {
        response = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG5...pubkey_payload... developer@example.com`;
      } else if (cleanCmd.startsWith('echo ')) {
        response = argStr.replace(/^["']|["']$/g, '');
      } else if (cleanCmd.startsWith('touch ')) {
        const fname = args[0] || 'file';
        response = `✓ Created file: ${fname}`;
      } else if (cleanCmd.startsWith('chmod ')) {
        const target = args[args.length - 1] || 'file';
        response = `✓ Permissions updated for ${target}`;
      } else if (cleanCmd.startsWith('apt update') || cleanCmd.startsWith('apt-get update')) {
        response = `Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease
Get:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]
Get:3 http://archive.ubuntu.com/ubuntu noble-updates InRelease [126 kB]
Get:4 https://cli.github.com/packages stable InRelease [3,917 B]
Fetched 256 kB in 1s (248 kB/s)
Reading package lists... Done
Building dependency tree... Done
All packages are up to date.`;
      } else if (cleanCmd.startsWith('apt install') || cleanCmd.startsWith('apt-get install')) {
        const pkgs = args.filter(a => !a.startsWith('-')).slice(1).join(' ') || 'build-essential';
        response = `Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  ${pkgs}
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
After this operation, 14.8 MB of additional disk space will be used.
Setting up ${pkgs} ...
Processing triggers for man-db ...
✓ Installation completed successfully.`;
      } else if (cleanCmd.startsWith('pacman -Syu')) {
        response = `:: Synchronizing package databases...
 core is up to date
 extra is up to date
 multilib is up to date
:: Starting full system upgrade...
 there is nothing to do`;
      } else if (cleanCmd.startsWith('pacman -S')) {
        const pkgs = args.filter(a => !a.startsWith('-')).join(' ') || 'package';
        response = `resolving dependencies...
looking for conflicting packages...

Packages (1) ${pkgs}-latest

Total Download Size:    3.40 MiB
Total Installed Size:  12.10 MiB

:: Proceed with installation? [Y/n] y
(1/1) checking keys in keyring                     [######################] 100%
(1/1) loading package files                        [######################] 100%
(1/1) installing ${pkgs}                           [######################] 100%
✓ Package ${pkgs} installed.`;
      } else if (cleanCmd.startsWith('dnf install') || cleanCmd.startsWith('dnf upgrade')) {
        const pkgs = args.filter(a => !a.startsWith('-')).slice(1).join(' ') || 'development-tools';
        response = `Last metadata expiration check: 0:04:12 ago.
Dependencies resolved.
================================================================================
 Package             Architecture       Version          Repository        Size
================================================================================
Installing:
 ${pkgs}             x86_64             latest           fedora           4.2 M

Transaction Summary
================================================================================
Install  1 Package
Total download size: 4.2 M
Installed size: 14 M
Is this ok [y/N]: y
Complete!`;
      } else if (cleanCmd.startsWith('systemctl status')) {
        const svc = args[1] || 'docker';
        response = `● ${svc}.service - Application Service Daemon
     Loaded: loaded (/etc/systemd/system/${svc}.service; enabled; preset: enabled)
     Active: active (running) since Wed 2026-10-28 08:14:02 UTC; 2h 45min ago
   Main PID: 1240 (${svc})
     Tasks: 8 (limit: 18944)
     Memory: 32.4M
        CPU: 420ms
     CGroup: /system.slice/${svc}.service
             └─1240 /usr/local/bin/${svc}`;
      } else if (cleanCmd.startsWith('systemctl start') || cleanCmd.startsWith('systemctl enable')) {
        const svc = args[1] || 'service';
        response = `✓ Created symlink /etc/systemd/system/multi-user.target.wants/${svc}.service.\n✓ Started ${svc}.service.`;
      } else if (cleanCmd.startsWith('make install')) {
        response = `[sudo] password for developer:
-- Install configuration: "Release"
-- Installing: /usr/local/bin/fastfetch
-- Installing: /usr/local/share/fastfetch
✓ Installed binary to /usr/local/bin`;
      } else if (cmd === 'ls' || cmd === 'ls -la' || cleanCmd === 'ls' || cleanCmd === 'ls -la') {
        if (cwd === '~') {
          response = 'Desktop  Documents  Downloads  src  .bashrc  .gitconfig  .ssh';
        } else if (cwd === '~/fastfetch') {
          response = 'build  CMakeLists.txt  LICENSE  README.md  src  tests';
        } else if (cwd === '~/fastfetch/build') {
          response = 'CMakeFiles  cmake_install.cmake  CMakeCache.txt  fastfetch  Makefile';
        } else if (cwd === '~/ripgrep') {
          response = 'Cargo.lock  Cargo.toml  LICENSE-MIT  README.md  src  target';
        } else if (cwd === '~/neovim') {
          response = 'build  CMakeLists.txt  LICENSE.txt  README.md  runtime  src';
        } else {
          response = 'total 8\ndrwxr-xr-x 2 developer developer 4096 Oct 28 10:00 .\ndrwxr-xr-x 4 developer developer 4096 Oct 28 09:59 ..';
        }
      } else if (cmd.startsWith('cd')) {
        const target = cmd.replace(/^cd\s*/, '').trim();
        if (target === '' || target === '~') {
          setCwd('~');
        } else if (target === '..') {
          if (cwd === '~/fastfetch/build') setCwd('~/fastfetch');
          else setCwd('~');
        } else if (target === 'fastfetch') {
          setCwd('~/fastfetch');
        } else if (target === 'build' || target === 'fastfetch/build') {
          setCwd('~/fastfetch/build');
        } else if (target === 'ripgrep') {
          setCwd('~/ripgrep');
        } else if (target === 'neovim') {
          setCwd('~/neovim');
        } else {
          response = `bash: cd: ${target}: No such file or directory`;
        }
      } else if (cmd === 'fastfetch' || cmd === './build/fastfetch') {
        response = `      ___          developer@openlinux-box
     /   \\         -----------------------
    /     \\        OS: Linux 6.8.0-45-generic x86_64
   /   _   \\       Host: Modern Workstation Standard
  /   (_)   \\      Kernel: 6.8.0-generic
 /  /  |  \\  \\     Uptime: 2 days, 4 hours, 18 mins
/_ /   |   \\ _\\    Packages: 1420 (dpkg), 1 (custom)
                   Shell: bash 5.2.21
                   CPU: AMD Ryzen 9 7950X (32) @ 5.70GHz
                   GPU: AMD Radeon RX 7900 XTX [Vulkan]
                   Memory: 4120MiB / 32140MiB (12%)`;
      } else if (cleanCmd === 'gh --version' || cleanCmd.startsWith('gh ')) {
        response = 'gh version 2.58.0 (2024-10-15)\nhttps://github.com/cli/cli/releases/tag/v2.58.0';
      } else if (cleanCmd === 'git --version') {
        response = 'git version 2.43.0';
      } else if (cleanCmd === 'cargo --version') {
        response = 'cargo 1.82.0 (8f40fc59f 2024-09-04)';
      } else if (cleanCmd === 'cmake --version') {
        response = 'cmake version 3.28.3\nCMake suite maintained and supported by Kitware (kitware.com/cmake).';
      } else if (cleanCmd === 'ollama --version' || cleanCmd.startsWith('ollama ')) {
        response = 'ollama version is 0.4.7';
      } else if (cleanCmd === 'nvim --version') {
        response = 'NVIM v0.10.2\nBuild type: RelWithDebInfo\nLuaJIT 2.1.1713484068';
      } else if (cleanCmd.startsWith('which ')) {
        const bin = args[0] || '';
        const standardBins: Record<string, string> = {
          dd: '/usr/bin/dd',
          sudo: '/usr/bin/sudo',
          bash: '/bin/bash',
          git: '/usr/bin/git',
          cmake: '/usr/bin/cmake',
          cargo: '/home/developer/.cargo/bin/cargo',
          rustc: '/home/developer/.cargo/bin/rustc',
          make: '/usr/bin/make',
          gcc: '/usr/bin/gcc',
          g: '/usr/bin/g++',
          gh: '/usr/bin/gh',
          nvim: '/usr/local/bin/nvim',
          fastfetch: '/usr/local/bin/fastfetch',
          lsblk: '/usr/bin/lsblk',
          sync: '/bin/sync',
          fdisk: '/usr/sbin/fdisk',
          umount: '/bin/umount',
          ollama: '/usr/local/bin/ollama',
          curl: '/usr/bin/curl',
          python3: '/usr/bin/python3',
        };
        response = standardBins[bin] || `/usr/bin/${bin}`;
      } else if (cleanCmd === 'lsblk' || cleanCmd.startsWith('lsblk ')) {
        response = `NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme0n1     259:0    0   1.8T  0 disk 
├─nvme0n1p1 259:1    0     1G  0 part /boot/efi
├─nvme0n1p2 259:2    0   1.8T  0 part /
└─nvme0n1p3 259:3    0    32G  0 part [SWAP]
sdb           8:16   1  29.8G  0 disk 
└─sdb1        8:17   1  29.8G  0 part /media/developer/LINUX_USB`;
      } else if (cleanCmd === 'sync') {
        response = `✓ Storage write buffers synchronized. All dirty blocks written to physical media.`;
      } else if (cleanCmd.startsWith('umount')) {
        const dev = args[0] || '/dev/sdb1';
        response = `✓ Partition ${dev} unmounted successfully. Drive is safe for raw block writes.`;
      } else if (cleanCmd.startsWith('fdisk')) {
        const dev = cleanCmd.includes('/dev/') ? cleanCmd.split('/dev/')[1].split(/\s+/)[0] : 'sdb';
        response = `Disk /dev/${dev}: 29.8 GiB, 32010928128 bytes, 62521344 sectors
Disk model: Ultra USB 3.0   
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: B57E6B8D-2E34-4C3D-81F8-AC50C6A72074

Device         Start      End  Sectors  Size Type
/dev/${dev}1       64  9437183  9437120  4.5G Microsoft basic data
/dev/${dev}2  9437184  9447423    10240    5M EFI System
/dev/${dev}3  9447424  9447999      576  288K BIOS boot`;
      } else if (cleanCmd === 'dd' || cleanCmd.startsWith('dd ') || cleanCmd.startsWith('dd\t')) {
        if (cleanCmd === 'dd --help' || cleanCmd === 'dd -h') {
          response = `Usage: dd [OPERAND]...
  or:  dd OPTION
Copy a file, converting and formatting according to the operands.

  bs=BYTES        read and write up to BYTES bytes at a time (default: 512)
  if=FILE         read from FILE instead of stdin
  of=FILE         write to FILE instead of stdout
  count=N         copy only N input blocks
  status=LEVEL    The LEVEL of information to print to stderr ('progress', 'none')
  oflag=FLAGS     write according to comma separated symbol list (e.g. sync, direct)

GNU coreutils online help: <https://www.gnu.org/software/coreutils/>`;
        } else if (cleanCmd === 'dd') {
          response = `dd: missing file operand\nTry 'dd --help' for more information.`;
        } else {
          // Parse dd options
          const ifMatch = cleanCmd.match(/if=([^\s]+)/);
          const ofMatch = cleanCmd.match(/of=([^\s]+)/);
          const bsMatch = cleanCmd.match(/bs=([^\s]+)/);
          const inputFile = ifMatch ? ifMatch[1] : 'ubuntu-24.04-desktop-amd64.iso';
          const outputFile = ofMatch ? ofMatch[1] : '/dev/sdb';
          const bs = bsMatch ? bsMatch[1] : '4M';

          response = `${!isSudo ? '[sudo] password for developer: \n' : ''}Flashing raw image '${inputFile}' to target device '${outputFile}' (block size: ${bs})...
1048576000 bytes (1.0 GB, 1000 MiB) copied, 7.82 s, 134 MB/s
2097152000 bytes (2.1 GB, 2000 MiB) copied, 15.64 s, 134 MB/s
3145728000 bytes (3.1 GB, 3000 MiB) copied, 23.46 s, 134 MB/s
4831838208 bytes (4.8 GB, 4.5 GiB) copied, 36.12 s, 134 MB/s
1152+0 records in
1152+0 records out
4831838208 bytes (4.8 GB, 4.5 GiB) copied, 36.211 s, 133 MB/s
✓ Raw block transfer complete to ${outputFile}! Run 'sync' to flush remaining disk caches.`;
        }
      } else {
        response = `bash: ${cleanCmd.split(' ')[0]}: command not found`;
      }

      if (response) {
        addLine({
          id: Math.random().toString(),
          type: 'output',
          content: response
        });
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (currentStep) {
        const hintCmd = currentStep.hint.replace(/^Type:\s*/, '');
        setInputVal(hintCmd);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const handleResetMission = () => {
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
    setCwd('~');
    setLines([
      {
        id: 'reset-1',
        type: 'system',
        content: `Reset mission: ${currentMission.title}. Ready for command entry.`
      }
    ]);
  };

  const autoRunStep = () => {
    if (!currentStep) return;
    const sampleCmd = currentStep.hint.replace(/^Type:\s*/, '');
    setInputVal(sampleCmd);
    setTimeout(() => {
      handleCommand(sampleCmd);
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Interactive Terminal Sandbox</span>
            <span aria-hidden="true">·</span>
            <span>Real Linux Shell Experience</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            Linux & GitHub Terminal Simulator
          </h1>
        </div>

        {/* Mission Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Mission:</span>
          <select
            value={selectedMissionId}
            onChange={e => {
              setSelectedMissionId(e.target.value);
              setCurrentStepIndex(0);
              setCompletedSteps(new Set());
              setCwd('~');
            }}
            className="bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 rounded-lg px-3 py-1.5 focus:border-cyan-400 focus:outline-none"
          >
            {TERMINAL_MISSIONS.map(m => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.difficulty})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Mission Guided Checklist */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ListCheck className="w-4 h-4 text-cyan-400" />
                <span>Mission Objectives</span>
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                <span>{currentMission.difficulty}</span>
                <span aria-hidden="true">·</span>
                <span>{currentMission.duration}</span>
              </div>
            </div>

            <button
              onClick={handleResetMission}
              title="Reset current mission"
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentMission.summary}
          </p>

          {/* Steps */}
          <div className="space-y-3">
            {currentMission.steps.map((step, idx) => {
              const isCompleted = completedSteps.has(idx);
              const isCurrent = idx === currentStepIndex && !isCompleted;
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                    isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : isCurrent
                      ? 'bg-slate-900 border-cyan-400/50 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className={`w-4 h-4 shrink-0 mt-0.5 ${isCurrent ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
                    )}
                    <div className="flex-1">
                      <span className={`font-semibold block ${isCurrent ? 'text-cyan-300' : ''}`}>
                        Step {idx + 1}
                      </span>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">{step.instruction}</p>
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="pt-1.5 pl-6 flex items-center justify-between gap-2 border-t border-slate-800/60">
                      <span className="text-[11px] font-mono text-cyan-400 truncate">
                        {step.hint}
                      </span>
                      <button
                        onClick={autoRunStep}
                        className="px-2 py-1 text-[11px] font-medium bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded shrink-0 flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Run</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Terminal Window */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[580px]">
          {/* Terminal Window Chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <span className="text-slate-400 font-mono text-[11px] ml-2">developer@linux-station: {cwd}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <span>bash 5.2</span>
              <span aria-hidden="true">·</span>
              <span className="text-cyan-400">interactive</span>
            </div>
          </div>

          {/* Output Display */}
          <div 
            onClick={() => inputRef.current?.focus()}
            className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-3 cursor-text text-slate-300 leading-relaxed"
          >
            {lines.map(line => {
              if (line.type === 'input') {
                return (
                  <div key={line.id} className="flex items-start gap-2">
                    <span className="text-cyan-400 shrink-0 font-semibold">
                      developer@linux-station:{line.cwd || '~'}$
                    </span>
                    <span className="text-slate-100 font-medium">{line.content}</span>
                  </div>
                );
              } else if (line.type === 'system') {
                return (
                  <div key={line.id} className="text-slate-500 whitespace-pre-wrap pb-1 border-b border-slate-900">
                    {line.content}
                  </div>
                );
              } else {
                return (
                  <div key={line.id} className="text-slate-300 whitespace-pre-wrap pl-2 border-l border-slate-800">
                    {line.content}
                  </div>
                );
              }
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Quick Command Chips */}
          <div className="px-4 py-1.5 bg-slate-900/60 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto text-[11px] font-mono scrollbar-none">
            <span className="text-slate-500 shrink-0">Quick:</span>
            {['fastfetch', 'lsblk', 'which dd', 'sudo dd if=ubuntu-24.04.iso of=/dev/sdb bs=4M status=progress', 'sync', 'uname -a', 'cat /etc/os-release', 'ls -la', 'gh --version', 'clear'].map(cmd => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
                className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Input Prompt */}
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/90 border-t border-slate-800 text-xs font-mono">
            <span className="text-cyan-400 font-semibold shrink-0">
              developer@linux-station:{cwd}$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentStep ? `${currentStep.hint.replace(/^Type:\s*/, '')} (Press Tab to auto-fill)` : 'type command...'}
              className="flex-1 bg-transparent text-slate-100 focus:outline-none placeholder-slate-600 font-mono"
              autoFocus
            />
            {currentStep && (
              <button
                onClick={autoRunStep}
                className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition-colors shrink-0"
              >
                Auto-fill
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
