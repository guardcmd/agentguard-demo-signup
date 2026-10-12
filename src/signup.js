import express from 'express';

// INTENTIONALLY FLAWED TRAINING FIXTURE. Never deploy this baseline.
// No trust proxy: req.ip comes from the socket, not a client-supplied header.
export function createApp() {
  const app = express();
  const users = [];
  app.use(express.json({ limit: '8kb' }));
  app.post('/signup', (req, res) => {
    const user = { id: users.length + 1, email: req.body.email };
    users.push(user);
    res.status(201).json({ id: user.id });
  });
  return app;
}
