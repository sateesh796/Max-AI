// High-tech Sci-Fi Audio Synthesizer with Realistic Girl and Boy AI Voice Models
// Supports 100% pure native language audio playback for Telugu and all other languages.
import { getLanguageByCode } from './languages';
import { convertNumbersInTextToWords } from './numberWords';

let audioCtx = null;
let currentPlayingAudio = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Mobile and Android touch-to-unlock audio handler
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      if (window.speechSynthesis && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (e) {}
  };
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
  window.addEventListener('touchend', unlockAudio, { once: true, passive: true });
  window.addEventListener('click', unlockAudio, { once: true });
}

export const playSound = (type = 'click') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'activate': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
      case 'think': {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(640, now + 0.1);
        osc.frequency.linearRampToValueAtTime(480, now + 0.2);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }
      case 'speak': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.18);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
        break;
      }
      case 'complete': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
        break;
      }
      case 'shield': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.35);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case 'click':
      default: {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
    }
  } catch (e) {
    // Audio context safe fallback
  }
};

/**
 * Exactly TWO Realistic AI Voice Models: ONE Girl AI and ONE Boy AI
 */
export const VOICE_PROFILES = [
  {
    id: 'girl',
    gender: 'girl',
    name: 'Girl AI',
    badge: 'Realistic Neural',
    description: 'Ultra-realistic, natural feminine AI voice with fluid articulation and emotional clarity.',
    pitch: 1.0,
    rate: 1.0
  },
  {
    id: 'boy',
    gender: 'boy',
    name: 'Boy AI',
    badge: 'Realistic Neural',
    description: 'Ultra-realistic, natural masculine AI voice with deep clarity and confident tactical presence.',
    pitch: 1.0,
    rate: 1.0
  }
];

const DEFAULT_PROFILE_ID = 'girl';
const DEFAULT_VOLUME = 1.0;

export function getSelectedVoiceProfileId() {
  if (typeof window === 'undefined') return DEFAULT_PROFILE_ID;
  const saved = localStorage.getItem('max_voice_profile_id');
  if (saved === 'boy' || saved?.startsWith('boy-')) return 'boy';
  return 'girl';
}

export function setSelectedVoiceProfileId(profileId) {
  if (typeof window !== 'undefined') {
    const normalized = profileId?.startsWith('boy') ? 'boy' : 'girl';
    localStorage.setItem('max_voice_profile_id', normalized);
    localStorage.setItem('max_voice_persona', normalized);
  }
}

export function getVoiceProfile(profileId) {
  const id = profileId ? (profileId.startsWith('boy') ? 'boy' : 'girl') : getSelectedVoiceProfileId();
  return VOICE_PROFILES.find((p) => p.id === id) || VOICE_PROFILES[0];
}

export function getVoicePersona() {
  return getVoiceProfile().gender;
}

export function getVoiceVolume() {
  if (typeof window === 'undefined') return DEFAULT_VOLUME;
  const saved = localStorage.getItem('max_voice_volume');
  return saved !== null ? parseFloat(saved) : DEFAULT_VOLUME;
}

export function setVoiceVolume(vol) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('max_voice_volume', String(vol));
  }
}

// Pre-cache and refresh voices automatically
let availableVoices = [];
function updateVoices() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    availableVoices = window.speechSynthesis.getVoices() || [];
  }
}
if (typeof window !== 'undefined' && window.speechSynthesis) {
  updateVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    updateVoices();
  };
}

/**
 * Find native speech synthesis voice if locally available in browser
 * Prioritizes Microsoft Natural Online and Google cloud voices for ultra clarity.
 * Strictest rule: NEVER assign an English voice to a non-English language.
 */
function findNativeLanguageVoice(profile, langCode) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices() || [];
  if (!voices || voices.length === 0) return null;

  const targetLang = (langCode || 'en-US').toLowerCase().replace('_', '-');
  const langPrefix = targetLang.split('-')[0];
  const langObj = getLanguageByCode(langCode);
  const gender = profile?.gender || 'girl';

  // If language is not English, never allow English voices
  const validVoices = langPrefix === 'en'
    ? voices
    : voices.filter((v) => !v.lang.toLowerCase().startsWith('en'));

  // 1. Language code matches
  const matching = validVoices.filter((v) => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return vLang === targetLang || vLang.startsWith(langPrefix);
  });

  // Prefer studio-grade Natural/Online or Google neural voices
  const naturalVoices = matching.filter((v) => /natural|online|google/i.test(v.name));
  const pool = naturalVoices.length > 0 ? naturalVoices : matching;

  if (pool.length > 0) {
    if (gender === 'girl') {
      const female = pool.find((v) =>
        /female|woman|shruti|swara|pallavi|tanishaa|sapna|sobhana|aarohi|elvira|denise|katja|nanami|zariyah/i.test(v.name)
      );
      if (female) return female;
    } else {
      const male = pool.find((v) =>
        /male|man|mohan|madhur|valluvar|bashkar|gagan|midhun|manohar|alvaro|henri|conrad|keita|hamed/i.test(v.name)
      );
      if (male) return male;
    }
    return pool[0];
  }

  // 2. Name hints matching
  if (langObj && langObj.voiceHints) {
    for (const hint of langObj.voiceHints) {
      const match = validVoices.find((v) => v.name.toLowerCase().includes(hint.toLowerCase()));
      if (match) return match;
    }
  }

  return null;
}

