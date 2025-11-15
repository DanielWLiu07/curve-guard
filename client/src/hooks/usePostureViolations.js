import { useState, useEffect } from 'react';
import { runPostureChecks } from '../lib/pose';

export const usePostureViolations = (poseLandmarks, settings, setSettings) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!poseLandmarks || !settings) return;

    const postureResults = runPostureChecks(poseLandmarks, {
      shoulderUnevennessLeniency: settings.shoulderUnevennessLeniency || 0.1,
      headHeightLeniency: settings.headHeightLeniency || 0.05,
      eyeHeightCalibrationLine: settings.eyeHeightCalibrationLine,
      eyeHeightTolerance: settings.eyeHeightTolerance || 20,
      eyeHeightTimeTolerance: settings.eyeHeightTimeTolerance || 3,
      headTiltTolerance: settings.headTiltTolerance,
      headTiltTimeTolerance: settings.headTiltTimeTolerance || 2,
      enableHeightDetection: settings.enableHeightDetection,
      enableShoulderDetection: settings.enableShoulderDetection,
      enableHeadTiltDetection: settings.enableHeadTiltDetection,
      currentTime: Date.now()
    });

    if (settings.enableHeightDetection && postureResults.eyeHeightViolation) {
      const now = Date.now();

      if (!settings.eyeHeightViolationStart) {
        setSettings(prev => ({ ...prev, eyeHeightViolationStart: now }));
      } else {
        const violationDuration = (now - settings.eyeHeightViolationStart) / 1000;

        if (violationDuration >= settings.eyeHeightTimeTolerance) {
          postureResults.errors.push('Poor posture: Head too low');
          setSettings(prev => ({ ...prev, eyeHeightViolationStart: null }));
        }
      }
    } else {
      if (settings.eyeHeightViolationStart) {
        setSettings(prev => ({ ...prev, eyeHeightViolationStart: null }));
      }
      if (settings.enableHeightDetection) {
        setAlerts([]);
      }
    }

    if (settings.enableShoulderDetection && postureResults.shoulderViolation) {
      const now = Date.now();

      if (!settings.shoulderViolationStart) {
        setSettings(prev => ({ ...prev, shoulderViolationStart: now }));
      } else {
        const violationDuration = (now - settings.shoulderViolationStart) / 1000;

        if (violationDuration >= settings.shoulderTimeTolerance) {
          postureResults.errors.push('Uneven shoulders');
          setSettings(prev => ({ ...prev, shoulderViolationStart: null }));
        }
      }
    } else {
      if (settings.shoulderViolationStart) {
        setSettings(prev => ({ ...prev, shoulderViolationStart: null }));
      }
      if (settings.enableShoulderDetection) {
        setAlerts([]);
      }
    }

    if (settings.enableHeadTiltDetection && postureResults.headTiltViolation) {
      const now = Date.now();

      if (!settings.headTiltViolationStart) {
        setSettings(prev => ({ ...prev, headTiltViolationStart: now }));
      } else {
        const violationDuration = (now - settings.headTiltViolationStart) / 1000;

        if (violationDuration >= settings.headTiltTimeTolerance) {
          postureResults.errors.push('Head tilt detected');
          setSettings(prev => ({ ...prev, headTiltViolationStart: null }));
        }
      }
    } else {
      if (settings.headTiltViolationStart) {
        setSettings(prev => ({ ...prev, headTiltViolationStart: null }));
      }
      if (settings.enableHeadTiltDetection) {
        setAlerts([]);
      }
    }

    if (postureResults.errors.length > 0 && settings.enableVisualAlerts) {
      setAlerts(postureResults.errors.map(error => ({ type: 'error', message: error })));
    }

  }, [poseLandmarks, settings]);

  return {
    alerts,
    setAlerts
  };
};
