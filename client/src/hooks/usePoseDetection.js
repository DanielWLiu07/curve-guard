import { useCallback } from 'react';
import { runPostureChecks } from '../lib/pose';

export const usePoseDetection = (settingsRef, setPoseLandmarks, setPoseCanvas, setLandmarksCanvas, setCallbackCount, handleViolation, setAlerts) => {
  const poseDetectionCallback = useCallback((landmarks, canvas) => {
    setPoseLandmarks(landmarks);
    setCallbackCount(prev => prev + 1);
    setLandmarksCanvas(canvas);
    setPoseCanvas(canvas);

    const postureResults = runPostureChecks(landmarks, {
      shoulderUnevennessLeniency: settingsRef.current.shoulderUnevennessLeniency || 0.1,
      headHeightLeniency: settingsRef.current.headHeightLeniency || 0.05,
      eyeHeightCalibrationLine: settingsRef.current.eyeHeightCalibrationLine,
      eyeHeightTolerance: settingsRef.current.eyeHeightTolerance || 20,
      eyeHeightTimeTolerance: settingsRef.current.eyeHeightTimeTolerance || 3,
      headTiltTolerance: settingsRef.current.headTiltTolerance,
      headTiltTimeTolerance: settingsRef.current.headTiltTimeTolerance || 2,
      enableHeightDetection: settingsRef.current.enableHeightDetection,
      enableShoulderDetection: settingsRef.current.enableShoulderDetection,
      enableHeadTiltDetection: settingsRef.current.enableHeadTiltDetection,
      currentTime: Date.now()
    });

    let updatedSettings = settingsRef.current;

    if (settingsRef.current.enableHeightDetection && postureResults.eyeHeightViolation) {
      updatedSettings = handleViolation('eyeHeight', true, updatedSettings, 'eyeHeightViolationStart', 'eyeHeightTimeTolerance');
    } else {
      updatedSettings = handleViolation('eyeHeight', false, updatedSettings, 'eyeHeightViolationStart', 'eyeHeightTimeTolerance');
      if (settingsRef.current.enableHeightDetection) {
        setAlerts([]);
      }
    }

    if (settingsRef.current.enableShoulderDetection && postureResults.shoulderViolation) {
      updatedSettings = handleViolation('shoulder', true, updatedSettings, 'shoulderViolationStart', 'shoulderTimeTolerance');
    } else {
      updatedSettings = handleViolation('shoulder', false, updatedSettings, 'shoulderViolationStart', 'shoulderTimeTolerance');
      if (settingsRef.current.enableShoulderDetection) {
        setAlerts([]);
      }
    }

    if (settingsRef.current.enableHeadTiltDetection && postureResults.headTiltViolation) {
      updatedSettings = handleViolation('headTilt', true, updatedSettings, 'headTiltViolationStart', 'headTiltTimeTolerance');
    } else {
      updatedSettings = handleViolation('headTilt', false, updatedSettings, 'headTiltViolationStart', 'headTiltTimeTolerance');
      if (settingsRef.current.enableHeadTiltDetection) {
        setAlerts([]);
      }
    }

    if (postureResults.errors.length > 0 && settingsRef.current.enableVisualAlerts) {
      setAlerts(postureResults.errors.map(error => ({ type: 'error', message: error })));
    }

    return () => ({ ...updatedSettings, alerts: [] });
  }, [settingsRef, setPoseLandmarks, setPoseCanvas, setLandmarksCanvas, setCallbackCount, handleViolation, setAlerts]);

  return poseDetectionCallback;
};