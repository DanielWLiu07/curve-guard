import React from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import HeroCanvas from '../components/HeroCanvas.jsx';
import HeroSection from '../components/HeroSection.jsx';

function AuthenticatedContent() {
  const { signOut, user } = useAuthenticator();
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

export default function ProtectedApp() {
  // Check if Amplify is configured
  const isConfigured = (() => {
    try {
      require('../amplify_outputs.json');
      return true;
    } catch {
      return false;
    }
  })();

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-jade-12 to-jade-10 flex items-center justify-center">
        <div className="w-full max-w-md p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-white/80 mb-6">
            You need to complete the AWS Amplify setup to access this page.
          </p>
          <button
            onClick={() => window.location.href = '/signin'}
            className="bg-blue-9 text-white px-6 py-2 rounded-md hover:bg-blue-10 transition-colors mr-4"
          >
            Go to Sign In
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="text-white/60 hover:text-white transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <Authenticator>
      <AuthenticatedContent />
    </Authenticator>
  );
}