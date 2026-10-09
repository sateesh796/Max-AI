import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock } from 'lucide-react';
import { playSound } from '../utils/audio';

/**
 * SecurityWidget: Minimal compact home screen widget displaying security state.
 * Clicking opens the dedicated Security Modal.
 */
export default function SecurityWidget({ onClick, isProtected = true }) {
  const handleClick = () => {
    playSound('shield');
    onClick && onClick();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      aria-label="Security Center"
      className="relative group p-4 sm:p-5 rounded-2xl glass-panel-interactive flex items-center gap-3.5 sm:gap-4 text-left w-full sm:w-auto min-w-[190px] overflow-hidden"
    >
      {/* Subtle Ambient Shield Glow Aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent rounded-2xl blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

      {/* Cyber Corner Accent */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400/50 rounded-tr pointer-events-none" />

      {/* Shield Icon Container with Breathing Pulse */}
      <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
        {/* Animated Radar Blip */}
        <span className="absolute w-full h-full rounded-xl bg-emerald-400/15 animate-ping opacity-60 pointer-events-none" />
        <ShieldCheck className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
      </div>

      {/* Text Info */}
      <div className="flex flex-col">
        <span className="font-tech text-xs tracking-wider uppercase text-slate-400 group-hover:text-slate-300">
          Security
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-sans font-semibold text-sm sm:text-base text-slate-100 group-hover:text-emerald-200 tracking-wide">
            Protected
          </span>
        </div>
      </div>
    </motion.button>
  );
}
