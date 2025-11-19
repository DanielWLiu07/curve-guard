import React from 'react';
import {
  SceneSetup,
  ScreenLight,
  SceneLighting,
  GLTFModel,
  SceneControls,
  PhoneWithWebcam
} from './three';

const DetectionScene = ({ skeletonRef, phoneRef, videoRef, isStreaming, poseCanvas, alerts, settings }) => {
  return (
    <>
      <SceneSetup />
      <color attach="background" args={['#0a0f1a']} />
      <SceneLighting />
      <ScreenLight />

      <group position={[-0.1, 1.6, 0]}>
        <PhoneWithWebcam
          ref={phoneRef}
          videoRef={videoRef}
          poseCanvas={poseCanvas}
          isStreaming={isStreaming}
          alerts={alerts}
          settings={settings}
        />
      </group>

      <group ref={skeletonRef}>
        <GLTFModel
          url="/skeleton.glb"
          position={[0, 0, 0]}
          rotation={[0, -Math.PI / 4, 0]}
        />
      </group>

      <SceneControls
        enablePan={false}
        enableZoom={false}
        target={[0, 1.6, 0]}
      />
    </>
  );
};

export default DetectionScene;