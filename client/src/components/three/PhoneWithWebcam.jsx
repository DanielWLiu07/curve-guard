import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const PhoneWithWebcam = ({
  videoRef,
  poseCanvas,
  isStreaming,
  alerts = {},
  settings = {},
  rotation = [0, 0, 0],
  width = 0.08,
  height = 0.12
}) => {
  const groupRef = useRef();

  useEffect(() => {
    if (!groupRef.current) return;

    const phoneGeometry = new THREE.BoxGeometry(width, height, 0.008);
    const phoneMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const phone = new THREE.Mesh(phoneGeometry, phoneMaterial);
    groupRef.current.add(phone);

    const screenWidth = width * 0.9;
    const screenHeight = height * 0.9;
    const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
    let screenMaterial;

    if (isStreaming && (videoRef?.current || poseCanvas)) {
      let texture;

      if (poseCanvas) {
        texture = new THREE.CanvasTexture(poseCanvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
      } else if (videoRef?.current) {
        texture = new THREE.VideoTexture(videoRef.current);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
      }

      const sourceElement = poseCanvas || videoRef?.current;
      if (sourceElement) {
        const sourceAspect = sourceElement.width / sourceElement.height;
        const screenAspect = screenWidth / screenHeight;

        const cropFactor = screenAspect / sourceAspect;
        texture.repeat.set(cropFactor, 1);
        texture.offset.set((1 - cropFactor) / 2, 0);

        texture.repeat.x *= -1;
        texture.offset.x = (1 + cropFactor) / 2;
      }

      screenMaterial = new THREE.MeshBasicMaterial({ map: texture });
    } else {
      screenMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    }

    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0, 0.0041);
    groupRef.current.add(screen);

    return () => {
      if (phone.geometry) phone.geometry.dispose();
      if (phone.material) phone.material.dispose();
      if (screen.geometry) screen.geometry.dispose();
      if (screen.material) screen.material.dispose();
    };
  }, [isStreaming, videoRef, poseCanvas, width, height]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(-2, 1.6, 0.1);

      gsap.to(groupRef.current.position, {
        x: -0.075,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.3
      });
    }
  }, []);

  return <group ref={groupRef} rotation={rotation} />;
};

export default PhoneWithWebcam;