import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const SceneSetup = () => {
  const { scene } = useThree();

  useEffect(() => {
    if (!scene.fog) {
      scene.fog = new THREE.Fog(0x0a0f1a, 2, 8);
    }
  }, [scene]);

  return null;
};

export default SceneSetup;