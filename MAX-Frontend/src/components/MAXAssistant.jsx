import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIOrb from './AIOrb';
import VoiceButton from './VoiceButton';
import { playSound, speakWithMAX, stopSpeech } from '../utils/audio';
import { Volume2, Sparkles, Terminal } from 'lucide-react';

/**
 * MAXAssistant: Central hero component containing the 3D AI Core,
 * dynamic status text, and interactive voice control.
 */
export default function MAXAssistant({ onOpenVoiceModal }) {
  const [aiState, setAiState] = useState('IDLE'); // IDLE, LISTENING, THINKING, SPEAKING
  const [statusMessage, setStatusMessage] = useState('How can I help you?');
  const [speakingText, setSpeakingText] = useState('');

  // Handle voice button click or core click
  const handleToggleVoice = () => {
    if (aiState === 'IDLE') {
      // Transition to LISTENING
      setAiState('LISTENING');
      setStatusMessage('Listening...');
      playSound('activate');

      // Simulate recognition after 2.5s -> THINKING
      setTimeout(() => {
        setAiState('THINKING');
        setStatusMessage('Thinking...');
        playSound('think');

        // After thinking for 1.8s -> SPEAKING
        setTimeout(() => {
          const sampleResponses = [
            "Online and ready. All neural networks operational, Commander. How can I assist you?",
            "Security perimeter verified. Quantum lattice encryption running smoothly.",
            "I've synchronized your academic schedule. 3 high-priority tasks pending review.",
            "All subroutines synchronized at 99.8% efficiency. Ready for your directive."
          ];
          const chosen = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
          
          setAiState('SPEAKING');
          setStatusMessage('Speaking...');
          setSpeakingText(chosen);
          playSound('speak');

          // Speak via Web Speech Synthesis API
          speakWithMAX(chosen, { pitch: 0.95, rate: 1.05 }, () => {
            // When finished speaking, return to IDLE
            setAiState('IDLE');
            setStatusMessage('How can I help you?');
            setSpeakingText('');
          });
        }, 1800);
      }, 2400);

    } else if (aiState === 'LISTENING') {
      // Force think
      setAiState('THINKING');
      setStatusMessage('Thinking...');
      playSound('think');
    } else {
      // Stop and reset to IDLE
      stopSpeech();
      setAiState('IDLE');
      setStatusMessage('How can I help you?');
      setSpeakingText('');
    }
  };

  // State text colors & glow styles
  const getStateColor = () => {
    switch (aiState) {
      case 'LISTENING':
        return 'text-cyan-300 drop-shadow-[0_0_12px_rgba(0,243,255,0.8)]';
      case 'THINKING':
        return 'text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]';
      case 'SPEAKING':
        return 'text-sky-200 drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]';
      case 'IDLE':
      default:
        return 'text-slate-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative z-10 py-4 max-w-xl mx-auto">
      {/* 3D AI Core Orb */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <AIOrb state={aiState} onClick={handleToggleVoice} />
      </motion.div>

      {/* Assistant Title: MAX */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mt-3 text-center"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <h1 className="font-cyber font-extrabold text-3xl sm:text-4xl tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400 cyber-text-glow">
            MAX
          </h1>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
        </div>

        {/* Dynamic Status Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={statusMessage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="mt-2"
          >
            <p className={`font-tech text-base sm:text-lg tracking-wider font-medium ${getStateColor()}`}>
              "{statusMessage}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Live Speaking Transcript Subtitle (if speaking) */}
        {aiState === 'SPEAKING' && speakingText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 px-4 py-2 rounded-xl bg-slate-900/70 border border-cyan-500/30 max-w-md text-xs sm:text-sm text-cyan-200/90 text-center backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            <span className="italic">"{speakingText}"</span>
          </motion.div>
        )}
      </motion.div>

      {/* Futuristic Voice / Microphone Button */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <VoiceButton state={aiState} onClick={handleToggleVoice} />

        {/* Interactive State Demo Controls (Subtle, sleek pills to showcase states) */}
        <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/50 backdrop-blur-md text-[11px] font-tech text-slate-400">
          <span className="text-slate-500 mr-1 uppercase tracking-wider text-[9px]">Mode:</span>
          {['IDLE', 'LISTENING', 'THINKING', 'SPEAKING'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setAiState(st);
                if (st === 'IDLE') {
                  stopSpeech();
                  setStatusMessage('How can I help you?');
                } else if (st === 'LISTENING') {
                  stopSpeech();
                  playSound('activate');
                  setStatusMessage('Listening...');
                } else if (st === 'THINKING') {
                  stopSpeech();
                  playSound('think');
                  setStatusMessage('Thinking...');
                } else if (st === 'SPEAKING') {
                  playSound('speak');
                  setStatusMessage('Speaking...');
                  const msg = "Neural subroutines active. Real-time cognitive interface enabled.";
                  setSpeakingText(msg);
                  speakWithMAX(msg, {}, () => {
                    setAiState('IDLE');
                    setStatusMessage('How can I help you?');
                    setSpeakingText('');
                  });
                }
              }}
              className={`px-2 py-0.5 rounded-full transition-all duration-200 ${
                aiState === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                  : 'hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
