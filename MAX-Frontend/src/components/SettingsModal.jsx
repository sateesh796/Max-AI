import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  X,
  Volume2,
  Sparkles,
  Sun,
  Moon,
  User,
  Play,
  Globe,
  Check
} from 'lucide-react';
import {
  playSound,
  speakWithMAX,
  getVoiceVolume,
  setVoiceVolume,
  VOICE_PROFILES,
  getSelectedVoiceProfileId,
  setSelectedVoiceProfileId,
  getVoiceProfile
} from '../utils/audio';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../utils/languages';

export default function SettingsModal({
  isOpen,
  onClose,
  theme = 'dark',
  onThemeChange = () => {},
  currentLang = 'en-US',
  onLanguageChange = () => {},
  selectedVoiceId = 'girl',
  onVoiceSelect = () => {}
}) {
  const [activeProfileId, setActiveProfileId] = useState(() => getSelectedVoiceProfileId());
  const [volume, setVolumeState] = useState(() => getVoiceVolume()); // 1.0 (Max volume)
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  if (!isOpen) return null;

  const activeLangObj = getLanguageByCode(currentLang);

  const handleVolumeChange = (newVol) => {
    setVolumeState(newVol);
    setVoiceVolume(newVol);
  };

  const handleSelectProfile = (profile) => {
    playSound('click');
    setActiveProfileId(profile.id);
    setSelectedVoiceProfileId(profile.id);
    onVoiceSelect(profile.id);
    handleTestVoice(profile);
  };

  const handleTestVoice = (profileToUse) => {
    const profile = profileToUse || getVoiceProfile(activeProfileId);
    setIsTestingVoice(true);
    playSound('activate');

    const isEng = currentLang.startsWith('en');
    const msg = isEng
      ? (profile.gender === 'girl'
          ? `Hello! I am Girl AI. Realistic neural voice synthesis is online in ${activeLangObj.name}.`
          : `Greetings! I am Boy AI. Realistic neural voice core is active in ${activeLangObj.name}.`)
      : (profile.gender === 'girl'
          ? activeLangObj.girlVoiceMsg
          : activeLangObj.boyVoiceMsg);

    speakWithMAX(
      msg,
      {
        profile,
        lang: currentLang,
        volume
      },
      () => {
        setIsTestingVoice(false);
      }
    );
  };

  const indianLanguages = SUPPORTED_LANGUAGES.filter((l) => l.region === 'India');
  const globalLanguages = SUPPORTED_LANGUAGES.filter((l) => l.region === 'Global');

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
          className="relative w-full max-w-xl rounded-3xl glass-panel border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,243,255,0.15)] z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-cyan-500/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Settings className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="font-cyber text-lg sm:text-xl font-bold tracking-wider text-slate-100">
                  SYSTEM SETTINGS
                </h2>
                <p className="font-tech text-xs tracking-wider text-cyan-400 mt-0.5">
                  REALISTIC VOICE MODELS, ACCENT & APPEARANCE
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
            {/* 1. EXACTLY TWO REALISTIC VOICE MODELS: GIRL AI & BOY AI */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-tech text-slate-300 uppercase tracking-wider mb-3">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  Realistic AI Voice Models (Select One)
                </span>
                <span className="text-cyan-400 font-mono text-[11px] uppercase">
                  Active: {getVoiceProfile(activeProfileId).name}
                </span>
              </div>

              {/* Two Distinct Voice Model Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VOICE_PROFILES.map((profile) => {
                  const isSelected = activeProfileId === profile.id;
                  const isGirl = profile.gender === 'girl';

                  return (
                    <motion.button
                      key={profile.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectProfile(profile)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                        isSelected
                          ? isGirl
                            ? 'bg-fuchsia-950/40 border-fuchsia-400/80 shadow-[0_0_20px_rgba(217,70,239,0.3)]'
                            : 'bg-blue-950/40 border-blue-400/80 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                              isGirl
                                ? 'bg-fuchsia-500/20 border-fuchsia-400/60 text-fuchsia-300'
                                : 'bg-blue-500/20 border-blue-400/60 text-blue-300'
                            }`}
                          >
                            {isGirl ? (
                              <Sparkles className="w-5 h-5 animate-pulse" />
                            ) : (
                              <User className="w-5 h-5 animate-pulse" />
                            )}
                          </div>
                          <div>
                            <div className="font-cyber font-bold text-sm sm:text-base text-white">
                              {profile.name}
                            </div>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                                isGirl
                                  ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/40'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                              }`}
                            >
                              {profile.badge}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isGirl ? 'bg-fuchsia-400 text-slate-950' : 'bg-blue-400 text-slate-950'
                            } shadow-[0_0_10px_currentColor]`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 font-tech mt-2.5 leading-relaxed">
                        {profile.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Natural & Realistic</span>
                        <span
                          className={`flex items-center gap-1 font-semibold ${
                            isGirl ? 'text-fuchsia-300' : 'text-blue-300'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          {isSelected && isTestingVoice ? 'Speaking...' : 'Audition'}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 2. VOICE VOLUME AMPLIFIER SLIDER */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-tech text-slate-300 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                  Voice Volume (AI Loudness)
                </span>
                <span className="text-cyan-400 font-mono font-bold">
                  {Math.round(volume * 100)}% {volume >= 0.95 && '• MAX LOUD'}
                </span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.0"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>Standard (30%)</span>
                <span>Enhanced (70%)</span>
                <span className="text-cyan-400 font-bold">Amplified (100%)</span>
              </div>
            </div>

            {/* 3. APPEARANCE SETTING: Dark Cyber vs Light Frost */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-tech text-slate-300 uppercase tracking-wider mb-2.5">
                <span className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-cyan-400" />
                  Appearance Mode
                </span>
                <span className="text-cyan-400 font-mono text-[11px] uppercase">
                  {theme === 'dark' ? 'Dark Cyber' : 'Light Frost (Soft Blue)'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    playSound('click');
                    onThemeChange('dark');
                  }}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                    theme === 'dark'
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.25)]'
                      : 'bg-slate-950/60 border-slate-700/60 hover:border-slate-500 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-tech font-bold text-xs sm:text-sm text-slate-100">
                      Dark Cyber
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Deep void & neon
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    onThemeChange('light');
                  }}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                    theme === 'light'
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.25)]'
                      : 'bg-slate-950/60 border-slate-700/60 hover:border-slate-500 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-200 border border-cyan-600/40 flex items-center justify-center text-sky-800 shrink-0">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-tech font-bold text-xs sm:text-sm text-slate-100">
                      Light Frost
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Soft cyber blue
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* 4. MULTILINGUAL DIALECT SELECTOR (High Accuracy Indian & International) */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-tech text-slate-300 uppercase tracking-wider mb-2.5">
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Speech Language (Titles in English)
                </span>
                <span className="text-cyan-400 font-mono text-[11px] font-semibold">
                  {activeLangObj.flag} {activeLangObj.name} ({activeLangObj.nativeName})
                </span>
              </div>

              {/* Indian Languages Section */}
              <div className="mb-3">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
                  <span>🇮🇳 Indian Languages</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {indianLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        playSound('click');
                        onLanguageChange(l.code);
                      }}
                      className={`px-2.5 py-2 rounded-xl border text-left flex items-center justify-between transition-all group ${
                        currentLang === l.code
                          ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,243,255,0.25)]'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900/60'
                      }`}
                      title={`${l.name} (${l.nativeName})`}
                    >
                      <div className="min-w-0 pr-1">
                        <div className="text-xs font-tech font-bold text-slate-100 flex items-center gap-1.5 truncate">
                          <span>{l.flag}</span>
                          <span className="truncate">{l.name}</span>
                        </div>
                        <div className="text-[10px] font-mono text-cyan-400/80 truncate pl-5">
                          {l.nativeName}
                        </div>
                      </div>
                      {currentLang === l.code && (
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* International Languages Section */}
              <div>
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
                  <span>🌐 Other Countries</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {globalLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        playSound('click');
                        onLanguageChange(l.code);
                      }}
                      className={`px-2.5 py-2 rounded-xl border text-left flex items-center justify-between transition-all group ${
                        currentLang === l.code
                          ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,243,255,0.25)]'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900/60'
                      }`}
                      title={`${l.name} (${l.nativeName})`}
                    >
                      <div className="min-w-0 pr-1">
                        <div className="text-xs font-tech font-bold text-slate-100 flex items-center gap-1.5 truncate">
                          <span>{l.flag}</span>
                          <span className="truncate">{l.name}</span>
                        </div>
                        <div className="text-[10px] font-mono text-cyan-400/80 truncate pl-5">
                          {l.nativeName}
                        </div>
                      </div>
                      {currentLang === l.code && (
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
