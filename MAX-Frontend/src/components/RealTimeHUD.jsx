import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Calendar as CalendarIcon,
  Globe,
  Volume2,
  ChevronRight,
  Sparkles,
  RotateCw
} from 'lucide-react';
import { formatTime, formatDate, getTimezoneInfo } from '../utils/dateTime';
import { playSound } from '../utils/audio';

export default function RealTimeHUD({ onAskTime }) {
  const [now, setNow] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeData = formatTime(now, is24Hour, true);
  const dateData = formatDate(now);
  const tzData = getTimezoneInfo(now);

  const secondsRatio = (now.getSeconds() / 60) * 100;

  // Mini calendar calculation for current month
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative group p-4 sm:p-5 rounded-2xl sm:rounded-3xl glass-panel border border-cyan-400/40 shadow-[0_0_30px_rgba(0,243,255,0.2)] max-w-xs sm:max-w-sm w-full z-20 pointer-events-auto overflow-hidden"
    >
      {/* Specular Ambient Glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity pointer-events-none" />

      {/* Cyber Corner Decals */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.3)]">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <span className="font-cyber text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
              CHRONO MATRIX
            </span>
            <span className="font-mono text-[9px] text-cyan-400/80 tracking-widest block uppercase">
              REAL-TIME TEMPORAL SYNC
            </span>
          </div>
        </div>

        {/* 12H / 24H Toggle */}
        <button
          onClick={() => {
            playSound('click');
            setIs24Hour((prev) => !prev);
          }}
          title="Toggle 12H / 24H Mode"
          className="px-2 py-0.5 rounded-lg bg-slate-900/80 border border-cyan-400/30 hover:border-cyan-400 text-[10px] font-mono text-cyan-300 font-semibold transition-all hover:bg-cyan-500/20"
        >
          {is24Hour ? '24H' : '12H'}
        </button>
      </div>

      {/* Primary Clock Digits */}
      <div className="mt-3.5 flex flex-col items-center justify-center relative z-10 py-1">
        <div className="flex items-baseline gap-1 text-white font-cyber drop-shadow-[0_0_15px_rgba(0,243,255,0.7)]">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {timeData.hours}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 animate-pulse">
            :
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {timeData.minutes}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 animate-pulse">
            :
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cyan-300">
            {timeData.seconds}
          </span>

          {timeData.period && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300 tracking-wider">
              {timeData.period}
            </span>
          )}
        </div>

        {/* Smooth Seconds Progress Bar */}
        <div className="w-full mt-2.5 h-1.5 rounded-full bg-slate-800/80 overflow-hidden border border-cyan-500/20 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 shadow-[0_0_10px_#00f3ff]"
            style={{ width: `${secondsRatio}%` }}
            transition={{ ease: 'linear', duration: 0.2 }}
          />
        </div>
      </div>

      {/* Date & Day Banner */}
      <div className="mt-3.5 p-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/25 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex flex-col">
            <span className="font-tech text-xs sm:text-sm font-bold text-slate-100 tracking-wider">
              {dateData.dayName.toUpperCase()}
            </span>
            <span className="font-mono text-[11px] text-cyan-300 font-medium">
              {dateData.monthNameShort} {dateData.dayNum}, {dateData.year}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/30 text-[9px] font-mono text-cyan-300 font-semibold block">
            DOY {dateData.dayOfYear}
          </span>
          <span className="text-[9px] font-tech text-slate-400 block mt-0.5">
            {dateData.isoDate}
          </span>
        </div>
      </div>

      {/* Timezone & Atomic Sync Pill */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] font-tech text-slate-400 relative z-10 px-0.5">
        <div className="flex items-center gap-1 text-slate-300">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span className="truncate max-w-[170px]" title={tzData.display}>
            {tzData.display}
          </span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
          <span>SYNCED</span>
        </div>
      </div>

      {/* Action Buttons: Ask MAX & Toggle Mini Calendar */}
      <div className="mt-3 pt-3 border-t border-cyan-500/20 flex items-center gap-2 relative z-10">
        <button
          onClick={() => {
            playSound('click');
            setShowCalendar((prev) => !prev);
          }}
          className={`flex-1 py-1.5 px-2.5 rounded-xl border text-xs font-tech font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-all ${
            showCalendar
              ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,243,255,0.3)]'
              : 'bg-slate-900/60 border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>{showCalendar ? 'Hide Calendar' : 'Cyber Calendar'}</span>
        </button>

        <button
          onClick={() => {
            playSound('speak');
            if (onAskTime) {
              onAskTime();
            }
          }}
          title="Ask MAX to speak current real time and date"
          className="py-1.5 px-3 rounded-xl bg-cyan-950/70 border border-cyan-400/40 hover:border-cyan-300 hover:bg-cyan-900/80 text-cyan-300 hover:text-white text-xs font-tech font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)]"
        >
          <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Voice</span>
        </button>
      </div>

      {/* Collapsible Mini Cyber Calendar View */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-3 pt-3 border-t border-cyan-500/20 relative z-10"
          >
            <div className="text-center font-tech text-xs text-cyan-300 font-bold tracking-wider mb-2">
              {dateData.monthName.toUpperCase()} {dateData.year}
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-400 mb-1">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-tech">
              {paddingDays.map((p) => (
                <span key={`pad-${p}`} className="p-1 opacity-0 pointer-events-none" />
              ))}
              {daysArray.map((d) => {
                const isToday = d === dateData.dayNum;
                return (
                  <span
                    key={`day-${d}`}
                    className={`py-1 rounded-lg transition-all ${
                      isToday
                        ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_10px_#00f3ff]'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    {d}
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
