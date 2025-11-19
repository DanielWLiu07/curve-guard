import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const VideoTexture = ({ videoRef, poseCanvas, isStreaming, width, height }) => {
  const textureRef = useRef();
  const [cropFactor, setCropFactor] = useState(1);

  useEffect(() => {
    if (isStreaming && (videoRef.current || poseCanvas)) {
      const createTexture = () => {
        const sourceElement = poseCanvas || videoRef.current;
        const isReady = poseCanvas || (videoRef.current && !videoRef.current.paused && !videoRef.current.ended);

        if (sourceElement && isReady) {
          try {
            if (textureRef.current) {
              textureRef.current.dispose();
            }

            const texture = poseCanvas
              ? new THREE.CanvasTexture(sourceElement)
              : new THREE.VideoTexture(sourceElement);

            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            if (!poseCanvas) {
              texture.format = THREE.RGBFormat;
            }
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            texture.needsUpdate = true;

            const sourceAspect = sourceElement.width / sourceElement.height;
            const displayAspect = width / height;

            const cropFactor = displayAspect / sourceAspect;
            texture.repeat.set(cropFactor, 1);
            texture.offset.set((1 - cropFactor) / 2, 0);

            setCropFactor(currentCropFactor);
            textureRef.current = texture;
          } catch (error) {
            setCropFactor(1);
          }
        }
      };

      createTexture();
    } else {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      setCropFactor(1);
    }
  }, [videoRef, poseCanvas, isStreaming, width, height]);

  return { texture: textureRef.current, cropFactor };
};

export default VideoTexture;