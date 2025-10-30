import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import HeroCanvas from '../components/HeroCanvas.jsx';
import HeroSection from '../components/HeroSection.jsx';
import Vignette from '../components/Vignette.jsx';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-jade-12 to-jade-10 relative">
      <Navbar />

      <div className="absolute inset-0">
        <HeroCanvas />
        <Vignette intensity={0.3} size={100} />
      </div>

      <HeroSection />
    </div>
  );
}


