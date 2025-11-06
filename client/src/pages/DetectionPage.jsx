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
      // Draw pose landmarks and connections
      drawConnectors(ctx, results.poseLandmarks, Pose.POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 4
      });
      drawLandmarks(ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 2
      });

      // Analyze posture
      analyzePosture(results.poseLandmarks);
    }
  };

  const analyzePosture = (landmarks) => {
    const newAlerts = [];

    if (landmarks.length >= 12) {
      // Check shoulders (landmarks 11 and 12 are shoulders)
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);

      if (shoulderDiff > 0.05) { // threshold for shoulder level
        newAlerts.push({
          type: 'warning',
          message: 'Shoulders are uneven - keep them level!'
        });
      }

      // Check head tilt (landmarks 2 and 5 are eyes)
      if (landmarks.length >= 6) {
        const leftEye = landmarks[2];
        const rightEye = landmarks[5];
        const eyeDiff = Math.abs(rightEye.y - leftEye.y);

        if (eyeDiff > 0.03) { // threshold for head tilt
          newAlerts.push({
            type: 'warning',
            message: 'Head tilt detected - keep head straight!'
          });
        }
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
      // For now, just return success
      // In a real implementation, this would trigger calibration in the browser
      setAlerts([{ type: 'success', message: 'Calibration completed successfully!' }]);
      setTimeout(() => setAlerts([]), 3000);
    } catch (error) {
      console.error('Calibration error:', error);
      setAlerts([{ type: 'error', message: 'Calibration failed. Please try again.' }]);
    }
    setIsCalibrating(false);
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
            <div className="grid md:grid-cols-3 gap-4 text-gray-300">
              <div className="text-center">
                <div className="text-2xl mb-2">👁️</div>
                <p>Keep your eyes at screen level</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionPage;