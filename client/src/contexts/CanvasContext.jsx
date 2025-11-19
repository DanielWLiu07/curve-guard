import React, { createContext, useContext, useState } from 'react';

const CanvasContext = createContext();

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}

export function CanvasProvider({ children }) {
  const [canvasProps, setCanvasProps] = useState({
    currentSection: 'hero',
    animateExit: false,
    videoRef: null,
    isStreaming: false,
    poseLandmarks: null,
    poseCanvas: null,
    alerts: {},
    settings: {}
  });

  const updateCanvasProps = (newProps) => {
    setCanvasProps(prev => ({ ...prev, ...newProps }));
  };

  return (
    <CanvasContext.Provider value={{ canvasProps, updateCanvasProps }}>
      {children}
    </CanvasContext.Provider>
  );
}