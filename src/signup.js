import express from 'express';
import { GuardCMD, velocity, disposableEmail } from 'guardcmd';
import { guardcmdExpress } from 'guardcmd/express';

// INTENTIONALLY FLAWED TRAINING FIXTURE. Never deploy this baseline.
// No trust proxy: req.ip comes from the socket, not a client-supplied header.
export const auditLog = [];
export const sharedGuard = new GuardCMD({
  mode: 'shadow',
  signals: [velocity({ windowMs: 60000, max: 5 }), disposableEmail()],
  onDecision: d => {
    auditLog.push(d);
    if (auditLog.length > 100) auditLog.shift();
  }
});

export function createApp({ guard = sharedGuard } = {}) {
  const app = express();
  const users = [];
  app.use(express.json({ limit: '8kb' }));
  app.use('/signup', guardcmdExpress(guard, { action: 'signup', trustProxy: false, context: req => ({ email: req.body?.email }) }));
  app.post('/signup', (req, res) => {
    if (typeof req.body.email !== 'string' || !req.body.email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    const user = { id: users.length + 1, email: req.body.email, reviewRequired: Boolean(req.abuse?.action === 'review') };
    users.push(user);
    res.status(201).json({ id: user.id });
  });
  return app;
}
