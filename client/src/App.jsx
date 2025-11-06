import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import Landing from './pages/Landing.jsx';
import ProtectedApp from './pages/ProtectedApp.jsx';
import DetectionPage from './pages/DetectionPage.jsx';

export default function App() {
  return (
    <Authenticator.Provider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<ProtectedApp />} />
          <Route path="/detect" element={<DetectionPage />} />
        </Routes>
      </Router>
    </Authenticator.Provider>
  );
}


