import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  Coffee,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdaptiveMomentModal() {
  const { 
    showAdaptiveModal, 
    setShowAdaptiveModal, 
    baselinePlan, 
    plan, 
    lostHoursActive, 
    triggerLostHoursAdaptive, 
    resetLostHours,
    isAdaptingAnimation 
  } = useApp();

  if (!showAdaptiveModal) return null;

  // Real data from plannerEngine
  const beforeTimeline = baselinePlan.timeline;
  const afterTimeline = plan.timeline;
  const afterDeferred = plan.deferredTasks;
  const explanation = plan.explanation;

  const handleActivate = () => {
    triggerLostHoursAdaptive();
  };

  const handleReset = () => {
    resetLostHours();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl rounded-3xl bg-[#0f172a] border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] relative overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setShowAdaptiveModal(false)}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Signature Adaptive Moment
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 italic">"Your life changed. Your plan should too."</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
            Life Changed: "I Lost 3 Hours Today"
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Simulate a common student crisis: an unexpected meeting, lab overtime, or commute delay cost you 3 hours. Watch how PULSE recalculates.
          </p>
        </div>

        {/* Action Trigger Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-left w-full sm:w-auto">
            <span className="text-xs text-slate-400 uppercase font-mono tracking-wider block">
              Simulation Trigger
            </span>
            <span className="text-sm font-bold text-white">
              {lostHoursActive ? "3 Hours Lost Mode: ACTIVE" : "Normal Schedule Mode"}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!lostHoursActive ? (
              <button
                onClick={handleActivate}
                disabled={isAdaptingAnimation}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Trigger: "I LOST 3 HOURS"</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Standard Day</span>
              </button>
            )}
          </div>
        </div>

        {/* Adapting Animation Overlay */}
        {isAdaptingAnimation && (
          <div className="p-8 rounded-2xl bg-cyan-950/30 border border-cyan-500/50 text-center my-6 animate-pulse">
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" />
            <h3 className="text-base font-extrabold text-cyan-200 uppercase tracking-widest font-mono">
              ADAPTING YOUR DAY...
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Evaluating deadline urgency, protecting critical milestones, inserting recovery buffers...
            </p>
          </div>
        )}

        {/* Before vs After Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          
          {/* BEFORE CARD */}
          <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
            lostHoursActive ? 'bg-slate-950/40 border-slate-800/80 opacity-70' : 'bg-slate-900/80 border-cyan-500/40 shadow-lg ring-1 ring-cyan-500/30'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                BEFORE (Standard Day)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {baselinePlan.capacityMinutes}m Available
              </span>
            </div>

            <div className="space-y-2">
              {beforeTimeline.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                    item.type === 'break' 
                      ? 'bg-emerald-950/20 text-emerald-300 border border-emerald-500/20' 
                      : 'bg-slate-900 border border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold">{item.title}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">
                    {item.durationMinutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AFTER CARD */}
          <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
            lostHoursActive ? 'bg-slate-900/90 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/40' : 'bg-slate-950/40 border-slate-800 opacity-60'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                AFTER (3 Hours Lost)
              </span>
              <span className="text-[11px] font-mono text-amber-300">
                {plan.capacityMinutes}m Capacity Cap
              </span>
            </div>

            {!lostHoursActive ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Click <strong>"Trigger: I LOST 3 HOURS"</strong> above to calculate the adapted plan.
              </div>
            ) : (
              <div className="space-y-2">
                {/* Scheduled items with change tags */}
                {afterTimeline.map((item) => {
                  let tagText = item.changeStatus || 'SCHEDULED';
                  let tagClass = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

                  if (tagText === 'PROTECTED') {
                    tagClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
                  } else if (tagText === 'REDUCED') {
                    tagClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
                  } else if (tagText === 'PRESERVED') {
                    tagClass = 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
                  }

                  return (
                    <div 
                      key={item.id} 
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                        item.type === 'break' 
                          ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-slate-900 border border-slate-800 text-white'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-[11px] text-slate-400">{item.durationMinutes}m</span>
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${tagClass}`}>
                          {tagText}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Deferred tasks list */}
                {afterDeferred.map((t) => (
                  <div 
                    key={t.id} 
                    className="p-2.5 rounded-xl text-xs flex items-center justify-between bg-rose-950/20 border border-rose-500/30 text-slate-300"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold line-through text-slate-500">{t.subject}: {t.title}</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold shrink-0">
                      TOMORROW
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* SECTION 3: WHY PULSE DECIDED THIS */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#080b11] border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">
              WHY PULSE DECIDED THIS
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Available Time</span>
              <span className="text-base font-bold font-mono text-cyan-300">
                {explanation.availableTime} min
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Workload</span>
              <span className="text-base font-bold font-mono text-white">
                {explanation.workload}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Capacity State</span>
              <span className="text-base font-bold font-mono text-amber-300 truncate block">
                {explanation.capacity}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Urgent Deadlines</span>
              <span className="text-base font-bold font-mono text-rose-400">
                {explanation.urgentDeadlines}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
                ENGINE DECISIONS
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {explanation.decisions.length > 0 ? (
                  explanation.decisions.map((dec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{dec}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">Schedule balanced within standard capacity boundaries.</li>
                )}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
                RATIONALE
              </span>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{explanation.reason}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-2 border-t border-slate-800">
          <button
            onClick={() => setShowAdaptiveModal(false)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
}
