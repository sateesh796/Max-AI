import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audio';

/**
 * ActionIcon: Minimal futuristic action button with sleek tooltip
 */
export default function ActionIcon({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  badge = null,
  tooltipPosition = 'top', // 'top' | 'right'
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    playSound('click');
    onClick && onClick(e);
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleClick}
        aria-label={label}
        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-300 border ${
          isActive
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,243,255,0.4)]'
            : 'bg-slate-900/40 border-cyan-500/15 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/50 hover:bg-slate-800/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]'
        }`}
      >
        <Icon className="w-5 h-5 sm:w-5 sm:h-5 transition-colors" />

        {/* Active Indicator Pip */}
        {isActive && (
          <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f3ff]" />
        )}

        {/* Optional Badge */}
        {badge !== null && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[9px] font-bold text-slate-950 flex items-center justify-center shadow-[0_0_6px_rgba(0,243,255,0.6)]">
            {badge}
          </span>
        )}
      </motion.button>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: tooltipPosition === 'top' ? 4 : 0, x: tooltipPosition === 'right' ? -4 : 0 }}
            animate={{ opacity: 1, scale: 1, y: tooltipPosition === 'top' ? -8 : 0, x: tooltipPosition === 'right' ? 8 : 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 pointer-events-none px-2.5 py-1 rounded-lg bg-slate-950/90 border border-cyan-500/30 text-cyan-200 text-xs font-tech tracking-wider shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md whitespace-nowrap ${
              tooltipPosition === 'top'
                ? 'bottom-full left-1/2 -translate-x-1/2 mb-1'
                : 'left-full top-1/2 -translate-y-1/2 ml-2'
            }`}
          >
            {label}
            {/* Tooltip caret */}
            <div
              className={`absolute w-1.5 h-1.5 bg-slate-950 border border-cyan-500/30 transform rotate-45 ${
                tooltipPosition === 'top'
                  ? 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-0 border-l-0'
                  : 'left-[-4px] top-1/2 -translate-y-1/2 border-r-0 border-t-0'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
