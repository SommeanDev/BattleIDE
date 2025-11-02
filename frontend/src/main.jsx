import React from 'react';
import ReactDOM from 'react-dom/client';
import {  RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { SocketProvider } from './context/SocketContext.jsx'; // Use .jsx
import './index.css';
import router from './routes/route.jsx';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY from .env");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <ClerkProvider publishableKey={CLERK_KEY}>
    <SocketProvider>
        <RouterProvider router={router} />
    </SocketProvider>
  </ClerkProvider>
</React.StrictMode>
);