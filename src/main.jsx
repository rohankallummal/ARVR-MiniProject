import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import ARcamera from './ARcamera'; // Import the ARcamera component
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ar-camera" element={<ARcamera />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
