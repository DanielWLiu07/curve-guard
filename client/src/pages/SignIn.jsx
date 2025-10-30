import React, { useState } from 'react';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import Vignette from '../components/Vignette';

export default function SignIn() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: ''
  });

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const signInInput = {
        username: formData.email,
        password: formData.password,
      };
      const result = await signIn(signInInput);

      if (result.isSignedIn) {
        navigate('/app');
      } else if (result.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        setIsConfirming(true);
        setSuccess('Please check your email for a confirmation code.');
      }
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const signUpInput = {
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
          },
        },
      };
      const result = await signUp(signUpInput);

      if (result.isSignUpComplete) {
        setSuccess('Account created successfully! Please check your email for confirmation.');
        setIsConfirming(true);
      } else if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setSuccess('Please check your email for a confirmation code.');
        setIsConfirming(true);
      }
    } catch (err) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const confirmSignUpInput = {
        username: formData.email,
        confirmationCode: formData.confirmationCode,
      };
      const result = await confirmSignUp(confirmSignUpInput);

      if (result.isSignUpComplete) {
        setSuccess('Account confirmed successfully! You can now sign in.');
        setIsConfirming(false);
        setIsSignUp(false);
        setFormData({ ...formData, confirmationCode: '' });
      }
    } catch (err) {
      setError(err.message || 'Confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError('');
    setSuccess('');
    setIsConfirming(false);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      confirmationCode: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-jade-12 to-jade-10 flex items-center justify-center relative overflow-hidden">
      <Vignette intensity={0.2} size={70} />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to CurveGuard</h1>
          <p className="text-white/80">Sign in to access your posture monitoring</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          {isConfirming ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Confirm Your Account</h2>
                <p className="text-white/70 text-sm mt-2">{success}</p>
              </div>

              <form onSubmit={handleConfirmSignUp} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Confirmation Code</label>
                  <input
                    type="text"
                    placeholder="Enter confirmation code"
                    value={formData.confirmationCode}
                    onChange={(e) => setFormData({ ...formData, confirmationCode: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-9 focus:border-transparent"
                    required
                  />
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-9 hover:bg-blue-10 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition-colors font-medium"
                >
                  {loading ? 'Confirming...' : 'Confirm Account'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  className="w-full text-white/60 hover:text-white text-sm underline transition-colors"
                >
                  Back to Sign In
                </button>
              </form>
            </>
          ) : isSignUp ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Create Account</h2>
                <p className="text-white/70 text-sm">Join CurveGuard to monitor your posture</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-9 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Create a password (8+ chars)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-9 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-9 focus:border-transparent"
                    required
                  />
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                {success && <p className="text-green-400 text-sm text-center">{success}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-9 hover:bg-blue-10 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition-colors font-medium"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    resetForm();
                  }}
                  className="w-full text-white/60 hover:text-white text-sm underline transition-colors"
                >
                  Already have an account? Sign in here
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Sign In</h2>
                <p className="text-white/70 text-sm">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-9 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-9 focus:border-transparent"
                    required
                  />
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-9 hover:bg-blue-10 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md transition-colors font-medium"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    resetForm();
                  }}
                  className="w-full text-white/60 hover:text-white text-sm underline transition-colors"
                >
                  Don't have an account? Sign up here
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}