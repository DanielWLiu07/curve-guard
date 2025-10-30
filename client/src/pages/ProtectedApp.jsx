import React from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import HeroCanvas from '../components/HeroCanvas.jsx';
import HeroSection from '../components/HeroSection.jsx';

function AuthenticatedContent() {
  const { signOut, user } = useAuthenticator();

  return (
    <div className="min-h-screen bg-gradient-to-b from-jade-12 to-jade-10 relative">
      <Navbar signOut={signOut} user={user} />

      <div className="absolute inset-0">
        <HeroCanvas />
      </div>

      <HeroSection />
    </div>
  );
}

export default function ProtectedApp() {
  return (
    <Authenticator>
      <AuthenticatedContent />
    </Authenticator>
  );
}