import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DetectionCanvas from '../components/canvas/DetectionCanvas';
import Vignette from '../components/Vignette';
import SlidingSettingsPanel from '../components/SlidingSettingsPanel';
import SettingsPanel from '../components/SettingsPanel';
import DataPanel from '../components/DataPanel';
import PostureAlerts from '../components/PostureAlerts';
import { initPose, startPoseDetection, stopPoseDetection, runPostureChecks } from '../lib/pose';
import { useCanvas } from '../contexts/CanvasContext';
import { usePostureRecording } from '../hooks/usePostureRecording';

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;

const DetectionPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('disconnected');
  const [alerts, setAlerts] = useState({
    eyeHeight: null,
    shoulder: null,
    headTilt: null,
    camera: null
  });
  const [poseLandmarks, setPoseLandmarks] = useState(null);
  const [poseCanvas, setPoseCanvas] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [panelMode, setPanelMode] = useState('settings');
  const { updateCanvasProps } = useCanvas();
  
  // Recording functionality
  const { 
    isRecording, 
    currentStats,
    startRecording, 
    stopRecording, 
    recordPostureState 
  } = usePostureRecording('demo-user');

  const [settings, setSettings] = useState({
    enableAudioAlerts: true,
    enableVisualAlerts: true,
    alertVolume: 50,
    alertSound: 'beep',
    landmarkDetection: 'full',
    smoothingFactor: 0.8,
    showLandmarks: true,
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
    shoulderUnevennessTolerancePx: 10,
    shoulderTimeTolerance: 2,
    shoulderViolationStart: null,
    errorBarColor: 'red',
    errorBarBorderStyle: 'solid',
    calibrationBarColor: 'red',
    calibrationBarStyle: 'solid',
    phoneRotation: 0,
    deviceType: 'phone',
    activeErrors: {
      eyeHeight: { active: false, lastActive: null },
      shoulder: { active: false, lastActive: null },
      headTilt: { active: false, lastActive: null }
    }
  });
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      isRecording: isRecording
    }));
  }, [isRecording]);

  const calibrateHeight = () => {
    if (poseLandmarks && poseLandmarks.length >= 5) {
      const leftEye = poseLandmarks[2];
      const rightEye = poseLandmarks[5];
      
      if (leftEye && rightEye) {
        const avgEyeY = ((leftEye.y + rightEye.y) / 2) * VIDEO_HEIGHT;
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

  const onGoHome = () => {
    navigate('/');
  };

  const handlePanelModeChange = (mode) => {
    setPanelMode(mode);
    setShowSettings(true);
  };

  const handleViolation = (violationType, isViolating, timeToleranceKey, violationStartKey, alertMessage) => {
    const currentSettings = settingsRef.current;
    const now = Date.now();

    if (isViolating) {
      if (!currentSettings[violationStartKey]) {
        setSettings(prev => ({ ...prev, [violationStartKey]: now }));
      } else {
        const violationDuration = (now - currentSettings[violationStartKey]) / 1000;
        if (violationDuration >= currentSettings[timeToleranceKey]) {
          setSettings(prev => ({
            ...prev,
            activeErrors: {
              ...prev.activeErrors,
              [violationType]: { active: true, lastActive: now }
            }
          }));
          setAlerts(prev => ({ ...prev, [violationType]: { type: 'error', message: alertMessage } }));
        }
      }
    } else {
      if (currentSettings[violationStartKey]) {
        setSettings(prev => ({ ...prev, [violationStartKey]: null }));
      }
      if (currentSettings.activeErrors[violationType].active) {
        setSettings(prev => ({
          ...prev,
          activeErrors: {
            ...prev.activeErrors,
            [violationType]: { active: false, lastActive: null }
          }
        }));
        setAlerts(prev => ({ ...prev, [violationType]: null }));
      }
    }
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
          shoulderUnevennessTolerancePx: settingsRef.current.shoulderUnevennessTolerancePx,
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

        // Log violations occasionally (2% of frames)
        if (Math.random() < 0.02) {
        }

        if (settingsRef.current.enableHeightDetection) {
          handleViolation('eyeHeight', postureResults.eyeHeightViolation, 'eyeHeightTimeTolerance', 'eyeHeightViolationStart', 'Poor posture: Head too low');
        }

        if (settingsRef.current.enableShoulderDetection) {
          handleViolation('shoulder', postureResults.shoulderViolation, 'shoulderTimeTolerance', 'shoulderViolationStart', 'Uneven shoulders');
        }

        if (settingsRef.current.enableHeadTiltDetection) {
          handleViolation('headTilt', postureResults.headTiltViolation, 'headTiltTimeTolerance', 'headTiltViolationStart', 'Head tilt detected');
        }

        if (isRecording) {
          // Check if there are ANY violations happening right now
          const hasAnyViolation = postureResults.eyeHeightViolation ||
                                  postureResults.shoulderViolation ||
                                  postureResults.headTiltViolation;

          let violationType = null;
          if (hasAnyViolation) {
            // Determine which violation type to record
            if (postureResults.eyeHeightViolation) violationType = 'slouch';
            else if (postureResults.shoulderViolation) violationType = 'shoulder_misalignment';
            else if (postureResults.headTiltViolation) violationType = 'head_tilt';
          }

          const isGoodPosture = !hasAnyViolation;
          recordPostureState(isGoodPosture, violationType);
        }

        updateCanvasProps({
          videoRef,
          isStreaming,
          poseLandmarks: landmarks,
          poseCanvas: canvas,
          alerts
        });
      }, () => settingsRef.current);
    }
  }, [settings.landmarkDetection, settings.smoothingFactor, settings.showLandmarks, isStreaming]);

  const startCamera = async () => {
    try {
      setCameraStatus('connecting');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: VIDEO_WIDTH, 
          height: VIDEO_HEIGHT, 
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
      setAlerts(prev => ({ ...prev, camera: { type: 'error', message: `Unable to access camera: ${error.message}. Please check permissions.` } }));
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
    setAlerts({
      eyeHeight: null,
      shoulder: null,
      headTilt: null,
      camera: null
    });
    setPoseLandmarks(null);
    setPoseCanvas(null);

    updateCanvasProps({
      videoRef: null,
      isStreaming: false,
      poseLandmarks: null,
      poseCanvas: null,
      alerts: {
        eyeHeight: null,
        shoulder: null,
        headTilt: null,
        camera: null
      }
    });
  };

  const alertsArray = Object.entries(alerts)
    .filter(([key, value]) => value !== null)
    .map(([key, value]) => value);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-5">
        <Vignette intensity={0.3} size={150} />
      </div>

      <Navbar onGoHome={onGoHome} />

      <PostureAlerts alerts={alertsArray} />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
        style={{ width: `${VIDEO_WIDTH}px`, height: `${VIDEO_HEIGHT}px` }}
      />

      <SlidingSettingsPanel
        isOpen={showSettings}
        onToggle={() => setShowSettings(false)}
        mode={panelMode}
        onModeChange={handlePanelModeChange}
        settingsContent={
          <SettingsPanel
            settings={settings}
            setSettings={setSettings}
            onStartCamera={startCamera}
            onStopCamera={stopCamera}
            isStreaming={isStreaming}
            onCalibrateHeight={calibrateHeight}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
          />
        }
        dataContent={
          <DataPanel
            settings={settings}
            poseLandmarks={poseLandmarks}
            alerts={alerts}
            isStreaming={isStreaming}
            cameraStatus={cameraStatus}
            currentStats={currentStats}
          />
        }
      />
    </div>
  );
};

export default DetectionPage;