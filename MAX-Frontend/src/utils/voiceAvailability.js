export function canStartVoiceInput(aiState) {
  return aiState !== 'THINKING' && aiState !== 'EXECUTING';
}
