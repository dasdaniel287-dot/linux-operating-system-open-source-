import React, { useState } from 'react';
import { LINUX_DISTROS, LinuxDistro } from '../data/linuxDistros';
import { 
  HardDrive, 
  Cpu, 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';

interface DistroGuideViewProps {
  onOpenTerminalMission?: (missionId: string) => void;
  onSelectDistroForCatalog?: (distroId: string) => void;
}

export const DistroGuideView: React.FC<DistroGuideViewProps> = ({ 
  onOpenTerminalMission,
  onSelectDistroForCatalog 
}) => {
  const [selectedDistroId, setSelectedDistroId] = useState<string>('ubuntu');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Storage Partition Calculator State
  const [diskSizeGb, setDiskSizeGb] = useState<number>(512);
  const [ramSizeGb, setRamSizeGb] = useState<number>(16);
  const [enableHibernate, setEnableHibernate] = useState<boolean>(true);
  const [filesystemType, setFilesystemType] = useState<'btrfs' | 'ext4'>('btrfs');

  const currentDistro = LINUX_DISTROS.find(d => d.id === selectedDistroId) || LINUX_DISTROS[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Calculate partitions mathematically
  const efiSizeMb = 1024; // 1GB EFI standard
  const efiSizeGb = 1.0;
  
  // Swap size calculation (Linux standards: with hibernation, equal or 1.5x RAM; without hibernation, sqrt(RAM) or 4GB)
  const calculatedSwapGb = enableHibernate 
    ? (ramSizeGb <= 8 ? ramSizeGb * 2 : Math.round(ramSizeGb * 1.25))
    : (ramSizeGb <= 8 ? 4 : 8);

  const remainingGb = Math.max(20, diskSizeGb - efiSizeGb - calculatedSwapGb);
  
  // If btrfs, subvolumes share root space; if ext4, split root and home
  const rootSizeGb = filesystemType === 'btrfs' 
    ? remainingGb 
    : Math.min(80, Math.round(remainingGb * 0.35));
  
  const homeSizeGb = filesystemType === 'btrfs' 
    ? 0 
    : Math.max(20, remainingGb - rootSizeGb);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Hero Section with Split Blueprint Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <span>Linux OS Architecture & Installation</span>
              <span aria-hidden="true">·</span>
              <span>UEFI & GitHub Ready</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight text-balance">
              Install Linux OS & Configure Git and GitHub from Scratch
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              An interactive blueprint for selecting, verifying, flashing, and partitioning an open-source Linux operating system on your workstation, fully configured to build GitHub projects.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="block text-xs text-slate-400">Boot Standard</span>
              <span className="text-sm font-semibold text-slate-200">UEFI / GPT</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="block text-xs text-slate-400">Flash Method</span>
              <span className="text-sm font-semibold text-slate-200">Ventoy / dd</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="block text-xs text-slate-400">Compiler Base</span>
              <span className="text-sm font-semibold text-slate-200">GCC / Clang / Rust</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="block text-xs text-slate-400">Default Auth</span>
              <span className="text-sm font-semibold text-slate-200">Ed25519 SSH</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <img 
            src="/src/assets/images/distro_boot_installation_1793208164859.jpg" 
            alt="Linux USB Boot Installation Media" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-4">
            <span className="text-xs text-slate-300 font-mono">
              UEFI Boot Partitioning & ISO Verification Schematic
            </span>
          </div>
        </div>
      </div>

      {/* Distribution Selector Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Select Target Operating System</h2>
            <p className="text-xs text-slate-400">Compare package managers, kernel branches, and GitHub toolchain support</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {LINUX_DISTROS.length} Tier-1 Distributions
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {LINUX_DISTROS.map(distro => {
            const isSelected = distro.id === selectedDistroId;
            return (
              <button
                key={distro.id}
                onClick={() => setSelectedDistroId(distro.id)}
                className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-semibold shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{distro.name}</span>
                <span className="ml-1.5 opacity-60 font-mono text-[11px]">{distro.version}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Distro Overview Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">{currentDistro.family} Family</span>
              <span aria-hidden="true">·</span>
              <span>Init: {currentDistro.initSystem}</span>
              <span aria-hidden="true">·</span>
              <span>Desktop: {currentDistro.defaultDesktop}</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mt-1">{currentDistro.name} {currentDistro.version}</h3>
            <p className="text-sm text-slate-300 mt-1">{currentDistro.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={currentDistro.isoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Official ISO Download</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* Key Features & Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workstation Advantages</h4>
            <div className="space-y-2 text-xs text-slate-300">
              {currentDistro.keyAdvantages.map((adv, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold">›</span>
                  <span>{adv}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hardware Guidelines</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block">Min Memory</span>
                <span className="font-mono text-slate-200 font-semibold">{currentDistro.specsRequirements.minRam}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block">Recommended RAM</span>
                <span className="font-mono text-cyan-400 font-semibold">{currentDistro.specsRequirements.recRam}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block">Min Storage</span>
                <span className="font-mono text-slate-200 font-semibold">{currentDistro.specsRequirements.minStorage}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block">Recommended Storage</span>
                <span className="font-mono text-cyan-400 font-semibold">{currentDistro.specsRequirements.recStorage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Snippets for Essential Toolchains on this Distro */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h4 className="text-sm font-semibold text-slate-200">
            Automated Terminal Commands for {currentDistro.name}
          </h4>

          {/* Git Installation Command */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>1. Install Git Version Control</span>
              <button
                onClick={() => handleCopy(currentDistro.gitInstallCmd, 'git')}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {copiedKey === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'git' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
              <code>{currentDistro.gitInstallCmd}</code>
            </pre>
          </div>

          {/* GitHub CLI (gh) Command */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>2. Install Official GitHub CLI (gh)</span>
              <button
                onClick={() => handleCopy(currentDistro.ghInstallCmd, 'gh')}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {copiedKey === 'gh' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'gh' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
              <code>{currentDistro.ghInstallCmd}</code>
            </pre>
          </div>

          {/* Build Tools */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>3. Install Essential C/C++, CMake & Compilers for Building Repos</span>
              <button
                onClick={() => handleCopy(currentDistro.essentialBuildToolsCmd, 'build')}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {copiedKey === 'build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'build' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto">
              <code>{currentDistro.essentialBuildToolsCmd}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Interactive Disk Partition & Swap Storage Calculator */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              <span>Interactive Partition & Storage Calculator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generates mathematically optimal GPT / UEFI partition geometry for Linux installations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filesystem:</span>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setFilesystemType('btrfs')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filesystemType === 'btrfs' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400'
                }`}
              >
                Btrfs (Modern)
              </button>
              <button
                onClick={() => setFilesystemType('ext4')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filesystemType === 'ext4' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400'
                }`}
              >
                Ext4 (Classic)
              </button>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {/* Drive Size Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              Disk Drive Capacity: <span className="text-cyan-400 font-mono font-bold">{diskSizeGb} GB</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[128, 256, 512, 1000, 2000].map(size => (
                <button
                  key={size}
                  onClick={() => setDiskSizeGb(size)}
                  className={`py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                    diskSizeGb === size
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {size >= 1000 ? `${size / 1000}TB` : `${size}G`}
                </button>
              ))}
            </div>
          </div>

          {/* System RAM Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              System Physical RAM: <span className="text-cyan-400 font-mono font-bold">{ramSizeGb} GB</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[8, 16, 32, 64, 128].map(ram => (
                <button
                  key={ram}
                  onClick={() => setRamSizeGb(ram)}
                  className={`py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                    ramSizeGb === ram
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ram}GB
                </button>
              ))}
            </div>
          </div>

          {/* Hibernation Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              Suspend-to-Disk (Hibernate)
            </label>
            <button
              onClick={() => setEnableHibernate(!enableHibernate)}
              className={`w-full py-2 px-3 text-xs font-medium rounded-lg border flex items-center justify-between transition-colors ${
                enableHibernate 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span>{enableHibernate ? 'Hibernate Enabled' : 'Hibernate Disabled'}</span>
              <span className="font-mono text-[11px] opacity-80">
                {enableHibernate ? `Swap: ${calculatedSwapGb}GB` : `Swap: ${calculatedSwapGb}GB`}
              </span>
            </button>
          </div>
        </div>

        {/* Visual Partition Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Visual Partition Table Allocation (Total: {diskSizeGb} GB)</span>
            <span className="font-mono text-[11px] text-cyan-400">GUID Partition Table (GPT)</span>
          </div>

          <div className="w-full h-8 rounded-lg bg-slate-950 border border-slate-800 flex overflow-hidden p-1 gap-1">
            {/* EFI */}
            <div 
              style={{ width: `${Math.max(4, (efiSizeGb / diskSizeGb) * 100)}%` }} 
              className="bg-amber-500/30 border border-amber-500/50 rounded flex items-center justify-center text-[10px] font-mono text-amber-200 font-semibold overflow-hidden px-1"
              title={`/boot/efi (1 GB)`}
            >
              EFI
            </div>

            {/* Root */}
            <div 
              style={{ width: `${Math.max(15, (rootSizeGb / diskSizeGb) * 100)}%` }} 
              className="bg-cyan-500/30 border border-cyan-500/50 rounded flex items-center justify-center text-[10px] font-mono text-cyan-200 font-semibold overflow-hidden px-1"
              title={`/ (${rootSizeGb} GB)`}
            >
              / ({rootSizeGb} GB)
            </div>

            {/* Home (if ext4 separate) */}
            {homeSizeGb > 0 && (
              <div 
                style={{ width: `${Math.max(15, (homeSizeGb / diskSizeGb) * 100)}%` }} 
                className="bg-indigo-500/30 border border-indigo-500/50 rounded flex items-center justify-center text-[10px] font-mono text-indigo-200 font-semibold overflow-hidden px-1"
                title={`/home (${homeSizeGb} GB)`}
              >
                /home ({homeSizeGb} GB)
              </div>
            )}

            {/* Swap */}
            <div 
              style={{ width: `${Math.max(5, (calculatedSwapGb / diskSizeGb) * 100)}%` }} 
              className="bg-purple-500/30 border border-purple-500/50 rounded flex items-center justify-center text-[10px] font-mono text-purple-200 font-semibold overflow-hidden px-1"
              title={`swap (${calculatedSwapGb} GB)`}
            >
              Swap ({calculatedSwapGb}G)
            </div>
          </div>
        </div>

        {/* Partition Details Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Partition Device</th>
                <th className="py-2.5 px-4">Mount Point</th>
                <th className="py-2.5 px-4">Filesystem</th>
                <th className="py-2.5 px-4 text-right">Size</th>
                <th className="py-2.5 px-4">Partition Flags & Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-900/30">
                <td className="py-2.5 px-4 text-amber-300">/dev/nvme0n1p1</td>
                <td className="py-2.5 px-4 text-slate-200">/boot/efi</td>
                <td className="py-2.5 px-4 text-slate-400">FAT32 (vfat)</td>
                <td className="py-2.5 px-4 text-right tabular-nums text-slate-200">1024 MB</td>
                <td className="py-2.5 px-4 text-slate-400 font-sans">boot, esp (UEFI firmware boot loader)</td>
              </tr>
              <tr className="hover:bg-slate-900/30">
                <td className="py-2.5 px-4 text-cyan-300">/dev/nvme0n1p2</td>
                <td className="py-2.5 px-4 text-slate-200">/</td>
                <td className="py-2.5 px-4 text-slate-400">{filesystemType.toUpperCase()}</td>
                <td className="py-2.5 px-4 text-right tabular-nums text-slate-200">{rootSizeGb} GB</td>
                <td className="py-2.5 px-4 text-slate-400 font-sans">
                  {filesystemType === 'btrfs' ? 'Subvolumes @ (root) and @home with zstd:3' : 'Linux root filesystem & binaries'}
                </td>
              </tr>
              {homeSizeGb > 0 && (
                <tr className="hover:bg-slate-900/30">
                  <td className="py-2.5 px-4 text-indigo-300">/dev/nvme0n1p3</td>
                  <td className="py-2.5 px-4 text-slate-200">/home</td>
                  <td className="py-2.5 px-4 text-slate-400">EXT4</td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-slate-200">{homeSizeGb} GB</td>
                  <td className="py-2.5 px-4 text-slate-400 font-sans">User directories, git repos, dotfiles</td>
                </tr>
              )}
              <tr className="hover:bg-slate-900/30">
                <td className="py-2.5 px-4 text-purple-300">
                  {homeSizeGb > 0 ? '/dev/nvme0n1p4' : '/dev/nvme0n1p3'}
                </td>
                <td className="py-2.5 px-4 text-slate-200">[SWAP]</td>
                <td className="py-2.5 px-4 text-slate-400">linux-swap</td>
                <td className="py-2.5 px-4 text-right tabular-nums text-slate-200">{calculatedSwapGb} GB</td>
                <td className="py-2.5 px-4 text-slate-400 font-sans">
                  {enableHibernate ? 'Hibernate resume image + virtual memory' : 'Emergency paging memory'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bootable USB Creation Guide */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Step-by-Step Bootable USB Flashing</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create installation media that boots seamlessly in modern UEFI workstations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Method 1: Ventoy */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">Method 1 (Recommended)</span>
              <h3 className="text-sm font-bold text-slate-200">Ventoy Multi-ISO</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Install Ventoy to your USB once. After that, simply drag-and-drop any Linux ISO onto the flash drive. No reformatting needed!
              </p>
            </div>
            <div className="pt-2">
              <span className="text-xs text-emerald-400 font-mono">Ventoy: Boots UEFI + SecureBoot</span>
            </div>
          </div>

          {/* Method 2: dd terminal command */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Method 2 (Linux / macOS)</span>
              <h3 className="text-sm font-bold text-slate-200">Raw Terminal `dd` Command</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct block copy using standard coreutils. Always verify your drive letter with <code className="text-cyan-300">lsblk</code> first.
              </p>
            </div>
            <div className="pt-2 space-y-2">
              <pre className="p-2 bg-slate-900 rounded text-[11px] font-mono text-cyan-300 overflow-x-auto">
                <code>{currentDistro.usbGuide.ddCommand}</code>
              </pre>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">GNU coreutils (/usr/bin/dd)</span>
                <button
                  onClick={() => handleCopy(currentDistro.usbGuide.ddCommand, 'dd-cmd')}
                  className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {copiedKey === 'dd-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'dd-cmd' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Method 3: Rufus (Windows) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Method 3 (Windows)</span>
              <h3 className="text-sm font-bold text-slate-200">Rufus Configuration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set Partition Scheme to <strong className="text-slate-200">GPT</strong>, Target System to <strong className="text-slate-200">UEFI (non CSM)</strong>, and write in DD Image Mode if prompted.
              </p>
            </div>
            <div className="pt-2">
              <span className="text-xs text-slate-400 font-mono">BIOS Boot Key: F12 / F11 / Del</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Desktop & Wayland Compositor Showcase Graphic */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <span>Display Server & Compositor Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Wayland Protocol</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              The Modern Linux Developer Workstation Experience
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Modern distributions (Fedora, Arch, Ubuntu 24.04) run pure Wayland with tear-free rendering, fractional scaling, PipeWire audio graphs, and dynamic tiling window managers.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1.5 rounded-lg shrink-0">
            <span>Wayland + PipeWire + Vulkan</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
            <img 
              src="/src/assets/images/wayland_desktop_compositor_1793210648772.jpg" 
              alt="Modern Linux Wayland Desktop and Dynamic Tiling Workstation" 
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-5 space-y-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <h3 className="text-sm font-semibold text-slate-200">1. Wayland Protocol Supremacy</h3>
              <p className="text-slate-400 leading-relaxed">
                Replaces legacy 35-year-old X11 with strict client sandboxing, per-monitor mixed refresh rates (e.g. 144Hz + 60Hz), and zero screen tearing by design.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <h3 className="text-sm font-semibold text-slate-200">2. Dynamic Tiling (Hyprland / Sway)</h3>
              <p className="text-slate-400 leading-relaxed">
                Automatic window tree layout tiles code editors, terminals, and web views without overlapping, controlled purely via keyboard shortcuts (Super + H/J/K/L).
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <h3 className="text-sm font-semibold text-slate-200">3. PipeWire Low-Latency Audio</h3>
              <p className="text-slate-400 leading-relaxed">
                Unifies PulseAudio, JACK, and ALSA with sub-5ms pro-audio streaming, Bluetooth LDAC/aptX codecs, and sandboxed screen sharing via WebRTC portals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
