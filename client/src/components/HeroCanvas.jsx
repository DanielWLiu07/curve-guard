import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function SceneSetup() {
  const { scene } = useThree();

  useEffect(() => {
    // Add exponential fog for dark atmospheric effect
    scene.fog = new THREE.FogExp2(0x0a0f1a, 0.08); // Dark blue-gray fog with moderate density
  }, [scene]);

  return null;
}

function ScreenLight() {
  const lightRef = useRef();
  const targetRef = useRef();

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
  }, []);

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[-3, 1.2, 0.5]}
        angle={0.2}
        penumbra={0.2}
        intensity={10}
        color="#00ff88"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <object3D ref={targetRef} position={[0.2, 1.4, 0]} />
    </>
  );
}

function Model(props) {
  const { scene } = useGLTF('/skeleton.glb');
  const ref = useRef();

  return <primitive ref={ref} object={scene} {...props} />;
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        camera={{ position: [0, 1.6, 0.4], fov: 50 }}
        gl={{ antialias: true }}
      >
        <SceneSetup />
        <color attach="background" args={['#0a0f1a']} />
        <ambientLight intensity={0.3} color="#4a5568" />
        <directionalLight
          position={[3, 2, 3]}
          intensity={0.4}
          color="#e2e8f0"
          castShadow
        />
        <ScreenLight />
        <pointLight position={[-2, 1, -2]} intensity={0.2} color="#60a5fa" /> 
        <Model position={[0, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />

        <OrbitControls enablePan={false} enableZoom={false} />
        <OrbitControls target={[0, 1.7, 0]} />
      </Canvas>
    </div>
  );
}
