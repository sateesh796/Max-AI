import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Brain, Volume2, Sparkles, Radio } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function AIVariations({
  currentState = 'IDLE',
  onSelectState = () => {}
}) {
  const variations = [
    {
      id: 'IDLE',
      label: 'Idle',
      icon: Sparkles,
      color: 'cyan',
      glowClass: 'shadow-[0_0_15px_rgba(0,243,255,0.4)]',
      borderClass: 'border-cyan-400',
      activeBg: 'bg-cyan-500/20 text-cyan-300'
    },
    {
      id: 'LISTENING',
      label: 'Listening',
      icon: Mic,
      color: 'emerald',
      glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
      borderClass: 'border-emerald-400',
      activeBg: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'THINKING',
      label: 'Thinking',
      icon: Brain,
      color: 'purple',
      glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
      borderClass: 'border-purple-400',
      activeBg: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'SPEAKING',
      label: 'Speaking',
      icon: Volume2,
      color: 'sky',
      glowClass: 'shadow-[0_0_15px_rgba(56,189,248,0.5)]',
      borderClass: 'border-sky-400',
      activeBg: 'bg-sky-500/20 text-sky-300'
    }
  ];

  return (
    <div className="flex flex-col items-center mt-3 z-20 pointer-events-auto">
      {/* State Switcher Pill Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel px-3 py-1.5 rounded-2xl border border-cyan-400/40 shadow-[0_0_20px_rgba(0,243,255,0.2)] flex items-center gap-1.5 sm:gap-2"
      >
        <span className="text-[10px] font-cyber font-bold tracking-wider text-cyan-300/80 uppercase px-1.5 hidden sm:inline">
          AI MODE:
        </span>

        {variations.map((item) => {
          const Icon = item.icon;
          const isActive = currentState === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectState(item.id)}
              className={`relative px-2.5 sm:px-3 py-1.5 rounded-xl font-tech text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
                isActive
                  ? `${item.activeBg} border ${item.borderClass} ${item.glowClass}`
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive ? 'animate-pulse text-white' : 'text-slate-400'
                }`}
              />
              <span>{item.label}</span>

              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping ml-0.5" />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
