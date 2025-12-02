import React from 'react';
import { HeroTitle, HeroSubtitle, HeroDescription } from '../ui/HeroContent';
import HeroActions from '../ui/HeroActions';
import HeroFeatures from '../ui/HeroFeatures';

export default function HeroSection({ onShowSignIn, onShowAbout, user, onGoToApp }) {
  return (
    <main className="absolute inset-0 flex items-center z-10">
      <div className="mx-auto w-full max-w-[90rem] p-6">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-4">
            <HeroTitle />
            <HeroSubtitle />
          </div>

          <div className="space-y-4">
            <HeroDescription />
          </div>

          <HeroActions
            user={user}
            onShowSignIn={onShowSignIn}
            onShowAbout={onShowAbout}
            onGoToApp={onGoToApp}
          />

          <HeroFeatures />
        </div>
      </div>
    </main>
  );
}