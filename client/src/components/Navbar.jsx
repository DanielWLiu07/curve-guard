import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@radix-ui/themes";

export default function Navbar({ signOut, user, onShowSignIn, showSignIn }) {
  return (
    <header className="w-full bg-jade-12/70 transparent z-20 relative">
      <div className="mx-auto w-full max-w-[102rem] pl-12 pr-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="images/logo.png" alt="CurveGuard Logo" className="h-14 w-auto" />
          
          <span className="bg-gradient-to-r from-jade-9 to-jade-6 bg-clip-text text-transparent font-bold text-lg tracking-wide whitespace-nowrap">
            Curve Guard
          </span>

          <div className="flex items-center gap-12 ml-8">
            <a
              href="#about"
              className="text-white/60 hover:text-white transition-colors text-sm font-medium duration-200"
            >
              About
            </a>
            <a
              href="#creator"
              className="text-white/60 hover:text-white transition-colors text-sm font-medium duration-200"
            >
              Creator
            </a>
          </div>
        </div>
        <nav className="flex items-center gap-4 hidden md:flex ml-auto mr-4">
          {user ? (
            <button
              onClick={signOut}
              className="inline-flex items-center rounded-md bg-blue-9 px-3 py-1.5 text-white text-sm font-medium shadow hover:bg-blue-10 focus:outline-none focus:ring-2 focus:ring-blue-7 focus:ring-offset-2 transition-colors"
            >
              Sign out
            </button>
          ) : (
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
          )}
        </nav>
      </div>
    </header>
  );
}


