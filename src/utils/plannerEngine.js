/**
 * PULSE - Adaptive Intelligent Planning Engine
 * Deterministic rule-based cognitive load & student workload optimizer.
 * 
 * Technical Distinction:
 * - AI Layer: Natural language task understanding, task decomposition, contextual explanations.
 * - Deterministic Engine: Mathematical constraint satisfaction, deadline proximity scoring,
 *   capacity boundaries, break insertion, and adaptive replanning.
 */

export const MOOD_CONFIGS = {
  // Safe, practical student-workload capacity terminology
  good: {
    key: 'high',
    label: 'High Capacity',
    emoji: '⚡',
    maxStudyMinutes: 240, // 4 hours focused work
    breakMinutes: 12,
    modeTitle: 'High Output Mode',
    modeDescription: 'Full cognitive battery. Tackling deep work, long sprints, and core milestones.',
    breakAdvice: '12-minute active walk or screen break between deep blocks.',
  },
  high: {
    key: 'high',
    label: 'High Capacity',
    emoji: '⚡',
    maxStudyMinutes: 240,
    breakMinutes: 12,
    modeTitle: 'High Output Mode',
    modeDescription: 'Full cognitive battery. Tackling deep work, long sprints, and core milestones.',
    breakAdvice: '12-minute active walk or screen break between deep blocks.',
  },
  okay: {
    key: 'balanced',
    label: 'Balanced Capacity',
    emoji: '⚖️',
    maxStudyMinutes: 180, // 3 hours
    breakMinutes: 15,
    modeTitle: 'Balanced Pacing',
    modeDescription: 'Steady workload pacing. Balancing urgent deadlines with moderate study sprints.',
    breakAdvice: '15-minute hydration and posture reset between sessions.',
  },
  balanced: {
    key: 'balanced',
    label: 'Balanced Capacity',
    emoji: '⚖️',
    maxStudyMinutes: 180,
    breakMinutes: 15,
    modeTitle: 'Balanced Pacing',
    modeDescription: 'Steady workload pacing. Balancing urgent deadlines with moderate study sprints.',
    breakAdvice: '15-minute hydration and posture reset between sessions.',
  },
  stressed: {
    key: 'low',
    label: 'Low Capacity',
    emoji: '🛡️',
    maxStudyMinutes: 120, // 2 hours max
    breakMinutes: 25,
    modeTitle: 'Workload Protection Mode',
    modeDescription: 'Overload shield engaged. Prioritizing only critical deadlines; non-urgent tasks deferred.',
    breakAdvice: '25-minute extended decompression break: step outside, box breathing, zero screens.',
  },
  low: {
    key: 'low',
    label: 'Low Capacity',
    emoji: '🛡️',
    maxStudyMinutes: 120,
    breakMinutes: 25,
    modeTitle: 'Workload Protection Mode',
    modeDescription: 'Overload shield engaged. Prioritizing only critical deadlines; non-urgent tasks deferred.',
    breakAdvice: '25-minute extended decompression break: step outside, box breathing, zero screens.',
  },
  tired: {
    key: 'very_low',
    label: 'Very Low Capacity',
    emoji: '🔋',
    maxStudyMinutes: 90,
    breakMinutes: 20,
    modeTitle: 'Minimal Load Mode',
    modeDescription: 'Energy depletion protection. Short focus sprints with generous buffer periods.',
    breakAdvice: '20-minute restorative break: stretch, power nap, or gentle music.',
  },
  very_low: {
    key: 'very_low',
    label: 'Very Low Capacity',
    emoji: '🔋',
    maxStudyMinutes: 90,
    breakMinutes: 20,
    modeTitle: 'Minimal Load Mode',
    modeDescription: 'Energy depletion protection. Short focus sprints with generous buffer periods.',
    breakAdvice: '20-minute restorative break: stretch, power nap, or gentle music.',
  },
};

/**
 * Calculates days remaining until a deadline date string (YYYY-MM-DD)
 */
