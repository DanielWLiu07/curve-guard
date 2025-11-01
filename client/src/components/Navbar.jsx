import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ signOut, user }) {
  return (
    <header className="w-full bg-jade-12/70 backdrop-blur z-20 relative">
      <div className="mx-auto w-full max-w-[102rem] pl-12 pr-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="images/logo.png" alt="CurveGuard Logo" className="h-14 w-auto" />
          
          <span className="bg-gradient-to-r from-jade-9 to-jade-6 bg-clip-text text-transparent font-bold text-lg tracking-wide">
            Curve Guard
          </span>
        </div>
        <nav className="flex items-center gap-4">
          {user ? (
            <button
              onClick={signOut}
              className="inline-flex items-center rounded-md bg-blue-9 px-3 py-1.5 text-white text-sm font-medium shadow hover:bg-blue-10 focus:outline-none focus:ring-2 focus:ring-blue-7 focus:ring-offset-2 transition-colors"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/signin"
              className="inline-flex items-center rounded-md bg-blue-9 px-3 py-1.5 text-white text-sm font-medium shadow hover:bg-blue-10 focus:outline-none focus:ring-2 focus:ring-blue-7 focus:ring-offset-2 transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}


