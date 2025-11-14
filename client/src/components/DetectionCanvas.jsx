import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function SceneSetup() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.Fog(0x0a0f1a, 2, 8);
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
        intensity={30}
        color="#00ff88"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <object3D ref={targetRef} position={[0.2, 1.4, 0]} />
    </>
  );
}

function WebcamScreen({ poseCanvas, isStreaming, width = 0.2, height = 0.24, position = { x: -0.1, y: 1.6, z: 0 } }) {
  const meshRef = useRef();
  const textureRef = useRef();

  useEffect(() => {
    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (poseCanvas && isStreaming) {
      try {
        if (textureRef.current) {
          textureRef.current.dispose();
          textureRef.current = null;
        }

        const texture = new THREE.CanvasTexture(poseCanvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        const displayAspect = width / height;
        const sourceAspect = 4/3;

        if (displayAspect > sourceAspect) {
          const cropFactor = sourceAspect / displayAspect;
          texture.repeat.set(1, cropFactor);
          texture.offset.set(0, (1 - cropFactor) / 2);
        } else {
          const cropFactor = displayAspect / sourceAspect;
          texture.repeat.set(cropFactor, 1);
          texture.offset.set((1 - cropFactor) / 2, 0);
        }

        textureRef.current = texture;

        if (meshRef.current) {
          meshRef.current.material.map = texture;
          meshRef.current.material.needsUpdate = true;
        }
      } catch (error) {
        console.error('Error creating texture:', error);
      }
    } else {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      if (meshRef.current) {
        meshRef.current.material.map = null;
        meshRef.current.material.needsUpdate = true;
      }
    }
  }, [poseCanvas, isStreaming, width, height]);

  useFrame(() => {
    if (textureRef.current && isStreaming) {
      textureRef.current.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]} rotation={[0, 0, 0]} scale={[-1, 1, 1]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        side={THREE.DoubleSide}
        transparent={true}
        opacity={isStreaming ? 1 : 0.1}
        color={isStreaming ? '#ffffff' : '#000000'}
      />
    </mesh>
  );
}

function Model(props) {
  const { scene } = useGLTF('/skeleton.glb');
  const ref = useRef();

  useEffect(() => {
    const outlineObject = ref.current.getObjectByName('OutLine');
    if (outlineObject) {
      outlineObject.visible = false;
    }
  }, [scene]);

  return <primitive ref={ref} object={scene} {...props} />;
}

function PhoneModel(props) {
  const { scene } = useGLTF('/minimal_phone.glb');
  const ref = useRef();

  useEffect(() => {
    const outlineObject = ref.current.getObjectByName('OutLine');
    if (outlineObject) {
      outlineObject.visible = false;
    }
  }, [scene]);

  return <primitive ref={ref} object={scene} {...props} />;
}

function WebcamWithPhone({ poseCanvas, isStreaming, rotation = [0, -6, 0] }) {
  const webcamPosition = { x: 0, y: 0, z: 0.0049 };

  return (
    <group rotation={rotation}>
      <PhoneModel
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={1.2}
      />
      <WebcamScreen
        poseCanvas={poseCanvas}
        isStreaming={isStreaming}
        width={0.086}
        height={0.16}
        position={webcamPosition}
      />
    </group>
  );
}

export default function DetectionCanvas({ videoRef, isStreaming, poseLandmarks, poseCanvas, alerts = [] }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1.6, 0.25], fov: 50 }}
        gl={{ antialias: true }}
      >
        <SceneSetup />
        <color attach="background" args={['#0a0f1a']} />
        <ambientLight intensity={0.5} color="#4a5568" />
        <directionalLight
          position={[3, 2, 3]}
          intensity={0.4}
          color="#e2e8f0"
          castShadow
        />
        <ScreenLight />
        <pointLight position={[-2, 1, -2]} intensity={0.2} color="#60a5fa" />

        <group position={[-0.1, 1.6, 0]}>
          <WebcamWithPhone
            poseCanvas={poseCanvas}
            isStreaming={isStreaming}
            rotation={[0, 0.6, 0]}
          />
        </group>

        <Model position={[0.08, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />

        <OrbitControls enablePan={false} enableZoom={false} target={[0, 1.6, 0]} />

      </Canvas>

      {alerts.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-red-600/90 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg border-2 border-red-400 animate-pulse">
            {alerts[0].message}
          </div>
        </div>
      )}
    </div>
  );
}