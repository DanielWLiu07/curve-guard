import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function SpinningBox(props) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.5;
      ref.current.rotation.y += delta * 0.8;
    }
  });
  return (
    <mesh ref={ref} {...props}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color="#2563eb" />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas camera={{ position: [2.5, 2, 2.5], fov: 50 }}>
      <color attach="background" args={[1, 1, 1]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={0.9} />
      <SpinningBox position={[0, 0, 0]} />
      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  );
}


