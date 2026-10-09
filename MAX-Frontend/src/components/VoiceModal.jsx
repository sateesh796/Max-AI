import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Send, Sparkles, Volume2, Radio, Clock } from 'lucide-react';
import { playSound, speakWithMAX, stopSpeech, setSelectedVoiceProfileId } from '../utils/audio';
import { checkTimeDateQuery, formatTime, formatDate } from '../utils/dateTime';
import { getLocalizedDateTimeSpeech, getDefaultLanguage } from '../utils/languages';

export default function VoiceModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [history, setHistory] = useState([
    {
      sender: 'max',
      text: "Greetings, Commander. I am MAX AI. Direct audio and neural interface is active. How may I assist you today?",
      timestamp: formatTime(new Date()).formatted
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAsk = (textToAsk) => {
    const q = textToAsk || query;
    if (!q.trim() || isProcessing) return;

    playSound('activate');
    const nowStamp = formatTime(new Date()).formatted;
    const userMsg = { sender: 'user', text: q.trim(), timestamp: nowStamp };
    setHistory((prev) => [...prev, userMsg]);
    setQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      playSound('think');
      setTimeout(() => {
        let answer = "Directive processed successfully. All subroutines remain optimal.";
        const lower = q.toLowerCase();
        const activeLang = getDefaultLanguage();

        const temporalCheck = checkTimeDateQuery(q);
        if (temporalCheck) {
          answer = getLocalizedDateTimeSpeech(new Date(), activeLang);
        } else if (lower.includes('girl voice') || lower.includes('female voice')) {
          setSelectedVoiceProfileId('girl');
          answer = "Voice persona switched to realistic Girl AI. Feminine neural synthesis frequency active.";
        } else if (lower.includes('boy voice') || lower.includes('male voice') || lower.includes('boy ai')) {
          setSelectedVoiceProfileId('boy');
          answer = "Voice persona switched to realistic Boy AI. Masculine neural audio core active.";
        } else if (lower.includes('security') || lower.includes('diagnostic')) {
          answer = "Security perimeter verified. Quantum lattice encryption running smoothly with zero active anomalies.";
        } else if (lower.includes('task') || lower.includes('reminder')) {
          answer = "You have high-priority academic tasks pending. Neural reminder notifications are primed.";
        } else if (lower.includes('architecture') || lower.includes('who are you')) {
          answer = "I am MAX AI, a decentralized next-generation personal neural intelligence system engineered for autonomous computing.";
        }

        const maxMsg = { sender: 'max', text: answer, timestamp: formatTime(new Date()).formatted };
        setHistory((prev) => [...prev, maxMsg]);
        setIsProcessing(false);
        playSound('speak');
        speakWithMAX(answer, { lang: activeLang });
      }, 900);
    }, 500);
  };

  const samplePrompts = [
    "What time is it?",
    "What's today's date?",
    "Switch to girl voice",
    "Run security diagnostics",
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            stopSpeech();
            onClose();
          }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-xl rounded-3xl glass-panel border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,243,255,0.15)] z-10 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="font-cyber text-lg font-bold tracking-wider text-slate-100">
                  VOICE INTERACTION
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="font-tech text-xs tracking-wider text-cyan-400">
                    REAL-TIME SYNTHETIC COGNITION
                  </p>
                  <span className="text-cyan-500/40">•</span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{formatTime(currentTime).formatted}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                stopSpeech();
                playSound('click');
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat / Interaction Stream */}
          <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
            {history.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-sans ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-400/40 rounded-br-none'
                      : 'bg-slate-900/80 text-slate-200 border border-slate-800 rounded-bl-none shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  {msg.sender === 'max' && (
                    <div className="flex items-center gap-1.5 text-[10px] font-cyber text-cyan-400 mb-1">
                      <Sparkles className="w-3 h-3" />
                      MAX AI
                    </div>
                  )}
                  {msg.text}
                </div>
                {msg.timestamp && (
                  <span className="text-[9px] font-mono text-cyan-500/60 mt-0.5 px-1">
                    {msg.timestamp}
                  </span>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 text-xs font-tech text-cyan-400 animate-pulse">
                <Radio className="w-4 h-4 animate-spin" />
                MAX is synthesizing response...
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5 mb-3 shrink-0">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleAsk(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-cyan-500/20 text-[11px] font-tech text-cyan-300 hover:text-white transition-colors"
              >
                "{p}"
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2 shrink-0 pt-2 border-t border-cyan-500/15"
          >
            <input
              type="text"
              placeholder="Speak or type a prompt for MAX..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-slate-100 text-xs sm:text-sm outline-none"
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-tech font-bold text-xs uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
