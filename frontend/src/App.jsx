import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Toaster, toast } from 'sonner';
const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

// This line is what the error says is missing
export default App;

