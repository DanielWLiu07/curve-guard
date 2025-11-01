import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, LightningBoltIcon, TargetIcon } from '@radix-ui/react-icons';

export default function HeroSection() {
  return (
    <main className="absolute inset-0 flex items-center z-10">
      <div className="mx-auto w-full max-w-[90rem] p-6">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-4">

            <h1 className="text-6xl md:text-7xl font-black tracking-tight">
              <br />
              <span className="bg-gradient-to-r from-jade-9 via-jade-6 to-white bg-clip-text text-transparent animate-pulse">
                FIX GOBLIN
                    <br />
                POSTURE
              </span>
            </h1>

            <div className="flex items-center gap-2 text-blue-6">
              <LightningBoltIcon className="w-5 h-5" />
              <span className="text-lg font-medium">Real-time awareness for healthier screen time</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xl text-white/90 leading-relaxed max-w-lg">
              Transform your daily habits with AI-powered posture detection.
              Get instant feedback and build better posture habits for life.
            </p>


          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/signin"
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-9 to-blue-10 px-8 py-4 text-white font-semibold text-lg shadow-2xl shadow-blue-9/25 hover:shadow-blue-9/40 hover:scale-105 transition-all duration-300 border border-blue-8/30 hover:border-blue-7/50"
            >
              Get Started Free
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <button className="inline-flex items-center justify-center gap-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 px-8 py-4 text-white font-medium text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              Learn More
            </button>
          </div>

          <div className="pt-8 border-t border-white/10"> 
            <div className="flex gap-4 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <div className="rounded-full animate-pulse">
                  Real-time monitoring
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}>
                  AI-powered analysis
                  </div>
                
              </div>
              <div className="flex items-center gap-2">
                <div className="animate-pulse" style={{ animationDelay: '0.4s' }}>
                  Personalized insights
                </div>
            
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}