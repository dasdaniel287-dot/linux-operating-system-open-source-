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

      if (cmd === 'clear') {
        setLines([]);
        return;
      } else if (cmd === 'help') {
        response = `Available simulated commands:
  git clone <url>      - Clone a GitHub repository
  cmake -B build       - Configure CMake build files
  make / cargo build   - Compile source code
  gh --version         - Check GitHub CLI
  fastfetch            - Display system hardware & OS info
  cat /etc/os-release  - Display Linux distribution info
  uname -a             - Print Linux kernel version
  ls, pwd, cd, whoami  - Standard filesystem navigation
  clear                - Clear terminal window`;
      } else if (cmd === 'pwd') {
        response = cwd === '~' ? '/home/developer' : `/home/developer/${cwd.replace('~/', '')}`;
      } else if (cmd === 'whoami') {
        response = 'developer';
      } else if (cmd === 'uname -a' || cmd === 'uname -r') {
        response = 'Linux openlinux-station 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
      } else if (cmd === 'cat /etc/os-release') {
        response = `NAME="Ubuntu"
VERSION="24.04 LTS (Noble Numbat)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 24.04 LTS"
VERSION_ID="24.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"`;
      } else if (cmd === 'ls' || cmd === 'ls -la') {
        if (cwd === '~') {
          response = 'Desktop  Documents  Downloads  src  .bashrc  .gitconfig  .ssh';
        } else if (cwd === '~/fastfetch') {
          response = 'build  CMakeLists.txt  LICENSE  README.md  src  tests';
        } else if (cwd === '~/fastfetch/build') {
          response = 'CMakeFiles  cmake_install.cmake  CMakeCache.txt  fastfetch  Makefile';
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
      } else if (cmd === 'gh --version') {
        response = 'gh version 2.58.0 (2024-10-15)\nhttps://github.com/cli/cli/releases/tag/v2.58.0';
      } else if (cmd === 'git --version') {
        response = 'git version 2.43.0';
      } else if (cmd === 'cargo --version') {
        response = 'cargo 1.82.0 (8f40fc59f 2024-09-04)';
      } else if (cmd === 'cmake --version') {
        response = 'cmake version 3.28.3\nCMake suite maintained and supported by Kitware (kitware.com/cmake).';
      } else {
        response = `bash: ${cmd.split(' ')[0]}: command executed in simulated environment. Follow the mission steps or type 'help'.`;
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
              placeholder={currentStep ? currentStep.hint.replace(/^Type:\s*/, '') : 'type command...'}
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
