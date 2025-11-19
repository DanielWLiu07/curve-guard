import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
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

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} color="#4a5568" />
      <directionalLight
        position={[3, 2, 3]}
        intensity={0.4}
        color="#e2e8f0"
        castShadow
      />
      <pointLight position={[-2, 1, -2]} intensity={0.2} color="#60a5fa" />
    </>
  );
}

const GLTFModel = React.forwardRef(({ url, position = [0, 0, 0], rotation = [0, 0, 0] }, ref) => {
  const { scene } = useGLTF(url);
  const internalRef = useRef();

  useEffect(() => {
    if (scene) {
      const outlineObject = scene.getObjectByName('OutLine');
      if (outlineObject) {
        outlineObject.visible = false;
      }
    }
  }, [scene]);

  React.useImperativeHandle(ref, () => internalRef.current);

  return <primitive ref={internalRef} object={scene} position={position} rotation={rotation} />;
});

function PhoneWithWebcam({ videoRef, poseCanvas, isStreaming, alerts = {}, settings = {}, rotation = [0, 0, 0], width = 0.08, height = 0.12 }) {
  const groupRef = useRef();

  useEffect(() => {
    if (!groupRef.current) return;

    const phoneGeometry = new THREE.BoxGeometry(width, height, 0.008);
    const phoneMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const phone = new THREE.Mesh(phoneGeometry, phoneMaterial);
    groupRef.current.add(phone);

    const screenWidth = width * 0.9;
    const screenHeight = height * 0.9;
    const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
    let screenMaterial;

    if (isStreaming && (videoRef?.current || poseCanvas)) {
      let texture;

      if (poseCanvas) {
        texture = new THREE.CanvasTexture(poseCanvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
      } else if (videoRef?.current) {
        texture = new THREE.VideoTexture(videoRef.current);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
      }

      const sourceElement = poseCanvas || videoRef?.current;
      if (sourceElement) {
        const sourceAspect = sourceElement.width / sourceElement.height;
        const screenAspect = screenWidth / screenHeight;

        const cropFactor = screenAspect / sourceAspect;
        texture.repeat.set(cropFactor, 1);
        texture.offset.set((1 - cropFactor) / 2, 0);

        texture.repeat.x *= -1;
        texture.offset.x = (1 + cropFactor) / 2;
      }

      screenMaterial = new THREE.MeshBasicMaterial({ map: texture });
    } else {
      screenMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    }

    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0, 0.0041);
    groupRef.current.add(screen);

    return () => {
      if (phone.geometry) phone.geometry.dispose();
      if (phone.material) phone.material.dispose();
      if (screen.geometry) screen.geometry.dispose();
      if (screen.material) screen.material.dispose();
    };
  }, [isStreaming, videoRef, poseCanvas, width, height]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(-2, 1.6, 0.1);

      gsap.to(groupRef.current.position, {
        x: -0.075,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.3
      });
    }
  }, []);

  return <group ref={groupRef} rotation={rotation} />;
}

function SceneControls({ enablePan = false, enableZoom = false, target = [0, 1.6, 0] }) {
  return (
    <OrbitControls
      enablePan={enablePan}
      enableZoom={enableZoom}
      target={target}
    />
  );
}

function LandingModel({ currentSection, animateExit, exitAnimationKey = 0 }) {
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
    if (ref.current && (!animateExit || exitAnimationKey === 0)) {
      ref.current.position.set(0.08, 0, 0);
      ref.current.rotation.set(0, -Math.PI / 4, 0);
    }
  }, [animateExit, exitAnimationKey]);

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
  }, [exitAnimationKey]);

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

function DetectionModel({ alerts = {} }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(2, 0, 0);

      gsap.to(ref.current.position, {
        x: 0,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.1
      });
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const tweens = [];

    if (alerts.eyeHeight || alerts.shoulder || alerts.headTilt) {
      const rotationTween = gsap.to(ref.current.rotation, {
        y: -Math.PI / 4,
        duration: 0.8,
        ease: "power2.out"
      });

      const positionTween = gsap.to(ref.current.position, {
        y: 0.05,
        duration: 0.8,
        ease: "power2.out"
      });

      tweens.push(rotationTween, positionTween);
    } else if (!alerts.eyeHeight && !alerts.shoulder && !alerts.headTilt) {
      const rotationTween = gsap.to(ref.current.rotation, {
        y: -Math.PI / 4,
        duration: 0.5,
        ease: "power2.out"
      });

      const positionTween = gsap.to(ref.current.position, {
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      });

      tweens.push(rotationTween, positionTween);
    }

    return () => {
      tweens.forEach(tween => tween.kill());
    };
  }, [alerts.eyeHeight, alerts.shoulder, alerts.headTilt]);

  return (
    <GLTFModel
      ref={ref}
      url="/skeleton.glb"
      position={[0, 0, 0]}
      rotation={[0, -Math.PI / 4, 0]}
    />
  );
}

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
            <ScreenLight />
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
            <ScreenLight />
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
