import React from 'react';

/**
 * CyberBackground: Recreates the atmospheric high-tech cyber laboratory
 * Supports both 'dark' and 'light' appearance modes, and dynamically shifts
 * ambient colors across 4 distinct AI states:
 * - IDLE: Cool Cyber Cyan & Electric Blue
 * - LISTENING: Glowing Matrix Emerald & Neon Mint Green
 * - THINKING: Deep Mystic Ultraviolet & Nebula Purple
 * - SPEAKING: Radiant Solar Amber & Sunset Coral Gold
 */
export default function CyberBackground({ theme = 'dark', aiState = 'IDLE' }) {
  const isLight = theme === 'light';
  const state = aiState || 'IDLE';

  // Distinct atmospheric color palettes per state
  const statePalettes = {
    IDLE: {
      dark: {
        bg: 'from-[#020b1e] via-[#05112a] to-[#01040f]',
        archBorder: 'border-cyan-400/50 shadow-[0_10px_40px_rgba(0,243,255,0.25)]',
        archGlow: 'bg-cyan-500/20',
        ambienceLeft: 'bg-blue-600/15',
        ambienceRight: 'bg-cyan-500/15',
        rackBorder: 'border-cyan-500/30',
        rackLed1: 'bg-cyan-400 shadow-[0_0_10px_#00f3ff]',
        rackLed2: 'bg-blue-500 shadow-[0_0_8px_#3b82f6]',
        floorHorizon: 'linear-gradient(to top, #01040f 0%, rgba(3, 14, 38, 0.95) 40%, rgba(6, 22, 56, 0.4) 100%)',
        floorRadial: 'bg-cyan-500/25',
        gridLine: 'rgba(0, 243, 255, 0.14)',
      },
      light: {
        bg: 'from-[#e0ecfc] via-[#edf3fc] to-[#d8e6f8]',
        archBorder: 'border-cyan-500/60 shadow-[0_10px_40px_rgba(6,182,212,0.35)]',
        archGlow: 'bg-cyan-400/25',
        ambienceLeft: 'bg-blue-400/20',
        ambienceRight: 'bg-cyan-400/20',
        rackBorder: 'border-cyan-500/40',
        rackLed1: 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]',
        rackLed2: 'bg-blue-600',
        floorHorizon: 'linear-gradient(to top, #d8e5f8 0%, rgba(224, 236, 252, 0.9) 40%, rgba(237, 243, 252, 0.3) 100%)',
        floorRadial: 'bg-cyan-400/35',
        gridLine: 'rgba(14, 165, 233, 0.25)',
      },
    },
    LISTENING: {
      dark: {
        bg: 'from-[#011a11] via-[#032a1b] to-[#000f0a]',
        archBorder: 'border-emerald-400/70 shadow-[0_10px_45px_rgba(16,185,129,0.5)]',
        archGlow: 'bg-emerald-500/30',
        ambienceLeft: 'bg-emerald-600/25',
        ambienceRight: 'bg-teal-500/25',
        rackBorder: 'border-emerald-500/40',
        rackLed1: 'bg-emerald-400 shadow-[0_0_12px_#10b981]',
        rackLed2: 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]',
        floorHorizon: 'linear-gradient(to top, #000f0a 0%, rgba(2, 38, 24, 0.95) 40%, rgba(4, 55, 34, 0.4) 100%)',
        floorRadial: 'bg-emerald-500/35 shadow-[0_0_60px_#10b981]',
        gridLine: 'rgba(16, 185, 129, 0.25)',
      },
      light: {
        bg: 'from-[#dafbe8] via-[#eafdf1] to-[#c7f7db]',
        archBorder: 'border-emerald-500/70 shadow-[0_10px_40px_rgba(16,185,129,0.35)]',
        archGlow: 'bg-emerald-400/30',
        ambienceLeft: 'bg-emerald-400/25',
        ambienceRight: 'bg-teal-400/25',
        rackBorder: 'border-emerald-500/50',
        rackLed1: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',
        rackLed2: 'bg-teal-500',
        floorHorizon: 'linear-gradient(to top, #c7f7db 0%, rgba(218, 251, 232, 0.9) 40%, rgba(234, 253, 241, 0.3) 100%)',
        floorRadial: 'bg-emerald-400/40',
        gridLine: 'rgba(16, 185, 129, 0.3)',
      },
    },
    THINKING: {
      dark: {
        bg: 'from-[#170529] via-[#240a3d] to-[#0c0215]',
        archBorder: 'border-purple-400/70 shadow-[0_10px_45px_rgba(168,85,247,0.5)]',
        archGlow: 'bg-purple-600/30',
        ambienceLeft: 'bg-purple-700/25',
        ambienceRight: 'bg-fuchsia-600/25',
        rackBorder: 'border-purple-500/40',
        rackLed1: 'bg-purple-400 shadow-[0_0_12px_#a855f7]',
        rackLed2: 'bg-fuchsia-400 shadow-[0_0_8px_#e879f9]',
        floorHorizon: 'linear-gradient(to top, #0c0215 0%, rgba(32, 10, 56, 0.95) 40%, rgba(45, 14, 78, 0.4) 100%)',
        floorRadial: 'bg-purple-600/35 shadow-[0_0_60px_#a855f7]',
        gridLine: 'rgba(168, 85, 247, 0.25)',
      },
      light: {
        bg: 'from-[#f3e8ff] via-[#faf5ff] to-[#e9d5ff]',
        archBorder: 'border-purple-500/70 shadow-[0_10px_40px_rgba(168,85,247,0.35)]',
        archGlow: 'bg-purple-400/30',
        ambienceLeft: 'bg-purple-400/25',
        ambienceRight: 'bg-fuchsia-400/25',
        rackBorder: 'border-purple-500/50',
        rackLed1: 'bg-purple-500 shadow-[0_0_8px_#a855f7]',
        rackLed2: 'bg-fuchsia-500',
        floorHorizon: 'linear-gradient(to top, #e9d5ff 0%, rgba(243, 232, 255, 0.9) 40%, rgba(250, 245, 255, 0.3) 100%)',
        floorRadial: 'bg-purple-400/40',
        gridLine: 'rgba(168, 85, 247, 0.3)',
      },
    },
    SPEAKING: {
      dark: {
        bg: 'from-[#261203] via-[#3a1a05] to-[#140801]',
        archBorder: 'border-amber-400/70 shadow-[0_10px_45px_rgba(245,158,11,0.5)]',
        archGlow: 'bg-amber-500/30',
        ambienceLeft: 'bg-amber-600/25',
        ambienceRight: 'bg-orange-600/25',
        rackBorder: 'border-amber-500/40',
        rackLed1: 'bg-amber-400 shadow-[0_0_12px_#f59e0b]',
        rackLed2: 'bg-orange-400 shadow-[0_0_8px_#fb923c]',
        floorHorizon: 'linear-gradient(to top, #140801 0%, rgba(55, 24, 6, 0.95) 40%, rgba(75, 34, 8, 0.4) 100%)',
        floorRadial: 'bg-amber-500/35 shadow-[0_0_60px_#f59e0b]',
        gridLine: 'rgba(245, 158, 11, 0.25)',
      },
      light: {
        bg: 'from-[#fef3c7] via-[#fffbeb] to-[#fde68a]',
        archBorder: 'border-amber-500/70 shadow-[0_10px_40px_rgba(245,158,11,0.35)]',
        archGlow: 'bg-amber-400/30',
        ambienceLeft: 'bg-amber-400/25',
        ambienceRight: 'bg-orange-400/25',
        rackBorder: 'border-amber-500/50',
        rackLed1: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
        rackLed2: 'bg-orange-500',
        floorHorizon: 'linear-gradient(to top, #fde68a 0%, rgba(254, 243, 199, 0.9) 40%, rgba(255, 251, 235, 0.3) 100%)',
        floorRadial: 'bg-amber-400/40',
        gridLine: 'rgba(245, 158, 11, 0.3)',
      },
    },
  };

  const currentTheme = (statePalettes[state] || statePalettes.IDLE)[isLight ? 'light' : 'dark'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-700">
      {/* Base Cyber Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b transition-all duration-700 ${currentTheme.bg}`}
      />

      {/* Ceiling Light Arch Glow */}
      <div
        className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[350px] rounded-full border-b-[6px] blur-[2px] transition-all duration-700 opacity-80 ${currentTheme.archBorder}`}
      />
      <div
        className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] rounded-full blur-[90px] transition-all duration-700 ${currentTheme.archGlow}`}
      />

      {/* Left & Right Tech Ambience */}
      <div
        className={`absolute top-1/4 -left-20 w-80 h-96 rounded-full blur-[100px] transition-all duration-700 ${currentTheme.ambienceLeft}`}
      />
      <div
        className={`absolute top-1/4 -right-20 w-80 h-96 rounded-full blur-[100px] transition-all duration-700 ${currentTheme.ambienceRight}`}
      />

      {/* Background Server Rack Lighting Strips */}
      <div
        className={`hidden lg:flex absolute left-8 top-28 bottom-28 w-24 border-l flex-col justify-around py-12 transition-all duration-700 opacity-25 ${currentTheme.rackBorder}`}
      >
        <div className={`w-16 h-1 transition-all duration-700 ${currentTheme.rackLed1}`} />
        <div className={`w-12 h-1 transition-all duration-700 ${currentTheme.rackLed2}`} />
        <div className={`w-20 h-1 transition-all duration-700 ${currentTheme.rackLed1}`} />
        <div className={`w-10 h-1 transition-all duration-700 ${currentTheme.rackLed2}`} />
      </div>

      <div
        className={`hidden lg:flex absolute right-8 top-28 bottom-28 w-24 border-r flex-col justify-around py-12 items-end transition-all duration-700 opacity-25 ${currentTheme.rackBorder}`}
      >
        <div className={`w-16 h-1 transition-all duration-700 ${currentTheme.rackLed1}`} />
        <div className={`w-20 h-1 transition-all duration-700 ${currentTheme.rackLed2}`} />
        <div className={`w-12 h-1 transition-all duration-700 ${currentTheme.rackLed1}`} />
        <div className={`w-14 h-1 transition-all duration-700 ${currentTheme.rackLed2}`} />
      </div>

      {/* High-Gloss Reflective Floor Horizon */}
      <div
        className="absolute bottom-0 inset-x-0 h-1/2 transition-all duration-700"
        style={{
          background: currentTheme.floorHorizon,
          opacity: isLight ? 0.85 : 0.8,
        }}
      />

      {/* Floor Radial Light Pool under Pedestal */}
      <div
        className={`absolute bottom-16 left-1/2 -translate-x-1/2 w-[650px] h-[180px] rounded-[100%] blur-[40px] transition-all duration-700 ${currentTheme.floorRadial}`}
      />

      {/* Subtle Perspective Grid on Floor */}
      <div
        className="absolute bottom-0 inset-x-0 h-64 transition-opacity duration-700"
        style={{
          opacity: isLight ? 0.35 : 0.28,
          backgroundImage: `
            linear-gradient(to right, ${currentTheme.gridLine} 1px, transparent 1px),
            linear-gradient(to bottom, ${currentTheme.gridLine} 1px, transparent 1px)
          `,
          backgroundSize: '40px 20px',
          transform: 'perspective(400px) rotateX(60deg)',
          transformOrigin: 'bottom center',
        }}
      />
    </div>
  );
}
