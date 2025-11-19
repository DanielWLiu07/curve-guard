import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

const GLTFModel = ({ url, hideOutline = true, ...props }) => {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useEffect(() => {
    if (hideOutline) {
      const outlineObject = ref.current.getObjectByName('OutLine');
      if (outlineObject) {
        outlineObject.visible = false;
      }
    }
  }, [scene, hideOutline]);

  const clonedScene = scene ? scene.clone() : null;

  useEffect(() => {
    return () => {
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [clonedScene]);

  return <primitive ref={ref} object={clonedScene} {...props} />;
};

export default GLTFModel;