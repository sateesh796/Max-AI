import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Clock, Bell } from 'lucide-react';
import CyberBackground from './components/CyberBackground';
import HeaderBadge from './components/HeaderBadge';
import SideMenu from './components/SideMenu';
import AIOrb from './components/AIOrb';
import AIVariations from './components/AIVariations';
import SpeechBubble from './components/SpeechBubble';
import CommandBar from './components/CommandBar';
import TaskModal from './components/TaskModal';
import SettingsModal from './components/SettingsModal';
import SearchModal from './components/SearchModal';
import VoiceModal from './components/VoiceModal';
import {
  playSound,
  speakWithMAX,
  stopSpeech,
  getVoiceVolume,
  setVoiceVolume,
  VOICE_PROFILES,
  getSelectedVoiceProfileId,
  setSelectedVoiceProfileId,
  getVoiceProfile
} from './utils/audio';
import {
  getBackendStatus,
  sendChatMessage,
  sendCommand,
  sendVoiceAudio,
  getApiErrorMessage,
} from './utils/api';
import { getVoiceCommandAction } from './utils/voiceCommands';
import { canStartVoiceInput } from './utils/voiceAvailability';
import { checkTimeDateQuery, formatTime, formatDate } from './utils/dateTime';
import {
  SUPPORTED_LANGUAGES,
  getDefaultLanguage,
  saveLanguage,
  getLanguageByCode,
  getLocalizedDateTimeSpeech
} from './utils/languages';

