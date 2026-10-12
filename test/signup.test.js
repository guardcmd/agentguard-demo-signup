import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createApp } from '../src/signup.js';

test('baseline documents unprotected account creation', async () => {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/signup`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'demo@example.invalid' })
    });
    assert.equal(response.status, 201);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
