import { arrayBufferToBase64 } from './base64.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function normalizeError(error, fallback) {
  if (error?.response?.data?.detail) return error.response.data.detail;
  if (error?.message) return error.message;
  return fallback;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = payload?.detail || payload?.error || `Request failed (${response.status})`;
    throw new Error(error);
  }

  return payload;
}

export async function getBackendStatus() {
  return request('/api/status');
}

export async function sendChatMessage(message) {
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function sendCommand(command) {
  return request('/api/command', {
    method: 'POST',
    body: JSON.stringify({ command }),
  });
}

export async function sendVoiceAudio(wavBlob) {
  const arrayBuffer = await wavBlob.arrayBuffer();
  const base64 = arrayBufferToBase64(arrayBuffer);

  return request('/api/voice', {
    method: 'POST',
    body: JSON.stringify({ audio: base64 }),
  });
}

export function audioBlobToWav(audioBlob) {
  return new Promise((resolve, reject) => {
    if (!audioBlob || audioBlob.size === 0) {
      reject(new Error('The recorded microphone audio is empty.'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const arrayBuffer = reader.result;
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          reject(new Error('The recorded microphone audio is empty.'));
          return;
        }

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          reject(new Error('This browser does not support audio conversion.'));
          return;
        }

        const audioContext = new AudioContextClass();
        try {
          let audioBuffer;
          try {
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
          } catch (decodeError) {
            const mimeType = audioBlob.type || 'unknown';
            throw new Error(
              `Unable to decode ${mimeType}. Check microphone permission and record again.`
            );
          }
          if (!audioBuffer || audioBuffer.length === 0 || audioBuffer.duration === 0) {
            throw new Error('The recorded microphone audio contains no usable sound.');
          }

          const channels = audioBuffer.numberOfChannels;
          const length = audioBuffer.length * channels;
          const data = new Int16Array(length);
          const channelData = Array.from({ length: channels }, (_, index) => audioBuffer.getChannelData(index));

          for (let index = 0; index < audioBuffer.length; index += 1) {
            for (let channel = 0; channel < channels; channel += 1) {
              const sample = Math.max(-1, Math.min(1, channelData[channel][index]));
              data[index * channels + channel] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
            }
          }

          const wavBuffer = new ArrayBuffer(44 + data.length * 2);
          const view = new DataView(wavBuffer);
          writeString(view, 0, 'RIFF');
          view.setUint32(4, 36 + data.length * 2, true);
          writeString(view, 8, 'WAVE');
          writeString(view, 12, 'fmt ');
          view.setUint32(16, 16, true);
          view.setUint16(20, 1, true);
          view.setUint16(22, channels, true);
          view.setUint32(24, audioBuffer.sampleRate, true);
          view.setUint32(28, audioBuffer.sampleRate * channels * 2, true);
          view.setUint16(32, channels * 2, true);
          view.setUint16(34, 16, true);
          writeString(view, 36, 'data');
          view.setUint32(40, data.length * 2, true);
          writePCM(view, 44, data);

          resolve(new Blob([wavBuffer], { type: 'audio/wav' }));
        } finally {
          audioContext.close().catch(() => {});
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('The microphone recording could not be read.'));
    reader.readAsArrayBuffer(audioBlob);
  });
}

function writeString(view, offset, text) {
  for (let index = 0; index < text.length; index += 1) {
    view.setUint8(offset + index, text.charCodeAt(index));
  }
}

function writePCM(view, offset, data) {
  for (let index = 0; index < data.length; index += 1) {
    view.setInt16(offset + index * 2, data[index], true);
  }
}

export function getApiErrorMessage(error) {
  return normalizeError(error, 'MAX is currently unable to connect to the brain service.');
}
