import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Radio } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function CommandBar({ state, onVoiceToggle, onSubmitMessage, disabled = false }) {
  const [inputVal, setInputVal] = useState('');
  const isListening = state === 'LISTENING';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || disabled) return;
    playSound('activate');
    onSubmitMessage && onSubmitMessage(inputVal.trim());
    setInputVal('');
  };

  const handleMicClick = () => {
    if (disabled) return;
    playSound('activate');
    onVoiceToggle && onVoiceToggle();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-xl mx-auto px-4 z-30"
    >
      <div className="command-bar-box relative group p-1.5 sm:p-2 rounded-full glass-panel border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,243,255,0.35),inset_0_0_15px_rgba(0,243,255,0.2)] flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,243,255,0.5)]">
        {/* Specular Glint along the top border */}
        <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent pointer-events-none" />

        {/* 1. Left Voice Microphone Button */}
        <motion.button
          type="button"
          whileHover={{ scale: disabled ? 1 : 1.08 }}
          whileTap={{ scale: disabled ? 1 : 0.94 }}
          onClick={handleMicClick}
          disabled={disabled}
          aria-label="Voice Input"
          className={`command-mic-btn relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
            isListening
              ? 'bg-cyan-500/30 border-cyan-300 shadow-[0_0_20px_#00f3ff] text-white animate-pulse'
              : 'bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border-cyan-400/60 hover:border-cyan-300 text-cyan-300 hover:text-white shadow-[0_0_15px_rgba(0,243,255,0.25)]'
          }`}
        >
          {isListening ? (
            <Radio className="w-5 h-5 text-cyan-300 animate-spin" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </motion.button>

        {/* 2. Middle Input Field */}
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type your message..."
          className="command-input flex-1 bg-transparent border-none outline-none font-sans text-sm sm:text-base text-white placeholder-cyan-200/50 px-2 py-1 tracking-wide"
        />

        {/* 3. Right Send Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: disabled ? 1 : 1.08 }}
          whileTap={{ scale: disabled ? 1 : 0.94 }}
          disabled={!inputVal.trim() || disabled}
          aria-label="Send Message"
          className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
            inputVal.trim() && !disabled
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-300 text-slate-950 shadow-[0_0_20px_#00f3ff]'
              : 'bg-slate-900/40 border-cyan-500/20 text-cyan-400/50 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5 -translate-x-[1px]" />
        </motion.button>
      </div>
    </form>
  );
}
