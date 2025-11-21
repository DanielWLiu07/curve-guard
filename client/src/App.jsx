import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import Landing from './pages/Landing.jsx';
import ProtectedApp from './pages/ProtectedApp.jsx';
import DetectionPage from './pages/DetectionPage.jsx';
import DataPage from './pages/DataPage.jsx';
import CanvasContentManager from './components/CanvasContentManager.jsx';
import { CanvasProvider } from './contexts/CanvasContext.jsx';

export default function App() {
  return (
    <Authenticator.Provider>
      <CanvasProvider>
        <Router>
          <CanvasContentManager />

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<ProtectedApp />} />
            <Route path="/detection" element={<DetectionPage />} />
            <Route path="/data" element={<DataPage />} />
          </Routes>
        </Router>
      </CanvasProvider>
    </Authenticator.Provider>
  );
}


