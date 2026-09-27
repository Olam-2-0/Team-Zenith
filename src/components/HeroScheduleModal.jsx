import React from 'react';
import { Sparkles, Calendar, Clock, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HeroScheduleModal() {
  const { heroScheduledResult, setHeroScheduledResult, setActiveTab } = useApp();

  if (!heroScheduledResult) return null;

  const { task, scheduledTimeText, reasonText, isDeferred, capacityLabel } = heroScheduledResult;

  const handleViewInPlanner = () => {
    setHeroScheduledResult(null);
    setActiveTab('planner');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-3xl bg-[#0f172a] border border-cyan-500/40 p-6 sm:p-7 shadow-[0_0_40px_rgba(6,182,212,0.25)] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setHeroScheduledResult(null)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Auto-Schedule Complete
            </div>
            <h2 className="text-lg font-bold text-white font-['Outfit']">
              Task Integrated Into Your Day
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Task added — PULSE scheduled it around your deadline, workload and available capacity.
        </p>

        {/* Task Card Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-400">{task.subject}</span>
            <span className="font-mono text-cyan-300">{task.estimatedMinutes} mins</span>
          </div>
          <div className="text-sm font-bold text-white truncate">
            {task.title}
          </div>
        </div>

        {/* Hero Scheduled For Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 mb-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              SCHEDULED FOR
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {capacityLabel}
            </span>
          </div>
          <div className="text-base font-extrabold text-white font-mono">
            {scheduledTimeText}
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              WHY
            </span>
            <p className="text-xs text-cyan-200/90 leading-relaxed font-medium">
              "{reasonText}"
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={() => setHeroScheduledResult(null)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={handleViewInPlanner}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <span>View in Smart Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
