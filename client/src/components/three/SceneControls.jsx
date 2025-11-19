import React from 'react';
import { OrbitControls } from '@react-three/drei';

const SceneControls = ({ enablePan = false, enableZoom = false, target = [0, 1.6, 0] }) => {
  return (
    <OrbitControls
      enablePan={enablePan}
      enableZoom={enableZoom}
      target={target}
    />
  );
};

export default SceneControls;