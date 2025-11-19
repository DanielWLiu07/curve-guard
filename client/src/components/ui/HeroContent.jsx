import React from 'react';
import { LightningBoltIcon } from '@radix-ui/react-icons';

const HeroTitle = () => {
  return (
    <h1 className="text-6xl md:text-7xl font-black tracking-tight">
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