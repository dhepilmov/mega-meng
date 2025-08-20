import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Launcher from './launcher_core/launcher_screen';
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