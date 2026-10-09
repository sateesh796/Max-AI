import test from 'node:test';
import assert from 'node:assert/strict';

import { getVoiceCommandAction } from './voiceCommands.js';

test('stop command immediately cancels speech and voice processing', () => {
  assert.deepEqual(getVoiceCommandAction('stop'), { action: 'stop' });
  assert.deepEqual(getVoiceCommandAction('please stop'), { action: 'stop' });
});

test('non-stop voice input continues normal processing', () => {
  assert.deepEqual(getVoiceCommandAction('what time is it'), { action: 'process' });
});
