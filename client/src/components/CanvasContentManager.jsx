import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalCanvas from './canvas/GlobalCanvas';
import { useCanvas } from '../contexts/CanvasContext';

export default function CanvasContentManager() {
  const location = useLocation();
  const { canvasProps, updateCanvasProps } = useCanvas();

  const getContentType = () => {
    if (location.pathname === '/') {
      return 'landing';
    } else if (location.pathname === '/detection') {
      return 'detection';
    }
    return 'landing';
  };

  const contentType = getContentType();

  useEffect(() => {
    if (location.pathname === '/') {
      updateCanvasProps({
        animateExit: false,
        currentSection: 'hero',
        exitAnimationKey: 0
      });
    }
  }, [location.pathname]);

  return (
    <GlobalCanvas
      contentType={contentType}
      {...canvasProps}
    />
  );
}