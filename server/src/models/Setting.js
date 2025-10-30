import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true, required: true },
    eyeHeightLeniency: { type: Number, default: 50 },
    eyeTimeLeniency: { type: Number, default: 3 },
    headTimeLeniency: { type: Number, default: 3 },
    shoulderUnevennessLeniency: { type: Number, default: 50 },
    shoulderTimeLeniency: { type: Number, default: 3 },
    headHeightLeniency: { type: Number, default: 20 },
    showHeightLine: { type: Boolean, default: true },
    showShoulders: { type: Boolean, default: true },
    showHead: { type: Boolean, default: true },
    showLandmarks: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);


