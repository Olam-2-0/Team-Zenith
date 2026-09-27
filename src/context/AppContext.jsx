import React, { createContext, useContext, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  StorageService,
  JUDGE_DEMO_TASKS,
  DEFAULT_USER,
  DEFAULT_WEEKLY_HISTORY,
  getRelativeDate,
} from '../utils/storage';
import { generateDailyPlan } from '../utils/plannerEngine';
import { playCompletionChime } from '../utils/soundGenerator';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // 1. User state
  const [user, setUserState] = useState(() => StorageService.getUser());

  // 2. Tasks state
  const [tasks, setTasksState] = useState(() => StorageService.getTasks());

  // 3. Capacity / Workload state (legacy mood keys mapped to safe capacity terms)
  const [wellBeing, setWellBeingState] = useState(() => {
    const stored = StorageService.getWellBeing();
    // Normalize to safe capacity states if needed
    return stored || { mood: 'high', updatedAt: new Date().toISOString() };
  });

  // 4. Focus & Analytics history
  const [focusHistory, setFocusHistoryState] = useState(() => StorageService.getFocusHistory());

  // 5. Active focus session task
  const [activeFocusTask, setActiveFocusTask] = useState(null);

  // 6. Navigation
  const [activeTab, setActiveTab] = useState('dashboard');

  // 7. Modals & Notifications
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // 8. Signature Adaptive Moment: "I LOST 3 HOURS" state
  const [lostHoursActive, setLostHoursActive] = useState(false);
  const [isAdaptingAnimation, setIsAdaptingAnimation] = useState(false);
  const [showAdaptiveModal, setShowAdaptiveModal] = useState(false);

  // 9. What-If & Exam Mode states
  const [whatIfMinutes, setWhatIfMinutes] = useState(null);
  const [examModeActive, setExamModeActive] = useState(false);
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);

  // 10. Hero Flow: Add Task -> Auto-Schedule Confirmation
  const [heroScheduledResult, setHeroScheduledResult] = useState(null);

  // Sync to storage
  const setTasks = (newTasks) => {
    setTasksState(newTasks);
    StorageService.saveTasks(newTasks);
  };

  const setWellBeing = (newWellBeing) => {
    setWellBeingState(newWellBeing);
    StorageService.setWellBeing(newWellBeing);
  };

  const setFocusHistory = (newHistory) => {
    setFocusHistoryState(newHistory);
    StorageService.saveFocusHistory(newHistory);
  };

  const setUser = (newUser) => {
    setUserState(newUser);
    StorageService.setUser(newUser);
  };

  // Trigger floating alert banner
  const showToast = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // Add Task with validation check & Hero Auto-Schedule calculation
  const addTask = ({ title, subject, deadline, estimatedMinutes, priority, notes }) => {
    if (!title?.trim()) {
      showToast('Task title is required.', 'error');
      return false;
    }
    if (!deadline) {
      showToast('Deadline date is required.', 'error');
      return false;
    }
    const est = parseInt(estimatedMinutes, 10);
    if (isNaN(est) || est <= 0) {
      showToast('Estimated duration must be greater than 0 minutes.', 'error');
      return false;
    }

    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim(),
      subject: subject?.trim() || 'General',
      deadline,
      estimatedMinutes: est,
      priority: priority || 'medium',
      notes: notes?.trim() || '',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);

    // Compute where PULSE scheduled this newly added task using actual engine
    const testPlan = generateDailyPlan(updatedTasks, wellBeing.mood, null, {
      lostMinutes: lostHoursActive ? 180 : 0,
      availableTimeOverride: whatIfMinutes,
      examMode: examModeActive,
    });

    const scheduledSlot = testPlan.timeline.find((item) => item.task?.id === newTask.id);
    const deferredItem = testPlan.deferredTasks.find((item) => item.id === newTask.id);

    let scheduledTimeText = 'Today, Next Available Slot';
    let isDeferred = false;
    let reasonText = "Scheduled based on deadline urgency, estimated duration and today's available capacity.";

    if (scheduledSlot) {
      scheduledTimeText = `Today, ${scheduledSlot.startTime} – ${scheduledSlot.endTime}`;
      if (scheduledSlot.reason) reasonText = scheduledSlot.reason;
    } else if (deferredItem) {
      isDeferred = true;
      scheduledTimeText = 'Deferred to Tomorrow';
      reasonText = deferredItem.deferReason || "Daily capacity full; deferred to protect your focus buffer.";
    }

    // Set Hero Confirmation result
    setHeroScheduledResult({
      task: newTask,
      scheduledTimeText,
      reasonText,
      isDeferred,
      capacityLabel: testPlan.moodConfig.label,
    });

    showToast(`Task added — PULSE auto-scheduled it into your day.`, 'success');
    return true;
  };

  // Toggle complete
  const toggleTaskComplete = (id) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const willBeCompleted = !target.completed;
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: willBeCompleted } : t));
    setTasks(updated);

    if (willBeCompleted) {
      playCompletionChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#8b5cf6', '#10b981'],
      });
      showToast(`Completed: ${target.title}! Great momentum.`, 'success');
      logFocusMinutes(target.estimatedMinutes, target.id);
    }
  };

  // Complete task from Focus Mode
  const completeTaskAndLogFocus = (taskId, minutesSpent) => {
    const target = tasks.find((t) => t.id === taskId);
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t));
    setTasks(updated);

    playCompletionChime();
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'],
    });

    logFocusMinutes(minutesSpent || target?.estimatedMinutes || 25, taskId);
    showToast(`Focus session logged: ${minutesSpent || 25} mins added for ${target?.title || 'task'}!`, 'success');
    setActiveFocusTask(null);
  };

  // Delete task
  const deleteTask = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    if (activeFocusTask?.id === id) {
      setActiveFocusTask(null);
    }
    showToast('Task removed.', 'info');
  };

  // Update capacity state (workload terminology)
  const updateMood = (mood) => {
    const newWellBeing = {
      mood,
      updatedAt: new Date().toISOString(),
    };
    setWellBeing(newWellBeing);

    if (mood === 'low' || mood === 'stressed') {
      showToast('Low Capacity check-in: Workload Protection engaged (urgent-first, extended breaks).', 'warning');
    } else if (mood === 'very_low' || mood === 'tired') {
      showToast('Very Low Capacity check-in: Minimal load and recovery buffers applied.', 'info');
    } else if (mood === 'high' || mood === 'good') {
      showToast('High Capacity selected: Full schedule capacity unlocked.', 'success');
    } else {
      showToast('Balanced Capacity pacing active.', 'info');
    }
  };

  // Trigger Signature Adaptive Moment: "I LOST 3 HOURS"
  const triggerLostHoursAdaptive = () => {
    setIsAdaptingAnimation(true);
    setTimeout(() => {
      setLostHoursActive(true);
      setIsAdaptingAnimation(false);
      showToast('Life changed: Schedule adapted to -3 hours available time.', 'warning');
    }, 700);
  };

  const resetLostHours = () => {
    setLostHoursActive(false);
    showToast('Schedule restored to standard daily capacity.', 'info');
  };

  // Focus logging
  const logFocusMinutes = (minutes, taskId = null) => {
    const mins = Math.max(1, Math.round(Number(minutes) || 15));
    const todayStr = new Date().toISOString().split('T')[0];

    setFocusHistory((prev) => {
      const todayTotal = (prev.todayMinutes || 0) + mins;
      const allTotal = (prev.totalMinutes || 0) + mins;

      const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      const updatedWeekly = (prev.weekly || DEFAULT_WEEKLY_HISTORY).map((dayEntry) => {
        if (dayEntry.day === currentDayName || dayEntry.date === todayStr) {
          return {
            ...dayEntry,
            focusMinutes: dayEntry.focusMinutes + mins,
            completedTasks: dayEntry.completedTasks + (taskId ? 1 : 0),
          };
        }
        return dayEntry;
      });

      return {
        ...prev,
        todayMinutes: todayTotal,
        totalMinutes: allTotal,
        streakDays: prev.streakDays || 3,
        weekly: updatedWeekly,
      };
    });
  };

  // Demo actions for Hackathon judges
  const loadJudgeDemo = () => {
    const freshTasks = [
      {
        id: 'demo-chem-1',
        title: 'Chemistry Assignment: Electrochemistry & Redox',
        subject: 'Chemistry',
        deadline: getRelativeDate(1), // due tomorrow
        estimatedMinutes: 120,
        priority: 'high',
        notes: 'Cover Nernst equation problems and lab review questions for tomorrow afternoon.',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'demo-math-2',
        title: 'Maths Problem Set: Multivariable Calculus',
        subject: 'Mathematics',
        deadline: getRelativeDate(2), // due in 2 days
        estimatedMinutes: 60,
        priority: 'medium',
        notes: 'Solve questions 14 through 28 on partial derivatives.',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'demo-prog-3',
        title: 'Programming Lab: Binary Search Tree Implementation',
        subject: 'Computer Science',
        deadline: getRelativeDate(7), // due next week
        estimatedMinutes: 60,
        priority: 'low',
        notes: 'Implement rebalancing and traversal test cases in C++.',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];

    setTasks(freshTasks);
    setWellBeing({ mood: 'high', updatedAt: new Date().toISOString() });
    setLostHoursActive(false);
    setWhatIfMinutes(null);
    setExamModeActive(false);
    setActiveFocusTask(null);
    setActiveTab('dashboard');
    showToast('Loaded Judge Demo Tasks (Chemistry, Maths, CS) in High Capacity.', 'success');
  };

  const resetAllData = () => {
    setTasks([]);
    setWellBeing({ mood: 'high', updatedAt: new Date().toISOString() });
    setLostHoursActive(false);
    setWhatIfMinutes(null);
    setExamModeActive(false);
    setFocusHistory({
      totalMinutes: 0,
      todayMinutes: 0,
      streakDays: 1,
      weekly: [
        { day: 'Mon', focusMinutes: 0, completedTasks: 0 },
        { day: 'Tue', focusMinutes: 0, completedTasks: 0 },
        { day: 'Wed', focusMinutes: 0, completedTasks: 0 },
        { day: 'Thu', focusMinutes: 0, completedTasks: 0 },
        { day: 'Fri', focusMinutes: 0, completedTasks: 0 },
        { day: 'Sat', focusMinutes: 0, completedTasks: 0 },
        { day: 'Sun', focusMinutes: 0, completedTasks: 0 },
      ],
    });
    setActiveFocusTask(null);
    showToast('All tasks & data wiped fresh.', 'info');
  };

  // Launch focus on specific task
  const startFocusOnTask = (task) => {
    setActiveFocusTask(task);
    setActiveTab('focus');
  };

  // Baseline plan (BEFORE losing hours)
  const baselinePlan = useMemo(() => {
    return generateDailyPlan(tasks, wellBeing.mood, null, {
      lostMinutes: 0,
      availableTimeOverride: whatIfMinutes,
      examMode: examModeActive,
    });
  }, [tasks, wellBeing.mood, whatIfMinutes, examModeActive]);

  // Current active plan (reflects lost hours, what-if, or exam mode)
  const plan = useMemo(() => {
    return generateDailyPlan(tasks, wellBeing.mood, null, {
      lostMinutes: lostHoursActive ? 180 : 0,
      availableTimeOverride: whatIfMinutes,
      examMode: examModeActive,
    });
  }, [tasks, wellBeing.mood, lostHoursActive, whatIfMinutes, examModeActive]);

  // Computed summary metrics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      percent,
      todayMinutes: focusHistory.todayMinutes || 0,
      totalMinutes: focusHistory.totalMinutes || 0,
      streak: focusHistory.streakDays || 3,
    };
  }, [tasks, focusHistory]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        tasks,
        addTask,
        toggleTaskComplete,
        completeTaskAndLogFocus,
        deleteTask,
        wellBeing,
        updateMood,
        focusHistory,
        logFocusMinutes,
        activeFocusTask,
        setActiveFocusTask,
        startFocusOnTask,
        activeTab,
        setActiveTab,
        isAddTaskModalOpen,
        setIsAddTaskModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        notification,
        showToast,
        plan,
        baselinePlan,
        stats,
        loadJudgeDemo,
        resetAllData,
        // Signature Adaptive & What-If
        lostHoursActive,
        triggerLostHoursAdaptive,
        resetLostHours,
        isAdaptingAnimation,
        showAdaptiveModal,
        setShowAdaptiveModal,
        whatIfMinutes,
        setWhatIfMinutes,
        examModeActive,
        setExamModeActive,
        showWhatIfModal,
        setShowWhatIfModal,
        // Hero Confirmation
        heroScheduledResult,
        setHeroScheduledResult,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
