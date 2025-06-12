import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; 

// Récupère l'élément HTML avec l'ID 'root'
const rootElement = document.getElementById('root');

if (rootElement) {
  // Crée un root React et y rend l'application
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error("L'élément avec l'ID 'root' n'a pas été trouvé dans le document HTML.");
}