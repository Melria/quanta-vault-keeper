
import { createRoot } from 'react-dom/client'
import React from 'react' // Adding explicit React import
import App from './App.tsx'
import './index.css'

// Use React.StrictMode to help catch potential issues
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
