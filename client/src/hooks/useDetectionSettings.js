import { useState, useRef, useEffect } from 'react';

const defaultSettings = {
  enableAudioAlerts: true,
  enableVisualAlerts: true,
  alertCooldown: 30,
  landmarkDetection: 'full',
  smoothingFactor: 0.8,
  showLandmarks: false,
  enableHeightDetection: true,
  enableShoulderDetection: true,
  enableHeadTiltDetection: true,
  isRecording: false,
  detectionConfidence: 0.5,
  trackingConfidence: 0.5,
  eyeHeightCalibrationLine: null,
  eyeHeightTolerance: 20,
  eyeHeightTimeTolerance: 3,
  eyeHeightViolationStart: null,
  headTiltTolerance: 15,
  headTiltTimeTolerance: 2,
  headTiltViolationStart: null,
  shoulderUnevennessLeniency: 0.1,
  shoulderTimeTolerance: 2,
  shoulderViolationStart: null,
  landmarkRadius: 6,
  landmarkColor: 'white',
  alertSound: 'beep'
};

export const useDetectionSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const calibrateHeight = (poseLandmarks) => {
    if (poseLandmarks && poseLandmarks.length >= 5) {
      const leftEye = poseLandmarks[2];
      const rightEye = poseLandmarks[5];

      if (leftEye && rightEye) {
        const avgEyeY = ((leftEye.y + rightEye.y) / 2) * 480;
        setSettings(prev => ({
          ...prev,
          eyeHeightCalibrationLine: avgEyeY,
          eyeHeightViolationStart: null
        }));
      }
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    setSettings,
    settingsRef,
    calibrateHeight,
    resetSettings
  };
};
