import React from 'react';
import ReactDom from 'react-dom/client';
import App from './App';
import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import './index.css';

ReactDom.createRoot(document.getElementById('root')).render(<App />);