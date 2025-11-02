import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { SocketProvider } from './context/SocketContext.jsx'; // Use .jsx
import './index.css';
import App from './App';
import Home from './pages/Home';
import Battle from './pages/battle';
import Dashboard from './pages/dashboard.jsx';

// 1. Get your Publishable Key from your Clerk Dashboard
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY from .env");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ClerkProvider publishableKey={CLERK_KEY}>
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="battle/:roomId" element={<Battle />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  </ClerkProvider>
  // </React.StrictMode>
);