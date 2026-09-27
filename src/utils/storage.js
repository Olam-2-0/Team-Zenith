/**
 * PULSE - Local Data Storage Layer
 * Designed with a clean interface so Firebase / Cloud sync can easily be swapped in.
 */

const STORAGE_KEYS = {
  USER: 'pulse_user',
  TASKS: 'pulse_tasks',
  WELL_BEING: 'pulse_well_being',
  FOCUS_HISTORY: 'pulse_focus_history',
  SETTINGS: 'pulse_settings',
};

// Default judge demo tasks matching the exact required demo story
export const JUDGE_DEMO_TASKS = [
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
  }
];

export const DEFAULT_USER = {
  id: 'user-demo-alex',
  name: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  major: 'Computer Science & Chemistry',
  institution: 'State University',
};

export const DEFAULT_WEEKLY_HISTORY = [
  { day: 'Mon', date: '2026-09-22', focusMinutes: 90, completedTasks: 3 },
  { day: 'Tue', date: '2026-09-23', focusMinutes: 135, completedTasks: 4 },
  { day: 'Wed', date: '2026-09-24', focusMinutes: 60, completedTasks: 2 },
  { day: 'Thu', date: '2026-09-25', focusMinutes: 150, completedTasks: 5 },
  { day: 'Fri', date: '2026-09-26', focusMinutes: 120, completedTasks: 3 },
  { day: 'Sat', date: '2026-09-27', focusMinutes: 45, completedTasks: 1 },
  { day: 'Sun', date: '2026-09-28', focusMinutes: 0, completedTasks: 0 },
];

export function getRelativeDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const StorageService = {
  getUser: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  setUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getTasks: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) {
        // Return judge demo tasks if fresh
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(JUDGE_DEMO_TASKS));
        return JUDGE_DEMO_TASKS;
      }
      return JSON.parse(data);
    } catch {
      return JUDGE_DEMO_TASKS;
    }
  },

  saveTasks: (tasks) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getWellBeing: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WELL_BEING);
      return data ? JSON.parse(data) : { mood: 'good', updatedAt: new Date().toISOString() };
    } catch {
      return { mood: 'good', updatedAt: new Date().toISOString() };
    }
  },

  setWellBeing: (wellBeing) => {
    localStorage.setItem(STORAGE_KEYS.WELL_BEING, JSON.stringify(wellBeing));
  },

  getFocusHistory: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOCUS_HISTORY);
      return data ? JSON.parse(data) : {
        totalMinutes: 600,
        todayMinutes: 45,
        streakDays: 3,
        weekly: DEFAULT_WEEKLY_HISTORY
      };
    } catch {
      return {
        totalMinutes: 600,
        todayMinutes: 45,
        streakDays: 3,
        weekly: DEFAULT_WEEKLY_HISTORY
      };
    }
  },

  saveFocusHistory: (history) => {
    localStorage.setItem(STORAGE_KEYS.FOCUS_HISTORY, JSON.stringify(history));
  },

  resetAll: () => {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.WELL_BEING);
    localStorage.removeItem(STORAGE_KEYS.FOCUS_HISTORY);
  },

  loadJudgeDemo: () => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(JUDGE_DEMO_TASKS));
    localStorage.setItem(STORAGE_KEYS.WELL_BEING, JSON.stringify({ mood: 'good', updatedAt: new Date().toISOString() }));
  }
};
