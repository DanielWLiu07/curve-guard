import React, { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Navbar from '../components/Navbar.jsx';
import HeroCanvas from '../components/HeroCanvas.jsx';
import HeroSection from '../components/HeroSection.jsx';
import SignInSection from '../components/SignInSection.jsx';
import LandingBackground from '../components/LandingBackground.jsx';
import AboutSection from '../components/AboutSection.jsx';
import FeaturesSection from '../components/FeaturesSection.jsx';
import CreatorSection from '../components/CreatorSection.jsx';
import { useCanvas } from '../contexts/CanvasContext.jsx';
import { useSectionTransition } from '../hooks/useSectionTransition.js';
import { useScrollPrevention } from '../hooks/useScrollPrevention.js';

export default function Landing() {
  const { user, signOut } = useAuthenticator();
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [animateExit, setAnimateExit] = useState(false);
  const { updateCanvasProps, canvasProps } = useCanvas();

  const { heroRef, aboutRef, featuresRef, creatorRef, animateSectionTransition } = useSectionTransition(updateCanvasProps);

  useScrollPrevention();

  const handleShowSignIn = () => {
    setShowSignIn(true);
  };

  const handleBackToHero = () => {
    setShowSignIn(false);
  };

  const handleGoToDetection = () => {
    const newKey = (canvasProps.exitAnimationKey || 0) + 1;
    setAnimateExit(true);
    updateCanvasProps({ animateExit: true, exitAnimationKey: newKey });

    const tl = gsap.timeline();

    tl.to('.navbar-about', {
      y: -100,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in'
    }, 0)
    .to('.navbar-features', {
      y: -100,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in'
    }, 0.1)
    .to('.navbar-creator', {
      y: -100,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in'
    }, 0.2)
    .to('.navbar-signout', {
      y: -100,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in'
    }, 0.3);

    tl.fromTo('.landing-content',
      { x: 0, y: 0 },
      {
        x: '-100%',
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in'
      }, 0.1);

    tl.call(() => {
      navigate('/detection');
      setTimeout(() => {
        setAnimateExit(false);
        updateCanvasProps({ animateExit: false });
      }, 100);
    });
  };

  const handleShowAbout = () => {
    if (currentSection !== 'about') {
      animateSectionTransition(currentSection, 'about', setCurrentSection);
    }
  };

  const handleShowFeatures = () => {
    if (currentSection !== 'features') {
      animateSectionTransition(currentSection, 'features', setCurrentSection);
    }
  };

  const handleShowCreator = () => {
    if (currentSection !== 'creator') {
      animateSectionTransition(currentSection, 'creator', setCurrentSection);
    }
  };

  const handleGoHome = () => {
    if (currentSection !== 'hero') {
      animateSectionTransition(currentSection, 'hero', setCurrentSection);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      <LandingBackground />

      <Navbar
        signOut={signOut}
        user={user}
        onShowSignIn={handleShowSignIn}
        onShowAbout={handleShowAbout}
        onShowFeatures={handleShowFeatures}
        onShowCreator={handleShowCreator}
        onGoHome={handleGoHome}
        showSignIn={showSignIn}
        currentSection={currentSection}
      />

      <div className="landing-content absolute inset-0">
        <div
          ref={heroRef}
          className={`absolute inset-0 z-10 transition-all duration-300 ease-out ${
            currentSection === 'hero'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-8 pointer-events-none'
          }`}
        >
          <HeroSection onShowSignIn={handleShowSignIn} onShowAbout={handleShowAbout} user={user} onGoToApp={handleGoToDetection} />
        </div>

        <div
          ref={aboutRef}
          className={`absolute inset-0 z-10 transition-all duration-300 ease-out ${
            currentSection === 'about'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-8 pointer-events-none'
          }`}
        >
          <AboutSection />
        </div>

        <div
          ref={featuresRef}
          className={`absolute inset-0 z-10 transition-all duration-300 ease-out ${
            currentSection === 'features'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-8 pointer-events-none'
          }`}
        >
          <FeaturesSection />
        </div>

        <div
          ref={creatorRef}
          className={`absolute inset-0 z-10 transition-all duration-300 ease-out ${
            currentSection === 'creator'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-8 pointer-events-none'
          }`}
        >
          <CreatorSection />
        </div>

        <SignInSection showSignIn={showSignIn} onBackToHero={handleBackToHero} />
      </div>
    </div>
  );
}


