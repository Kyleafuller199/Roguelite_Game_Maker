/**
 * main.jsx
 *
 * Application entry point.
 *
 * Responsibilities:
 * - Imports global styles
 * - Creates the React root
 * - Mounts the <App /> component into the DOM
 * - Wraps the app in React.StrictMode for development checks
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import "./index.css";

/**
 * Create the React root using the DOM element with id="root".
 * This element is defined in index.html.
 */
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

/**
 * Render the application.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);