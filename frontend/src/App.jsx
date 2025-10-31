// src/App.jsx - CORRECTED
import React from 'react';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Battle from "./pages/battle";

const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default App;

