import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Flame, 
  Play, 
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  Coffee,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import WellBeingWidget from './WellBeingWidget';
import AdaptiveLoopStrip from './AdaptiveLoopStrip';
import { getDaysUntil } from '../utils/plannerEngine';

export default function Dashboard() {
  const { 
    user, 
    tasks, 
    plan, 
    stats, 
    toggleTaskComplete, 
    startFocusOnTask, 
    setActiveTab, 
    setIsAddTaskModalOpen,
    wellBeing,
    loadJudgeDemo,
    lostHoursActive,
    setShowAdaptiveModal,
    setShowWhatIfModal,
    resetLostHours
  } = useApp();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Sorted upcoming deadlines
  const sortedUpcoming = [...tasks]
    .filter((t) => !t.completed)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Hackathon Judge Interactive Guide Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-cyan-950/40 via-violet-950/40 to-slate-900 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.12)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Judge Demo Guide
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                Core Story & Adaptive Moment
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5 font-medium">
              1. Click <strong className="text-amber-300">"Load Judge Demo"</strong>.
              2. Add a task to see <strong className="text-cyan-300">Auto-Schedule</strong>.
              3. Trigger <strong className="text-amber-300">"I Lost 3 Hours"</strong> to see Before → After recalculation.
              4. Check in as <strong className="text-rose-300">"Low Capacity"</strong> for workload protection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAdaptiveModal(true)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>I Lost 3 Hours</span>
          </button>

          <button
            onClick={loadJudgeDemo}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Tasks</span>
          </button>
        </div>
      </div>

      {/* Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1 flex items-center gap-2">
            <span>{today}</span>
            <span>•</span>
            <span className="text-slate-400">{user.major || 'Undergraduate'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            "Most productivity apps plan your ideal day. PULSE plans for your real day."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowWhatIfModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>What-If</span>
          </button>

          <button
            onClick={() => setActiveTab('focus')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span>Focus Mode</span>
          </button>

          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Adaptive Loop Strip */}
      <AdaptiveLoopStrip />

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Completion Card */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Daily Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{stats.percent}%</span>
            <span className="text-[11px] text-slate-400">
              ({stats.completed}/{stats.total} tasks)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500" 
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>

        {/* Focus Time Card */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Focus Time Today</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {stats.todayMinutes}m
            </span>
            <span className="text-[11px] text-slate-400">
              ({(stats.todayMinutes / 60).toFixed(1)} hrs)
            </span>
          </div>
          <div className="text-[11px] text-cyan-400 font-mono mt-3 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Target: {plan.capacityMinutes}m max</span>
          </div>
        </div>

        {/* Streak Card */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Consistency Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{stats.streak} Days</span>
            <span className="text-[11px] text-amber-300 font-semibold">Active 🔥</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-3">
            Top 10% study discipline
          </div>
        </div>

        {/* Current Capacity State Card */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Workload Capacity</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{plan.moodConfig.emoji}</span>
            <span className="text-base font-bold text-white truncate">
              {plan.moodConfig.label}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 truncate">
            {plan.moodConfig.breakMinutes}m buffer breaks
          </div>
        </div>

      </div>

      {/* Capacity Check-in (formerly Well-being) */}
      <WellBeingWidget />

      {/* Main Grid: Recommended Schedule & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Today's Smart Recommended Plan (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Today's Recommended Priority Tasks
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {lostHoursActive && (
                <button
                  onClick={resetLostHours}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset (-3h)
                </button>
              )}
              <button
                onClick={() => setActiveTab('planner')}
                className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition-colors"
              >
                <span>View Timed Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {pendingTasks.length === 0 ? (
            /* Empty State */
            <div className="glass-panel rounded-2xl p-10 text-center border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No tasks currently queued!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                Add an assignment or test the judge demo story to see how PULSE auto-generates your schedule.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={loadJudgeDemo}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md"
                >
                  Load Judge Demo
                </button>
                <button
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md"
                >
                  Add Custom Task
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {plan.scheduledTasks.map((task) => {
                const days = getDaysUntil(task.deadline);
                const isUrgent = days <= 1;
                const isHigh = task.priority === 'high';
                const tag = task.changeStatus;

                let badgeColor = 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300';
                if (tag === 'PROTECTED') badgeColor = 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300';
                else if (tag === 'REDUCED') badgeColor = 'bg-amber-950/60 border-amber-500/50 text-amber-300';

                return (
                  <div
                    key={task.id}
                    className="glass-card-interactive rounded-2xl p-4 sm:p-5 border border-slate-800 group relative"
                  >
                    <div className="flex items-start justify-between gap-3">
                      
                      {/* Checkbox & Task details */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          title="Mark task completed"
                          className="mt-1 w-5 h-5 rounded-lg border border-slate-700 hover:border-cyan-400 flex items-center justify-center text-transparent hover:text-cyan-400 transition-colors shrink-0"
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {task.subject}
                            </span>

                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                              isHigh
                                ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                                : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                            }`}>
                              {task.priority} Priority
                            </span>

                            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              {task.effectiveDuration || task.estimatedMinutes}m
                            </span>

                            {isUrgent && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                {days === 0 ? 'Due Today' : 'Due Tomorrow'}
                              </span>
                            )}

                            {lostHoursActive && tag && (
                              <span className={`text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 rounded border ${badgeColor}`}>
                                {tag}
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors truncate">
                            {task.title}
                          </h3>

                          {task.notes && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                              {task.notes}
                            </p>
                          )}

                          {/* Recommendation reason line */}
                          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-cyan-300/90 font-medium">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{task.reason}</span>
                          </div>
                        </div>
                      </div>

                      {/* Launch Focus Button */}
                      <button
                        onClick={() => startFocusOnTask(task)}
                        className="shrink-0 p-2.5 sm:px-3 sm:py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:scale-105 active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span className="hidden sm:inline">Focus</span>
                      </button>

                    </div>
                  </div>
                );
              })}

              {/* Show deferred summary if tasks are deferred */}
              {plan.deferredTasks.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>
                    ℹ️ <strong>{plan.deferredTasks.length} task(s)</strong> deferred to protect your focus bandwidth.
                  </span>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    View in Planner →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Completed Today Section */}
          {completedTasks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Completed Sessions ({completedTasks.length})
              </h3>
              <div className="space-y-1.5">
                {completedTasks.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-850 flex items-center justify-between text-xs text-slate-400"
                  >
                    <span className="line-through text-slate-500 truncate max-w-sm">
                      {t.subject}: {t.title}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      +{t.estimatedMinutes}m logged
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Deadlines & Quick Calendar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              Deadlines Queue
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {sortedUpcoming.length} pending
            </span>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
            {sortedUpcoming.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No upcoming deadlines.</p>
            ) : (
              sortedUpcoming.map((item) => {
                const days = getDaysUntil(item.deadline);
                let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
                let label = `In ${days} days`;

                if (days < 0) {
                  badgeColor = 'bg-rose-950/80 text-rose-300 border-rose-500/50';
                  label = 'Overdue';
                } else if (days === 0) {
                  badgeColor = 'bg-rose-950/80 text-rose-300 border-rose-500/50';
                  label = 'Today';
                } else if (days === 1) {
                  badgeColor = 'bg-amber-950/80 text-amber-300 border-amber-500/50';
                  label = 'Tomorrow';
                }

                return (
                  <div 
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-200 truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.subject} • {item.estimatedMinutes}m
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${badgeColor}`}>
                      {label}
                    </span>
                  </div>
                );
              })
            )}

            {/* Quick Action Button */}
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="w-full mt-2 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Deadline</span>
            </button>
          </div>

          {/* Workload Protection Card */}
          <div className="glass-panel rounded-2xl p-4 border border-violet-500/20 bg-gradient-to-br from-violet-950/20 to-slate-900">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Workload Protection
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              PULSE caps uninterrupted focus blocks at 120 minutes to preserve executive function and prevent late-night study panic.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
