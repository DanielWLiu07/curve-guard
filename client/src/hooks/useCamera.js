import { useRef, useState } from 'react';

export const useCamera = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('disconnected');
  const [alerts, setAlerts] = useState([]);

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
          setAlerts([{
            type: 'error',
            message: `Unable to play video: ${error.message}`
          }]);
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
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setCameraStatus('disconnected');
    setAlerts([]);
  };

  return {
    videoRef,
    isStreaming,
    cameraStatus,
    alerts,
    startCamera,
    stopCamera,
    setAlerts
  };
};
