import React from 'react';

export default function Vignette({ className = '', intensity = 0.3, size = 150 }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none z-20 ${className}`}
      style={{
        background: `radial-gradient(circle at center, transparent ${size}%, rgba(0, 0, 0, ${intensity}) 100%)`,
      }}
    />
  );
}