import React from 'react';
import WebcamScreen from './WebcamScreen';
import CameraOffOverlay from './CameraOffOverlay';

const PhoneDisplay = ({
  videoRef,
  poseCanvas,
  isStreaming,
  alerts = {},
  settings = {},
  webcamPosition = { x: 0, y: 0, z: 0.0049 },
  webcamWidth = 0.086,
  webcamHeight = 0.16
}) => {
  return (
    <>
      <WebcamScreen
        videoRef={videoRef}
        poseCanvas={poseCanvas}
        isStreaming={isStreaming}
        alerts={alerts}
        settings={settings}
        width={webcamWidth}
        height={webcamHeight}
        position={webcamPosition}
      />

      {!isStreaming && <CameraOffOverlay />}
    </>
  );
};

export default PhoneDisplay;