<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Battle from "./pages/battle";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/battle" element={<Battle />} />
      </Routes>
    </Router>
  );
};

export default App;
=======
import React from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'

const App = () => {
  return (
    <>
    <Navbar/>
    <Home/>
    </>
  )
}

export default App
>>>>>>> 63f1c46 (backend code old)
