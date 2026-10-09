import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Sparkles,
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  Volume2,
  CheckCircle2,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';
import { playSound, speakWithMAX } from '../utils/audio';
import { getLanguageByCode } from '../utils/languages';

const KNOWLEDGE_BASE = [
  {
    id: '1',
    title: 'Neural Transformer Architecture Overview',
    snippet: 'Multi-head attention mechanisms applied to autonomous edge inference and real-time cognition.',
    category: 'Cognitive Intelligence',
    confidence: 98,
    relevance: 95,
    tag: 'AI Research',
    speed: '8ms'
  },
  {
    id: '2',
    title: 'Quantum Key Distribution & Lattice Protocols',
    snippet: 'Post-quantum cryptographic defenses against Shor algorithmic factorization and side-channel entropy.',
    category: 'Quantum Systems',
    confidence: 94,
    relevance: 89,
    tag: 'Security',
    speed: '12ms'
  },
  {
    id: '3',
    title: 'Autonomous Multi-Agent Task Synchronization',
    snippet: 'Decentralized scheduling heuristics for real-time task queues, priority resolution, and distributed nodes.',
    category: 'Autonomous Logic',
    confidence: 96,
    relevance: 92,
    tag: 'Systems',
    speed: '9ms'
  },
  {
    id: '4',
    title: 'Multi-Lingual Synthetic Phoneme Modeling',
    snippet: 'Real-time acoustic formant adaptation across Indic and International language families.',
    category: 'Language Synthesis',
    confidence: 91,
    relevance: 87,
    tag: 'Audio Acoustics',
    speed: '14ms'
  },
  {
    id: '5',
    title: 'Temporal Synchronization & Chrono Telemetry',
    snippet: 'Precision clock crystal calibration and multi-zone temporal voice synthesis engines.',
    category: 'Temporal Systems',
    confidence: 99,
    relevance: 96,
    tag: 'Real-Time',
    speed: '6ms'
  }
];

