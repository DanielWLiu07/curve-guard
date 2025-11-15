import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import settingsRouter from './routes/settings.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptimeSec: process.uptime() });
});

app.use('/api/settings', settingsRouter);

const port = process.env.PORT || 8080;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/curve_guard';

async function start() {
  try {
    await mongoose.connect(mongoUri, { dbName: process.env.MONGODB_DB || undefined });
  } catch (err) {
  }

  app.listen(port, () => {});
}

start();


