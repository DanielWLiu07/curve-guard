import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-jade-12 to-jade-10 flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to CurveGuard</h1>
          <p className="text-white/80">Sign in to access your posture monitoring</p>
        </div>

        <Authenticator
          signUpAttributes={['email']}
          components={{
            Header: () => null, // Remove default header since we have our own
          }}
          formFields={{
            signIn: {
              username: {
                placeholder: 'Enter your email',
                label: 'Email',
              },
              password: {
                placeholder: 'Enter your password',
                label: 'Password',
              },
            },
            signUp: {
              username: {
                placeholder: 'Enter your email',
                label: 'Email',
              },
              password: {
                placeholder: 'Create a password',
                label: 'Password',
              },
              confirm_password: {
                placeholder: 'Confirm your password',
                label: 'Confirm Password',
              },
            },
          }}
        >
          {({ signOut, user }) => (
            <div className="text-center">
              <p className="text-white mb-4">Welcome back, {user?.signInDetails?.loginId}!</p>
              <button
                onClick={() => navigate('/app')}
                className="bg-blue-9 text-white px-6 py-2 rounded-md hover:bg-blue-10 transition-colors"
              >
                Enter App
              </button>
            </div>
          )}
        </Authenticator>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}