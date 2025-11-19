import React from 'react';
import FeatureCard from './FeatureCard.jsx';

const FeaturesSection = () => {
  const features = [
    {
      title: "Head Tilt Detection",
      description: "Monitors head positioning and alerts when your head tilts forward or sideways beyond healthy limits."
    },
    {
      title: "Shoulder Alignment",
      description: "Tracks shoulder positioning to detect uneven shoulders and forward shoulder rounding."
    },
    {
      title: "Slouch Detector",
      description: "Detects slouching behavior and monitors overall body posture to prevent long-term posture issues."
    },
    {
      title: "Smart Alerts",
      description: "Gentle notifications help you correct posture before bad habits form. Your data stays private."
    }
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pt-4">
      <div className="max-w-8xl mx-auto px-8">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[36vw] gap-y-2 md:gap-y-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;