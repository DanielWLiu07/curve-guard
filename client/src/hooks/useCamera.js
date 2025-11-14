import { useState, useRef, useEffect } from 'react';
import { initPose, startPoseDetection, stopPoseDetection } from '../lib/pose';

export const useCamera = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('disconnected');

  const startCamera = async (settings, poseDetectionCallback) => {
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

        await initPose(settings);

        const video = videoRef.current;

        const startDrawing = () => {
          startPoseDetection(video, poseDetectionCallback);
          video.play().then(() => {
            setIsStreaming(true);
            setCameraStatus('streaming');
          });
        };

        if (video.readyState >= 1) {
          startDrawing();
        } else {
          video.addEventListener('loadedmetadata', startDrawing, { once: true });
        }
      }
    } catch (error) {
      setCameraStatus('error');
      throw error;
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
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopCamera();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    isStreaming,
    cameraStatus,
    startCamera,
    stopCamera
  };
};