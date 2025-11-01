import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';


function SceneSetup() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.Fog(0x000000, 0, 0.7);
  }, [scene]);

  return null;
}

function ScreenLight() {
  const lightRef = useRef();
  const targetRef = useRef();
  const [currentIntensity, setCurrentIntensity] = useState(30);
  const [targetIntensity, setTargetIntensity] = useState(30);
  const [flickerTimer, setFlickerTimer] = useState(0);

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
  }, []);

  useFrame((state, delta) => {
    if (!lightRef.current) return;

    // Smoothly interpolate to target intensity
    const lerpFactor = 0.1;
    const newIntensity = THREE.MathUtils.lerp(currentIntensity, targetIntensity, lerpFactor);
    setCurrentIntensity(newIntensity);
    lightRef.current.intensity = newIntensity;

    setFlickerTimer(prev => prev + delta);

    if (Math.random() < 0.025) {
      const flickerPatterns = [
        35,  // Normal
        50,  // Bright
        70,  // Very bright
        90,  // Extremely bright
        45,  // Medium bright
        60,  // Bright
        80,  // Very bright
        100, // Maximum bright
      ];
      const randomIntensity = flickerPatterns[Math.floor(Math.random() * flickerPatterns.length)];
      setTargetIntensity(randomIntensity);

      // Reset flicker timer for next potential flicker
      setFlickerTimer(0);
    } else if (flickerTimer > 0.3) { // Faster recovery
      // Gradually return to base intensity after flicker
      setTargetIntensity(30);
    }
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[-3, 1.2, 0.5]}
        angle={0.2}
        penumbra={0.2}
        intensity={currentIntensity}
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
  const headRef = useRef();
  const jawRef = useRef();

  useEffect(() => {
    // Your specific head bone selection code
    const skeletonRoot = ref.current.getObjectByName('SM_HumanSkeleton');
    if (skeletonRoot) {
      headRef.current = skeletonRoot.getObjectByName('SM_HumanSkeleton_17');
      jawRef.current = skeletonRoot.getObjectByName('SM_HumanSkeleton_18');
      console.log('Head bone:', headRef.current);
      console.log('Jaw bone:', jawRef.current);
    }

    // Disable the outline object
    const outlineObject = ref.current.getObjectByName('OutLine');
    if (outlineObject) {
      outlineObject.visible = false;
      console.log('Outline object disabled');
    }
  }, [scene]);

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
        <Model position={[0.12, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />

        <OrbitControls enablePan={false} enableZoom={false} />
        <OrbitControls target={[0, 1.7, 0]} />
        
      </Canvas>
    </div>
  );
}
