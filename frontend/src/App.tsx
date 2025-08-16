import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Launcher from './launcher/launcher_UI';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Launcher />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;