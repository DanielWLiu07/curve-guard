import React from 'react';

export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white/70 backdrop-blur">
      <div className="mx-auto w-full max-w-[102rem] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src ="images/logo.png" alt = "CurveGuard Logo"className= "h-10 w-auto"/>
          <a href="/" className="text-xl font-semibold tracking-tight">CurveGuard</a>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="/auth"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-white text-sm font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign in
          </a>
        </nav>
      </div>
    </header>
  );
}


