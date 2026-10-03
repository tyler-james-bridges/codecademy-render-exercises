const pool = require('./database');

const getAllActivities = async (req, res, next) => {
  try {
    const { rows: activities } = await pool.query('SELECT activity FROM my_activities');
    res.json({ activities, count: activities.length });
  } catch (error) { next(error); }
};

const getSingleActivity = async (req, res) => {
  try {
    const response = await fetch('https://bored-api.appbrewery.com/random', { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Activity service unavailable.');
    const data = await response.json();
    if (typeof data.activity !== 'string' || !data.activity.trim()) throw new Error('Invalid activity response.');
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: 'Suggestions are temporarily unavailable. Try No thanks again.' });
  }
};

const addActivityToDB = async (req, res, next) => {
  const activity = req.body?.activity;
  if (typeof activity !== 'string' || !activity.trim() || activity.length > 1000) {
    return res.status(400).json({ error: 'Choose a valid activity first.' });
  }
  try {
    const { rows } = await pool.query('INSERT INTO my_activities (activity) VALUES ($1) RETURNING activity', [activity.trim()]);
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
};

const deleteAllActivites = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM my_activities');
    res.json({ activities: [], count: 0 });
  } catch (error) { next(error); }
};

module.exports = { getSingleActivity, addActivityToDB, getAllActivities, deleteAllActivites };
