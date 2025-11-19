import React from 'react';
import Vignette from './Vignette.jsx';

const LandingBackground = () => {
  return (
    <>
      <div className="fixed inset-0 z-0">
      </div>
      <div className="fixed inset-0 z-5 pointer-events-none">
        <Vignette intensity={0.3} size={150} />
      </div>
    </>
  );
};

export default LandingBackground;