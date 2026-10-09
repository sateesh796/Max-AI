import React from 'react';
import { motion } from 'framer-motion';

/**
 * AIOrb: Futuristic 3D Cyber Core with rotating orbital rings,
 * central "MAX AI" illuminated emblem, and holographic projector pedestal.
 */
export default function AIOrb({ state = 'IDLE', onClick }) {
  // Speed factors based on AI state
  const isListening = state === 'LISTENING';
  const isThinking = state === 'THINKING';
  const isSpeaking = state === 'SPEAKING';

  const ringSpeed1 = isThinking ? 5 : isListening ? 8 : isSpeaking ? 10 : 16;
  const ringSpeed2 = isThinking ? 6 : isListening ? 10 : isSpeaking ? 12 : 20;
  const ringSpeed3 = isThinking ? 4 : isListening ? 7 : isSpeaking ? 9 : 14;
  const irisSpeed = isThinking ? 8 : 28;

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col items-center justify-center select-none cursor-pointer group scale-[0.72] sm:scale-95 md:scale-100 origin-center transition-transform -my-10 sm:my-0"
      style={{ width: '420px', height: '460px' }}
    >
      {/* 1. Ambient Holographic Core Glow */}
      <div
        className={`absolute top-16 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isThinking
            ? 'bg-purple-600/40 scale-110 shadow-[0_0_80px_#a855f7]'
            : isListening
            ? 'bg-emerald-500/40 scale-115 shadow-[0_0_80px_#10b981]'
            : isSpeaking
            ? 'bg-amber-500/40 scale-110 shadow-[0_0_80px_#f59e0b]'
            : 'bg-cyan-500/30 scale-100 shadow-[0_0_80px_#00f3ff]'
        }`}
      />

      {/* 2. Upward Holographic Light Projection Cone (from pedestal to orb) */}
      <div
        className="absolute bottom-20 w-48 h-56 pointer-events-none opacity-45 group-hover:opacity-65 transition-all duration-700"
        style={{
          background: isThinking
            ? 'linear-gradient(to top, rgba(168, 85, 247, 0.45) 0%, rgba(147, 51, 234, 0.15) 50%, transparent 100%)'
            : isListening
            ? 'linear-gradient(to top, rgba(16, 185, 129, 0.45) 0%, rgba(5, 150, 105, 0.15) 50%, transparent 100%)'
            : isSpeaking
            ? 'linear-gradient(to top, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0, 243, 255, 0.45) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 100%)',
          clipPath: 'polygon(30% 100%, 70% 100%, 95% 0%, 5% 0%)',
        }}
      />

      {/* 3. Main Floating Core Sphere Assembly (Perspective 3D Container) */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex items-center justify-center"
        style={{ width: '340px', height: '340px', perspective: 1000 }}
      >
        {/* Orbital Ring 1 (Tilted Right Angle) with Rotating Satellites */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: 'rotateX(72deg) rotateY(28deg) rotateZ(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: ringSpeed1, repeat: Infinity, ease: 'linear' }}
            className="relative w-[330px] h-[330px] rounded-full border border-cyan-400/60 shadow-[0_0_15px_rgba(0,243,255,0.4)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Glowing Satellite Sphere Node 1 */}
            <div className="absolute top-[-7px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-300 shadow-[0_0_15px_#00f3ff,0_0_25px_#00f3ff] border border-white" />
            {/* Satellite Sphere Node 2 */}
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f3ff] border border-white/80" />
          </motion.div>
        </div>

        {/* Orbital Ring 2 (Tilted Opposite Angle) with Rotating Satellites */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: 'rotateX(72deg) rotateY(-28deg) rotateZ(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: ringSpeed2, repeat: Infinity, ease: 'linear' }}
            className="relative w-[340px] h-[340px] rounded-full border border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.35)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Glowing Satellite Sphere Node 3 */}
            <div className="absolute top-1/2 right-[-7px] -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-200 shadow-[0_0_15px_#38bdf8,0_0_25px_#00f3ff] border border-white" />
            {/* Satellite Sphere Node 4 */}
            <div className="absolute top-1/2 left-[-6px] -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-300 shadow-[0_0_12px_#60a5fa] border border-white/80" />
          </motion.div>
        </div>

        {/* Orbital Ring 3 (Equatorial Wave Ring) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            transform: 'rotateX(82deg) rotateY(4deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: ringSpeed3, repeat: Infinity, ease: 'linear' }}
            className="relative w-[350px] h-[350px] rounded-full border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]"
          >
            <div className="absolute top-[-5px] right-12 w-3 h-3 rounded-full bg-purple-300 shadow-[0_0_10px_#a855f7]" />
          </motion.div>
        </div>

        {/* Outer Circular Tech Iris (Rotating Clockwise) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: irisSpeed, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[250px] h-[250px] rounded-full pointer-events-none"
        >
          <svg className="w-full h-full" viewBox="0 0 250 250">
            {/* Outer segmented tech notches */}
            <circle
              cx="125"
              cy="125"
              r="120"
              fill="none"
              stroke="#00f3ff"
              strokeWidth="2.5"
              strokeDasharray="12 18 4 14 36 24"
              className="drop-shadow-[0_0_8px_#00f3ff]"
            />
            <circle
              cx="125"
              cy="125"
              r="112"
              fill="none"
              stroke="rgba(168, 85, 247, 0.6)"
              strokeWidth="1.5"
              strokeDasharray="6 30 18 12"
            />
          </svg>
        </motion.div>

        {/* Inner Counter-Rotating Mechanical Tech Shutter Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: irisSpeed * 0.75, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[215px] h-[215px] rounded-full pointer-events-none"
        >
          <svg className="w-full h-full" viewBox="0 0 215 215">
            <circle
              cx="107.5"
              cy="107.5"
              r="102"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeDasharray="20 12 8 8 32 16"
              className="drop-shadow-[0_0_6px_#38bdf8]"
            />
            {/* Tech teeth markers */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <rect
                key={deg}
                x="105.5"
                y="3"
                width="4"
                height="8"
                fill="#00f3ff"
                transform={`rotate(${deg} 107.5 107.5)`}
              />
            ))}
          </svg>
        </motion.div>

        {/* Audio Waveform Ripples (When Speaking or Listening) */}
        {(isListening || isSpeaking) && (
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[240px] h-[240px] rounded-full border-2 border-cyan-300/40 shadow-[0_0_20px_#00f3ff] pointer-events-none"
          />
        )}

        {/* 4. Center Core Sphere: The Illuminated "MAX AI" Emblem WITH LIVE TIME */}
        <div className="relative w-[174px] h-[174px] rounded-full flex flex-col items-center justify-center z-10 overflow-hidden shadow-[0_0_35px_rgba(0,243,255,0.6),inset_0_0_25px_rgba(0,243,255,0.4)] border-2 border-cyan-400 bg-gradient-to-b from-[#0a1936] via-[#050b1d] to-[#02050f]">
          {/* Internal Cyber Grid Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.3)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />

          {/* Central Blue Lens Flare Glint */}
          <div className="absolute top-2 inset-x-8 h-8 rounded-full bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />

          {/* Illuminated Text: MAX AI */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <span
              className="font-cyber font-black text-2xl sm:text-3xl tracking-[0.18em] text-white drop-shadow-[0_0_15px_#00f3ff]"
              style={{
                textShadow: '0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 35px rgba(0,243,255,0.8)',
              }}
            >
              MAX
            </span>
            <span
              className="font-cyber font-bold text-xl sm:text-2xl tracking-[0.25em] text-cyan-300 mt-[-3px]"
              style={{
                textShadow: '0 0 8px #00f3ff, 0 0 16px rgba(0,243,255,0.7)',
              }}
            >
              AI
            </span>
          </div>
        </div>
      </motion.div>

      {/* 6. Holographic Multi-Tiered Pedestal Base */}
      <div className="relative flex flex-col items-center pointer-events-none">
        {/* Pedestal Level 1 (Top Emitter Disc) */}
        <div className="relative w-36 h-4 rounded-full bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-400/80 shadow-[0_0_20px_rgba(0,243,255,0.8)] flex items-center justify-center">
          <div className="w-20 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#00f3ff]" />
        </div>

        {/* Pedestal Level 2 (Middle Metallic Tier) */}
        <div className="relative w-52 h-5 -mt-1 rounded-full bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950 border-t border-cyan-500/60 shadow-lg flex items-center justify-around px-4">
          <div className="w-2.5 h-1 rounded bg-cyan-400 shadow-[0_0_6px_#00f3ff]" />
          <div className="w-2.5 h-1 rounded bg-cyan-400 shadow-[0_0_6px_#00f3ff]" />
          <div className="w-2.5 h-1 rounded bg-cyan-400 shadow-[0_0_6px_#00f3ff]" />
          <div className="w-2.5 h-1 rounded bg-cyan-400 shadow-[0_0_6px_#00f3ff]" />
        </div>

        {/* Pedestal Level 3 (Wide Metallic Launchpad Base) */}
        <div className="relative w-72 h-6 -mt-1 rounded-full bg-gradient-to-r from-[#030712] via-[#09152e] to-[#030712] border-t-2 border-cyan-400 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_25px_rgba(0,243,255,0.3)] flex items-center justify-center">
          {/* Blue LED Light Ring on Floor */}
          <div className="w-56 h-2 rounded-full border border-cyan-400/50 shadow-[0_0_15px_#00f3ff]" />
        </div>

        {/* Floor Light Reflections */}
        <div className="w-80 h-3 -mt-1 rounded-full bg-cyan-400/20 blur-sm" />
      </div>
    </div>
  );
}
