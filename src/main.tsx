import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '/node_modules/modern-normalize/modern-normalize.css';
import './reset.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
