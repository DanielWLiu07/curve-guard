import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CreatorSection = () => {
  const containerRef = useRef(null);
  const avatarRef = useRef(null);
  const contentRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    // Animate content on mount
    const tl = gsap.timeline();

    tl.fromTo(avatarRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
    )
    .fromTo(contentRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    // Floating animation for avatar
    gsap.to(avatarRef.current, {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Create floating particles
    const particles = particlesRef.current;
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-jade-4/30 rounded-full';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';

      gsap.set(particle, { scale: 0 });
      gsap.to(particle, {
        scale: Math.random() * 0.5 + 0.5,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        duration: Math.random() * 3 + 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2
      });

      containerRef.current.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-jade-9/20 via-jade-8/20 to-jade-7/20" />

      {/* Floating particles container */}
      <div className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        {/* Main title with gradient */}
        <h2 className="text-5xl md:text-7xl font-black mb-8 mt-8">
          <span className="bg-gradient-to-r from-jade-9 via-jade-6 to-white bg-clip-text text-transparent animate-pulse">
            Meet the Creator
          </span>
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl mx-auto">
          {/* Avatar section */}
          <div className="flex-shrink-0">
            <div
              ref={avatarRef}
              className="relative w-56 h-56 md:w-80 md:h-80 mx-auto"
            >
              {/* Profile picture with gradient border */}
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-500 via-cyan-500 to-teal-500 p-1">
                {/* Glow behind the profile picture - bigger than the circle */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-green-400 via-cyan-400 to-teal-400 opacity-30 blur-xl animate-pulse" />

                <div className="relative w-full h-full rounded-full bg-slate-900 overflow-hidden z-10">
                  <img
                    src="/images/profile.jpeg"
                    alt="Daniel W Liu"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback initials */}
                  <div className="w-full h-full flex items-center justify-center text-6xl md:text-8xl font-black text-white" style={{ display: 'none' }}>
                    DL
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div ref={contentRef} className="flex-1 text-left lg:text-center">
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Daniel W Liu
              </h3>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                <span className="px-3 py-1 bg-jade-5/20 text-jade-3 rounded-full text-sm font-medium border border-jade-5/30">
                  AI Engineer
                </span>
                <span className="px-3 py-1 bg-jade-6/20 text-jade-4 rounded-full text-sm font-medium border border-jade-6/30">
                  Computer Vision
                </span>
                <span className="px-3 py-1 bg-jade-7/20 text-jade-5 rounded-full text-sm font-medium border border-jade-7/30">
                  Full Stack Developer
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed mb-8 text-lg">
                Passionate about creating innovative solutions that blend <span className="text-jade-8 font-semibold">artificial intelligence</span> with
                <span className="text-jade-9 font-semibold"> human-centered design</span>. Currently pursuing Computer Science while building
                the next generation of posture correction technology using cutting-edge computer vision and modern web technologies.
              </p>

              {/* Tech stack */}
              <div className="mb-8">
                <h4 className="text-white font-semibold mb-4">Tech Stack - Technologies used to build this project</h4>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {[
                    { name: 'React', color: 'bg-gradient-to-r from-jade-9 to-jade-10' },
                    { name: 'JavaScript', color: 'bg-gradient-to-r from-jade-9 to-jade-10' },
                    { name: 'MediaPipe', color: 'bg-gradient-to-r from-jade-9 to-jade-10' },
                    { name: 'Three.js', color: 'bg-gradient-to-r from-jade-9 to-jade-10' },
                    { name: 'Node.js', color: 'bg-gradient-to-r from-jade-9 to-jade-10' },
                    { name: 'MongoDB', color: 'bg-gradient-to-r from-jade-9 to-jade-10' },
                    { name: 'Mongoose', color: 'bg-gradient-to-r from-jade-9 to-jade-10' },
                    { name: 'AWS', color: 'bg-gradient-to-r from-jade-9 to-jade-10' }
                  ].map((tech, index) => (
                    <span
                      key={tech.name}
                      className={`px-3 py-1 ${tech.color} text-white rounded-lg text-sm font-medium shadow-lg transform hover:scale-105 transition-transform`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social links with enhanced styling */}
              <div className="flex justify-center lg:justify-start gap-4">
                <a
                  href="https://github.com/DanielWLiu07"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  title="GitHub Profile"
                >
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                <a
                  href="https://www.linkedin.com/in/danielliu2007/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  title="LinkedIn Profile"
                >
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorSection;