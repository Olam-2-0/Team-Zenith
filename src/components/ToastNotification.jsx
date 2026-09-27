import React from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ToastNotification() {
  const { notification } = useApp();

  if (!notification) return null;

  const { message, type } = notification;

  let borderColor = 'border-cyan-500/40';
  let bgColor = 'bg-slate-900/95';
  let Icon = Info;
  let iconColor = 'text-cyan-400';

  if (type === 'success') {
    borderColor = 'border-emerald-500/50';
    Icon = CheckCircle2;
    iconColor = 'text-emerald-400';
  } else if (type === 'error') {
    borderColor = 'border-rose-500/50';
    Icon = AlertCircle;
    iconColor = 'text-rose-400';
  } else if (type === 'warning') {
    borderColor = 'border-amber-500/50';
    Icon = Sparkles;
    iconColor = 'text-amber-400';
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${bgColor} border ${borderColor} shadow-2xl backdrop-blur-xl text-xs text-white max-w-sm`}>
        <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}
