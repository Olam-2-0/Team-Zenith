import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Shuffle, 
  RotateCw, 
  HelpCircle, 
  CheckCircle2, 
  Cpu, 
  Bot, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AdaptiveLoopStrip() {
  const [showHowItThinks, setShowHowItThinks] = useState(false);

  const loopSteps = [
    { label: 'ADD TASK', icon: PlusCircle, color: 'text-cyan-400' },
    { label: 'AUTO-SCHEDULE', icon: Sparkles, color: 'text-violet-400' },
    { label: 'LIFE CHANGES', icon: Shuffle, color: 'text-amber-400' },
    { label: 'ADAPT', icon: RotateCw, color: 'text-rose-400' },
    { label: 'EXPLAIN', icon: HelpCircle, color: 'text-cyan-400' },
    { label: 'COMPLETE / MISS', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'REPLAN', icon: RotateCw, color: 'text-violet-400' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
      
      {/* Top Banner Tagline & Expand Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              THE PULSE ADAPTIVE LOOP
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              Core Architecture
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 italic">
            "Most productivity apps plan your ideal day. PULSE plans for your real day."
          </p>
        </div>

        <button
          onClick={() => setShowHowItThinks(!showHowItThinks)}
          className="self-start sm:self-auto text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 transition-colors"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>{showHowItThinks ? 'Hide Engine Architecture' : 'How PULSE Thinks'}</span>
          {showHowItThinks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Visual Horizontal Adaptive Loop */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
        {loopSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.label}>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono whitespace-nowrap shadow-sm">
                <Icon className={`w-3.5 h-3.5 ${step.color} shrink-0`} />
                <span className="font-semibold text-slate-200">{step.label}</span>
              </div>
              {idx < loopSteps.length - 1 && (
                <span className="text-slate-600 font-bold text-xs shrink-0 select-none">
                  →
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Collapsible: How PULSE Thinks (Section 6) */}
      {showHowItThinks && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* AI Layer */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-violet-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-violet-300 font-bold uppercase tracking-wider font-mono">
                <Bot className="w-4 h-4 text-violet-400" />
                AI Understanding Layer
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Handles natural-language task understanding, course decomposition, and human-friendly rationale generation.
              </p>
              <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
                <li>• Parses assignments and course syllabi</li>
                <li>• Suggests realistic sprint estimates</li>
                <li>• Generates contextual "Why this task now" explanations</li>
              </ul>
            </div>

            {/* Deterministic Planning Engine */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-wider font-mono">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Deterministic Planning Engine
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Zero hallucinations. Mathematical constraint satisfaction ensures your day is realistic and physically feasible.
              </p>
              <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
                <li>• Strictly respects daily capacity limits (e.g. 120m / 240m)</li>
                <li>• Evaluates deadline proximity & priority weighting</li>
                <li>• Automatically inserts non-negotiable recovery breaks</li>
                <li>• Dynamically defers lower-priority tasks when hours are lost</li>
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
