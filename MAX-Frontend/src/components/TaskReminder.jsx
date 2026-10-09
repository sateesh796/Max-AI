import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/audio';

/**
 * TaskReminder: Minimal compact home screen widget displaying pending task count.
 * Clicking opens the dedicated Task Reminder Modal.
 */
export default function TaskReminder({ count = 3, onClick }) {
  const handleClick = () => {
    playSound('click');
    onClick && onClick();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      aria-label="Task Reminders"
      className="relative group p-4 sm:p-5 rounded-2xl glass-panel-interactive flex items-center gap-3.5 sm:gap-4 text-left w-full sm:w-auto min-w-[190px] overflow-hidden"
    >
      {/* Subtle Ambient Task Glow Aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent rounded-2xl blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

      {/* Cyber Corner Accent */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/50 rounded-tr pointer-events-none" />

      {/* Bell Icon Container */}
      <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
        <Bell className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />

        {/* Pending Badge */}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 shadow-[0_0_8px_rgba(0,243,255,0.8)]">
            {count}
          </span>
        )}
      </div>

      {/* Text Info */}
      <div className="flex flex-col">
        <span className="font-tech text-xs tracking-wider uppercase text-slate-400 group-hover:text-slate-300">
          Task Reminder
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="font-sans font-semibold text-sm sm:text-base text-slate-100 group-hover:text-cyan-200 tracking-wide">
            {count} {count === 1 ? 'Task' : 'Tasks'}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
