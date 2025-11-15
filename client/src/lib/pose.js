import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

let pose = null;
let camera = null;
let isRunning = false;

export async function initPose(settings = {}) {
  if (!pose) {
    const poseConfig = {
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    };

    pose = new Pose(poseConfig);

    const modelComplexity = settings.landmarkDetection === 'minimal' ? 0 : 
                           settings.landmarkDetection === 'upper_body' ? 1 : 1;

    pose.setOptions({
      modelComplexity: modelComplexity,
      smoothLandmarks: settings.smoothingFactor > 0.5,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: settings.detectionConfidence || 0.5,
      minTrackingConfidence: settings.trackingConfidence || 0.5,
    });

    await pose.initialize();
  } else {
    const modelComplexity = settings.landmarkDetection === 'minimal' ? 0 : 
                           settings.landmarkDetection === 'upper_body' ? 1 : 1;

    pose.setOptions({
      modelComplexity: modelComplexity,
      smoothLandmarks: settings.smoothingFactor > 0.5,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: settings.detectionConfidence || 0.5,
      minTrackingConfidence: settings.trackingConfidence || 0.5,
    });
  }

  return pose;
}

export function startPoseDetection(videoElement, onResults, settingsOrGetter = {}) {
  if (isRunning) {
    return;
  }
  
  isRunning = true;

  pose.onResults((results) => {
    
    const currentSettings = typeof settingsOrGetter === 'function' ? settingsOrGetter() : settingsOrGetter;
    
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = 640;
    frameCanvas.height = 480;
    const frameCtx = frameCanvas.getContext('2d');
    
    frameCtx.fillStyle = 'black';
    frameCtx.fillRect(0, 0, frameCanvas.width, frameCanvas.height);
    
    if (videoElement.readyState >= 1) {
      frameCtx.drawImage(videoElement, 0, 0, frameCanvas.width, frameCanvas.height);
    }

    if (results.poseLandmarks) {
      let filteredLandmarks = results.poseLandmarks;

      if (currentSettings.landmarkDetection === 'minimal') {
        const essentialIndices = [0, 2, 5, 7, 8, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
        filteredLandmarks = results.poseLandmarks.filter((_, index) => essentialIndices.includes(index));
      } else if (currentSettings.landmarkDetection === 'upper_body') {
        filteredLandmarks = results.poseLandmarks.filter((_, index) => index <= 24);
      }

      if (currentSettings.showLandmarks && frameCtx && frameCanvas) {
        drawConnectors(frameCtx, filteredLandmarks, [
          [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
          [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
          [11, 23], [12, 24], [23, 24],
          [23, 25], [25, 27], [27, 29], [29, 31],
          [24, 26], [26, 28], [28, 30], [30, 32]
        ], { color: currentSettings.landmarkColor === 'white' ? '#ffffff' :
                   currentSettings.landmarkColor === 'red' ? '#ff0000' :
                   currentSettings.landmarkColor === 'green' ? '#00ff00' :
                   currentSettings.landmarkColor === 'blue' ? '#0000ff' :
                   currentSettings.landmarkColor === 'yellow' ? '#ffff00' :
                   currentSettings.landmarkColor === 'cyan' ? '#00ffff' : '#00ff88', lineWidth: 4 });

        drawLandmarks(frameCtx, filteredLandmarks, {
          color: currentSettings.landmarkColor === 'white' ? '#ffffff' :
                 currentSettings.landmarkColor === 'red' ? '#ff0000' :
                 currentSettings.landmarkColor === 'green' ? '#00ff00' :
                 currentSettings.landmarkColor === 'blue' ? '#0000ff' :
                 currentSettings.landmarkColor === 'yellow' ? '#ffff00' :
                 currentSettings.landmarkColor === 'cyan' ? '#00ffff' : '#00ff88',
          lineWidth: 2,
          radius: currentSettings.landmarkRadius || 6
        });

        frameCanvas.version = Date.now();
      }

      if (currentSettings.eyeHeightCalibrationLine != null && frameCtx && frameCanvas) {
        frameCtx.strokeStyle = '#ff6b6b';
        frameCtx.lineWidth = 3;
        frameCtx.setLineDash([10, 5]);
        frameCtx.beginPath();
        frameCtx.moveTo(0, currentSettings.eyeHeightCalibrationLine);
        frameCtx.lineTo(frameCanvas.width, currentSettings.eyeHeightCalibrationLine);
        frameCtx.stroke();
        frameCtx.setLineDash([]);
      }

      if (currentSettings.alerts && currentSettings.alerts.length > 0 && frameCtx && frameCanvas) {

        frameCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        frameCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        frameCtx.lineWidth = 3;
        frameCtx.font = 'bold 24px Arial';
        frameCtx.textAlign = 'center';
        frameCtx.textBaseline = 'middle';

        currentSettings.alerts.forEach((alert, index) => {
          const yPosition = frameCanvas.height / 2 + (index * 40) - ((currentSettings.alerts.length - 1) * 20);

          frameCtx.strokeText(alert.message, frameCanvas.width / 2, yPosition);
          frameCtx.fillText(alert.message, frameCanvas.width / 2, yPosition);
        });

      }

      onResults(filteredLandmarks, frameCanvas);
    } else {
      onResults(null, frameCanvas);
    }
  });

  if (camera) {
    camera.stop();
  }

  camera = new Camera(videoElement, {
    onFrame: async () => {
      if (videoElement.readyState >= 2 && pose && isRunning) {
        await pose.send({ image: videoElement });
      }
    },
    width: 640,
    height: 480,
  });

  camera.start();
}

export async function stopPoseDetection() {
  if (camera) {
    camera.stop();
    camera = null;
  }
  
  isRunning = false;
}

export function runPostureChecks(landmarks, settings) {
  if (!landmarks || !settings) return { errors: [], eyeHeightViolation: false, shoulderViolation: false, headTiltViolation: false };

  const errors = [];

  const getLandmark = (idx) => landmarks[idx];
  const getY = (idx) => (landmarks[idx] ? landmarks[idx].y : null);

  const leftEye = getLandmark(2);
  const rightEye = getLandmark(5);
  const leftShoulder = getLandmark(11);
  const rightShoulder = getLandmark(12);

  let shoulderViolation = false;
  if (settings.enableShoulderDetection && leftShoulder && rightShoulder && settings.shoulderUnevennessLeniency != null) {
    const shoulderDelta = Math.abs(leftShoulder.y - rightShoulder.y);
    if (shoulderDelta > settings.shoulderUnevennessLeniency) {
      shoulderViolation = true;
    }
  }

  let headTiltViolation = false;
  if (settings.enableHeadTiltDetection && leftEye && rightEye && settings.headTiltTolerance != null) {
    const eyeDelta = Math.abs(leftEye.y - rightEye.y);
    const eyeDeltaPixels = eyeDelta * 480;
    if (eyeDeltaPixels > settings.headTiltTolerance) {
      headTiltViolation = true;
    }
  }

  let eyeHeightViolation = false;
  if (settings.enableHeightDetection && leftEye && rightEye && settings.eyeHeightCalibrationLine != null && settings.eyeHeightTolerance != null) {
    const avgEyeY = (leftEye.y + rightEye.y) / 2;
    const eyeYPixels = avgEyeY * 480;
    if (eyeYPixels > settings.eyeHeightCalibrationLine + settings.eyeHeightTolerance) {
      eyeHeightViolation = true;
    }
  }

  return { errors, eyeHeightViolation, shoulderViolation, headTiltViolation };
}