export function getDaysUntil(deadlineStr) {
  if (!deadlineStr) return 999;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(deadlineStr);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates algorithmic priority score for a task
 */
export function calculateTaskScore(task, mood = 'good', examMode = false) {
  if (task.completed) return -9999;

  let score = 0;
  const daysUntil = getDaysUntil(task.deadline);

  // 1. Deadline proximity weighting
  if (daysUntil < 0) {
    score += 160; // Overdue: immediate emergency
  } else if (daysUntil === 0) {
    score += 110; // Due today
  } else if (daysUntil === 1) {
    score += 90; // Due tomorrow
  } else if (daysUntil === 2) {
    score += 60; // Due in 2 days
  } else if (daysUntil <= 4) {
    score += 40; // Due this week
  } else {
    score += 15; // Due next week or later
  }

  // 2. Declared priority weighting
  if (task.priority === 'high') {
    score += 50;
  } else if (task.priority === 'medium') {
    score += 25;
  } else {
    score += 10;
  }

  // 3. Exam Mode boost for high-weight core subjects
  if (examMode) {
    if (task.priority === 'high' || daysUntil <= 3) {
      score += 35;
    }
  }

  // 4. Capacity adaptive weighting
  const isConstrained = mood === 'stressed' || mood === 'low' || mood === 'tired' || mood === 'very_low';
  if (isConstrained) {
    if (daysUntil <= 1) {
      score += 45; // Protect critical urgent work
    } else {
      score -= 55; // Aggressively deprioritize non-urgent to protect student
    }
  }

  return score;
}

/**
 * Formats a Date object or offset into friendly time (e.g., "2:00 PM")
 */
export function formatTimeSlot(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * Generates an adaptive daily schedule based on current tasks, capacity, and real-time conditions
 * 
 * Options:
 * - lostMinutes: number (e.g., 180 for "I LOST 3 HOURS")
 * - availableTimeOverride: number (for What-If simulations)
 * - examMode: boolean (intensifies focus blocks)
 * - recoveryMode: boolean (ensures generous recovery buffer)
 */
export function generateDailyPlan(tasks, mood = 'good', baseStartTime = null, options = {}) {
  const moodConfig = MOOD_CONFIGS[mood] || MOOD_CONFIGS.good;
  const pendingTasks = tasks.filter((t) => !t.completed);

  const lostMinutes = options.lostMinutes || 0;
  const isExamMode = !!options.examMode;
  const isRecoveryMode = !!options.recoveryMode;

  // Calculate actual effective daily study capacity
  let baseCapacity = moodConfig.maxStudyMinutes;
  if (typeof options.availableTimeOverride === 'number') {
    baseCapacity = options.availableTimeOverride;
  }
  const effectiveCapacity = Math.max(45, baseCapacity - lostMinutes);

  // Score each task
  const scoredTasks = pendingTasks.map((task) => {
    const daysUntil = getDaysUntil(task.deadline);
    const score = calculateTaskScore(task, mood, isExamMode);
    
    // Generate one-line reason based on actual planning factors
    let reason = '';
    if (daysUntil < 0) {
      reason = 'Overdue! Highest urgent action required.';
    } else if (daysUntil === 0) {
      reason = 'Due today — prioritized for immediate completion.';
    } else if (daysUntil === 1 && task.priority === 'high') {
      reason = 'Due tomorrow with High priority — critical deep focus block.';
    } else if (daysUntil === 1) {
      reason = 'Due tomorrow — scheduled early to prevent last-minute rush.';
    } else if (daysUntil === 2 && lostMinutes > 0) {
      reason = 'Reduced/rescheduled: urgent work prioritized after losing 3 hours.';
    } else if (daysUntil === 2) {
      reason = 'Due in 2 days — steady pacing ahead of deadline crunch.';
    } else if (daysUntil > 3 && (lostMinutes > 0 || mood === 'stressed' || mood === 'low')) {
      reason = 'Deferred for tomorrow to protect mental bandwidth today.';
    } else {
      reason = 'Future milestone — preliminary review block.';
    }

    return {
      ...task,
      score,
      daysUntil,
      reason,
    };
  });

  // Sort by priority score descending
  scoredTasks.sort((a, b) => b.score - a.score);

  // Capacity allocation with adaptive changes (PROTECTED, REDUCED, MOVED, DEFERRED)
  let remainingCapacity = effectiveCapacity;
  const scheduledTasks = [];
  const deferredTasks = [];
  const decisions = [];

  scoredTasks.forEach((task, idx) => {
    let est = Number(task.estimatedMinutes) || 45;
    let changeStatus = 'SCHEDULED'; // Default

    // In Lost 3 Hours mode or heavy constraint:
    if (lostMinutes > 0) {
      if (idx === 0 && task.daysUntil <= 1) {
        // First urgent task is strictly PROTECTED and trimmed to fit available capacity
        if (est > remainingCapacity) {
          est = Math.max(30, remainingCapacity);
        }
        changeStatus = 'PROTECTED';
        decisions.push(`Protect ${task.subject}: ${task.title} (Urgent deadline preserved at ${est}m)`);
      } else if (remainingCapacity >= 30 && remainingCapacity < est) {
        // If it partially fits, REDUCE duration to keep progress without breaking capacity
        est = Math.max(30, remainingCapacity);
        changeStatus = 'REDUCED';
        decisions.push(`Reduce ${task.subject}: ${task.title} (${est}m sprint)`);
      } else if (task.daysUntil > 1) {
        // Non-urgent tasks are DEFERRED
        changeStatus = 'DEFERRED';
        deferredTasks.push({
          ...task,
          changeStatus: 'DEFERRED',
          deferReason: `Deferred to tomorrow: 3 hours lost today, preserving focus on urgent work.`,
        });
        decisions.push(`Move ${task.subject}: ${task.title} to tomorrow`);
        return;
      } else {
        changeStatus = 'RESCHEDULED';
        decisions.push(`Reschedule ${task.subject}: ${task.title}`);
      }
    } else if (mood === 'stressed' || mood === 'low') {
      if (task.daysUntil > 1 && scheduledTasks.length > 0) {
        deferredTasks.push({
          ...task,
          changeStatus: 'DEFERRED',
          deferReason: 'Deferred to avoid overload under Low Capacity state.',
        });
        decisions.push(`Defer ${task.subject}: ${task.title} for tomorrow`);
        return;
      }
    }

    if (remainingCapacity - est >= -15) { // 15m grace window
      scheduledTasks.push({
        ...task,
        effectiveDuration: est,
        changeStatus: changeStatus === 'SCHEDULED' ? (idx === 0 ? 'PROTECTED' : 'SCHEDULED') : changeStatus,
      });
      remainingCapacity -= est;
    } else {
      deferredTasks.push({
        ...task,
        changeStatus: 'DEFERRED',
        deferReason: `Deferred: Daily capacity limit reached (${effectiveCapacity}m limit).`,
      });
      decisions.push(`Defer ${task.subject}: ${task.title} (Capacity full)`);
    }
  });

  // Build timed timeline blocks
  const startTime = baseStartTime ? new Date(baseStartTime) : new Date();
  
  // Round up to next convenient 15-minute slot
  const currentMinutes = startTime.getMinutes();
  const remainder = currentMinutes % 15;
  if (remainder !== 0) {
    startTime.setMinutes(currentMinutes + (15 - remainder));
  }
  startTime.setSeconds(0);
  startTime.setMilliseconds(0);

  const timeline = [];
  let currentTime = new Date(startTime.getTime());
  let totalStudyTime = 0;
  let totalBreakTime = 0;

  const breakDuration = (lostMinutes > 0 && scheduledTasks.length > 1)
    ? 15 // preserved reasonable recovery
    : isRecoveryMode
    ? 25
    : moodConfig.breakMinutes;

  scheduledTasks.forEach((task, index) => {
    const taskStart = new Date(currentTime.getTime());
    const est = task.effectiveDuration || Number(task.estimatedMinutes) || 45;
    const taskEnd = new Date(taskStart.getTime() + est * 60000);
    totalStudyTime += est;

    timeline.push({
      type: 'task',
      id: `slot-task-${task.id}`,
      task,
      startTime: formatTimeSlot(taskStart),
      endTime: formatTimeSlot(taskEnd),
      durationMinutes: est,
      title: `${task.subject}: ${task.title}`,
      subject: task.subject,
      reason: task.reason,
      changeStatus: task.changeStatus,
    });

    currentTime = new Date(taskEnd.getTime());

    // Insert break between tasks (if not last item)
    if (index < scheduledTasks.length - 1) {
      const breakStart = new Date(currentTime.getTime());
      const breakEnd = new Date(breakStart.getTime() + breakDuration * 60000);
      totalBreakTime += breakDuration;

      timeline.push({
        type: 'break',
        id: `slot-break-${index}`,
        startTime: formatTimeSlot(breakStart),
        endTime: formatTimeSlot(breakEnd),
        durationMinutes: breakDuration,
        title: lostMinutes > 0 ? '🌿 Preserved Recovery Buffer' : '☕ Refreshment & Stride Break',
        advice: moodConfig.breakAdvice,
        changeStatus: 'PRESERVED',
      });

      currentTime = new Date(breakEnd.getTime());
    }
  });

  // Calculate real factors for "WHY PULSE DECIDED THIS"
  const urgentCount = scoredTasks.filter((t) => t.daysUntil <= 1).length;
  let workloadRating = 'Moderate';
  if (totalStudyTime >= 180) workloadRating = 'High';
  else if (totalStudyTime <= 90) workloadRating = 'Light';

  const explanation = {
    availableTime: effectiveCapacity,
    workload: workloadRating,
    capacity: moodConfig.label,
    urgentDeadlines: urgentCount,
    decisions: decisions.slice(0, 4),
    reason: lostMinutes > 0
      ? `Your available time decreased by 180 min, so PULSE protected the highest-priority work and moved lower-urgency tasks while preserving recovery time.`
      : `Scheduled based on deadline urgency, estimated duration and today's available ${moodConfig.label}.`,
  };

  return {
    mood,
    moodConfig,
    timeline,
    scheduledTasks,
    deferredTasks,
    totalStudyTime,
    totalBreakTime,
    capacityMinutes: effectiveCapacity,
    capacityUsedPercent: Math.min(100, Math.round((totalStudyTime / effectiveCapacity) * 100)),
    explanation,
    lostMinutes,
    isExamMode,
  };
}
