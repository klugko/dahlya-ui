import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes pour ajouter le jeton JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ou sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses pour gérer les erreurs (ex: 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Gérer la déconnexion si le jeton est invalide ou expiré
      console.log('Jeton invalide ou expiré. Déconnexion...');
      localStorage.removeItem('token');
      // Rediriger l'utilisateur vers la page de connexion
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
