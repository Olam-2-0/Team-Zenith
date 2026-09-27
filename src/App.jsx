import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SmartPlanner from './components/SmartPlanner';
import FocusMode from './components/FocusMode';
import Analytics from './components/Analytics';
import AddTaskModal from './components/AddTaskModal';
import AuthModal from './components/AuthModal';
import ToastNotification from './components/ToastNotification';
import AdaptiveMomentModal from './components/AdaptiveMomentModal';
import HeroScheduleModal from './components/HeroScheduleModal';
import WhatIfModal from './components/WhatIfModal';
import { Sparkles, Shield } from 'lucide-react';

function MainLayout() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Cosmic Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 65%),
                            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px'
        }}
      />

      {/* Persistent Navigation */}
      <Navbar />

      {/* Main Content View Container */}
      <main className="flex-1 relative z-10 pb-16">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'planner' && <SmartPlanner />}
        {activeTab === 'focus' && <FocusMode />}
        {activeTab === 'analytics' && <Analytics />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#080b11]/80 backdrop-blur-md py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-slate-300 font-['Outfit']">
              PULSE
            </span>
            <span>—</span>
            <span>Student Life OS</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
              Hackathon Final Polish
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Local-first Data Layer
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Adaptive Capacity Engine
            </span>
          </div>

          <div>
            <span>"Most productivity apps plan your ideal day. PULSE plans for your real day."</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Hero Flows */}
      <AddTaskModal />
      <AuthModal />
      <AdaptiveMomentModal />
      <HeroScheduleModal />
      <WhatIfModal />
      <ToastNotification />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
