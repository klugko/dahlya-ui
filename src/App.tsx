// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RecommendationDetailsPage from './pages/RecommendationDetailsPage';
import HomePage from './pages/HomePage';
import Navbar from './components/NavBar'; 
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

// Composant pour protéger les routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
        <p className="ml-3 text-lg text-gray-700">Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen"> {/* Conteneur principal pour le layout */}
          <Navbar /> {/* La Navbar sera visible sur toutes les pages */}
          <main className="flex-grow"> {/* Le contenu des pages prendra l'espace restant */}
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/home" element={<HomePage />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer /> {/* Le Footer sera visible sur toutes les pages */}
        </div>
      </AuthProvider>
    </Router>
  );
};

// Composant pour la redirection initiale
const HomeRedirect: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
        <p className="ml-3 text-lg text-gray-700">Chargement de la page d'accueil...</p>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />;
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
