import React from 'react';
import { Canvas } from '@react-three/fiber';
import DetectionScene from './DetectionScene';
import { useDetectionAnimations } from '../hooks/useDetectionAnimations';

export default function DetectionCanvas({ videoRef, isStreaming, poseLandmarks, poseCanvas, alerts = {}, settings = {} }) {
  const { skeletonRef, phoneRef } = useDetectionAnimations(alerts);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1.6, 0.25], fov: 50 }}
        gl={{
          antialias: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false,
          alpha: false,
          depth: true,
          stencil: false
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (event) => {
            console.warn("Detection Canvas: WebGL context lost");
          });
        }}
      >
        <DetectionScene
          skeletonRef={skeletonRef}
          phoneRef={phoneRef}
          videoRef={videoRef}
          isStreaming={isStreaming}
          poseCanvas={poseCanvas}
          alerts={alerts}
          settings={settings}
        />
      </Canvas>
    </div>
  );
}