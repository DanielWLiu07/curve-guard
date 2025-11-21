# Curve Guard Setup Guide

## Prerequisites

### 1. Install MongoDB

**macOS:**
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

**Verify MongoDB is running:**
```bash
mongosh --eval "db.version()"
```

### 2. Install Node.js Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

## Running the Application

### 1. Start MongoDB (if not already running)
```bash
brew services start mongodb-community
```

### 2. Start the Backend Server
```bash
cd server
npm start
```

The server will run on `http://localhost:8080`

### 3. Start the Frontend Development Server
```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

## Using the Posture Recording System

### How It Works

1. **Navigate to Detection Page**: Click on "Detection" in the navbar
2. **Start Camera**: Click "Start Camera" button in the settings panel
3. **Calibrate Height**: Position your head at ideal posture and click "Calibrate Height"
4. **Start Recording**: Click "Start Recording" button
5. **View Data**: Navigate to "Data" section to see your posture statistics

### Features

- **Real-time Posture Detection**: Uses MediaPipe Pose to detect your posture
- **Violation Detection**:
  - **Slouch**: Head too low compared to calibration line
  - **Shoulder Misalignment**: Uneven shoulders
  - **Head Tilt**: Head tilted to one side
- **Data Visualization**:
  - **Daily View**: See today's posture percentage and time breakdown
  - **Weekly View**: 7-day trend line chart
  - **Calendar View**: Monthly overview with color-coded days

### API Endpoints

- `POST /api/posture/start` - Start a recording session
- `POST /api/posture/update` - Update session with posture data
- `POST /api/posture/stop` - Stop recording session
- `GET /api/posture/daily/:userId/:date` - Get daily statistics
- `GET /api/posture/range/:userId?startDate=&endDate=` - Get date range statistics
- `GET /api/posture/calendar/:userId/:year/:month` - Get calendar data

## Environment Configuration

### Server `.env` File

Located at `server/.env`:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/curve_guard
MONGODB_DB=curve_guard

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## Database Schema

### PostureSession Model

```javascript
{
  userId: String (indexed),
  date: Date (indexed),
  sessions: [{
    startTime: Date,
    endTime: Date,
    goodPostureTime: Number (milliseconds),
    badPostureTime: Number (milliseconds),
    violations: [{
      type: String ('slouch' | 'shoulder_misalignment' | 'head_tilt'),
      timestamp: Date,
      duration: Number (milliseconds)
    }]
  }],
  totalGoodTime: Number,
  totalBadTime: Number,
  goodPosturePercentage: Number
}
```

## Troubleshooting

### MongoDB Connection Issues

If you see `MongooseServerSelectionError`, ensure MongoDB is running:
```bash
brew services list | grep mongodb
```

If not running:
```bash
brew services start mongodb-community
```

### Port Conflicts

If port 8080 or 5173 is in use, change the port in:
- Server: `server/.env` (PORT=8080)
- Client: `client/vite.config.js` (port: 5173)

### Camera Access Issues

- Ensure your browser has permission to access the camera
- Chrome: Settings → Privacy and Security → Site Settings → Camera
- Allow `localhost:5173` to access camera

## Development Notes

### Recording System Architecture

1. **Detection**: `DetectionPage.jsx` uses `usePoseDetection` hook with MediaPipe
2. **Analysis**: `lib/pose.js` → `runPostureChecks()` determines violations
3. **Recording**: `usePostureRecording` hook manages recording state and API calls
4. **Storage**: Express API routes save data to MongoDB via Mongoose
5. **Visualization**: `PostureStats.jsx` fetches data and displays with Chart.js

### Key Files

- **Frontend Detection**: `client/src/pages/DetectionPage.jsx`
- **Pose Library**: `client/src/lib/pose.js`
- **Recording Hook**: `client/src/hooks/usePostureRecording.js`
- **Stats Component**: `client/src/components/PostureStats.jsx`
- **API Routes**: `server/src/routes/posture.js`
- **Database Model**: `server/src/models/PostureSession.js`

## Future Enhancements

- [ ] User authentication (replace hardcoded 'user123')
- [ ] Push notifications for prolonged bad posture
- [ ] Export data to CSV/PDF
- [ ] Weekly/monthly email reports
- [ ] Machine learning for personalized thresholds
- [ ] Mobile app version
