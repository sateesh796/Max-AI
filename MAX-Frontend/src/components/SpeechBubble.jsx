import React from 'react';
import { motion } from 'framer-motion';
import { getLanguageByCode } from '../utils/languages';

export default function SpeechBubble({
  state = 'IDLE',
  message = 'How can I help you today?',
  currentLang = 'en-US'
}) {
  const isSpeaking = state === 'SPEAKING';
  const isListening = state === 'LISTENING';
  const isThinking = state === 'THINKING';
  const langObj = getLanguageByCode(currentLang);

  const isTaskCompleted = Boolean(message && message.toLowerCase().includes('has been completed'));

  const statusTitle = isTaskCompleted
    ? 'TASK COMPLETED'
    : isListening
    ? (langObj.listeningStatus || 'Listening...')
    : isThinking
    ? (langObj.thinkingStatus || 'Thinking...')
    : isSpeaking
    ? (langObj.speakingStatus || 'Speaking...')
    : (langObj.defaultStatus || 'Hello!');

  // Dynamic border & glow depending on state or task completion
  const borderClass = isTaskCompleted
    ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)]'
    : isListening
    ? 'border-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
    : isThinking
    ? 'border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
    : isSpeaking
    ? 'border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
    : 'border-cyan-400/40 shadow-[0_0_30px_rgba(0,243,255,0.25)]';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.5 },
        x: { duration: 0.5 },
        y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
      }}
      className={`speech-bubble-panel relative group p-4 sm:p-5 rounded-2xl sm:rounded-3xl glass-panel border max-w-xs sm:max-w-sm z-20 pointer-events-auto transition-all duration-500 ${borderClass}`}
    >
      {/* Speech Pointer Tail pointing left towards the sphere */}
      <div className="hidden lg:block absolute -left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#09152e] border-l border-b border-cyan-400 transform rotate-45 pointer-events-none speech-tail" />

      {/* Top Header with Waveform */}
      <div className="flex items-center gap-2.5">
        {/* Animated Sound Waveform Bars */}
        <div className="flex items-end gap-1 h-5">
          <motion.span
            animate={
              isSpeaking || isListening
                ? { height: ['4px', '18px', '8px', '16px', '4px'] }
                : { height: ['4px', '10px', '4px'] }
            }
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 rounded-full bg-cyan-400"
          />
          <motion.span
            animate={
              isSpeaking || isListening
                ? { height: ['12px', '4px', '20px', '8px', '12px'] }
                : { height: ['8px', '14px', '8px'] }
            }
            transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            className="w-1 rounded-full bg-cyan-300"
          />
          <motion.span
            animate={
              isSpeaking || isListening
                ? { height: ['6px', '18px', '10px', '20px', '6px'] }
                : { height: ['12px', '6px', '12px'] }
            }
            transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            className="w-1 rounded-full bg-cyan-400"
          />
          <motion.span
            animate={
              isSpeaking || isListening
                ? { height: ['16px', '6px', '14px', '4px', '16px'] }
                : { height: ['6px', '12px', '6px'] }
            }
            transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="w-1 rounded-full bg-sky-300"
          />
        </div>

        <h3 className="speech-title font-cyber font-bold text-lg sm:text-xl text-white tracking-wide flex items-center gap-2 drop-shadow-[0_0_8px_#00f3ff]">
          {statusTitle}
        </h3>
      </div>

      {/* Message Subtext */}
      <p className="speech-message font-tech text-sm sm:text-base text-cyan-200/90 mt-1.5 tracking-wide leading-relaxed font-medium">
        {message}
      </p>

      {/* Live AI State Tag */}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-cyan-500/20 text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="speech-status">{langObj.flag} {langObj.name} // ONLINE</span>
      </div>
    </motion.div>
  );
}
