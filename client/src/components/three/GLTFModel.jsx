import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

const GLTFModel = React.forwardRef(({ url, position = [0, 0, 0], rotation = [0, 0, 0] }, ref) => {
  const { scene } = useGLTF(url);
  const internalRef = useRef();

  useEffect(() => {
    if (scene) {
      const outlineObject = scene.getObjectByName('OutLine');
      if (outlineObject) {
        outlineObject.visible = false;
      }
    }
  }, [scene]);

  React.useImperativeHandle(ref, () => internalRef.current);

  return <primitive ref={internalRef} object={scene} position={position} rotation={rotation} />;
});

GLTFModel.displayName = 'GLTFModel';

export default GLTFModel;