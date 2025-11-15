import { Router } from 'express';
import Setting from '../models/Setting.js';

const router = Router();

function getUserId(req) {
  return req.headers['x-user-id'] || 'demo-user';
}

router.get('/', async (req, res) => {
  const userId = getUserId(req);
  const doc = await Setting.findOne({ userId });
  res.json(doc || { userId });
});

router.post('/', async (req, res) => {
  const userId = getUserId(req);
  const update = { ...req.body, userId };
  const doc = await Setting.findOneAndUpdate({ userId }, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  });
  res.json(doc);
});

export default router;


