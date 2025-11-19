import { useRef } from 'react';
import { gsap } from 'gsap';

export const useSectionTransition = (updateCanvasProps) => {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const creatorRef = useRef(null);

  const animateSectionTransition = (fromSection, toSection, setCurrentSection) => {
    const sections = {
      hero: heroRef.current,
      about: aboutRef.current,
      features: featuresRef.current,
      creator: creatorRef.current
    };

    const tl = gsap.timeline();

    if (sections[fromSection]) {
      tl.to(sections[fromSection], {
        y: -50,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "power2.in",
      });
    }

    tl.set({}, {}, "-=0.3");

    if (sections[toSection]) {
      tl.fromTo(sections[toSection],
        {
          y: 50,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.in",
          onStart: () => {
            setCurrentSection(toSection);
            updateCanvasProps({ currentSection: toSection });
          }
        },
        "-=0.3"
      );
    } else {
      setCurrentSection(toSection);
      updateCanvasProps({ currentSection: toSection });
    }
  };

  return {
    heroRef,
    aboutRef,
    featuresRef,
    creatorRef,
    animateSectionTransition
  };
};