export default function SearchModal({
  isOpen,
  onClose,
  initialQuery = '',
  currentLang = 'en-US',
  selectedVoiceId = 'girl'
}) {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'results' | 'all'
  const [isSpeakingChart, setIsSpeakingChart] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  if (!isOpen) return null;

  // Filtered results
  const filteredResults = useMemo(() => {
    if (!query.trim()) return KNOWLEDGE_BASE;
    const lower = query.toLowerCase();
    return KNOWLEDGE_BASE.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.snippet.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.tag.toLowerCase().includes(lower)
    );
  }, [query]);

  // Dynamic Chart Board Metrics calculated from query & findings
  const chartMetrics = useMemo(() => {
    const count = filteredResults.length;
    const baseFactor = count > 0 ? count / KNOWLEDGE_BASE.length : 0.4;
    const qLen = query.trim().length;

    const confidenceScore = Math.min(99, Math.max(78, Math.round(92 + (count * 1.5) - (qLen > 20 ? 4 : 0))));
    const semanticDensity = Math.min(98, Math.max(70, Math.round(85 + (count * 2.2))));
    const alignmentRatio = Math.min(97, Math.max(65, Math.round(88 + (qLen > 0 ? 6 : 0))));
    const synapseRate = Math.min(99, Math.max(80, Math.round(94 + count)));

    return {
      confidence: confidenceScore,
      semanticDensity,
      alignmentRatio,
      synapseRate,
      latency: Math.max(5, Math.round(18 - count * 2)),
      matchCount: count,
      quantumLoad: 42,
      intelligenceLoad: 33,
      autonomousLoad: 17,
      acousticsLoad: 8
    };
  }, [query, filteredResults]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    playSound('think');
  };

  const handleSpeakChartAnalysis = () => {
    setIsSpeakingChart(true);
    playSound('speak');

    const langObj = getLanguageByCode(currentLang);
    const summaryText = langObj?.chartBoardSpoken
      ? langObj.chartBoardSpoken(query.trim(), chartMetrics.matchCount, chartMetrics.confidence, chartMetrics.latency)
      : (query.trim()
        ? `Chart Board analysis for "${query}": Found ${chartMetrics.matchCount} matching neural records.`
        : `Chart Board telemetry: All neural matrices reporting at ${chartMetrics.confidence} percent.`);

    speakWithMAX(
      summaryText,
      {
        lang: currentLang,
        profileId: selectedVoiceId,
        volume: 1.0
      },
      () => {
        setIsSpeakingChart(false);
      }
    );
  };

  const quickPills = [
    'Neural Architecture',
    'Quantum Encryption',
    'Language Synthesis',
    'Chrono Telemetry',
    'Task Synchronization'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl rounded-3xl glass-panel border border-cyan-400/40 p-5 sm:p-7 shadow-[0_0_60px_rgba(0,243,255,0.2)] z-10 flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-900/60 to-blue-900/60 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                <BarChart3 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-cyber text-lg sm:text-xl font-bold tracking-wider text-white">
                    NEURAL SEARCH & CHART BOARD
                  </h2>
                  <span className="text-[10px] font-tech font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/50 text-cyan-300">
                    LIVE
                  </span>
                </div>
                <p className="font-tech text-xs tracking-wider text-cyan-300/90 mt-0.5">
                  REAL-TIME TELEMETRY, DATA VISUALIZATIONS & KNOWLEDGE RETRIEVAL
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-4 relative shrink-0">
            <input
              type="text"
              placeholder="Search concepts, models, quantum keys, tasks, or queries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 pr-24 rounded-2xl bg-slate-950/85 border border-cyan-400/50 text-sm text-white placeholder-cyan-200/40 outline-none focus:border-cyan-300 shadow-[0_0_20px_rgba(0,243,255,0.15)] transition-all"
            />
            <Search className="w-5 h-5 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-2 py-1"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-tech font-bold text-xs flex items-center gap-1 transition-all shadow-[0_0_10px_#00f3ff]"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2 shrink-0 no-scrollbar">
            <span className="text-[11px] font-tech text-cyan-400/70 uppercase tracking-wider shrink-0 mr-1">
              Quick:
            </span>
            {quickPills.map((pill) => (
              <button
                key={pill}
                onClick={() => {
                  playSound('click');
                  setQuery(pill);
                }}
                className={`text-xs px-2.5 py-1 rounded-xl font-tech transition-all whitespace-nowrap border ${
                  query === pill
                    ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,243,255,0.4)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Tab Switcher: Chart Board vs Knowledge Results */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pt-1 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  setActiveTab('chart');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-cyber font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'chart'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_#00f3ff]'
                    : 'text-cyan-300/80 hover:text-white bg-slate-900/50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>CHART BOARD</span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setActiveTab('results');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-cyber font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'results'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_#00f3ff]'
                    : 'text-cyan-300/80 hover:text-white bg-slate-900/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>KNOWLEDGE ITEMS ({filteredResults.length})</span>
              </button>
            </div>

            {/* Voice Audio Readout of Chart */}
            <button
              onClick={handleSpeakChartAnalysis}
              className={`px-3 py-1.5 rounded-xl text-xs font-tech font-bold flex items-center gap-1.5 border transition-all ${
                isSpeakingChart
                  ? 'bg-cyan-400/30 border-cyan-300 text-white animate-pulse shadow-[0_0_15px_#00f3ff]'
                  : 'bg-cyan-950/60 border-cyan-400/40 text-cyan-300 hover:border-cyan-300 hover:text-white'
              }`}
              title="Voice the Chart Board results aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeakingChart ? 'Speaking...' : 'Voice Chart'}</span>
            </button>
          </div>

          {/* Main Scrollable Content */}
          <div className="mt-3 overflow-y-auto flex-1 space-y-4 pr-1">
            {/* VIEW 1: THE CHART BOARD */}
            {(activeTab === 'chart' || activeTab === 'all') && (
              <div className="space-y-4">
                {/* 1. Metric Telemetry Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-cyan-400/30 flex flex-col">
                    <span className="text-[10px] font-tech text-cyan-300/80 uppercase">Confidence</span>
                    <span className="text-xl sm:text-2xl font-cyber font-bold text-white drop-shadow-[0_0_8px_#00f3ff]">
                      {chartMetrics.confidence}%
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 mt-0.5">Optimal Range</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-purple-400/30 flex flex-col">
                    <span className="text-[10px] font-tech text-purple-300/80 uppercase">Semantic Density</span>
                    <span className="text-xl sm:text-2xl font-cyber font-bold text-purple-200 drop-shadow-[0_0_8px_#a855f7]">
                      {chartMetrics.semanticDensity}%
                    </span>
                    <span className="text-[9px] font-mono text-purple-400 mt-0.5">High Coherence</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-sky-400/30 flex flex-col">
                    <span className="text-[10px] font-tech text-sky-300/80 uppercase">Vector Alignment</span>
                    <span className="text-xl sm:text-2xl font-cyber font-bold text-sky-200 drop-shadow-[0_0_8px_#38bdf8]">
                      {chartMetrics.alignmentRatio}%
                    </span>
                    <span className="text-[9px] font-mono text-sky-400 mt-0.5">Cross-Referenced</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/70 border border-emerald-400/30 flex flex-col">
                    <span className="text-[10px] font-tech text-emerald-300/80 uppercase">Latency Speed</span>
                    <span className="text-xl sm:text-2xl font-cyber font-bold text-emerald-200 drop-shadow-[0_0_8px_#10b981]">
                      {chartMetrics.latency}ms
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 mt-0.5">Ultra Real-Time</span>
                  </div>
                </div>

                {/* 2. Visual Progress Bar Chart: Neural Attributes */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-400/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-cyber font-bold text-cyan-300 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      COGNITIVE ATTRIBUTE DISTRIBUTION CHART
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400/70">
                      Query: {query ? `"${query}"` : 'Global Baseline'}
                    </span>
                  </div>

                  {/* Bar 1: Knowledge Confidence */}
                  <div>
                    <div className="flex justify-between text-xs font-tech text-slate-300 mb-1">
                      <span>Neural Retrieval Confidence</span>
                      <span className="font-mono text-cyan-300 font-bold">{chartMetrics.confidence}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-cyan-500/20 p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${chartMetrics.confidence}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_#00f3ff]"
                      />
                    </div>
                  </div>

                  {/* Bar 2: Semantic Density */}
                  <div>
                    <div className="flex justify-between text-xs font-tech text-slate-300 mb-1">
                      <span>Semantic Information Density</span>
                      <span className="font-mono text-purple-300 font-bold">{chartMetrics.semanticDensity}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-purple-500/20 p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${chartMetrics.semanticDensity}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_#a855f7]"
                      />
                    </div>
                  </div>

                  {/* Bar 3: Vector Alignment */}
                  <div>
                    <div className="flex justify-between text-xs font-tech text-slate-300 mb-1">
                      <span>Lattice Vector Alignment</span>
                      <span className="font-mono text-sky-300 font-bold">{chartMetrics.alignmentRatio}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-sky-500/20 p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${chartMetrics.alignmentRatio}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 shadow-[0_0_10px_#38bdf8]"
                      />
                    </div>
                  </div>

                  {/* Bar 4: Synaptic Throughput */}
                  <div>
                    <div className="flex justify-between text-xs font-tech text-slate-300 mb-1">
                      <span>Synaptic Cognition Throughput</span>
                      <span className="font-mono text-emerald-300 font-bold">{chartMetrics.synapseRate}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-emerald-500/20 p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${chartMetrics.synapseRate}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_#10b981]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Segmented Domain Allocation Chart */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-400/30">
                  <div className="flex items-center justify-between text-xs font-cyber font-bold text-white mb-2.5">
                    <span>DOMAIN ALLOCATION PROPORTIONS</span>
                    <span className="text-[10px] font-mono text-cyan-400">100% Normalized</span>
                  </div>

                  {/* Segmented Stacked Bar */}
                  <div className="w-full h-4 rounded-xl bg-slate-950 overflow-hidden flex border border-slate-700">
                    <div
                      style={{ width: `${chartMetrics.quantumLoad}%` }}
                      className="bg-cyan-500 h-full relative group cursor-pointer hover:opacity-90 transition-opacity"
                      title={`Quantum Systems: ${chartMetrics.quantumLoad}%`}
                    />
                    <div
                      style={{ width: `${chartMetrics.intelligenceLoad}%` }}
                      className="bg-purple-500 h-full relative group cursor-pointer hover:opacity-90 transition-opacity"
                      title={`Cognitive Intelligence: ${chartMetrics.intelligenceLoad}%`}
                    />
                    <div
                      style={{ width: `${chartMetrics.autonomousLoad}%` }}
                      className="bg-sky-400 h-full relative group cursor-pointer hover:opacity-90 transition-opacity"
                      title={`Autonomous Logic: ${chartMetrics.autonomousLoad}%`}
                    />
                    <div
                      style={{ width: `${chartMetrics.acousticsLoad}%` }}
                      className="bg-emerald-400 h-full relative group cursor-pointer hover:opacity-90 transition-opacity"
                      title={`Language Synthesis: ${chartMetrics.acousticsLoad}%`}
                    />
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px] font-tech text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_6px_#00f3ff]" />
                      <span>Quantum ({chartMetrics.quantumLoad}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" />
                      <span>Cognitive ({chartMetrics.intelligenceLoad}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                      <span>Autonomous ({chartMetrics.autonomousLoad}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                      <span>Language ({chartMetrics.acousticsLoad}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: KNOWLEDGE ITEMS */}
            {(activeTab === 'results' || activeTab === 'all') && (
              <div className="space-y-3">
                <div className="text-xs font-tech text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Matched Knowledge Records</span>
                  <span className="font-mono text-[11px]">{filteredResults.length} records retrieved</span>
                </div>

                {filteredResults.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                    <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-slate-300 font-sans">
                      No matching records for "{query}".
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try searching for "Neural", "Quantum", "Language", or "Temporal".
                    </p>
                  </div>
                ) : (
                  filteredResults.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-slate-900/65 border border-slate-800 hover:border-cyan-400/50 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_20px_rgba(0,243,255,0.15)]"
                      onClick={() => {
                        playSound('click');
                        speakWithMAX(item.title + '. ' + item.snippet, {
                          lang: currentLang,
                          profileId: selectedVoiceId,
                          volume: 1.0
                        });
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-sans text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-emerald-400">
                            {item.speed}
                          </span>
                          <span className="text-[10px] font-tech text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30">
                            {item.tag}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-1.5 font-sans leading-relaxed">
                        {item.snippet}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400/70">
                        <span>Category: {item.category}</span>
                        <span className="flex items-center gap-1 text-cyan-300 group-hover:underline">
                          <Volume2 className="w-3 h-3" />
                          Click to Speak Record
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
