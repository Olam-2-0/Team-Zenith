import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sparkles, 
  BookOpen, 
  ChevronDown, 
  Maximize2, 
  Minimize2,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toggleAmbientNoise } from '../utils/soundGenerator';

export default function FocusMode() {
  const { 
    tasks, 
    activeFocusTask, 
    setActiveFocusTask, 
    completeTaskAndLogFocus,
    setActiveTab,
    setIsAddTaskModalOpen
  } = useApp();

  const pendingTasks = tasks.filter((t) => !t.completed);

  // If no task selected, select the first high-priority or pending task
  const currentTask = activeFocusTask || pendingTasks[0] || null;

  // Duration in seconds
  const initialDuration = (currentTask?.estimatedMinutes || 25) * 60;
  const [totalSeconds, setTotalSeconds] = useState(initialDuration);
  const [secondsLeft, setSecondsLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);

  const timerRef = useRef(null);

  // Reset timer whenever active task changes
  useEffect(() => {
    if (currentTask) {
      const dur = (currentTask.estimatedMinutes || 25) * 60;
      setTotalSeconds(dur);
      setSecondsLeft(dur);
      setIsRunning(false);
    }
  }, [currentTask?.id]);

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Ambient sound handler
  const handleToggleSound = () => {
    const newState = !isAmbientPlaying;
    toggleAmbientNoise(newState);
    setIsAmbientPlaying(newState);
  };

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      toggleAmbientNoise(false);
    };
  }, []);

  // Format time mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const handleAdjustMinutes = (deltaMinutes) => {
    const deltaSeconds = deltaMinutes * 60;
    const newTotal = Math.max(300, totalSeconds + deltaSeconds);
    const newLeft = Math.max(0, secondsLeft + deltaSeconds);
    setTotalSeconds(newTotal);
    setSecondsLeft(newLeft);
  };

  const handleComplete = () => {
    setIsRunning(false);
    if (isAmbientPlaying) {
      toggleAmbientNoise(false);
      setIsAmbientPlaying(false);
    }
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsLeft) / 60)) || currentTask?.estimatedMinutes || 25;
    if (currentTask) {
      completeTaskAndLogFocus(currentTask.id, elapsedMinutes);
    }
  };

  // SVG Progress calculation
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Empty state if no pending tasks exist
  if (!currentTask && pendingTasks.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
          <CheckCircle2 className="w-8 h-8 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-2">All Focus Sessions Complete!</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          You've cleared your current academic queue. Great work protecting your momentum.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            Add New Task
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-6 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#080b11] p-8 max-w-none flex flex-col justify-center items-center overflow-y-auto' : ''}`}>
      
      {/* Top Bar / Task Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 w-full max-w-2xl">
        <div className="relative">
          <button
            onClick={() => setShowTaskDropdown(!showTaskDropdown)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Focusing On
              </div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors flex items-center gap-2 truncate max-w-[240px] sm:max-w-[320px]">
                <span>{currentTask.subject}: {currentTask.title}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
            </div>
          </button>

          {/* Task Dropdown Menu */}
          {showTaskDropdown && (
            <div className="absolute left-0 top-full mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 p-2 shadow-2xl z-30">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1">
                Select Task to Focus On:
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1">
                {pendingTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveFocusTask(t);
                      setShowTaskDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                      currentTask.id === t.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate pr-2">{t.subject}: {t.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{t.estimatedMinutes}m</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ambient & Fullscreen Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Ambient Rain / Noise Toggle */}
          <button
            onClick={handleToggleSound}
            title={isAmbientPlaying ? 'Mute ambient focus sound' : 'Enable ambient rain white noise'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              isAmbientPlaying
                ? 'bg-violet-950/40 border-violet-500/60 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAmbientPlaying ? <Volume2 className="w-4 h-4 text-violet-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAmbientPlaying ? 'Ambient Rain ON' : 'Ambient Sound'}</span>
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Focus Centerpiece */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800/80 text-center relative overflow-hidden flex flex-col items-center justify-center max-w-2xl mx-auto shadow-2xl">
        
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Task Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 font-semibold">{currentTask.subject}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 capitalize">{currentTask.priority} Priority</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white max-w-lg mb-2 font-['Outfit']">
          {currentTask.title}
        </h1>

        {currentTask.notes && (
          <p className="text-xs text-slate-400 max-w-md mb-6 italic">
            "{currentTask.notes}"
          </p>
        )}

        {/* Circular Countdown Progress Ring */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-4">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="stroke-slate-800/80"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Active animated progress ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="stroke-cyan-400 transition-all duration-1000 ease-linear drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-extrabold text-white font-mono tracking-tighter drop-shadow-md">
              {formatTime(secondsLeft)}
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[11px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                isRunning ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {isRunning ? 'Flow State Active' : 'Ready to Start'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 font-mono">
              {Math.round(progressPercent)}% elapsed
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-4 mt-4">
          
          {/* Reset */}
          <button
            onClick={handleReset}
            title="Reset timer"
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Start / Pause */}
          <button
            onClick={handleStartPause}
            className={`px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2.5 shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-slate-950" />
                <span>Pause Sprint</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          {/* Complete Early / Finish */}
          <button
            onClick={handleComplete}
            title="Mark task done and log focus time"
            className="px-5 py-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Task</span>
          </button>

        </div>

        {/* Micro Adjusters */}
        <div className="flex items-center gap-2 mt-6 text-xs text-slate-400">
          <span>Adjust time:</span>
          <button
            onClick={() => handleAdjustMinutes(-5)}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono"
          >
            -5m
          </button>
          <button
            onClick={() => handleAdjustMinutes(5)}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono"
          >
            +5m
          </button>
          <button
            onClick={() => {
              setTotalSeconds(25 * 60);
              setSecondsLeft(25 * 60);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono"
          >
            Pomodoro (25m)
          </button>
        </div>

        {/* Motivational Neuro-Pacing Note */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 w-full flex items-center justify-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Single-tasking preserves cognitive stamina. Focus strictly on this one block.</span>
        </div>

      </div>

    </div>
  );
}
