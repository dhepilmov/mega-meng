import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MaintenanceScreen, WarungMengRouter } from './warungmeng';
import { YuzhaRouter } from './Yuzha';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* 🏪 ROOT REDIRECT - Direct visitors to WarungMeng Maintenance */}
          <Route path="/" element={<Navigate to="/warungmeng" replace />} />
          
          {/* 🏪 WarungMeng Website Routes */}
          <Route path="/warungmeng" element={<MaintenanceScreen />} />
          <Route path="/warungmeng/*" element={<WarungMengRouter />} />
          
          {/* 🎯 Yuzha Application Routes */}
          <Route path="/yuzha/*" element={<YuzhaRouter />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;