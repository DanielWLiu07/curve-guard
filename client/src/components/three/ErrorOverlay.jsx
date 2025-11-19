import React from 'react';
import { Html } from '@react-three/drei';

const ErrorOverlay = ({ alert, index, effectiveWidth, settings }) => {
  const getDisplayMessage = (key, message) => {
    if (key.toLowerCase().includes('head') && key.toLowerCase().includes('tilt') || message.toLowerCase().includes('tilt')) {
      return 'Head Tilted';
    }
    if (key.toLowerCase().includes('head') || message.toLowerCase().includes('head')) {
      return 'Raise Head';
    }
    return message;
  };

  return (
    <Html
      transform
      center
      distanceFactor={1}
      position={[0, 0.0725 - index * 0.013, 0.002]}
      style={{
        color: settings.errorBarColor || 'red',
        fontSize: '2.5px',
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '0.5px 4px',
        borderRadius: '2px',
        border: `0.5px ${settings.errorBarBorderStyle || 'solid'} ${settings.errorBarColor || 'red'}`,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        fontFamily: 'Arial, sans-serif',
        width: `${effectiveWidth * 900}px`,
        maxWidth: `${effectiveWidth * 1000}px`,
        maxHeight: '10px',
        lineHeight: '1.2',
        overflow: 'hidden',
        display: 'block'
      }}
    >
      {getDisplayMessage(alert.key, alert.message)}
    </Html>
  );
};

export default ErrorOverlay;