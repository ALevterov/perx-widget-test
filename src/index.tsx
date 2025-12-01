import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.scss';

// Restore path from sessionStorage after 404 redirect
// This needs to run before React Router initializes
const redirectPath = sessionStorage.getItem('redirectPath');
if (redirectPath) {
  sessionStorage.removeItem('redirectPath');
  const basePath = process.env.NODE_ENV === 'production' ? '/perx-widget-test' : '';
  
  // redirectPath format: "/catalog?query#hash" or just "/catalog"
  // Parse it manually since it's a relative path
  const hashIndex = redirectPath.indexOf('#');
  const queryIndex = redirectPath.indexOf('?');
  
  let pathOnly = redirectPath;
  let query = '';
  let hash = '';
  
  if (hashIndex !== -1) {
    hash = redirectPath.slice(hashIndex);
    pathOnly = redirectPath.slice(0, hashIndex);
  }
  
  if (queryIndex !== -1 && (hashIndex === -1 || queryIndex < hashIndex)) {
    const endIndex = hashIndex !== -1 ? hashIndex : redirectPath.length;
    query = redirectPath.slice(queryIndex, endIndex);
    pathOnly = redirectPath.slice(0, queryIndex);
  }
  
  const fullPath = basePath + pathOnly + query + hash;
  
  // Restore the path before React Router mounts
  if (window.location.pathname + window.location.search + window.location.hash !== fullPath) {
    window.history.replaceState(null, '', fullPath);
  }
}

const rootElement = document.getElementById('widget-root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
