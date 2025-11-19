import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useDetectionAnimations = (alerts) => {
  const skeletonRef = useRef();
  const phoneRef = useRef();

  useEffect(() => {
    if (!skeletonRef.current) return;

    const tweens = [];

    if (alerts.eyeHeight || alerts.shoulder || alerts.headTilt) {
      const rotationTween = gsap.to(skeletonRef.current.rotation, {
        y: -Math.PI / 4,
        duration: 0.8,
        ease: "power2.out"
      });

      const positionTween = gsap.to(skeletonRef.current.position, {
        y: 0.05,
        duration: 0.8,
        ease: "power2.out"
      });

      tweens.push(rotationTween, positionTween);
    } else if (!alerts.eyeHeight && !alerts.shoulder && !alerts.headTilt) {
      const rotationTween = gsap.to(skeletonRef.current.rotation, {
        y: -Math.PI / 4,
        duration: 0.5,
        ease: "power2.out"
      });

      const positionTween = gsap.to(skeletonRef.current.position, {
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

  useEffect(() => {
    if (!phoneRef.current) return;

    const phoneTweens = [];

    if (alerts.eyeHeight || alerts.shoulder || alerts.headTilt) {
      const phoneRotationTween = gsap.to(phoneRef.current.rotation, {
        y: 0.3,
        duration: 0.8,
        ease: "power2.out"
      });

      phoneTweens.push(phoneRotationTween);
    } else if (!alerts.eyeHeight && !alerts.shoulder && !alerts.headTilt) {
      const phoneRotationTween = gsap.to(phoneRef.current.rotation, {
        y: 0.6,
        duration: 0.5,
        ease: "power2.out"
      });

      phoneTweens.push(phoneRotationTween);
    }

    return () => {
      phoneTweens.forEach(tween => tween.kill());
    };
  }, [alerts.eyeHeight, alerts.shoulder, alerts.headTilt]);

  return { skeletonRef, phoneRef };
};