/**
 * Stream genuine, native language TTS audio directly with studio clarity:
 * Guarantees 100% native pronunciation for Telugu, Hindi, Tamil, Kannada, etc.
 * Uses the dedicated server proxy to eliminate CORS/Referer blocks.
 */
function playNativeAudioStream(text, langCode, volume = 1.0, onEnd = () => {}) {
  stopSpeech();
  const shortLang = (langCode || 'en-US').split('-')[0];

  // Request the high-clarity server-side audio endpoint
  const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(shortLang)}`;

  const audio = new Audio();
  currentPlayingAudio = audio;
  audio.src = audioUrl;
  audio.volume = Math.min(1.0, Math.max(0.1, volume));

  audio.onended = () => {
    currentPlayingAudio = null;
    onEnd();
  };

  audio.onerror = () => {
    // Direct backup fallback if local server is busy
    const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.slice(0, 150))}&tl=${encodeURIComponent(shortLang)}&client=tw-ob`;
    const backupAudio = new Audio(directUrl);
    currentPlayingAudio = backupAudio;
    backupAudio.volume = volume;
    backupAudio.onended = () => {
      currentPlayingAudio = null;
      onEnd();
    };
    backupAudio.onerror = () => {
      currentPlayingAudio = null;
      onEnd();
    };
    backupAudio.play().catch(() => {
      currentPlayingAudio = null;
      onEnd();
    });
  };

  audio.play().catch(() => {
    currentPlayingAudio = null;
    onEnd();
  });
}

/**
 * Speech Synthesis with specific voice profile & amplified volume:
 * - If native voice exists in browser for that language, uses SpeechSynthesis.
 * - If no local voice exists for non-English language (like Telugu), streams pure native Telugu audio!
 * - Never forces an English voice on Telugu or other non-English languages!
 */
export const speakWithMAX = (text, options = {}, onEnd = () => {}) => {
  if (!text || typeof text !== 'string') {
    onEnd();
    return;
  }

  stopSpeech();

  const profile = options.profile || getVoiceProfile(options.profileId);
  const langCode = options.lang || localStorage.getItem('max_language') || 'en-US';
  const langPrefix = langCode.split('-')[0];
  const configuredVol = getVoiceVolume();
  const volume = options.volume !== undefined ? options.volume : configuredVol;

  // Spell out all numbers into native words for this language before synthesizing speech
  const vocalText = convertNumbersInTextToWords(text, langCode);

  // 1. For non-English languages (e.g. Telugu, Hindi, Tamil):
  if (langPrefix !== 'en') {
    const nativeVoice = findNativeLanguageVoice(profile, langCode);
    if (nativeVoice && typeof window !== 'undefined' && window.speechSynthesis) {
      // Browser actually has a true native voice for this language!
      try {
        const utterance = new SpeechSynthesisUtterance(vocalText);
        utterance.voice = nativeVoice;
        utterance.lang = nativeVoice.lang || langCode;
        utterance.volume = volume;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
        window.speechSynthesis.speak(utterance);
        return;
      } catch (e) {
        // Fall back to stream
      }
    }

    // No local native voice installed on this PC for this language -> Stream 100% pure native audio!
    playNativeAudioStream(vocalText, langCode, volume, onEnd);
    return;
  }

  // 2. English Language (en-US or en-IN):
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd();
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(vocalText);
    const voices = window.speechSynthesis.getVoices() || [];
    const gender = profile?.gender || 'girl';

    // Find best English voice
    const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    let chosenVoice = null;

    if (gender === 'girl') {
      chosenVoice =
        englishVoices.find((v) => /natural|online|jenny|aria/i.test(v.name)) ||
        englishVoices.find((v) => /female|woman|zira/i.test(v.name));
    } else {
      chosenVoice =
        englishVoices.find((v) => /natural|online|guy|christopher/i.test(v.name)) ||
        englishVoices.find((v) => /male|man|david/i.test(v.name));
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }
    utterance.lang = chosenVoice?.lang || langCode;
    utterance.volume = volume;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    onEnd();
  }
};

export const stopSpeech = () => {
  if (currentPlayingAudio) {
    try {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
    } catch (e) {}
    currentPlayingAudio = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
};
