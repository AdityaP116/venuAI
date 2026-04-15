import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Silence Chromium Firebase COOP polling warnings in the development console
const originalError = console.error;
const originalWarn = console.warn;

const filterMessage = (msg) => 
  typeof msg === 'string' && 
  (msg.includes('Cross-Origin-Opener-Policy') || msg.includes('window.closed call'));

console.error = (...args) => {
  if (filterMessage(args[0])) return;
  originalError(...args);
};

console.warn = (...args) => {
  if (filterMessage(args[0])) return;
  originalWarn(...args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