export default function App() {
  const [aiState, setAiState] = useState('IDLE');
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTaskNotification, setCompletedTaskNotification] = useState(null);
  const [statusMessage, setStatusMessage] = useState('MAX brain online');
  const [currentTask, setCurrentTask] = useState('Ready');
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioAnalyzerRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const requestTokenRef = useRef(0);
  const voiceRecordingSessionRef = useRef(0);
  const voiceTimeoutRef = useRef(null);
  const voiceCaptureRef = useRef(null);

  // Multilingual State (Indian & International languages)
  const [currentLang, setCurrentLangState] = useState(() => {
    return getDefaultLanguage();
  });

  const activeLangObj = getLanguageByCode(currentLang);
  const [bubbleMessage, setBubbleMessage] = useState(activeLangObj.greeting);

  // Appearance Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('max_theme') || 'dark';
    }
    return 'dark';
  });

  // Selected Realistic Voice Profile ('girl' or 'boy')
  const [selectedVoiceId, setSelectedVoiceId] = useState(() => {
    return getSelectedVoiceProfileId();
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('max_theme', theme);
      document.documentElement.className = theme;
    }
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    const checkConnection = async () => {
      try {
        const status = await getBackendStatus();
        if (!cancelled) {
          setConnectionStatus(status?.status === 'ok' ? 'online' : 'offline');
          setStatusMessage(status?.backend || 'MAX brain online');
        }
      } catch (error) {
        if (!cancelled) {
          setConnectionStatus('offline');
          setStatusMessage('Backend unavailable');
          setErrorMessage(getApiErrorMessage(error));
        }
      }
    };

    checkConnection();
    const timer = window.setInterval(checkConnection, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => () => {
    stopSpeech();
    if (voiceTimeoutRef.current) {
      window.clearTimeout(voiceTimeoutRef.current);
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleVoiceSelect = (profileId) => {
    const normalized = profileId?.startsWith('boy') ? 'boy' : 'girl';
    setSelectedVoiceId(normalized);
    setSelectedVoiceProfileId(normalized);
  };

  const handleSetLanguage = (langCode) => {
    setCurrentLangState(langCode);
    saveLanguage(langCode);
    const langObj = getLanguageByCode(langCode);
    setBubbleMessage(langObj.greeting);

    // Speak native greeting confirmation with amplified volume
    speakWithMAX(langObj.readyResponse || langObj.greeting, {
      lang: langCode,
      profileId: selectedVoiceId,
      volume: 1.0
    });
  };

  // Dynamic real date for task management
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  // Task management
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Neural Architecture Presentation Review',
      date: todayStr,
      time: '16:30',
      priority: 'High',
      hasReminder: true,
      completed: false,
      subtasks: [
        { id: 's1', title: 'Compile benchmark loss metrics', completed: false },
        { id: 's2', title: 'Verify neural latency', completed: false },
      ],
    },
    {
      id: '2',
      title: 'Calibrate Quantum Lattice Keys',
      date: todayStr,
      time: '17:15',
      priority: 'Medium',
      hasReminder: true,
      completed: false,
      subtasks: [
        { id: 's3', title: 'Calibrate key resonance frequency', completed: false },
      ],
    },
    {
      id: '3',
      title: 'Validate Autonomous Perception Pipeline',
      date: todayStr,
      time: '18:45',
      priority: 'High',
      hasReminder: true,
      completed: false,
      subtasks: [],
    },
  ]);

  const pendingTaskCount = tasks.filter((t) => !t.completed).length;

  const handleAddTask = (newTask) => {
    setTasks((prev) => [
      {
        subtasks: [],
        ...newTask,
      },
      ...prev,
    ]);
  };

  const handleToggleTask = (id) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    const willComplete = !targetTask.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: willComplete } : t))
    );

    if (willComplete) {
      const completionMsg = `Task "${targetTask.title}" has been completed`;
      setCompletedTaskNotification({
        id: targetTask.id,
        title: targetTask.title,
        text: completionMsg,
      });
      setBubbleMessage(completionMsg);
      setAiState('SPEAKING');
      playSound('complete');

      speakWithMAX(
        completionMsg,
        {
          lang: currentLang,
          profileId: selectedVoiceId,
          volume: 1.0,
        },
        () => {
          setAiState('IDLE');
        }
      );
    } else {
      playSound('click');
    }
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? { ...updatedTask, autoCompleted: false } : t))
    );
    // Allow auto-notification to trigger again when new time arrives
    autoNotifiedTaskIdsRef.current.delete(updatedTask.id);
    playSound('activate');
  };

  // Set of task IDs that have already triggered their auto-completion notification
  const autoNotifiedTaskIdsRef = useRef(new Set());

  // Request browser Notification permission on mount if supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      try {
        Notification.requestPermission().catch(() => {});
      } catch (e) {}
    }
  }, []);

  // Time-based automatic task completion scheduler:
  // Monitors clock every 2 seconds. When a task reaches its scheduled time, it automatically completes
  // and triggers the completion notification, alarm sound, mobile vibration, speech bubble, and spoken voice!
  useEffect(() => {
    const checkScheduledTimeTasks = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const curDateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const curTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

      tasks.forEach((t) => {
        if (!t.completed && !autoNotifiedTaskIdsRef.current.has(t.id)) {
          // Compare dates and times: trigger when date is past or date is today and time is reached
          const isPastDate = t.date < curDateStr;
          const isDateMatch = t.date === curDateStr;
          const isTimeDue = t.time <= curTimeStr;

          if (isPastDate || (isDateMatch && isTimeDue)) {
            autoNotifiedTaskIdsRef.current.add(t.id);

            // 1. Automatically complete the task
            setTasks((prev) =>
              prev.map((item) =>
                item.id === t.id ? { ...item, completed: true, autoCompleted: true } : item
              )
            );

            // 2. Audio alarm & mobile vibration
            playSound('complete');
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              try {
                navigator.vibrate([300, 150, 300, 150, 400]);
              } catch (e) {}
            }

            // 3. Exact completion message: Task "${t.title}" has been completed
            const completionMsg = `Task "${t.title}" has been completed`;
            setCompletedTaskNotification({
              id: t.id,
              title: t.title,
              text: completionMsg,
              autoTriggered: true,
              time: curTimeStr,
            });
            setBubbleMessage(completionMsg);
            setAiState('SPEAKING');

            // 4. Browser OS notification
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification('MAX AI - Task Completed', {
                  body: completionMsg,
                  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23050b1a" stroke="%2310b981" stroke-width="6"/><circle cx="50" cy="50" r="20" fill="%2310b981"/></svg>',
                });
              } catch (e) {}
            }

            // 5. Spoken voice announcement
            speakWithMAX(
              completionMsg,
              {
                lang: currentLang,
                profileId: selectedVoiceId,
                volume: 1.0,
              },
              () => {
                setAiState('IDLE');
              }
            );
          }
        }
      });
    };

    const timer = setInterval(checkScheduledTimeTasks, 2000);
    checkScheduledTimeTasks();
    return () => clearInterval(timer);
  }, [tasks, currentLang, selectedVoiceId]);

  // Quick 5-second auto-alarm test simulator for testing from mobile or desktop
  const handleTestAutoComplete = (taskId, delaySeconds = 5) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    playSound('activate');
    autoNotifiedTaskIdsRef.current.delete(taskId);

    // Set time to current minute
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const dueTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    setTasks((prev) =>
      prev.map((item) =>
        item.id === taskId
          ? { ...item, completed: false, time: dueTime }
          : item
      )
    );

    setTimeout(() => {
      if (!autoNotifiedTaskIdsRef.current.has(taskId)) {
        autoNotifiedTaskIdsRef.current.add(taskId);
        setTasks((prev) =>
          prev.map((item) =>
            item.id === taskId ? { ...item, completed: true, autoCompleted: true } : item
          )
        );

        playSound('complete');
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([300, 150, 300]);
          } catch (e) {}
        }

        const completionMsg = `Task "${target.title}" has been completed`;
        setCompletedTaskNotification({
          id: target.id,
          title: target.title,
          text: completionMsg,
          autoTriggered: true,
          time: dueTime,
        });
        setBubbleMessage(completionMsg);
        setAiState('SPEAKING');

        speakWithMAX(
          completionMsg,
          {
            lang: currentLang,
            profileId: selectedVoiceId,
            volume: 1.0,
          },
          () => {
            setAiState('IDLE');
          }
        );
      }
    }, delaySeconds * 1000);
  };

  // Voice Date and Time Trigger: Accurate native phonetics and localized phrasing
  const handleVoiceDateTime = () => {
    playSound('activate');
    setAiState('SPEAKING');

    const now = new Date();
    const timeObj = formatTime(now, false, false);
    const dateObj = formatDate(now);
    const langObj = getLanguageByCode(currentLang);

    // Accurate native speech generated for the selected language
    const spokenText = getLocalizedDateTimeSpeech(now, currentLang);

    setBubbleMessage(`${timeObj.formatted} • ${dateObj.headerDisplay}`);
    speakWithMAX(
      spokenText,
      {
        profileId: selectedVoiceId,
        lang: currentLang,
        volume: 1.0
      },
      () => {
        setAiState('IDLE');
        setBubbleMessage(langObj.greeting);
      }
    );
  };

  // State Variations switcher (Thinking, Speaking, Listening, Idle)
  const handleSelectVariation = (stateId) => {
    if (stateId === 'IDLE') {
      stopSpeech();
      setAiState('IDLE');
      setBubbleMessage(activeLangObj.greeting);
      playSound('click');
    } else if (stateId === 'LISTENING') {
      stopSpeech();
      setAiState('LISTENING');
      setBubbleMessage(activeLangObj.listeningStatus || 'Listening...');
      playSound('activate');
    } else if (stateId === 'THINKING') {
      stopSpeech();
      setAiState('THINKING');
      setBubbleMessage(activeLangObj.thinkingStatus || 'Analyzing...');
      playSound('think');
    } else if (stateId === 'SPEAKING') {
      setAiState('SPEAKING');
      setBubbleMessage(activeLangObj.speakingStatus || 'Speaking...');
      playSound('speak');
      speakWithMAX(
        activeLangObj.variationSpeakingMsg,
        {
          profileId: selectedVoiceId,
          lang: currentLang,
          volume: 1.0
        },
        () => {
          setAiState('IDLE');
          setBubbleMessage(activeLangObj.greeting);
        }
      );
    }
  };

  const handleAssistantResponse = async (userPrompt, { speak = true, source = 'text' } = {}) => {
    const requestId = ++requestTokenRef.current;
    setAiState('THINKING');
    setBubbleMessage(activeLangObj.thinkingStatus || 'Processing...');
    setCurrentTask(source === 'voice' ? 'Transcribing voice' : 'Processing command');
    setErrorMessage('');
    playSound('think');

    try {
      const response = await (source === 'voice'
        ? sendCommand(userPrompt)
        : sendChatMessage(userPrompt));

      if (!response?.success && response?.response) {
        throw new Error(response.response);
      }

      const answer = response?.response || activeLangObj.readyResponse;
      const action = response?.action || { type: 'assistant_response' };
      setConversation((prev) => [
        ...prev,
        { role: 'user', text: userPrompt },
        { role: 'assistant', text: answer, action },
      ].slice(-8));
      setBubbleMessage(answer);
      setCurrentTask(action?.type || 'Completed');
      setAiState(speak ? 'SPEAKING' : 'IDLE');
      if (speak) {
        playSound('speak');
        speakWithMAX(answer, {
          profileId: selectedVoiceId,
          lang: currentLang,
          volume: 1.0,
        }, () => {
          if (requestId !== requestTokenRef.current) return;
          setAiState('IDLE');
          setBubbleMessage(activeLangObj.greeting);
          setCurrentTask('Ready');
          setErrorMessage('');
        });
      } else {
        setAiState('IDLE');
        setCurrentTask('Ready');
      }
    } catch (error) {
      if (requestId !== requestTokenRef.current) return;
      setAiState('ERROR');
      setCurrentTask('Connection error');
      setErrorMessage(getApiErrorMessage(error));
      setBubbleMessage('MAX is offline.');
      playSound('click');
    }
  };

  const triggerAIResponse = async (userPrompt) => {
    if (!userPrompt?.trim()) return;
    await handleAssistantResponse(userPrompt.trim(), { source: 'text' });
  };

  function createWavBlob(samples, sampleRate) {
    if (!samples?.length) return null;
    const totalSamples = samples.reduce((count, channel) => count + channel.length, 0);
    const dataLength = totalSamples * 2;
    const wavBuffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(wavBuffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    for (const channel of samples) {
      for (let index = 0; index < channel.length; index += 1) {
        const sample = Math.max(-1, Math.min(1, channel[index]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([wavBuffer], { type: 'audio/wav' });
  }

  function writeString(view, offset, text) {
    for (let index = 0; index < text.length; index += 1) {
      view.setUint8(offset + index, text.charCodeAt(index));
    }
  }

  const handleVoiceRecording = async () => {
    if (aiState === 'LISTENING') {
      voiceCaptureRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setAiState('ERROR');
      setErrorMessage('This browser does not support microphone access.');
      return;
    }

    const sessionId = ++voiceRecordingSessionRef.current;
    if (voiceTimeoutRef.current) {
      window.clearTimeout(voiceTimeoutRef.current);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (sessionId !== voiceRecordingSessionRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('This browser cannot capture microphone audio.');
      }

      const audioContext = new AudioContextClass();
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      const samples = [];
      let stopped = false;

      source.connect(processor);
      processor.connect(audioContext.destination);
      processor.onaudioprocess = (event) => {
        if (stopped || sessionId !== voiceRecordingSessionRef.current) return;
        const channelData = event.inputBuffer.getChannelData(0);
        samples.push(new Float32Array(channelData));
      };

      const stopCapture = () => {
        if (stopped) return;
        stopped = true;
        if (voiceTimeoutRef.current) {
          window.clearTimeout(voiceTimeoutRef.current);
          voiceTimeoutRef.current = null;
        }
        processor.disconnect();
        source.disconnect();
        audioContext.close().catch(() => {});
        stream.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
        audioContextRef.current = null;
        audioAnalyzerRef.current = null;
        mediaRecorderRef.current = null;
        voiceCaptureRef.current = null;
        if (voiceRecordingSessionRef.current === sessionId) {
          setAiState('IDLE');
          setCurrentTask('Ready');
        }
      };

      audioStreamRef.current = stream;
      audioContextRef.current = audioContext;
      audioAnalyzerRef.current = processor;
      mediaRecorderRef.current = { state: 'recording', stop: stopCapture };
      voiceCaptureRef.current = { stop: stopCapture };
      setAiState('LISTENING');
      setCurrentTask('Listening');
      setBubbleMessage(activeLangObj.listeningStatus || 'Listening...');
      setErrorMessage('');
      playSound('activate');

      voiceTimeoutRef.current = window.setTimeout(async () => {
        if (sessionId !== voiceRecordingSessionRef.current) return;
        const analyserProcessor = audioAnalyzerRef.current;
        const analyserContext = audioContextRef.current;
        const analyserStream = audioStreamRef.current;

        if (analyserProcessor) analyserProcessor.disconnect();
        if (analyserContext) analyserContext.close().catch(() => {});
        if (analyserStream) analyserStream.getTracks().forEach((track) => track.stop());

        audioStreamRef.current = null;
        audioContextRef.current = null;
        audioAnalyzerRef.current = null;
        mediaRecorderRef.current = null;
        voiceCaptureRef.current = null;
        voiceTimeoutRef.current = null;

        const wavBlob = createWavBlob(samples, analyserContext?.sampleRate || 44100);
        if (!wavBlob || wavBlob.size === 0) {
          setAiState('ERROR');
          setCurrentTask('Voice error');
          setErrorMessage('No microphone audio was recorded. Speak clearly and try again.');
          setBubbleMessage('Voice command failed.');
          return;
        }

        setAiState('THINKING');
        setCurrentTask('Transcribing voice');
        try {
          const result = await sendVoiceAudio(wavBlob);
          if (!result?.success) {
            throw new Error(result?.response || 'Voice transcription failed.');
          }
          const text = result.response?.trim();
          if (!text) {
            throw new Error('MAX could not understand your voice command.');
          }

              const commandAction = getVoiceCommandAction(text);
          if (commandAction.action === 'stop') {
            stopSpeech();
            voiceRecordingSessionRef.current = sessionId;
            setAiState('IDLE');
            setCurrentTask('Ready');
            setBubbleMessage(activeLangObj.greeting);
            setErrorMessage('');
            return;
          }

          setBubbleMessage(`Heard: ${text}`);
          await handleAssistantResponse(text, { source: 'voice' });
        } catch (error) {
          if (sessionId !== voiceRecordingSessionRef.current) return;
          setAiState('ERROR');
          setCurrentTask('Voice error');
          setErrorMessage(getApiErrorMessage(error));
          setBubbleMessage('Voice command failed.');
        }
      }, 10000);
    } catch (error) {
      if (sessionId !== voiceRecordingSessionRef.current) return;
      setAiState('ERROR');
      setErrorMessage(error.name === 'NotAllowedError'
        ? 'Microphone permission was denied. Allow access and try again.'
        : getApiErrorMessage(error));
      setBubbleMessage('Voice command failed.');
    }
  };

  // Toggle voice button
  const handleToggleVoice = () => {
    if (aiState === 'LISTENING') {
      mediaRecorderRef.current?.stop();
      return;
    }
    if (canStartVoiceInput(aiState)) {
      handleVoiceRecording();
      return;
    }
    stopSpeech();
    setAiState('IDLE');
    setBubbleMessage(activeLangObj.greeting);
  };

  const handleSideMenuSelect = (actionId) => {
    if (actionId === 'chat') {
      setActiveModal('chat');
    } else if (actionId === 'search') {
      setSearchQuery('');
      setActiveModal('search');
    } else if (actionId === 'tasks') {
      setActiveModal('tasks');
    } else if (actionId === 'settings') {
      setActiveModal('settings');
    }
  };

  const stateDarkBgs = {
    IDLE: 'bg-[#020b1e]',
    LISTENING: 'bg-[#011a11]',
    THINKING: 'bg-[#170529]',
    SPEAKING: 'bg-[#261203]',
    EXECUTING: 'bg-[#120e22]',
    ERROR: 'bg-[#2a090d]',
    OFFLINE: 'bg-[#111827]',
  };
  const stateLightBgs = {
    IDLE: 'bg-[#e0ecfc]',
    LISTENING: 'bg-[#dafbe8]',
    THINKING: 'bg-[#f3e8ff]',
    SPEAKING: 'bg-[#fef3c7]',
    EXECUTING: 'bg-[#f5f3ff]',
    ERROR: 'bg-[#fee2e2]',
    OFFLINE: 'bg-[#f1f5f9]',
  };
  const activeBgClass =
    theme === 'dark'
      ? stateDarkBgs[aiState] || stateDarkBgs.IDLE
      : stateLightBgs[aiState] || stateLightBgs.IDLE;

  return (
    <div
      className={`relative min-h-screen w-full transition-colors duration-700 flex flex-col justify-between overflow-x-hidden select-none ${activeBgClass} ${
        theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
      }`}
    >
      {/* 1. Atmospheric Cyber Laboratory Backdrop with Dynamic State Colors */}
      <CyberBackground theme={theme} aiState={aiState} />

      {/* 1.5 Floating Task Completion Notification Banner */}
      <AnimatePresence>
        {completedTaskNotification && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl glass-panel border border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)] bg-[#031c12]/95 text-white flex items-center gap-3.5 pointer-events-auto"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/80 flex items-center justify-center shrink-0 shadow-[0_0_15px_#10b981]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-cyber font-bold tracking-wider text-emerald-300 uppercase flex items-center gap-1.5">
                {completedTaskNotification.autoTriggered ? (
                  <>
                    <Clock className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>TIME DUE • AUTO COMPLETED</span>
                  </>
                ) : (
                  <span>TASK COMPLETED</span>
                )}
              </span>
              <span className="text-xs sm:text-sm font-tech font-bold text-white tracking-wide">
                Task "{completedTaskNotification.title}" has been completed
              </span>
            </div>
            <button
              onClick={() => setCompletedTaskNotification(null)}
              className="ml-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Top Header Bar: Upward corner has Voice Date & Time button and Online status */}
      <HeaderBadge
        onVoiceDateTime={handleVoiceDateTime}
        currentLang={currentLang}
        onOpenLanguageModal={() => setActiveModal('settings')}
      />

      <div className="relative z-20 flex items-center justify-center gap-3 px-4 pt-3 text-xs font-tech uppercase tracking-wider">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${connectionStatus === 'online' ? 'bg-emerald-400 shadow-[0_0_12px_#34d399]' : 'bg-red-400 shadow-[0_0_12px_#f87171]'}`} />
        <span className={connectionStatus === 'online' ? 'text-emerald-300' : 'text-red-300'}>
          {connectionStatus === 'online' ? 'MAX brain online' : 'MAX brain offline'}
        </span>
        <span className="text-cyan-200/60">{currentTask}</span>
      </div>

      {/* 3. Main Stage: Strict 3-Column Grid ensuring MAX AI is in Dead Center */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-3 items-center justify-items-center px-4 sm:px-8 lg:px-12 py-3 max-w-7xl mx-auto w-full gap-6 my-auto">
        {/* Left Column: SideMenu aligned to left */}
        <div className="w-full flex justify-center lg:justify-start">
          <SideMenu
            onSelect={handleSideMenuSelect}
            taskCount={pendingTaskCount}
          />
        </div>

        {/* Center Column: 3D AI Orb + Variations Toolbar strictly centered */}
        <div className="w-full flex flex-col items-center justify-center my-2 sm:my-0">
          <AIOrb state={aiState} onClick={handleToggleVoice} />
          {/* AI Variations Toolbar: Idle, Listening, Thinking, Speaking */}
          <AIVariations
            currentState={aiState}
            onSelectState={handleSelectVariation}
          />
        </div>

        {/* Right Column: Floating Speech Bubble aligned to right */}
        <div className="w-full flex justify-center lg:justify-end">
          <SpeechBubble
            state={aiState}
            message={bubbleMessage}
            currentLang={currentLang}
          />
        </div>
      </main>

      {/* 4. Bottom Command Bar: Floating Capsule with Mic, Input, and Send */}
      <footer className="relative z-30 pb-6 sm:pb-8 pt-2">
        <CommandBar
          state={aiState}
          onVoiceToggle={handleToggleVoice}
          onSubmitMessage={triggerAIResponse}
          disabled={!canStartVoiceInput(aiState)}
        />
        {errorMessage && (
          <div className="mx-auto mt-3 max-w-xl rounded-xl border border-red-400/40 bg-red-950/70 px-4 py-2 text-center text-sm text-red-200">
            {errorMessage}
          </div>
        )}
      </footer>

      {/* 5. Interactive Modals */}
      <TaskModal
        isOpen={activeModal === 'tasks'}
        onClose={() => setActiveModal(null)}
        tasks={tasks}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        lastCompletedTaskTitle={completedTaskNotification?.title}
        onTestAutoComplete={handleTestAutoComplete}
        onUpdateTask={handleUpdateTask}
      />

      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        theme={theme}
        onThemeChange={setTheme}
        selectedVoiceId={selectedVoiceId}
        onVoiceSelect={handleVoiceSelect}
        currentLang={currentLang}
        onLanguageChange={handleSetLanguage}
      />

      {/* 6. Neural Search & Chart Board */}
      <SearchModal
        isOpen={activeModal === 'search'}
        onClose={() => setActiveModal(null)}
        initialQuery={searchQuery}
        currentLang={currentLang}
        selectedVoiceId={selectedVoiceId}
      />

      <VoiceModal
        isOpen={activeModal === 'chat'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
