import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  SceneSetup,
  ScreenLight,
  SceneLighting,
  PhoneWithWebcam,
  SceneControls,
  LandingModel,
  DetectionModel
} from './three';

export default function GlobalCanvas({
  contentType = 'landing',
  currentSection = 'hero',
  animateExit = false,
  exitAnimationKey = 0,
  videoRef,
  isStreaming = false,
  poseLandmarks,
  poseCanvas,
  alerts = {},
  settings = {}
}) {
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
          });
          canvas.addEventListener('webglcontextrestored', () => {
          });
        }}
      >
        <SceneSetup />
        <color attach="background" args={[contentType === 'detection' ? '#0a0f1a' : '#0a0f1a']} />

        {contentType === 'landing' ? (
          <>
            <ambientLight intensity={0.3} color="#4a5568" />
            <directionalLight
              position={[3, 2, 3]}
              intensity={0.4}
              color="#e2e8f0"
              castShadow
            />
            <ScreenLight flickering={true} />
            <pointLight position={[-2, 1, -2]} intensity={0.2} color="#60a5fa" />
            <LandingModel currentSection={currentSection} animateExit={animateExit} exitAnimationKey={exitAnimationKey} />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              target={[0, 1.7, 0]}
            />
          </>
        ) : (
          <>
            <SceneLighting />
            <ScreenLight flickering={false} />
            <PhoneWithWebcam
              videoRef={videoRef}
              poseCanvas={poseCanvas}
              isStreaming={isStreaming}
              alerts={alerts}
              settings={settings}
              rotation={[0, 0, 0]}
              width={0.08}
              height={0.12}
            />
            <DetectionModel alerts={alerts} />
            <SceneControls
              enablePan={false}
              enableZoom={false}
              target={[0, 1.6, 0]}
            />
          </>
        )}
      </Canvas>
    </div>
  );
}
