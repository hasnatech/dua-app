
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DuaViewer from './pages/DuaViewer';

const App: React.FC = () => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative shadow-2xl shadow-slate-200">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dua/:categoryId" element={<DuaViewer />} />
      </Routes>
    </div>
  );
};

export default App;
