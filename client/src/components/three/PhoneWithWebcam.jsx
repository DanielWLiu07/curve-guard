import React, { forwardRef } from 'react';
import PhoneModel from './PhoneModel';
import PhoneDisplay from './PhoneDisplay';

const PhoneWithWebcam = forwardRef(({
  videoRef,
  poseCanvas,
  isStreaming,
  alerts = {},
  settings = {},
  rotation = [0, 0.6, 0]
}, ref) => {
  const groupRef = React.useRef();

  React.useImperativeHandle(ref, () => groupRef.current);

  return (
    <group ref={groupRef} rotation={rotation}>
      <PhoneModel />
      <PhoneDisplay
        videoRef={videoRef}
        poseCanvas={poseCanvas}
        isStreaming={isStreaming}
        alerts={alerts}
        settings={settings}
      />
    </group>
  );
});

PhoneWithWebcam.displayName = 'PhoneWithWebcam';

export default PhoneWithWebcam;