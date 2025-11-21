import mongoose from 'mongoose';

const postureSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  sessions: [{
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: false // Optional - set when session ends
    },
    goodPostureTime: {
      type: Number, // milliseconds
      default: 0
    },
    badPostureTime: {
      type: Number, // milliseconds
      default: 0
    },
    violations: [{
      type: {
        type: String,
        enum: ['head_tilt', 'shoulder_misalignment', 'slouch']
      },
      timestamp: Date,
      duration: Number // milliseconds
    }]
  }],
  totalGoodPostureTime: {
    type: Number,
    default: 0
  },
  totalBadPostureTime: {
    type: Number,
    default: 0
  },
  goodPosturePercentage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate percentages before saving
postureSessionSchema.pre('save', function(next) {
  const totalTime = this.totalGoodPostureTime + this.totalBadPostureTime;
  if (totalTime > 0) {
    this.goodPosturePercentage = (this.totalGoodPostureTime / totalTime) * 100;
  }
  next();
});

// Index for efficient querying
postureSessionSchema.index({ userId: 1, date: 1 });

const PostureSession = mongoose.model('PostureSession', postureSessionSchema);

export default PostureSession;
