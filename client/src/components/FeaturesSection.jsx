import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import FeatureCard from './FeatureCard.jsx';

const FeaturesSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  const features = [
    {
      title: "Head Tilt Detection",
      description: "Monitors head positioning and alerts when your head tilts forward or sideways beyond healthy limits.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Shoulder Alignment",
      description: "Tracks shoulder positioning to detect uneven shoulders and forward shoulder rounding.",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Slouch Detector",
      description: "Detects slouching behavior and monitors overall body posture to prevent long-term posture issues.",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Smart Alerts",
      description: "Gentle notifications help you correct posture before bad habits form. Your data stays private.",
      color: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        }
      );

      // Cards staggered animation
      gsap.fromTo(cardsRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.3
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="absolute inset-0 flex items-center justify-center pt-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-pink-500/10 rounded-full blur-xl"></div>
      </div>

      <div className="w-full px-10 relative z-10">
        <div ref={titleRef} className="text-center mb-6">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-jade-9 via-jade-6 to-white bg-clip-text text-transparent animate-pulse">
              Features
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered posture detection with intelligent monitoring and gentle guidance
          </p>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 md:justify-items-center gap-8 md:gap-x-[100px] md:gap-y-12">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="transform transition-all duration-500 hover:scale-105"
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                color={feature.color}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;