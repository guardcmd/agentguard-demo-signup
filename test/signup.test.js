import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createApp } from '../src/signup.js';
import { GuardCMD } from 'guardcmd';

const createTestGuard = (signals, mode) => new GuardCMD({ mode, signals, onDecision: d => {} });

const testSignal = { name: 'test', evaluate: () => ({ signal: 'test', score: 100, reasons: ['test risk'] }) };

const shadowGuard = createTestGuard([testSignal], 'shadow');
const enforceGuard = createTestGuard([testSignal], 'enforce');

const testSignup = async (guard, expectedStatus) => {
  const server = createApp({ guard }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/signup`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'demo@example.invalid' })
    });
    assert.equal(response.status, expectedStatus);
  } finally { await new Promise(resolve => server.close(resolve)); }
};

test('default shadow accepts the example email', async () => {
  await testSignup(undefined, 201);
});

test('injected real GuardCMD with test signal in enforce mode blocks with 403', async () => {
  await testSignup(enforceGuard, 403);
});

test('injected real GuardCMD with test signal in shadow permits 201', async () => {
  await testSignup(shadowGuard, 201);
});

test('malformed email returns 400', async () => {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/signup`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email' })
    });
    assert.equal(response.status, 400);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
