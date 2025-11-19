import React, { useRef } from 'react';
import * as THREE from 'three';
import VideoTexture from './VideoTexture';
import ErrorOverlays from './ErrorOverlays';

const WebcamScreen = ({
  videoRef,
  poseCanvas,
  isStreaming,
  alerts,
  settings,
  width = 0.2,
  height = 0.24,
  position = { x: -0.1, y: 1.6, z: 0 }
}) => {
  const meshRef = useRef();
  const { texture, cropFactor } = VideoTexture({ videoRef, poseCanvas, isStreaming, width, height });

  const effectiveWidth = width * cropFactor;

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh ref={meshRef} scale={[-1, 1, 1]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={isStreaming ? 1 : 0.1}
          color={isStreaming ? '#ffffff' : '#000000'}
        />
      </mesh>

      <ErrorOverlays
        alerts={alerts}
        settings={settings}
        effectiveWidth={effectiveWidth}
      />
    </group>
  );
};

export default WebcamScreen;