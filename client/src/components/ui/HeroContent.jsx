import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { LightningBoltIcon } from '@radix-ui/react-icons';

const HeroTitle = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.set(titleRef.current, { opacity: 0, y: 20 });

    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 0.5
    });
  }, []);

  return (
    <h1 ref={titleRef} className="text-6xl md:text-7xl font-black tracking-tight">
      <br />
      <span className="bg-gradient-to-r from-jade-9 via-jade-6 to-white bg-clip-text text-transparent animate-pulse">
        FIX GOBLIN
        <br />
        POSTURE
      </span>
    </h1>
  );
};

const HeroSubtitle = () => {
  return (
    <div className="flex items-center gap-2 text-blue-6">
      <LightningBoltIcon className="w-5 h-5" />
      <span className="text-lg font-medium">Real-time awareness for healthier screen time</span>
    </div>
  );
};

const HeroDescription = () => {
  return (
    <p className="text-xl text-white/90 leading-relaxed max-w-lg">
      Transform your daily habits with AI-powered posture detection.
      Get instant feedback and build better posture habits for life.
    </p>
  );
};

export { HeroTitle, HeroSubtitle, HeroDescription };