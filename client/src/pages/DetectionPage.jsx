import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DetectionCanvas from '../components/DetectionCanvas';
import Vignette from '../components/Vignette';
import SettingsPanel from '../components/SettingsPanel';
import { initPose, startPoseDetection, stopPoseDetection } from '../lib/pose';
import { useCamera } from '../hooks/useCamera';
import { useDetectionSettings } from '../hooks/useDetectionSettings';
import { usePostureViolations } from '../hooks/usePostureViolations';
import { usePoseDetection } from '../hooks/usePoseDetection';

const DetectionPage = () => {
  const [poseLandmarks, setPoseLandmarks] = useState(null);
  const [poseCanvas, setPoseCanvas] = useState(null);
  const [landmarksCanvas, setLandmarksCanvas] = useState(null);
  const [callbackCount, setCallbackCount] = useState(0);

  const { settings, setSettings, settingsRef, calibrateHeight } = useDetectionSettings();
  const { videoRef, isStreaming, startCamera: startCameraHook, stopCamera } = useCamera();
  const { alerts, setAlerts, handleViolation, clearAlerts } = usePostureViolations();

  const poseDetectionCallback = usePoseDetection(
    settingsRef,
    setPoseLandmarks,
    setPoseCanvas,
    setLandmarksCanvas,
    setCallbackCount,
    handleViolation,
    clearAlerts
  );

  const startCamera = async () => {
    try {
      await startCameraHook(settings, poseDetectionCallback);
    } catch (error) {
      clearAlerts();
      setAlerts([{
        type: 'error',
        message: `Unable to access camera: ${error.message}. Please check permissions.`
      }]);
    }
  };

  const handleCalibrateHeight = () => {
    calibrateHeight(poseLandmarks);
  };

  useEffect(() => {
    if (isStreaming && videoRef.current) {
      stopPoseDetection();

      initPose(settingsRef.current).then(() => {
        startPoseDetection(videoRef.current, poseDetectionCallback, () => settingsRef.current);
      });
    } else if (!isStreaming) {
      stopPoseDetection();
    }
  }, [settings.landmarkDetection, settings.smoothingFactor, isStreaming]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <DetectionCanvas
          videoRef={videoRef}
          isStreaming={isStreaming}
          poseLandmarks={poseLandmarks}
          poseCanvas={poseCanvas}
          onStartCamera={startCamera}
          onStopCamera={stopCamera}
          alerts={alerts}
        />
      </div>
      <div className="absolute inset-0 z-5">
        <Vignette intensity={0.3} size={150} />
      </div>

      <Navbar />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
        style={{ width: '640px', height: '480px' }}
      />

      <SettingsPanel
        settings={settings}
        setSettings={setSettings}
        onStartCamera={startCamera}
        onStopCamera={stopCamera}
        isStreaming={isStreaming}
        onCalibrateHeight={handleCalibrateHeight}
      />
    </div>
  );
};

export default DetectionPage;