import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Radio, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

/**
 * VoiceButton: Futuristic cyber voice input button below MAX
 */
export default function VoiceButton({ state, onClick, disabled }) {
  const isListening = state === 'LISTENING';
  const isThinking = state === 'THINKING';
  const isSpeaking = state === 'SPEAKING';

  const handleClick = (e) => {
    if (disabled) return;
    playSound('activate');
    onClick && onClick(e);
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Dynamic Pulse Waves when Listening */}
      {isListening && (
        <>
          <motion.div
            className="absolute rounded-full border border-cyan-400/40 bg-cyan-500/10"
            style={{ width: 84, height: 84 }}
            animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute rounded-full border border-cyan-400/30"
            style={{ width: 84, height: 84 }}
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
          />
        </>
      )}

      {/* Rotating Energy Halo when Thinking */}
      {isThinking && (
        <motion.div
          className="absolute rounded-full border-2 border-t-purple-500 border-r-cyan-400 border-b-transparent border-l-transparent pointer-events-none"
          style={{ width: 82, height: 82 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Audio Waveform Flares when Speaking */}
      {isSpeaking && (
        <motion.div
          className="absolute rounded-full bg-cyan-400/20 blur-md pointer-events-none"
          style={{ width: 88, height: 88 }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Main Interactive Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleClick}
        disabled={disabled}
        aria-label="Activate Voice Assistant"
        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-xl border ${
          isListening
            ? 'bg-gradient-to-br from-cyan-500/30 to-blue-600/40 border-cyan-300 shadow-[0_0_30px_rgba(0,243,255,0.6)] text-cyan-200'
            : isThinking
            ? 'bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.5)] text-purple-200'
            : isSpeaking
            ? 'bg-gradient-to-br from-sky-500/30 to-cyan-500/30 border-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.5)] text-white'
            : 'bg-slate-900/70 border-cyan-500/30 hover:border-cyan-400/70 text-cyan-400 hover:text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]'
        }`}
      >
        {/* Specular Glint */}
        <div className="absolute inset-x-2 top-1 h-3 rounded-full bg-white/10 blur-[1px] pointer-events-none" />

        {isListening ? (
          <Radio className="w-7 h-7 animate-pulse text-cyan-300" />
        ) : isThinking ? (
          <Sparkles className="w-7 h-7 text-purple-300 animate-spin" />
        ) : (
          <Mic className="w-7 h-7 transition-colors duration-200" />
        )}
      </motion.button>
    </div>
  );
}
