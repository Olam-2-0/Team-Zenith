import React from 'react';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  BookOpen,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Analytics() {
  const { stats, focusHistory, tasks, wellBeing, plan } = useApp();

  const weeklyData = focusHistory.weekly || [];
  const maxWeeklyMinutes = Math.max(...weeklyData.map((d) => d.focusMinutes), 120);

  // Group tasks by subject
  const subjectMap = {};
  tasks.forEach((t) => {
    const s = t.subject || 'General';
    if (!subjectMap[s]) {
      subjectMap[s] = { total: 0, completed: 0, minutes: 0 };
    }
    subjectMap[s].total += 1;
    if (t.completed) subjectMap[s].completed += 1;
    subjectMap[s].minutes += Number(t.estimatedMinutes) || 0;
  });

  const subjects = Object.entries(subjectMap);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" />
              OS Telemetry & Analytics
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-['Outfit']">
            Academic Performance & Workload
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track study volume, consistency streaks, and adaptive workload balancing.
          </p>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Flame className="w-6 h-6 fill-amber-400 animate-bounce" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono">Current Streak</div>
            <div className="text-xl font-extrabold text-white font-mono flex items-baseline gap-1">
              {stats.streak} <span className="text-xs text-amber-400 font-normal">Days In A Row</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Focus Hours */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Study Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {(stats.totalMinutes / 60).toFixed(1)} <span className="text-xs font-sans text-slate-400 font-normal">hrs</span>
          </div>
          <div className="text-[11px] text-cyan-300 font-mono mt-2">
            {stats.totalMinutes} total logged minutes
          </div>
        </div>

        {/* Completion % */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {stats.percent}%
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-2">
            {stats.completed} done / {stats.pending} pending
          </div>
        </div>

        {/* Tasks Processed */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Tasks Logged</span>
            <BookOpen className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {stats.total}
          </div>
          <div className="text-[11px] text-violet-300 font-mono mt-2">
            {stats.completed} successfully finished
          </div>
        </div>

        {/* Workload Protection */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Workload Protection</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            Active
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-2 truncate">
            {plan.moodConfig.label} calibrated
          </div>
        </div>

      </div>

      {/* Main Weekly Productivity Chart */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Weekly Focus Minutes (Mon — Sun)
            </h2>
            <p className="text-xs text-slate-400">
              Interactive review of daily study volumes
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> Focus Minutes
            </span>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-8 pb-2 border-b border-slate-800">
          {weeklyData.map((d, index) => {
            const heightPercent = Math.min(100, Math.max(12, (d.focusMinutes / maxWeeklyMinutes) * 100));
            const isToday = index === 5; // Saturday in demo

            return (
              <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end group relative">
                
                {/* Floating tooltip on hover */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 border border-slate-700 text-[10px] text-cyan-300 font-mono px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-20">
                  {d.focusMinutes}m ({d.completedTasks} tasks)
                </div>

                {/* Bar */}
                <div className="w-full max-w-[42px] bg-slate-800/80 rounded-t-xl overflow-hidden flex flex-col justify-end relative h-full">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-700 ${
                      isToday
                        ? 'bg-gradient-to-t from-cyan-500 to-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-gradient-to-t from-violet-600/70 to-cyan-500/70 group-hover:from-violet-500 group-hover:to-cyan-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day label */}
                <span className={`text-xs font-mono font-semibold ${isToday ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {d.day}
                </span>
                
                {/* Minutes under label */}
                <span className="text-[10px] font-mono text-slate-500 hidden sm:block">
                  {d.focusMinutes}m
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
          <span>Weekly Total: <strong className="text-white font-mono">{weeklyData.reduce((acc, c) => acc + c.focusMinutes, 0)} minutes</strong></span>
          <span>Daily Average: <strong className="text-white font-mono">{Math.round(weeklyData.reduce((acc, c) => acc + c.focusMinutes, 0) / 7)} minutes/day</strong></span>
        </div>
      </div>

      {/* Subject Distribution & Workload Protection Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Subject Breakdown */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Workload by Subject
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {subjects.length} Course Areas
            </span>
          </div>

          {subjects.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No tasks to analyze.</p>
          ) : (
            <div className="space-y-3">
              {subjects.map(([subject, data]) => {
                const percent = stats.total > 0 ? Math.round((data.total / stats.total) * 100) : 0;
                return (
                  <div key={subject} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{subject}</span>
                      <span className="text-slate-400 font-mono">
                        {data.completed}/{data.total} completed ({data.minutes}m)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Workload Protection Info */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-['Outfit']">
              Why PULSE Protects Student Workload
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Standard to-do lists present an endless backlog, triggering cognitive paralysis. PULSE treats time and mental energy as finite physical resources.
          </p>
          <ul className="text-xs text-slate-400 space-y-2 pt-1">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Workload Protection:</strong> Daily capacity shrinks automatically under Low Capacity states.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Scheduled Decompression:</strong> Buffer breaks are built directly into the timeline.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-400 font-bold">•</span>
              <span><strong>Urgent-First Pacing:</strong> Non-urgent tasks are deferred gracefully with zero guilt.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
