import React, { useEffect, useRef, useState } from 'react';

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
      } catch (e) {
        setError('Failed to load settings');
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e) {
        setError('Camera access denied');
      }
    }
    startCamera();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Curve Guard (Web)</h1>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <div className="mt-4 flex gap-4">
        <video ref={videoRef} className="w-[640px] h-[480px] bg-black" muted playsInline />
        <canvas ref={canvasRef} width={640} height={480} className="border border-gray-300" />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Base Setup
      </p>
    </div>
  );
}


