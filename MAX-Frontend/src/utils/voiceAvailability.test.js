import test from 'node:test';
import assert from 'node:assert/strict';

import { canStartVoiceInput } from './voiceAvailability.js';

test('voice input is available while speaking so it can be restarted', () => {
  assert.equal(canStartVoiceInput('SPEAKING'), true);
  assert.equal(canStartVoiceInput('IDLE'), true);
  assert.equal(canStartVoiceInput('LISTENING'), true);
});

test('voice input stays blocked while processing a request', () => {
  assert.equal(canStartVoiceInput('THINKING'), false);
  assert.equal(canStartVoiceInput('EXECUTING'), false);
});
