import React, { useState } from 'react';
import { X, Clock, Calendar, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRelativeDate } from '../utils/storage';

export default function AddTaskModal() {
  const { isAddTaskModalOpen, setIsAddTaskModalOpen, addTask } = useApp();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Chemistry');
  const [customSubject, setCustomSubject] = useState('');
  const [deadline, setDeadline] = useState(getRelativeDate(1));
  const [estimatedMinutes, setEstimatedMinutes] = useState('60');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  if (!isAddTaskModalOpen) return null;

  const subjectPresets = [
    'Chemistry',
    'Mathematics',
    'Computer Science',
    'Physics',
    'Biology',
    'Literature',
    'Other',
  ];

  const durationPresets = [
    { label: '30m', value: 30 },
    { label: '45m', value: 45 },
    { label: '1h', value: 60 },
    { label: '1.5h', value: 90 },
    { label: '2h', value: 120 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!deadline) {
      newErrors.deadline = 'Deadline date is required';
    }

    const durationNum = parseInt(estimatedMinutes, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      newErrors.estimatedMinutes = 'Duration must be greater than 0 minutes';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalSubject = subject === 'Other' && customSubject.trim() ? customSubject.trim() : subject;

    const success = addTask({
      title,
      subject: finalSubject,
      deadline,
      estimatedMinutes: durationNum,
      priority,
      notes,
    });

    if (success) {
      // Reset form
      setTitle('');
      setSubject('Chemistry');
      setCustomSubject('');
      setDeadline(getRelativeDate(1));
      setEstimatedMinutes('60');
      setPriority('medium');
      setNotes('');
      setErrors({});
      setIsAddTaskModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl bg-[#0f172a] border border-cyan-500/30 p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">Add New Academic Task</h2>
              <p className="text-xs text-slate-400">PULSE will automatically factor this into your daily schedule.</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddTaskModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 relative z-10">
          
          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Chemistry Assignment: Electrochemistry"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                errors.title ? 'border-rose-500/80 bg-rose-950/10' : 'border-slate-800 focus:border-cyan-500'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Subject / Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Subject / Course
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {subjectPresets.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSubject(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    subject === s
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {subject === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom subject name..."
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            )}
          </div>

          {/* Two Columns: Deadline & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Deadline */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Deadline Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: null }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                  errors.deadline ? 'border-rose-500/80' : 'border-slate-800 focus:border-cyan-500'
                }`}
              />
              {errors.deadline && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.deadline}
                </p>
              )}
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Est. Duration (Minutes) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="5"
                step="5"
                placeholder="60"
                value={estimatedMinutes}
                onChange={(e) => {
                  setEstimatedMinutes(e.target.value);
                  if (errors.estimatedMinutes) setErrors((prev) => ({ ...prev, estimatedMinutes: null }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${
                  errors.estimatedMinutes ? 'border-rose-500/80' : 'border-slate-800 focus:border-cyan-500'
                }`}
              />
              {/* Presets */}
              <div className="flex gap-1.5 mt-1.5">
                {durationPresets.map((d) => (
                  <button
                    type="button"
                    key={d.value}
                    onClick={() => setEstimatedMinutes(d.value.toString())}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      parseInt(estimatedMinutes, 10) === d.value
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              {errors.estimatedMinutes && (
                <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.estimatedMinutes}
                </p>
              )}
            </div>

          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'Low', desc: 'Flexible', color: 'border-slate-600 text-slate-300 active:border-emerald-500 active:bg-emerald-950/20' },
                { id: 'medium', label: 'Medium', desc: 'Standard', color: 'border-cyan-500/40 text-cyan-300 active:border-cyan-400 active:bg-cyan-950/20' },
                { id: 'high', label: 'High', desc: 'Critical', color: 'border-rose-500/40 text-rose-300 active:border-rose-400 active:bg-rose-950/20' },
              ].map((p) => {
                const isSelected = priority === p.id;
                let activeStyle = '';
                if (isSelected) {
                  if (p.id === 'low') activeStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
                  if (p.id === 'medium') activeStyle = 'bg-cyan-950/50 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]';
                  if (p.id === 'high') activeStyle = 'bg-rose-950/50 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]';
                } else {
                  activeStyle = 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700';
                }

                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPriority(p.id)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${activeStyle}`}
                  >
                    <div className="text-xs font-bold uppercase">{p.label}</div>
                    <div className="text-[10px] opacity-75">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Task Notes / Sub-Goals (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Problems 14-28, review lecture 4 slides first..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddTaskModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              Save & Auto-Schedule
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
