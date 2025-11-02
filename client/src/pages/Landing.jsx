import React, { useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import HeroCanvas from '../components/HeroCanvas.jsx';
import HeroSection from '../components/HeroSection.jsx';
import SignInSection from '../components/SignInSection.jsx';
import Vignette from '../components/Vignette.jsx';

export default function Landing() {
  const { user, signOut } = useAuthenticator();
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);

  // Redirect to protected app if user is signed in
  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleShowSignIn = () => {
    setShowSignIn(true);
  };

  const handleBackToHero = () => {
    setShowSignIn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-jade-12 to-jade-10 relative overflow-hidden">
      <Navbar
        signOut={signOut}
        user={user}
        onShowSignIn={handleShowSignIn}
        showSignIn={showSignIn}
      />

      <div className="absolute inset-0 z-0">
        <HeroCanvas />
      </div>
      <div className="absolute inset-0 z-5">
        <Vignette intensity={0.3} size={150} />
      </div>


      <div className={`absolute inset-0 z-10 transition-all duration-700 ease-in-out ${
        showSignIn ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        <HeroSection onShowSignIn={handleShowSignIn} />
      </div>

      {/* Sign In Section */}
      <SignInSection showSignIn={showSignIn} onBackToHero={handleBackToHero} />
    </div>
  );
}


