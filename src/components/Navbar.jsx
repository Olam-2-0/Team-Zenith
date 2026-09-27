import React from 'react';
import { 
  Activity, 
  Calendar, 
  Clock, 
  BarChart3, 
  Plus, 
  Sparkles, 
  RotateCcw, 
  User as UserIcon,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { 
    activeTab, 
    setActiveTab, 
    setIsAddTaskModalOpen, 
    setIsAuthModalOpen, 
    user, 
    loadJudgeDemo, 
    resetAllData,
    stats,
    wellBeing
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'planner', label: 'Smart Planner', icon: Calendar, badge: 'Adaptive' },
    { id: 'focus', label: 'Focus Mode', icon: Clock },
    { id: 'analytics', label: 'Progress & OS', icon: BarChart3 },
  ];

  const moodEmojis = {
    high: '⚡',
    balanced: '⚖️',
    low: '🛡️',
    very_low: '🔋',
    good: '⚡',
    okay: '⚖️',
    stressed: '🛡️',
    tired: '🔋',
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080b11]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <span className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="relative w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-xl bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent font-['Outfit']">
                  PULSE
                </span>
                <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-700/40 text-cyan-300 font-semibold uppercase">
                  OS v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight font-medium hidden sm:block">
                Adaptive Student Life OS
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Judge Actions & User Profile */}
          <div className="flex items-center gap-2">
            
            {/* Judge Demo Fast-Track button */}
            <button
              onClick={loadJudgeDemo}
              title="Quick-load the 3 Hackathon judge demo tasks"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:from-amber-500/30 hover:to-orange-500/30 transition-all shadow-[0_0_12px_rgba(245,158,11,0.15)] group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Load Judge Demo</span>
              <span className="sm:hidden font-mono text-[10px]">Demo</span>
            </button>

            {/* Reset data */}
            <button
              onClick={resetAllData}
              title="Wipe data to start fresh"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Quick Add Task button */}
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Task</span>
            </button>

            {/* User pill */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-medium text-slate-200 leading-none truncate max-w-[100px]">
                  {user.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-slate-400">
                    {moodEmojis[wellBeing.mood] || '😊'}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-medium flex items-center">
                    <Flame className="w-2.5 h-2.5 mr-0.5 fill-amber-400" />
                    {stats.streak}d
                  </span>
                </div>
              </div>
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
