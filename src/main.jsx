import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
