import React, { useEffect, useRef, useState } from 'react';
import * as Switch from '@radix-ui/react-switch';

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
      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm" htmlFor="show-height-line">Show height line</label>
        <Switch.Root
          className="w-[42px] h-[25px] bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer"
          defaultChecked
          id="show-height-line"
        >
          <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow transition-transform translate-x-[2px] will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root>
      </div>
      <div className="mt-4 flex gap-4">
        <video ref={videoRef} className="w-[640px] h-[480px] bg-black" muted playsInline />
        <canvas ref={canvasRef} width={640} height={480} className="border border-gray-300" />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Base Setup + Radix UI Switch
      </p>
    </div>
  );
}


