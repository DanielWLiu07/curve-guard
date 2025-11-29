import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import { SceneSetup } from './three';


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

function Model({ currentSection, animateExit }) {
  const { scene } = useGLTF('/skeleton.glb');
  const ref = useRef();

  useEffect(() => {
    if (scene) {
      const outlineObject = scene.getObjectByName('OutLine');
      if (outlineObject) {
        outlineObject.visible = false;
      }
    }
  }, [scene]);

  useEffect(() => {
    if (!ref.current || !animateExit) return;

    const tween = gsap.to(ref.current.position, {
      x: 5,
      duration: 1.2,
      ease: 'power2.in'
    });

    return () => {
      tween.kill();
    };
  }, [animateExit]);

  useEffect(() => {
    if (!ref.current) return;

    const sectionPositions = {
      hero: [0.08, 0, 0],
      about: [-0.075, 0.4, -0.05],
      features: [0, 0.15, -0.4],
      creator: [0, -0.55, 0.1],
    };

    const sectionRotations = {
      hero: [0, -Math.PI / 4, 0],
      about: [0, Math.PI / 2.5, 0],
      features: [0.1, 0, 0],
      creator: [0.3, 0, 0]
    };

    const targetPosition = sectionPositions[currentSection] || sectionPositions.hero;
    const targetRotation = sectionRotations[currentSection] || sectionRotations.hero;

    const positionTween = gsap.to(ref.current.position, {
      x: targetPosition[0],
      y: targetPosition[1],
      z: targetPosition[2],
      duration: 0.8,
      ease: 'power2.out'
    });

    const rotationTween = gsap.to(ref.current.rotation, {
      x: targetRotation[0],
      y: targetRotation[1],
      z: targetRotation[2],
      duration: 0.8,
      ease: 'power2.out'
    });

    return () => {
      positionTween.kill();
      rotationTween.kill();
    };
  }, [currentSection]);

  return <primitive ref={ref} object={scene} position={[0.08, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />;
}



export default function HeroCanvas({ currentSection, animateExit = false }) {
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
        }}
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
        <Model currentSection={currentSection} animateExit={animateExit} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={[0, 1.7, 0]}
        />

      </Canvas>
    </div>
  );
}
