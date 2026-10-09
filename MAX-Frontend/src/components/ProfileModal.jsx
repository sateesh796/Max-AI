import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X, Shield, Award, Cpu, Radio, Fingerprint } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function ProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg rounded-3xl glass-panel border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,243,255,0.15)] z-10"
        >
          <div className="flex items-center justify-between pb-5 border-b border-cyan-500/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="font-cyber text-lg sm:text-xl font-bold tracking-wider text-slate-100">
                  OPERATOR PROFILE
                </h2>
                <p className="font-tech text-xs tracking-wider text-cyan-400 mt-0.5">
                  AUTHENTICATED NEURAL LINK #MAX-8902-ALPHA
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {/* Operator Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-cyber font-bold text-xl shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                AI
              </div>
              <div>
                <div className="font-cyber text-base font-bold text-slate-100">
                  Lead AI Engineer
                </div>
                <div className="text-xs text-cyan-400 font-tech mt-0.5">
                  Clearance Level: Alpha 5 (Root Access)
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Status: Neural Synchronization 99.4%
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800">
                <div className="text-xs font-tech text-slate-400 uppercase flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Neural Uptime
                </div>
                <div className="text-lg font-cyber font-bold text-slate-100 mt-1">99.98%</div>
                <div className="text-[10px] text-emerald-400 font-mono">Zero crashes recorded</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800">
                <div className="text-xs font-tech text-slate-400 uppercase flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                  Biometric Link
                </div>
                <div className="text-lg font-cyber font-bold text-purple-300 mt-1">VERIFIED</div>
                <div className="text-[10px] text-purple-400 font-mono">Hardware token active</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
