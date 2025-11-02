import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import HeroCanvas from '../components/HeroCanvas.jsx';
import HeroSection from '../components/HeroSection.jsx';

export default function ProtectedApp() {
  const { user, signOut } = useAuthenticator();

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-jade-12 to-jade-10 relative">
      <Navbar signOut={signOut} user={user} />

      <div className="absolute inset-0">
        <HeroCanvas />
      </div>

      <HeroSection />

      <div className="absolute bottom-8 left-8">
        <button
          onClick={() => navigate('/')}
          className="text-white/60 hover:text-white transition-colors text-sm"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}