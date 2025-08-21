import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { YuzhaLauncherScreen } from './Launcher';

const YuzhaRouter: React.FC = () => {
  return (
    <Routes>
      {/* Main Yuzha Personal App */}
      <Route path="/" element={<YuzhaLauncherScreen />} />
      <Route path="/launcher" element={<YuzhaLauncherScreen />} />
      <Route path="/home" element={<YuzhaLauncherScreen />} />
      {/* Add more Yuzha specific routes here */}
      {/* Future routes like: */}
      {/* <Route path="/dashboard" element={<YuzhaDashboard />} /> */}
      {/* <Route path="/settings" element={<YuzhaSettings />} /> */}
      {/* <Route path="/apps" element={<YuzhaApps />} /> */}
    </Routes>
  );
};

export default YuzhaRouter;