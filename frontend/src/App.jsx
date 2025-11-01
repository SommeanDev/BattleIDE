import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'; 

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

// This line is what the error says is missing
export default App;

