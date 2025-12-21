// src/index.jsx or src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Render the React component to the root div
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);