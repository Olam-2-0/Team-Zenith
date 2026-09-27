# PULSE — Student Life OS
> **Adaptive Intelligent Study Planner & Cognitive Energy Balancer**  
> *Built for Hackathon MVP — Speed, Polish, & Working End-to-End Demo*

---

## 🎯 Problem Statement
Students struggle to decide **WHAT** to do and **WHEN** to do it. Traditional to-do apps present an infinite, overwhelming backlog with no sense of cognitive pacing, resulting in decision fatigue, late-night cramming, and burnout.

**PULSE is not a basic to-do list.** It is an adaptive Student Life OS that:
1. Analyzes deadline proximity, task priority, and estimated duration.
2. Cross-references the student's real-time **Cognitive Energy State** (Good, Okay, Stressed, Tired).
3. Auto-generates a realistic, timed daily schedule with built-in buffer breaks and deferred workload protection.

---

## 🚀 Quick Start

### 1. Requirements
- Node.js v18+ (tested on Node v24)
- npm v9+

### 2. Run Locally
```bash
cd pulse-student-os
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🏆 The Judge Demo Story (2-Minute Walkthrough)

To present the exact story required by hackathon judges:

1. **Load Demo Tasks**: Click the amber **"Load Judge Demo"** button on the top navigation bar.
   - *Task 1:* Chemistry Assignment — Due tomorrow — High priority — ~2 hours (120 min)
   - *Task 2:* Maths Problem Set — Due in 2 days — Medium priority — ~1 hour (60 min)
   - *Task 3:* Programming Lab — Due next week — Low priority — ~1 hour (60 min)
2. **Review Generated Plan**: 
   - Observe the Dashboard and click the **Smart Planner** tab.
   - Note the timed timeline: Chemistry is scheduled first with a 1-line reason (*"Due tomorrow with High priority — critical deep focus block"*), followed by an automatic refreshment break, then Maths.
3. **Execute Focus Mode**:
   - Click **"Focus"** on the Chemistry task.
   - Watch the countdown timer, circular SVG progress ring, and ambient sound options.
   - Click **"Complete Task"** — celebration confetti fires, sound chimes, focus minutes are logged, and dashboard completion updates.
4. **Simulate Well-being Check-in ("Stressed")**:
   - In the **Cognitive Energy Check-in** widget, click **"Stressed" (😓)**.
5. **Watch the Adaptive Engine Adapt in Real Time**:
   - The OS triggers **Burnout Shield**:
     - Daily study capacity is cut from 240 mins down to 120 mins.
     - Extended 25-minute decompression breaks are inserted.
     - Non-urgent tasks (Maths/Programming) are deferred with clear rationale banners: *"Deferred to avoid cognitive overload under current stress level."*
6. **Telemetry & Progress**:
   - Switch to the **Progress & OS** tab to see the weekly productivity bar chart, completion %, study volume, and active streak.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Vite + React 19
- **Styling**: Tailwind CSS v4 (Obsidian glassmorphic dark futuristic student theme)
- **Icons**: `lucide-react`
- **Audio Synthesis**: Native Web Audio API synthesizer for ambient rain white noise & chords (100% offline, 0 external media files)
- **Delight & Animations**: `canvas-confetti` + CSS keyframe glow pulses
- **Data Layer**: Clean `StorageService` interface abstracting local persistence (`localStorage`), enabling seamless migration to Firebase/Supabase in the future.

---

## 📂 Project Structure

```
pulse-student-os/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky branding, judge fast-track, user profile
│   │   ├── Dashboard.jsx         # Today's schedule, deadlines queue, quick stats
│   │   ├── SmartPlanner.jsx      # Timed timeline, break dividers, deferred tasks
│   │   ├── FocusMode.jsx         # Circular countdown timer, ambient rain, task completion
│   │   ├── WellBeingWidget.jsx   # Non-medical cognitive energy check-in (4 moods)
│   │   ├── Analytics.jsx         # Weekly bar charts, subject distribution, streak
│   │   ├── AddTaskModal.jsx      # Validated task creation with presets
│   │   ├── AuthModal.jsx         # Local demo user authentication & switcher
│   │   └── ToastNotification.jsx # Glassmorphic feedback alerts
│   ├── context/
│   │   └── AppContext.jsx        # State provider, event dispatchers, demo loaders
│   ├── utils/
│   │   ├── plannerEngine.js      # Rule-based priority scoring & schedule builder
│   │   ├── soundGenerator.js     # Native Web Audio ambient noise & completion chime
│   │   └── storage.js            # Clean storage abstraction layer & seed data
│   ├── App.jsx                   # Main layout container
│   ├── index.css                 # Dark futuristic design system & tokens
│   └── main.jsx
├── vite.config.js
├── package.json
└── README.md
```
