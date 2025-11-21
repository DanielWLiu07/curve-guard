import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ signOut, user, onShowSignIn, onShowAbout, onShowCreator, onShowFeatures, onGoHome, showSignIn, currentSection }) {
  const location = useLocation();
  const isDetectionPage = location.pathname === '/detection';

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-jade-12/70 transparent z-40 relative">
      <div className="mx-auto w-full max-w-[102rem] pl-12 pr-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onGoHome} className={`flex items-center gap-4 ${currentSection === 'hero' ? 'opacity-100' : 'opacity-75 hover:opacity-100'} transition-opacity duration-200`}>
            <img src="images/logo.png" alt="CurveGuard Logo" className="h-14 w-auto" />
            
            <span className="bg-gradient-to-r from-jade-9 to-jade-6 bg-clip-text text-transparent font-bold text-lg tracking-wide whitespace-nowrap">
              Curve Guard
            </span>
          </button>

          {!isDetectionPage && (
            <div className="flex items-center gap-12 ml-8">
              <button
                onClick={onShowAbout}
                className={`navbar-about transition-colors text-sm font-medium duration-200 ${
                  currentSection === 'about'
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                About
              </button>
              <button
                onClick={onShowFeatures}
                className={`navbar-features transition-colors text-sm font-medium duration-200 ${
                  currentSection === 'features'
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Features
              </button>
              <button
                onClick={onShowCreator}
                className={`navbar-creator transition-colors text-sm font-medium duration-200 ${
                  currentSection === 'creator'
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Creator
              </button>
            </div>
          )}
        </div>
        <nav className="flex items-center gap-4 hidden md:flex ml-auto mr-4">
          {user ? (
            <button
              onClick={signOut}
              className="navbar-signout inline-flex items-center rounded-md bg-blue-9 px-3 py-1.5 text-white text-sm font-medium shadow hover:bg-blue-10 focus:outline-none focus:ring-2 focus:ring-blue-7 focus:ring-offset-2 transition-colors"
            >
              Sign out
            </button>
          ) : (
            !isDetectionPage && (
              <button
                onClick={onShowSignIn}
                className={`group inline-flex items-center justify-center gap-3
                       px-8 py-2 font-medium text-sm text-white/60
                      hover:shadow-xl hover:text-white
                       transition-all duration-500 ease-in-out
                       ${showSignIn ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
              >
                Sign in
              </button>
            )
          )}
        </nav>
      </div>
    </header>
  );
}


