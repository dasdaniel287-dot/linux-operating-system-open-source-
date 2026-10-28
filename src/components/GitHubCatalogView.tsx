import React, { useState, useMemo } from 'react';
import { OPEN_SOURCE_PROJECTS, OpenSourceProject, CategoryId } from '../data/openSourceProjects';
import { 
  Search, 
  ExternalLink, 
  Star, 
  Copy, 
  Check, 
  Terminal, 
  X, 
  Wrench, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface GitHubCatalogViewProps {
  onSimulateInTerminal?: (project: OpenSourceProject) => void;
}

const CATEGORIES: { id: CategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'All Open Source' },
  { id: 'cli-tools', label: 'CLI Tools' },
  { id: 'system-monitors', label: 'System Monitors' },
  { id: 'ai-dev', label: 'AI & Local LLMs' },
  { id: 'editors-dev', label: 'Editors & IDEs' },
  { id: 'containers-devops', label: 'Containers & DevOps' },
  { id: 'shells-terminals', label: 'Shells & Prompts' }
];

export const GitHubCatalogView: React.FC<GitHubCatalogViewProps> = ({ onSimulateInTerminal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedDistro, setSelectedDistro] = useState<'ubuntu' | 'fedora' | 'arch' | 'alpine'>('ubuntu');
  const [activeProject, setActiveProject] = useState<OpenSourceProject | null>(null);
  const [installMethod, setInstallMethod] = useState<'source' | 'release' | 'package'>('source');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredProjects = useMemo(() => {
    return OPEN_SOURCE_PROJECTS.filter(project => {
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.repo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <span>Curated Open-Source Directory</span>
            <span aria-hidden="true">·</span>
            <span>Linux Verified</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
            GitHub Open-Source Software for Linux
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Direct recipes to compile from source, pull latest GitHub release binaries, or install via native package managers across Ubuntu, Fedora, Arch, and Alpine.
          </p>
        </div>

        {/* Distro Quick Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 shrink-0">
          <span className="text-xs text-slate-400 px-2 font-medium">Target Distro:</span>
          {(['ubuntu', 'fedora', 'arch', 'alpine'] as const).map(d => (
            <button
              key={d}
              onClick={() => setSelectedDistro(d)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                selectedDistro === d
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, repo (e.g. 'fastfetch', 'neovim', 'BurntSushi/ripgrep')..."
            className="w-full bg-slate-900/60 border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors"
          />
        </div>

        {/* Category Filter Buttons (Functional Segmented Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 border-cyan-400/40 text-cyan-300 font-semibold'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map(project => {
          const quickInstall = project.installViaPackage[selectedDistro] || project.installFromRelease[0];
          return (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-150"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                      <span>{project.repo}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-300 font-mono bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{(project.stars / 1000).toFixed(1)}k</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span className="capitalize">{project.buildSystem} build</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.license}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-medium group-hover:underline flex items-center gap-1">
                  <span>View Install Recipes</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {project.binaryPath}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal / Drawer */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>{activeProject.license} License</span>
                  <span aria-hidden="true">·</span>
                  <span>{(activeProject.stars).toLocaleString()} GitHub Stars</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{activeProject.buildSystem} Toolchain</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mt-1">{activeProject.name}</h2>
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline mt-1 font-mono"
                >
                  <span>github.com/{activeProject.repo}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                onClick={() => setActiveProject(null)}
                className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Why use it */}
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4 text-xs text-cyan-200">
              <strong className="block font-semibold mb-1 text-cyan-300">Why Use {activeProject.name}?</strong>
              <p className="leading-relaxed">{activeProject.whyUseIt}</p>
            </div>

            {/* Distro Prerequisites */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300 uppercase tracking-wider">
                  Prerequisites ({selectedDistro.toUpperCase()})
                </span>
                <button
                  onClick={() => handleCopy(activeProject.prerequisites[selectedDistro], 'prereq')}
                  className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {copiedKey === 'prereq' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'prereq' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-amber-300 overflow-x-auto">
                <code>{activeProject.prerequisites[selectedDistro]}</code>
              </pre>
            </div>

            {/* Install Method Tabs */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setInstallMethod('source')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    installMethod === 'source'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Compile From Source (Git + {activeProject.buildSystem})
                </button>
                <button
                  onClick={() => setInstallMethod('release')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    installMethod === 'release'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  GitHub Release Binary (Curl / Tar)
                </button>
                <button
                  onClick={() => setInstallMethod('package')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    installMethod === 'package'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Package Manager ({selectedDistro})
                </button>
              </div>

              {/* Code Panel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Run these commands in your Linux bash terminal:</span>
                  <button
                    onClick={() => {
                      const text = installMethod === 'source'
                        ? activeProject.installFromSource.join('\n')
                        : installMethod === 'release'
                        ? activeProject.installFromRelease.join('\n')
                        : activeProject.installViaPackage[selectedDistro];
                      handleCopy(text, 'install');
                    }}
                    className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {copiedKey === 'install' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'install' ? 'Copied' : 'Copy Commands'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  <code>
                    {installMethod === 'source' && activeProject.installFromSource.join('\n')}
                    {installMethod === 'release' && activeProject.installFromRelease.join('\n')}
                    {installMethod === 'package' && activeProject.installViaPackage[selectedDistro]}
                  </code>
                </pre>
              </div>
            </div>

            {/* Verification & Uninstall info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <span className="text-slate-400 block font-medium">Verify Installation</span>
                <code className="text-emerald-400 font-mono block overflow-x-auto">{activeProject.verifyCommand}</code>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <span className="text-slate-400 block font-medium">Uninstall Command</span>
                <code className="text-rose-400 font-mono block overflow-x-auto">{activeProject.uninstallCommand}</code>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-mono">
                Installs to: {activeProject.binaryPath}
              </span>
              <button
                onClick={() => {
                  if (onSimulateInTerminal) {
                    onSimulateInTerminal(activeProject);
                    setActiveProject(null);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Simulate in Terminal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
