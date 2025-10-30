import React from 'react';

export default function HeroSection() {
  return (
    <main className="absolute inset-0 flex items-center z-10">
      <div className="mx-auto w-full max-w-[90rem] p-6">
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold tracking-tight text-white [text-shadow:0_0_20px_var(--jade-12)]">FIX YOUR SH** POSTURE</h1>
          <p className="mt-3 text-white text-lg">Real-time posture awareness for healthier screen time.</p>
          <div className="mt-6">
            <a
              href="/auth"
              className="inline-flex items-center rounded-md bg-blue-9 px-4 py-2 text-white font-medium shadow hover:bg-blue-10 focus:outline-none focus:ring-2 focus:ring-blue-7 focus:ring-offset-2"
            >
              Sign in / Create account
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}