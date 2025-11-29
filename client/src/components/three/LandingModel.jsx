import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';

const LandingModel = ({ currentSection, animateExit, exitAnimationKey = 0 }) => {
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
};

export default LandingModel;