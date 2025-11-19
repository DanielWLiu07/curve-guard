import React from 'react';
import { Html } from '@react-three/drei';

const CameraOffOverlay = () => {
  return (
    <Html
      transform
      center
      distanceFactor={1}
      position={[0, 0, 0.01]}
      style={{
        color: 'white',
        fontSize: '6px',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '2px 6px',
        borderRadius: '3px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      CAMERA OFF
    </Html>
  );
};

export default CameraOffOverlay;