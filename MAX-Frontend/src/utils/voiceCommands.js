export function getVoiceCommandAction(text) {
  const normalized = (text || '').trim().toLowerCase();
  if (!normalized) return { action: 'process' };

  const stopWords = ['stop', 'stopped', 'stop listening', 'stop recording', 'end'];
  if (stopWords.includes(normalized) || normalized.startsWith('stop ') || normalized.startsWith('please stop')) {
    return { action: 'stop' };
  }

  return { action: 'process' };
}
