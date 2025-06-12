// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RecommendationDetailsPage from './pages/RecommendationDetailsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

// Composant pour protéger les routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Affiche un spinner de chargement tant que l'état d'authentification est en cours de vérification
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
        <p className="ml-3 text-lg text-gray-700">Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirige vers la page de connexion si non authentifié
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    // Le Router doit être le composant parent pour que useNavigate fonctionne partout en dessous
    <Router>
      {/* AuthProvider doit maintenant envelopper les Routes À L'INTÉRIEUR du Router */}
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations/:cvId"
            element={
              <ProtectedRoute>
                <RecommendationDetailsPage />
              </ProtectedRoute>
            }
          />
          {/* Redirection par défaut vers le tableau de bord si authentifié, sinon vers la page de connexion */}
          <Route
            path="/"
            element={
              <HomeRedirect />
            }
          />
          <Route path="*" element={<NotFound />} /> {/* Route 404 */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

// Composant pour la redirection initiale
const HomeRedirect: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Affiche un spinner de chargement tant que l'état d'authentification est en cours de vérification
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
        <p className="ml-3 text-lg text-gray-700">Chargement de la page d'accueil...</p>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page non trouvée.</p>
      <Link to="/" className="text-blue-600 hover:underline">Retour à l'accueil</Link>
    </div>
  );
};


export default App;
