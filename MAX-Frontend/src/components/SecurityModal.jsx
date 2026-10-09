import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  X,
  Lock,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Server,
  Activity
} from 'lucide-react';
import { playSound } from '../utils/audio';

export default function SecurityModal({ isOpen, onClose }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [neuralFirewall, setNeuralFirewall] = useState(true);
  const [dataIsolation, setDataIsolation] = useState(true);
  const [scanResult, setScanResult] = useState('All 1,024 Neural Nodes Secure');

  if (!isOpen) return null;

  const handleRunScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    playSound('think');

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanResult('Quantum Audit Passed • 0 Vulnerabilities');
          playSound('shield');
          return 100;
        }
        return prev + 10;
      });
    }, 180);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-3xl glass-panel border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,243,255,0.15)] z-10"
        >
          {/* Cyber Specular Light Bar */}
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-cyan-500/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-cyber text-lg sm:text-xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
                  SECURITY DEFENSE GRID
                </h2>
                <p className="font-tech text-xs tracking-wider text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  QUANTUM ENCRYPTION ACTIVE • LEVEL 5 PROTOCOL
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Diagnostic Scan Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Activity className={`w-5 h-5 text-cyan-400 ${isScanning ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <div className="font-tech text-sm font-semibold text-slate-200">
                  {isScanning ? `Running Deep Quantum Scan (${scanProgress}%)` : scanResult}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {isScanning ? 'Inspecting memory sectors & neural weights...' : 'Threat Index: 0.00 (Zero Anomalies)'}
                </div>
              </div>
            </div>

            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className={`px-4 py-2 rounded-xl font-tech text-xs tracking-wider uppercase font-semibold transition-all flex items-center gap-2 shrink-0 ${
                isScanning
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 opacity-75 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(0,243,255,0.4)]'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Run Audit'}
            </button>
          </div>

          {/* Scan Progress Bar */}
          {isScanning && (
            <div className="mt-2 w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-200"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          )}

          {/* Security Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
            {/* Feature 1 */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-950/50 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-tech text-sm text-slate-200 font-semibold">Neural Firewall</div>
                  <div className="text-[11px] text-slate-400">Packet inspection active</div>
                </div>
              </div>
              <button
                onClick={() => {
                  playSound('click');
                  setNeuralFirewall(!neuralFirewall);
                }}
                className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                  neuralFirewall ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    neuralFirewall ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Feature 2 */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-tech text-sm text-slate-200 font-semibold">Memory Sandbox</div>
                  <div className="text-[11px] text-slate-400">Zero cloud leakage</div>
                </div>
              </div>
              <button
                onClick={() => {
                  playSound('click');
                  setDataIsolation(!dataIsolation);
                }}
                className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                  dataIsolation ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    dataIsolation ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Feature 3 */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-tech text-sm text-slate-200 font-semibold">Lattice Encryption</div>
                  <div className="text-[11px] text-slate-400">Post-quantum standard</div>
                </div>
              </div>
              <span className="text-xs font-tech text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            {/* Feature 4 */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-tech text-sm text-slate-200 font-semibold">Perimeter Guard</div>
                  <div className="text-[11px] text-slate-400">Heuristic threat detection</div>
                </div>
              </div>
              <span className="text-xs font-tech text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                SECURE
              </span>
            </div>
          </div>

          {/* Audit Log Snippet */}
          <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-[11px] text-slate-400 flex flex-col gap-1">
            <div className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider">Audit Log:</div>
            <div className="flex items-center justify-between text-slate-300">
              <span>[11:24:18] Neural cryptographic handshake verified</span>
              <span className="text-emerald-400">OK</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>[11:18:02] Local sandbox integrity check 100% clean</span>
              <span className="text-emerald-400">OK</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
