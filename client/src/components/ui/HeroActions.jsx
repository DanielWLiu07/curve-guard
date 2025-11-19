import React from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';

const HeroActions = ({ user, onShowSignIn, onShowAbout, onGoToApp }) => {
  const handleGoToApp = () => {
    if (onGoToApp) {
      onGoToApp();
    } else {
      window.location.href = '/detection';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 pt-4">
      {user ? (
        <button
          onClick={handleGoToApp}
          className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 px-8 py-4 text-white font-semibold text-lg shadow-2xl shadow-green-700/25 hover:shadow-green-700/40 hover:scale-105 transition-all duration-300 border-2 border-white/20 hover:border-white/40 outline outline-2 outline-offset-2 outline-green-500/50 hover:outline-green-400/70"
        >
          Go to App
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      ) : (
        <button
          onClick={onShowSignIn}
          className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-9 to-blue-10 px-8 py-4 text-white font-semibold text-lg shadow-2xl shadow-blue-9/25 hover:shadow-blue-9/40 hover:scale-105 transition-all duration-300 border border-blue-8/30 hover:border-blue-7/50"
        >
          Get Started Free
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      )}

      <button onClick={onShowAbout} className="inline-flex items-center justify-center gap-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 px-8 py-4 text-white font-medium text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300">
        Learn More
      </button>
    </div>
  );
};

export default HeroActions;