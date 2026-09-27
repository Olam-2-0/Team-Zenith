import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Clock, 
  Flame, 
  BookOpen, 
  Coffee, 
  X, 
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateDailyPlan } from '../utils/plannerEngine';

export default function WhatIfModal() {
  const { 
    showWhatIfModal, 
    setShowWhatIfModal, 
    tasks, 
    wellBeing, 
    whatIfMinutes, 
    setWhatIfMinutes,
    examModeActive, 
    setExamModeActive 
  } = useApp();

  const [simMinutes, setSimMinutes] = useState(whatIfMinutes || 180);
  const [localExamMode, setLocalExamMode] = useState(examModeActive);
  const [localRecoveryMode, setLocalRecoveryMode] = useState(false);

  if (!showWhatIfModal) return null;

  // Run actual planner engine with simulated inputs
  const simulatedPlan = generateDailyPlan(tasks, wellBeing.mood, null, {
    availableTimeOverride: simMinutes,
    examMode: localExamMode,
    recoveryMode: localRecoveryMode,
  });

  const handleApply = () => {
    setWhatIfMinutes(simMinutes);
    setExamModeActive(localExamMode);
    setShowWhatIfModal(false);
  };

  const handleReset = () => {
    setSimMinutes(180);
    setLocalExamMode(false);
    setLocalRecoveryMode(false);
    setWhatIfMinutes(null);
    setExamModeActive(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-3xl bg-[#0f172a] border border-cyan-500/40 p-6 sm:p-7 shadow-[0_0_40px_rgba(6,182,212,0.2)] relative overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setShowWhatIfModal(false)}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-violet-400" />
              Scenario Simulator
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit']">
            What-If Schedule Simulator & Exam Mode
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test different available time budgets, exam cram conditions, and recovery pacing.
          </p>
        </div>

        {/* Controls Section */}
        <div className="space-y-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-5">
          
          {/* Available Time Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Available Study Time: <strong className="text-cyan-300 font-mono text-sm">{simMinutes} mins</strong> ({(simMinutes / 60).toFixed(1)} hrs)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {simMinutes >= 240 ? 'Heavy Load' : simMinutes <= 90 ? 'Constrained' : 'Balanced'}
              </span>
            </div>
            <input 
              type="range"
              min="45"
              max="300"
              step="15"
              value={simMinutes}
              onChange={(e) => setSimMinutes(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            {/* Quick presets */}
            <div className="flex gap-2 mt-2">
              {[60, 120, 180, 240].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSimMinutes(mins)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                    simMinutes === mins
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 font-bold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {mins}m ({mins / 60}h)
                </button>
              ))}
            </div>
          </div>

          {/* Mode Toggles: Exam Mode & Recovery Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            {/* Exam Mode Toggle */}
            <button
              onClick={() => setLocalExamMode(!localExamMode)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                localExamMode
                  ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  Exam Mode
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Prioritizes high-weight exams & deadlines
                </div>
              </div>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                localExamMode ? 'bg-rose-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {localExamMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Recovery Buffer Mode */}
            <button
              onClick={() => setLocalRecoveryMode(!localRecoveryMode)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                localRecoveryMode
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-emerald-400" />
                  Recovery Buffers
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Inserts 25m decompression blocks
                </div>
              </div>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                localRecoveryMode ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {localRecoveryMode ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

        </div>

        {/* Live Simulated Result Output */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Simulated Schedule Output
            </span>
            <span className="text-xs font-mono text-slate-400">
              {simulatedPlan.scheduledTasks.length} scheduled • {simulatedPlan.deferredTasks.length} deferred
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            {simulatedPlan.timeline.map((item) => (
              <div 
                key={item.id}
                className={`p-2 rounded-xl text-xs flex items-center justify-between ${
                  item.type === 'break'
                    ? 'bg-emerald-950/20 text-emerald-300 border border-emerald-500/20'
                    : 'bg-slate-900 border border-slate-800 text-white'
                }`}
              >
                <div className="truncate pr-2">
                  <span className="font-mono text-cyan-300 mr-2">{item.startTime}</span>
                  <span className="font-semibold">{item.title}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400 shrink-0">
                  {item.durationMinutes}m
                </span>
              </div>
            ))}

            {simulatedPlan.deferredTasks.length > 0 && (
              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                <span className="font-bold text-amber-300">Deferred to Tomorrow: </span>
                {simulatedPlan.deferredTasks.map(t => `${t.subject}: ${t.title}`).join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulation</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWhatIfModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95"
            >
              Apply Simulation to Plan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
