import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './main/App';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root.

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
