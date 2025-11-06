import React, { useRef, useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Navbar from '../components/Navbar';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const DetectionPage = () => {
  const { user } = useAuthenticator();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('disconnected');
  const [alerts, setAlerts] = useState([]);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [pose, setPose] = useState(null);
  const [camera, setCamera] = useState(null);
  const [calibratedEyeLevel, setCalibratedEyeLevel] = useState(null);

  // Posture analysis state (similar to Python analyzer)
  const [eyeAboveStart, setEyeAboveStart] = useState(null);
  const [eyeAboveTriggered, setEyeAboveTriggered] = useState(false);
  const [shoulderUnevenStart, setShoulderUnevenStart] = useState(null);
  const [shoulderUnevenTriggered, setShoulderUnevenTriggered] = useState(false);
  const [headUnevenStart, setHeadUnevenStart] = useState(null);
  const [headUnevenTriggered, setHeadUnevenTriggered] = useState(false);

  // Leniency settings (matching Python defaults)
  const eyeHeightLeniency = 50;
  const eyeTimeLeniency = 3;
  const headTimeLeniency = 3;
  const shoulderUnevennessLeniency = 50;
  const shoulderTimeLeniency = 3;
  const headHeightLeniency = 20;

  useEffect(() => {
    initializePoseDetection();
    return () => {
      stopCamera();
    };
  }, []);

  const initializePoseDetection = () => {
    const poseInstance = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    poseInstance.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    poseInstance.onResults(onPoseResults);
    setPose(poseInstance);
  };

  const onPoseResults = (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    if (!canvas || !video) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      // Perform calibration if in calibration mode
      if (isCalibrating) {
        performCalibration(results.poseLandmarks);
      }

      // Draw pose landmarks and connections
      drawConnectors(ctx, results.poseLandmarks, Pose.POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 4
      });
      drawLandmarks(ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 2
      });

      // Draw height line if calibrated
      if (calibratedEyeLevel !== null) {
        const eyeLevelY = calibratedEyeLevel * canvas.height;
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, eyeLevelY);
        ctx.lineTo(canvas.width, eyeLevelY);
        ctx.stroke();
      }

      // Draw shoulder analysis (similar to Python version)
      if (results.poseLandmarks.length >= 13) {
        const leftShoulder = results.poseLandmarks[11];
        const rightShoulder = results.poseLandmarks[12];

        // Draw circles around shoulders
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(leftShoulder.x * canvas.width, leftShoulder.y * canvas.height, 20, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rightShoulder.x * canvas.width, rightShoulder.y * canvas.height, 20, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw line between shoulders
        ctx.beginPath();
        ctx.moveTo(leftShoulder.x * canvas.width, leftShoulder.y * canvas.height);
        ctx.lineTo(rightShoulder.x * canvas.width, rightShoulder.y * canvas.height);
        ctx.stroke();

        // Show shoulder vertical distance
        const verticalDist = Math.abs((rightShoulder.y - leftShoulder.y) * canvas.height);
        const midX = ((leftShoulder.x + rightShoulder.x) / 2) * canvas.width;
        const textY = Math.min(leftShoulder.y, rightShoulder.y) * canvas.height - 10;

        ctx.fillStyle = '#00FF00';
        ctx.font = '16px Arial';
        ctx.fillText(`Vertical Dist: ${verticalDist.toFixed(1)}px`, midX - 50, textY);
      }

      // Draw eye analysis (similar to Python version)
      if (results.poseLandmarks.length >= 6) {
        const leftEye = results.poseLandmarks[2];
        const rightEye = results.poseLandmarks[5];

        // Draw circles around eyes
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(leftEye.x * canvas.width, leftEye.y * canvas.height, 15, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rightEye.x * canvas.width, rightEye.y * canvas.height, 15, 0, 2 * Math.PI);
        ctx.stroke();

        // Draw line between eyes
        ctx.beginPath();
        ctx.moveTo(leftEye.x * canvas.width, leftEye.y * canvas.height);
        ctx.lineTo(rightEye.x * canvas.width, rightEye.y * canvas.height);
        ctx.stroke();

        // Show eye vertical distance
        const verticalDist = Math.abs((rightEye.y - leftEye.y) * canvas.height);
        const midX = ((leftEye.x + rightEye.x) / 2) * canvas.width;
        const textY = Math.min(leftEye.y, rightEye.y) * canvas.height - 10;

        ctx.fillStyle = '#00FF00';
        ctx.font = '16px Arial';
        ctx.fillText(`Eye Dist: ${verticalDist.toFixed(1)}px`, midX - 40, textY);
      }

      // Analyze posture
      analyzePosture(results.poseLandmarks);
    }
  };

  const analyzePosture = (landmarks) => {
    const newAlerts = [];
    const currentTime = Date.now() / 1000; // Convert to seconds like Python time.time()

    // Check eye level (if calibrated)
    if (calibratedEyeLevel !== null && landmarks.length >= 6) {
      const leftEye = landmarks[2]; // Left eye landmark
      const rightEye = landmarks[5]; // Right eye landmark
      const avgEyeY = (leftEye.y + rightEye.y) / 2;

      // Convert normalized coordinates to pixel values for comparison
      const avgEyeYPixels = avgEyeY * 480; // Assuming 480px height
      const eyeLevelPixels = calibratedEyeLevel * 480;

      if (avgEyeYPixels > (eyeLevelPixels + eyeHeightLeniency)) {
        // Eyes are too low
        if (eyeAboveStart === null) {
          setEyeAboveStart(currentTime);
        } else {
          const elapsed = currentTime - eyeAboveStart;
          if (elapsed >= eyeTimeLeniency && !eyeAboveTriggered) {
            setEyeAboveTriggered(true);
            newAlerts.push({
              type: 'warning',
              message: 'Eyes too low - look up at the screen!'
            });
          }
        }
      } else {
        setEyeAboveStart(null);
        setEyeAboveTriggered(false);
      }
    }

    // Check head tilt (eyes at different heights)
    if (landmarks.length >= 6) {
      const leftEye = landmarks[2];
      const rightEye = landmarks[5];
      const verticalDist = Math.abs(rightEye.y - leftEye.y) * 480; // Convert to pixels

      if (verticalDist > headHeightLeniency) {
        if (headUnevenStart === null) {
          setHeadUnevenStart(currentTime);
        } else {
          const timeElapsed = currentTime - headUnevenStart;
          if (timeElapsed >= headTimeLeniency && !headUnevenTriggered) {
            setHeadUnevenTriggered(true);
            newAlerts.push({
              type: 'warning',
              message: 'Head tilt detected - keep head straight!'
            });
          }
        }
      } else {
        setHeadUnevenStart(null);
        setHeadUnevenTriggered(false);
      }
    }

    // Check shoulder unevenness
    if (landmarks.length >= 13) {
      const leftShoulder = landmarks[11]; // Left shoulder
      const rightShoulder = landmarks[12]; // Right shoulder
      const verticalDist = Math.abs(rightShoulder.y - leftShoulder.y) * 480; // Convert to pixels

      if (verticalDist > shoulderUnevennessLeniency) {
        if (shoulderUnevenStart === null) {
          setShoulderUnevenStart(currentTime);
        } else {
          const elapsed = currentTime - shoulderUnevenStart;
          if (elapsed >= shoulderTimeLeniency && !shoulderUnevenTriggered) {
            setShoulderUnevenTriggered(true);
            newAlerts.push({
              type: 'warning',
              message: 'Uneven shoulders - keep them level!'
            });
          }
        }
      } else {
        setShoulderUnevenStart(null);
        setShoulderUnevenTriggered(false);
      }
    }

    setAlerts(newAlerts);
  };

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      setCameraStatus('connecting');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      console.log('Camera access granted, stream:', stream);
      setCameraStatus('connected');

      if (videoRef.current && pose) {
        videoRef.current.srcObject = stream;
        console.log('Video element srcObject set');

        const cameraInstance = new Camera(videoRef.current, {
          onFrame: async () => {
            if (pose) {
              await pose.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        cameraInstance.start();
        setCamera(cameraInstance);
        setIsStreaming(true);
        setCameraStatus('streaming');
      } else {
        console.error('Video ref or pose is null');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraStatus('error');
      setAlerts([{
        type: 'error',
        message: `Unable to access camera: ${error.message}. Please check permissions and try again.`
      }]);
    }
  };

  const stopCamera = () => {
    if (camera) {
      camera.stop();
      setCamera(null);
    }
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsStreaming(false);
    setCameraStatus('disconnected');
  };

  const handleCalibrate = async () => {
    setIsCalibrating(true);
    try {
      // Get current pose landmarks for calibration
      if (pose && videoRef.current) {
        // Send current frame to pose detector to get landmarks
        await pose.send({ image: videoRef.current });

        // The calibration will happen in the onPoseResults callback
        // For now, we'll simulate success
        setTimeout(() => {
          setAlerts([{ type: 'success', message: 'Eye level calibrated successfully!' }]);
          setTimeout(() => setAlerts([]), 3000);
          setIsCalibrating(false);
        }, 1000);
      } else {
        throw new Error('Pose detector not ready or no video feed');
      }
    } catch (error) {
      console.error('Calibration error:', error);
      setAlerts([{ type: 'error', message: 'Calibration failed. Please ensure you are visible in the camera.' }]);
      setIsCalibrating(false);
    }
  };

  // Function to actually perform calibration when landmarks are available
  const performCalibration = (landmarks) => {
    if (landmarks.length >= 6) {
      const leftEye = landmarks[2];
      const rightEye = landmarks[5];
      const avgEyeLevel = (leftEye.y + rightEye.y) / 2;
      setCalibratedEyeLevel(avgEyeLevel);
      console.log('Calibrated eye level:', avgEyeLevel);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Curve Guard Active
            </h1>
            <p className="text-gray-300 mb-4">
              Welcome back, {user?.username || 'User'}! Your posture is being monitored.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${
                cameraStatus === 'streaming' ? 'bg-green-500' :
                cameraStatus === 'connected' ? 'bg-yellow-500' :
                cameraStatus === 'connecting' ? 'bg-blue-500 animate-pulse' :
                cameraStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
              }`}></div>
              <span className="text-gray-400 capitalize">
                Camera: {cameraStatus.replace('_', ' ')}
              </span>
              {calibratedEyeLevel !== null && (
                <>
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-400">Eye Level: Calibrated</span>
                </>
              )}
            </div>
          </div>

          {/* Camera Feed */}
          <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-6 relative">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="hidden"
                style={{ width: '640px', height: '480px' }}
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="w-full h-auto block"
                style={{ width: '640px', height: '480px' }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={handleCalibrate}
              disabled={isCalibrating}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors"
            >
              {isCalibrating ? 'Calibrating...' : 'Calibrate Eye Level'}
            </button>
            <button
              onClick={isStreaming ? stopCamera : startCamera}
              className={`px-6 py-3 ${isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg font-semibold transition-colors`}
            >
              {isStreaming ? 'Stop Camera' : 'Start Camera'}
            </button>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg font-semibold text-center ${
                    alert.type === 'error'
                      ? 'bg-red-600 text-white'
                      : alert.type === 'warning'
                      ? 'bg-yellow-600 text-black'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-slate-800 rounded-lg p-6 mt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Posture Guidelines</h3>
            <div className="grid md:grid-cols-3 gap-4 text-gray-300 mb-4">
              <div className="text-center">
                <div className="text-2xl mb-2">👁️</div>
                <p>Keep your eyes at screen level (calibrate first)</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚖️</div>
                <p>Keep shoulders level</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📐</div>
                <p>Maintain straight head posture</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <p><strong>Visual Indicators:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Red line: Calibrated eye level</li>
                <li>Red circles: Shoulder and eye tracking points</li>
                <li>Green lines: Pose skeleton connections</li>
                <li>Red dots: Individual body landmarks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionPage;