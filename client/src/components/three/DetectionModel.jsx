import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import GLTFModel from './GLTFModel';

const DetectionModel = ({ alerts = {} }) => {
  const ref = useRef();

  // Initial entrance animation
  useEffect(() => {
    if (ref.current) {
      // Start from right and down
      ref.current.position.set(2, -0.5, -0.2);

      // Animate to final position
      gsap.to(ref.current.position, {
        x: 0.15,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.1
      });
    }
  }, []);

  // Alert-based position adjustments
  useEffect(() => {
    if (!ref.current) return;

    const tweens = [];

    if (alerts.eyeHeight || alerts.shoulder || alerts.headTilt) {
      const positionTween = gsap.to(ref.current.position, {
        y: 0.05,
        duration: 0.8,
        ease: "power2.out"
      });

      tweens.push(positionTween);
    } else if (!alerts.eyeHeight && !alerts.shoulder && !alerts.headTilt) {
      const positionTween = gsap.to(ref.current.position, {
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      });

      tweens.push(positionTween);
    }

    return () => {
      tweens.forEach(tween => tween.kill());
    };
  }, [alerts.eyeHeight, alerts.shoulder, alerts.headTilt]);

  return (
    <GLTFModel
      ref={ref}
      url="/skeleton.glb"
      position={[2, -0.5, -0.2]}
      rotation={[0, 0, 0]}
    />
  );
};

export default DetectionModel;