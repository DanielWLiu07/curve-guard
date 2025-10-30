import React from 'react';
import Navbar from '../components/Navbar.jsx';
import HeroCanvas from '../components/HeroCanvas.jsx';
import HeroSection from '../components/HeroSection.jsx';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-jade-12 to-jade-10 relative">
      <Navbar />

      <div className="absolute inset-0">
        <HeroCanvas />
      </div>

      <HeroSection />
    </div>
  );
}


