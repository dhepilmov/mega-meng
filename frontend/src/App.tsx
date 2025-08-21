import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WarungMengApp from './warungmeng/WarungMengApp';
import MaintenanceScreen from './warungmeng/MaintenanceScreen';
import { YuzhaLauncherScreen } from './Yuzha';
import WarungMengRouter from './warungmeng/WarungMengRouter';
import YuzhaRouter from './Yuzha/YuzhaRouter';
import './App.css';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Your App
        </h1>
        <p className="text-gray-600 mb-6">
          Clean foundation ready for development
        </p>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Foundation Ready
          </h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li>✅ React 19 + TypeScript</li>
            <li>✅ Tailwind CSS</li>
            <li>✅ FastAPI Backend</li>
            <li>✅ MongoDB Connection</li>
            <li>✅ CORS Configured</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Main Route - Maintenance Screen */}
          <Route path="/" element={<MaintenanceScreen />} />
          
          {/* Development Foundation Route */}
          <Route path="/welcome" element={<HomePage />} />
          
          {/* WarungMeng Website Routes - Complete Independence */}
          <Route path="/warungmeng/*" element={<WarungMengRouter />} />
          
          {/* Yuzha Personal App Routes - Complete Independence */}
          <Route path="/yuzha/*" element={<YuzhaRouter />} />
          
          {/* Legacy direct routes for backward compatibility */}
          <Route path="/launcher" element={<YuzhaLauncherScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;