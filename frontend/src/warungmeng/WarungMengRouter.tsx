import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WarungMengApp from './WarungMengApp';
import MaintenanceScreen from './MaintenanceScreen';

const WarungMengRouter: React.FC = () => {
  return (
    <Routes>
      {/* Main WarungMeng Website */}
      <Route path="/" element={<WarungMengApp />} />
      <Route path="/home" element={<WarungMengApp />} />
      <Route path="/maintenance" element={<MaintenanceScreen />} />
      {/* Add more WarungMeng specific routes here */}
    </Routes>
  );
};

export default WarungMengRouter;