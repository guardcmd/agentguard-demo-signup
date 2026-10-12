// Independent reviewer checks, added after preserving the unmodified AI proposals.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GuardCMD } from 'guardcmd';
import { createApp, auditLog } from '../src/signup.js';

async function withApp(guard, run) {
  const server = createApp({ guard }).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}/signup`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}
const signup = (url, email='demo@example.invalid', headers={}) => fetch(url, {method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify({email})});

test('real disposable-email signal is logged while default shadow permits signup', async () => {
  await withApp(undefined, async url => {
    const response = await signup(url, 'fixture@mailinator.com');
    assert.equal(response.status, 201);
    const decision = auditLog.at(-1);
    assert.equal(decision.enforced, false);
    assert.ok(decision.reasons.some(reason => /disposable/i.test(reason)));
  });
});
test('forwarded IP and body IP cannot override the socket-derived context', async () => {
  let captured;
  const guard = new GuardCMD({signals:[{name:'capture',evaluate:ctx=>{captured=ctx;return {signal:'capture',score:0,reasons:[]};}}]});
  await withApp(guard, async url => {
    await fetch(url,{method:'POST',headers:{'content-type':'application/json','x-forwarded-for':'203.0.113.7'},body:JSON.stringify({email:'demo@example.invalid',ip:'203.0.113.9'})});
    assert.equal(captured.ip, '127.0.0.1');
  });
});
test('real SDK challenge, throttle and review actions retain their documented semantics', async () => {
  for (const [score,status] of [[45,428],[65,429],[80,201]]) {
    const guard = new GuardCMD({mode:'enforce',signals:[{name:'qa',evaluate:()=>({signal:'qa',score,reasons:['controlled QA risk']})}]});
    await withApp(guard, async url => {
      const response = await signup(url); assert.equal(response.status,status);
      if (status===429) assert.equal(response.headers.get('retry-after'),'60');
    });
  }
});
test('an absent request body returns 400 after reviewer correction', async () => {
  await withApp(undefined, async url => assert.equal((await fetch(url,{method:'POST'})).status,400));
});
