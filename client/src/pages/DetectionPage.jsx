import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DetectionCanvas from '../components/DetectionCanvas';
import Vignette from '../components/Vignette';
import SlidingSettingsPanel from '../components/SlidingSettingsPanel';
import SettingsPanel from '../components/SettingsPanel';
import { initPose, startPoseDetection, stopPoseDetection, runPostureChecks } from '../lib/pose';

const DetectionPage = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('disconnected');
  const [alerts, setAlerts] = useState([]);
  const [poseLandmarks, setPoseLandmarks] = useState(null);
  const [poseCanvas, setPoseCanvas] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useState({
    enableAudioAlerts: true,
    enableVisualAlerts: true,
    alertCooldown: 30,
    alertSound: 'beep',
    landmarkDetection: 'full',
    smoothingFactor: 0.8,
    showLandmarks: false,
    landmarkRadius: 3,
    landmarkColor: 'white',
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
  });
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const calibrateHeight = () => {
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

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    return () => {
      stopPoseDetection();
    };
  }, []);

  useEffect(() => {
    initPose(settingsRef.current);
  }, []);

  useEffect(() => {
    if (isStreaming && videoRef.current) {
      initPose(settingsRef.current);
      startPoseDetection(videoRef.current, (landmarks, canvas) => {
        setPoseLandmarks(landmarks);
        setPoseCanvas(canvas);

        const postureResults = runPostureChecks(landmarks, {
          shoulderUnevennessLeniency: settingsRef.current.shoulderUnevennessLeniency,
          headHeightLeniency: 0.05,
          eyeHeightCalibrationLine: settingsRef.current.eyeHeightCalibrationLine,
          eyeHeightTolerance: settingsRef.current.eyeHeightTolerance,
          eyeHeightTimeTolerance: settingsRef.current.eyeHeightTimeTolerance,
          headTiltTolerance: settingsRef.current.headTiltTolerance,
          headTiltTimeTolerance: settingsRef.current.headTiltTimeTolerance,
          enableHeightDetection: settingsRef.current.enableHeightDetection,
          enableShoulderDetection: settingsRef.current.enableShoulderDetection,
          enableHeadTiltDetection: settingsRef.current.enableHeadTiltDetection,
          currentTime: Date.now()
        });

        if (settingsRef.current.enableHeightDetection && postureResults.eyeHeightViolation) {
          const now = Date.now();

          if (!settingsRef.current.eyeHeightViolationStart) {
            setSettings(prev => ({ ...prev, eyeHeightViolationStart: now }));
          } else {
            const violationDuration = (now - settingsRef.current.eyeHeightViolationStart) / 1000;

            if (violationDuration >= settingsRef.current.eyeHeightTimeTolerance) {
              postureResults.errors.push('Poor posture: Head too low');
              setSettings(prev => ({ ...prev, eyeHeightViolationStart: null }));
            }
          }
        } else {
          if (settingsRef.current.eyeHeightViolationStart) {
            setSettings(prev => ({ ...prev, eyeHeightViolationStart: null }));
          }
          if (settingsRef.current.enableHeightDetection) {
            setAlerts([]);
          }
        }

        if (settingsRef.current.enableShoulderDetection && postureResults.shoulderViolation) {
          const now = Date.now();

          if (!settingsRef.current.shoulderViolationStart) {
            setSettings(prev => ({ ...prev, shoulderViolationStart: now }));
          } else {
            const violationDuration = (now - settingsRef.current.shoulderViolationStart) / 1000;

            if (violationDuration >= settingsRef.current.shoulderTimeTolerance) {
              postureResults.errors.push('Uneven shoulders');
              setSettings(prev => ({ ...prev, shoulderViolationStart: null }));
            }
          }
        } else {
          if (settingsRef.current.shoulderViolationStart) {
            setSettings(prev => ({ ...prev, shoulderViolationStart: null }));
          }
          if (settingsRef.current.enableShoulderDetection) {
            setAlerts([]);
          }
        }

        if (settingsRef.current.enableHeadTiltDetection && postureResults.headTiltViolation) {
          const now = Date.now();

          if (!settingsRef.current.headTiltViolationStart) {
            setSettings(prev => ({ ...prev, headTiltViolationStart: now }));
          } else {
            const violationDuration = (now - settingsRef.current.headTiltViolationStart) / 1000;

            if (violationDuration >= settingsRef.current.headTiltTimeTolerance) {
              postureResults.errors.push('Head tilt detected');
              setSettings(prev => ({ ...prev, headTiltViolationStart: null }));
            }
          }
        } else {
          if (settingsRef.current.headTiltViolationStart) {
            setSettings(prev => ({ ...prev, headTiltViolationStart: null }));
          }
          if (settingsRef.current.enableHeadTiltDetection) {
            setAlerts([]);
          }
        }

        if (postureResults.errors.length > 0 && settingsRef.current.enableVisualAlerts) {
          setAlerts(postureResults.errors.map(error => ({ type: 'error', message: error })));
        }
      }, () => settingsRef.current);
    }
  }, [settings.landmarkDetection, settings.smoothingFactor, settings.showLandmarks, isStreaming]);

  const startCamera = async () => {
    try {
      setCameraStatus('connecting');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480, 
          facingMode: 'user',
          frameRate: { ideal: 30, max: 30 }
        }
      });

      setCameraStatus('connected');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.play().then(() => {
          setIsStreaming(true);
          setCameraStatus('streaming');
        }).catch(error => {
          setCameraStatus('error');
        });
      }
    } catch (error) {
      setCameraStatus('error');
      setAlerts([{
        type: 'error',
        message: `Unable to access camera: ${error.message}. Please check permissions.`
      }]);
    }
  };

  const stopCamera = () => {

    stopPoseDetection();

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setCameraStatus('disconnected');
    setAlerts([]);
    setPoseLandmarks(null);
    setPoseCanvas(null);
  };

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

      <SlidingSettingsPanel isOpen={showSettings} onToggle={toggleSettings}>
        <SettingsPanel 
          settings={settings} 
          setSettings={setSettings}
          onStartCamera={startCamera}
          onStopCamera={stopCamera}
          isStreaming={isStreaming}
          onCalibrateHeight={calibrateHeight}
        />
      </SlidingSettingsPanel>
    </div>
  );
};

export default DetectionPage;