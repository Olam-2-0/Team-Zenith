import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Zap, BatteryLow, Coffee, Sparkles, Sliders } from 'lucide-react';
import { MOOD_CONFIGS } from '../utils/plannerEngine';

export default function WellBeingWidget() {
  const { wellBeing, updateMood, setShowAdaptiveModal, setShowWhatIfModal } = useApp();

  const capacities = [
    {
      id: 'high',
      altId: 'good',
      label: 'High Capacity',
      emoji: '⚡',
      subtitle: 'Full Battery',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300',
      activeBorder: 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400',
      icon: Zap,
    },
    {
      id: 'balanced',
      altId: 'okay',
      label: 'Balanced Capacity',
      emoji: '⚖️',
      subtitle: 'Steady Pacing',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-300',
      activeBorder: 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400',
      icon: Coffee,
    },
    {
      id: 'low',
      altId: 'stressed',
      label: 'Low Capacity',
      emoji: '🛡️',
      subtitle: 'Workload Protection',
      color: 'from-rose-500/20 to-amber-500/10 border-rose-500/40 text-rose-300',
      activeBorder: 'border-rose-400 bg-rose-950/50 shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-1 ring-rose-400',
      icon: ShieldCheck,
    },
    {
      id: 'very_low',
      altId: 'tired',
      label: 'Very Low Capacity',
      emoji: '🔋',
      subtitle: 'Minimal Load',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300',
      activeBorder: 'border-amber-400 bg-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400',
      icon: BatteryLow,
    },
  ];

  const currentConfig = MOOD_CONFIGS[wellBeing.mood] || MOOD_CONFIGS.high;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 relative overflow-hidden transition-all duration-300">
      
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none rounded-tr-2xl" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-['Outfit']">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Capacity Check-in
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              Workload Pacing • Non-Medical
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            What is your available cognitive bandwidth today? PULSE calibrates your daily schedule capacity and buffer intervals.
          </p>
        </div>

        {/* Current State Summary Pill & Quick Triggers */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAdaptiveModal(true)}
            className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>Lost 3 Hours?</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs">
            <span className="text-sm">{currentConfig.emoji}</span>
            <span className="font-semibold text-slate-200">{currentConfig.label}</span>
          </div>
        </div>
      </div>

      {/* Capacity Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {capacities.map((c) => {
          const isSelected = wellBeing.mood === c.id || wellBeing.mood === c.altId;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => updateMood(c.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${
                isSelected
                  ? c.activeBorder
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-2xl transform group-hover:scale-110 transition-transform">
                  {c.emoji}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-40'}`} />
              </div>

              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {c.label}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {c.subtitle}
                </div>
              </div>

              {isSelected && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-[#080b11]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Engine Adaptation Banner */}
      <div className={`mt-3.5 p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
        wellBeing.mood === 'low' || wellBeing.mood === 'stressed'
          ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
          : wellBeing.mood === 'very_low' || wellBeing.mood === 'tired'
          ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
          : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
      }`}>
        <div className="p-1 rounded bg-black/40 border border-white/10 shrink-0 mt-0.5">
          {wellBeing.mood === 'low' || wellBeing.mood === 'stressed' ? (
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold tracking-tight text-white mb-0.5">
            {currentConfig.modeDescription}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
            <span>
              Target study capacity: <strong className="text-white">{currentConfig.maxStudyMinutes} mins</strong>
            </span>
            <span>•</span>
            <span>
              Decompression breaks: <strong className="text-white">{currentConfig.breakMinutes} mins</strong>
            </span>
            <span>•</span>
            <span>{currentConfig.breakAdvice}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
