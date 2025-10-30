import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import SignIn from './pages/SignIn.jsx';
import ProtectedApp from './pages/ProtectedApp.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/app" element={<ProtectedApp />} />
      </Routes>
    </Router>
  );
}


