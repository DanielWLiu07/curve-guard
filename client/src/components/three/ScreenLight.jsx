import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ScreenLight = ({ flickering = false }) => {
  const lightRef = useRef();
  const targetRef = useRef();
  const animationRef = useRef(null);

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
  }, []);

  useEffect(() => {
    if (!flickering || !lightRef.current) return;

    const animate = () => {
      const baseIntensity = 30;
      const variance = 50;
      const targetIntensity = baseIntensity + (Math.random() - 0.5) * variance;
      const duration = 0.2 + Math.random() * 0.4;

      animationRef.current = gsap.to(lightRef.current, {
        intensity: targetIntensity,
        duration: duration,
        ease: "power2.inOut",
        onComplete: animate
      });
    };

    animate();

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [flickering]);

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
};

export default ScreenLight;