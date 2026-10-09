import test from 'node:test';
import assert from 'node:assert/strict';

import { arrayBufferToBase64 } from './base64.js';

test('arrayBufferToBase64 converts large audio buffers without overflowing the call stack', () => {
  const bytes = new Uint8Array(1_000_000);
  bytes.fill(255);

  const base64 = arrayBufferToBase64(bytes.buffer);

  assert.equal(base64.length, 1_333_336);
  assert.match(base64, /^[A-Za-z0-9+/]+={0,2}$/);
  assert.equal(base64.slice(0, 4), '////');
});
