# MAX AI - Futuristic Multilingual AI Voice Assistant & Scheduler

A cyberpunk-inspired next-generation AI assistant interface featuring real-time multilingual voice synthesis, dynamic glowing HUD visualizer, sound effects, and intelligent time-based task scheduling.

![MAX AI Interface](https://img.shields.io/badge/MAX-AI_Assistant-00f3ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=for-the-badge&logo=vite)

---

## 🚀 Key Features

- **🌐 Multilingual Voice Synthesis**:
  - High-clarity native pronunciation across multiple global and regional languages (English, Hindi, Telugu, Tamil, Spanish, French, German, Japanese, and more).
  - Native language number spelling translation so numbers are pronounced naturally.
  - Multi-tier fallback architecture: Edge Neural TTS -> ResponsiveVoice -> Web Speech API with automatic language matching.

- **⏰ Intelligent Time-Based Task Scheduler**:
  - Real-time clock monitoring automatically triggers task completion when the scheduled time arrives.
  - Audio chimes, mobile haptic vibration feedback, floating toasts, and spoken completion announcements: *"Task [Title] has been completed"*.
  - Inline **Task Editor**: Edit task titles, scheduled times, dates, and priorities.
  - Quick time presets (`+1m`, `+2m`, `+5m`, `+10m`) for easy scheduling and rapid testing.
  - Interactive **Subtasks & Steps**: Add action items, checklists, and steps inside each task.

- **🔮 Dynamic State-Aware Cyberpunk Orb**:
  - Interactive 3D/Canvas-style glowing AI orb that morphs dynamically with assistant states:
    - `IDLE`: Deep cyan/indigo ambient core.
    - `LISTENING`: Radiant emerald-cyan pulse with active sound-wave rings.
    - `THINKING`: Amber/purple computational orbits and rotating particle rings.
    - `SPEAKING`: Vibrant multi-chromatic reactive audio visualizer waves.

- **📱 Full Mobile Chrome Support**:
  - Fully responsive layout optimized for mobile screens.
  - Global touch-gesture audio unlock compliant with mobile autoplay policies.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bolisettydharmateja-ops/MAX-Frontend.git
   cd MAX-Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
MAX-Frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── AIOrb.jsx             # Responsive glowing neural orb visualizer
│   │   ├── CommandBar.jsx        # Bottom action control dock
│   │   ├── HeaderBadge.jsx       # Real-time clock, status & language selector
│   │   ├── SpeechBubble.jsx      # AI response & task completion display
│   │   ├── TaskModal.jsx         # Interactive task scheduler, editor & subtasks
│   │   └── ...
│   ├── utils/
│   │   ├── audio.js              # Synthesized chimes & mobile gesture unlock
│   │   ├── dateTime.js           # Real-time clock & formatting utilities
│   │   ├── languages.js          # Multilingual TTS engine & fallbacks
│   │   └── numberWords.js        # Multilingual number converter
│   ├── App.jsx                   # Main application state & scheduler
│   └── index.css                 # Cyberpunk design system & glow effects
├── package.json
└── vite.config.js
```

---

## 📄 License

MIT License. Built with ❤️ for next-gen conversational AI experiences.
