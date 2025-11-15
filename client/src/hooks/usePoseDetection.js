import { useState, useEffect, useRef } from 'react';
import { initPose, startPoseDetection, stopPoseDetection } from '../lib/pose';

export const usePoseDetection = (isStreaming, settingsRef, onPoseResults) => {
  const [poseLandmarks, setPoseLandmarks] = useState(null);
  const [poseCanvas, setPoseCanvas] = useState(null);
  const [landmarksCanvas, setLandmarksCanvas] = useState(null);
  const [callbackCount, setCallbackCount] = useState(0);

  useEffect(() => {
    initPose(settingsRef.current);
  }, []);

  useEffect(() => {
    if (isStreaming) {
      initPose(settingsRef.current);

      const handlePoseResults = (landmarks, canvas) => {
        setPoseLandmarks(landmarks);
        setCallbackCount(prev => prev + 1);
        setLandmarksCanvas(canvas);
        setPoseCanvas(canvas);

        onPoseResults?.(landmarks, canvas);
      };

      startPoseDetection(null, handlePoseResults, () => settingsRef.current);
    }
  }, [isStreaming, settingsRef.current.landmarkDetection, settingsRef.current.smoothingFactor, settingsRef.current.showLandmarks]);

  useEffect(() => {
    return () => {
      stopPoseDetection();
    };
  }, []);

  return {
    poseLandmarks,
    poseCanvas,
    landmarksCanvas,
    callbackCount
  };
};
