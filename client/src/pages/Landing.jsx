import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser } from 'aws-amplify/auth';
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
  const { user: authUser, signOut } = useAuthenticator();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [animateExit, setAnimateExit] = useState(false);
  const { updateCanvasProps, canvasProps } = useCanvas();

  const { heroRef, aboutRef, featuresRef, creatorRef, animateSectionTransition } = useSectionTransition(updateCanvasProps);

  useScrollPrevention();

  // Check for current user on mount and when authUser changes
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };

    if (authUser) {
      setUser(authUser);
    } else {
      checkCurrentUser();
    }
  }, [authUser]);

  // Animate current section when sign-in is shown/hidden
  useEffect(() => {
    const sections = {
      hero: heroRef.current,
      about: aboutRef.current,
      features: featuresRef.current,
      creator: creatorRef.current
    };
    
    const currentSectionElement = sections[currentSection];
    
    if (showSignIn) {
      // Animate current section up and away when sign-in is shown
      if (currentSectionElement) {
        gsap.to(currentSectionElement, {
          y: -50,
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          ease: "power2.in"
        });
      }
    } else {
      // Animate current section back in when sign-in is hidden
      if (currentSectionElement) {
        gsap.to(currentSectionElement, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    }
  }, [showSignIn, currentSection]);

  const handleShowSignIn = () => {
    // First navigate to hero section if not already there
    if (currentSection !== 'hero') {
      animateSectionTransition(currentSection, 'hero', setCurrentSection);
    }
    // Then show sign-in
    setShowSignIn(true);
  };

  const handleBackToHero = () => {
    setShowSignIn(false);
  };

  const handleGoToDetection = () => {
    navigate('/detection');
  };

  const handleShowAbout = () => {
    if (showSignIn) {
      // If sign-in is showing, hide it and go directly to about
      setShowSignIn(false);
      setCurrentSection('about');
      updateCanvasProps({ currentSection: 'about' });
    } else if (currentSection !== 'about') {
      animateSectionTransition(currentSection, 'about', setCurrentSection);
    }
  };

  const handleShowFeatures = () => {
    if (showSignIn) {
      // If sign-in is showing, hide it and go directly to features
      setShowSignIn(false);
      setCurrentSection('features');
      updateCanvasProps({ currentSection: 'features' });
    } else if (currentSection !== 'features') {
      animateSectionTransition(currentSection, 'features', setCurrentSection);
    }
  };

  const handleShowCreator = () => {
    if (showSignIn) {
      // If sign-in is showing, hide it and go directly to creator
      setShowSignIn(false);
      setCurrentSection('creator');
      updateCanvasProps({ currentSection: 'creator' });
    } else if (currentSection !== 'creator') {
      animateSectionTransition(currentSection, 'creator', setCurrentSection);
    }
  };

  const handleGoHome = () => {
    if (showSignIn) {
      // If sign-in is showing, hide it and go directly to hero
      setShowSignIn(false);
      setCurrentSection('hero');
      updateCanvasProps({ currentSection: 'hero' });
    } else if (currentSection !== 'hero') {
      animateSectionTransition(currentSection, 'hero', setCurrentSection);
    }
  };

  const handleAuthSuccess = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
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

        <SignInSection showSignIn={showSignIn} onBackToHero={handleBackToHero} onAuthSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
}


