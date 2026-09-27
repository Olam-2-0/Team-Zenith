import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Coffee, 
  ShieldCheck, 
  Info, 
  ChevronRight,
  Zap,
  Play,
  Sliders,
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import AdaptiveLoopStrip from './AdaptiveLoopStrip';

export default function SmartPlanner() {
  const { 
    plan, 
    wellBeing, 
    startFocusOnTask, 
    toggleTaskComplete, 
    setIsAddTaskModalOpen,
    tasks,
    lostHoursActive,
    setShowAdaptiveModal,
    setShowWhatIfModal,
    resetLostHours
  } = useApp();

  const { 
    timeline, 
    scheduledTasks, 
    deferredTasks, 
    moodConfig, 
    totalStudyTime, 
    totalBreakTime, 
    capacityMinutes, 
    capacityUsedPercent,
    explanation,
    isExamMode
  } = plan;

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner with Tagline & Quick Action Triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
            ADAPTIVE INTELLIGENT PLANNER
          </span>
          <p className="text-xs text-slate-300 italic">
            "Your life changed. Your plan should too."
          </p>
        </div>

        {/* Quick Signature Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdaptiveModal(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              lostHoursActive
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/40 hover:from-amber-500/30 hover:to-rose-500/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{lostHoursActive ? '3h Lost (Active)' : 'Lost 3 Hours?'}</span>
          </button>

          <button
            onClick={() => setShowWhatIfModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>What-If</span>
          </button>
        </div>
      </div>

      {/* Visual Adaptive Loop Strip */}
      <AdaptiveLoopStrip />

      {/* Top Planner Engine Status Card */}
      <div className={`glass-panel-glow rounded-3xl p-6 border transition-all relative overflow-hidden ${
        lostHoursActive || wellBeing.mood === 'low' || wellBeing.mood === 'stressed'
          ? 'border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
          : 'border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Adaptive Planning Engine
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-white">
                {moodConfig.emoji} {moodConfig.label}
              </span>
              {lostHoursActive && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  -3h Lost Adapted
                </span>
              )}
              {isExamMode && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  Exam Mode
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white font-['Outfit']">
              Today's Recommended Timed Schedule
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {lostHoursActive
                ? "Schedule dynamically adapted to preserve high-urgency milestones and protect mental bandwidth after losing 3 hours."
                : moodConfig.modeDescription}
            </p>
          </div>

          {/* Daily Cognitive Capacity Gauge */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 min-w-[240px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Daily Workload:</span>
              <span className="font-mono font-bold text-white">
                {totalStudyTime}m / {capacityMinutes}m max
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  capacityUsedPercent > 95
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : 'bg-gradient-to-r from-cyan-400 to-violet-500'
                }`}
                style={{ width: `${Math.min(100, capacityUsedPercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
              <span>{timeline.filter(t => t.type === 'task').length} Study Blocks</span>
              <span>{timeline.filter(t => t.type === 'break').length} Recovery Buffers</span>
            </div>
          </div>
        </div>

        {/* Workload Protection banner */}
        {(lostHoursActive || wellBeing.mood === 'low' || wellBeing.mood === 'stressed') && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Workload Protection Engaged:</strong> Non-urgent tasks are shifted to tomorrow so you can focus strictly on high-priority deadlines without cognitive overload.
              </span>
            </div>
            {lostHoursActive && (
              <button
                onClick={resetLostHours}
                className="shrink-0 text-slate-300 hover:text-white font-mono text-[11px] underline"
              >
                Reset (-3h)
              </button>
            )}
          </div>
        )}
      </div>

      {/* SECTION 3: COMPACT "WHY PULSE DECIDED THIS" PANEL */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              WHY PULSE DECIDED THIS
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Real-time planning factors
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Available Time</span>
            <span className="text-sm font-bold font-mono text-cyan-300">{explanation.availableTime} min</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Workload</span>
            <span className="text-sm font-bold font-mono text-white">{explanation.workload}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Capacity</span>
            <span className="text-sm font-bold font-mono text-amber-300 truncate block">{explanation.capacity}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Urgent Deadlines</span>
            <span className="text-sm font-bold font-mono text-rose-400">{explanation.urgentDeadlines}</span>
          </div>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
          <strong className="text-cyan-400">Decision Rationale: </strong>
          <span>"{explanation.reason}"</span>
        </div>
      </div>

      {/* Main Schedule Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Timed Daily Execution Timeline
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {scheduledTasks.length} tasks scheduled • {totalStudyTime}m study • {totalBreakTime}m rest
          </span>
        </div>

        {timeline.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No tasks scheduled for today</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              {pendingCount === 0 
                ? "You're all caught up! Add a new task to generate your next study schedule."
                : "All current tasks are deferred or complete."}
            </p>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all"
            >
              Add New Task
            </button>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-6 my-2">
            {timeline.map((item) => {
              if (item.type === 'task') {
                const task = item.task;
                const isHigh = task.priority === 'high';
                const isMedium = task.priority === 'medium';
                const tag = item.changeStatus || (isHigh ? 'PROTECTED' : 'SCHEDULED');

                let badgeColor = 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300';
                if (tag === 'PROTECTED') badgeColor = 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300';
                else if (tag === 'REDUCED') badgeColor = 'bg-amber-950/60 border-amber-500/50 text-amber-300';

                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full bg-[#080b11] border-2 border-cyan-400 group-hover:scale-125 transition-transform flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>

                    {/* Task Card */}
                    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 hover:border-cyan-500/40 transition-all group-hover:translate-x-1 duration-200">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        {/* Time Slot Header */}
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">
                            {item.startTime} — {item.endTime}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ({item.durationMinutes} mins)
                          </span>
                        </div>

                        {/* Priority, Subject & Adaptive Status Badges */}
                        <div className="flex items-center gap-1.5 self-start sm:self-auto">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            {task.subject}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                            isHigh
                              ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                              : isMedium
                              ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}>
                            {task.priority} Priority
                          </span>
                          {lostHoursActive && (
                            <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                              {tag}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Notes */}
                      <h3 className="text-base font-bold text-white mb-1">
                        {task.title}
                      </h3>
                      {task.notes && (
                        <p className="text-xs text-slate-400 mb-2.5">
                          {task.notes}
                        </p>
                      )}

                      {/* Engine Rationale Line */}
                      <div className="flex items-center gap-1.5 text-xs text-cyan-200/90 bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-800/30 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="font-medium">{item.reason}</span>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Finished</span>
                        </button>

                        <button
                          onClick={() => startFocusOnTask(task)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95"
                        >
                          <Play className="w-3 h-3 fill-slate-950" />
                          <span>Start Focus Sprint</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              }

              // Break Block
              return (
                <div key={item.id} className="relative">
                  {/* Timeline Break Node */}
                  <div className="absolute -left-[30px] sm:-left-[38px] top-3 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  </div>

                  {/* Break Card */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-slate-900/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                        <Coffee className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-300">
                            {item.title}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {item.startTime} — {item.endTime} ({item.durationMinutes}m)
                          </span>
                          {lostHoursActive && (
                            <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                              PRESERVED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {item.advice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deferred Tasks Section (Shows capacity protection in action) */}
      {deferredTasks.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white font-['Outfit']">
                Deferred for Tomorrow ({deferredTasks.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Paced to protect your cognitive stamina
            </span>
          </div>

          <div className="space-y-2">
            {deferredTasks.map((t) => (
              <div 
                key={t.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300">
                      {t.subject}: {t.title}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {t.estimatedMinutes}m
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                      DEFERRED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {t.deferReason || `Due in ${t.daysUntil} days • Deferred by planning algorithm.`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startFocusOnTask(t)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/30 transition-colors"
                  >
                    Study Anyway
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
