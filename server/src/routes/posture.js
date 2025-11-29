import express from 'express';
import PostureSession from '../models/PostureSession.js';

const router = express.Router();

// Start a new recording session
router.post('/start', async (req, res) => {
  try {
    const { userId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let session = await PostureSession.findOne({
      userId,
      date: today
    });

    if (!session) {
      session = new PostureSession({
        userId,
        date: today,
        sessions: []
      });
    }

    session.sessions.push({
      startTime: new Date(),
      endTime: null,
      goodPostureTime: 0,
      badPostureTime: 0,
      violations: []
    });

    await session.save();

    res.json({
      success: true,
      sessionId: session._id,
      sessionIndex: session.sessions.length - 1
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update posture data during recording
router.post('/update', async (req, res) => {
  try {
    const { sessionId, sessionIndex, isGoodPosture, violationType, duration } = req.body;
    
    const session = await PostureSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    const currentSession = session.sessions[sessionIndex];
    
    if (isGoodPosture) {
      currentSession.goodPostureTime += duration;
      session.totalGoodPostureTime += duration;
    } else {
      currentSession.badPostureTime += duration;
      session.totalBadPostureTime += duration;
      
      if (violationType) {
        currentSession.violations.push({
          type: violationType,
          timestamp: new Date(),
          duration
        });
      }
    }

    await session.save();
    
    res.json({
      success: true,
      goodPosturePercentage: session.goodPosturePercentage,
      totalGoodTime: session.totalGoodPostureTime,
      totalBadTime: session.totalBadPostureTime
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stop recording session
router.post('/stop', async (req, res) => {
  try {
    const { sessionId, sessionIndex } = req.body;

    const session = await PostureSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    session.sessions[sessionIndex].endTime = new Date();
    await session.save();

    res.json({
      success: true,
      session: session.sessions[sessionIndex],
      totalStats: {
        goodPosturePercentage: session.goodPosturePercentage,
        totalGoodTime: session.totalGoodPostureTime,
        totalBadTime: session.totalBadPostureTime
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get daily stats
router.get('/daily/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    
    // Parse the date string (YYYY-MM-DD format) and create date range
    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    
    const session = await PostureSession.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });
    
    if (!session) {
      return res.json({
        success: true,
        data: {
          goodPosturePercentage: 0,
          totalGoodTime: 0,
          totalBadTime: 0,
          sessions: []
        }
      });
    }

    res.json({
      success: true,
      data: {
        goodPosturePercentage: session.goodPosturePercentage,
        totalGoodTime: session.totalGoodPostureTime,
        totalBadTime: session.totalBadPostureTime,
        sessions: session.sessions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get weekly/monthly stats
router.get('/range/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const sessions = await PostureSession.find({
      userId,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    const stats = sessions.map(session => ({
      date: session.date,
      goodPosturePercentage: session.goodPosturePercentage,
      totalGoodTime: session.totalGoodPostureTime,
      totalBadTime: session.totalBadPostureTime,
      sessionsCount: session.sessions.length
    }));

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get calendar data (month view)
router.get('/calendar/:userId/:year/:month', async (req, res) => {
  try {
    const { userId, year, month } = req.params;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const sessions = await PostureSession.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    const calendarData = sessions.map(session => ({
      date: session.date,
      goodPosturePercentage: session.goodPosturePercentage,
      hasData: session.sessions.length > 0
    }));

    res.json({
      success: true,
      data: calendarData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
