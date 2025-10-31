// src/App.jsx - CORRECTED
import React from 'react';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom'; // 👈 1. Import Outlet

const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default App;