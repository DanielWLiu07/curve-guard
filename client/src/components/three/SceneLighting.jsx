import React from 'react';

const SceneLighting = () => {
  return (
    <>
      <ambientLight intensity={0.3} color="#4a5568" />
      <directionalLight
        position={[3, 2, 3]}
        intensity={0.4}
        color="#e2e8f0"
        castShadow
      />
      <pointLight position={[-2, 1, -2]} intensity={0.2} color="#60a5fa" />
    </>
  );
};

export default SceneLighting;