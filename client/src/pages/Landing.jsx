import React from 'react';

export default function Landing() {
  return (
    <main className="min-h-screen flex items-center bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="mx-auto w-full max-w-[102rem]">
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold tracking-tight">CurveGuard</h1>
          <p className="mt-3 text-gray-600 text-lg">Real-time posture awareness for healthier screen time.</p>
          <div className="mt-6">
            <a
              href="/auth"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign in / Create account
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}


