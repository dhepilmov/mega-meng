import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LauncherEngine from './launcher';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LauncherEngine />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;