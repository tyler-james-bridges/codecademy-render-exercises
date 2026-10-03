const express = require('express');
const path = require('node:path');
const { readFile } = require('node:fs/promises');
const services = require('./services/requests');
const pool = require('./services/database');

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/activities', services.getAllActivities);
app.post('/api/activities', services.addActivityToDB);
app.get('/api/activities/new', services.getSingleActivity);
app.delete('/api/activities', services.deleteAllActivites);
app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  res.status(error.status === 400 ? 400 : 500).json({ error: 'The request could not be completed. Please try again.' });
});

async function start() {
  await pool.query(await readFile(path.join(__dirname, 'schema.sql'), 'utf8'));
  const port = Number(process.env.PORT || 3013);
  const server = app.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`Activity app listening on port ${port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(() => pool.end()));
  return server;
}

if (require.main === module) start().catch(() => {
  console.error('Startup failed. Check DATABASE_URL and database access.');
  pool.end();
  process.exitCode = 1;
});
module.exports = { app, start };
