import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DataSection from '../components/DataSection';
import Vignette from '../components/Vignette';

const DataPage = () => {
  const navigate = useNavigate();

  const onGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 z-5">
        <Vignette intensity={0.3} size={150} />
      </div>

      <Navbar onGoHome={onGoHome} />

      <div className="relative z-10 pt-20">
        <DataSection user={{ userId: 'demo-user' }} />
      </div>
    </div>
  );
};

export default DataPage;
