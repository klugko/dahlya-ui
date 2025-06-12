import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button'; 

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/home"} className="text-white text-2xl font-bold hover:text-blue-200 transition-colors duration-200">
          Dahlya
        </Link>
        <div className="flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-white hover:text-blue-200 transition-colors duration-200 text-lg font-medium">
                Tableau de Bord
              </Link>
              {/* Le bouton de déconnexion est maintenant dans la Navbar */}
              <Button onClick={logout} variant="secondary" className="bg-blue-500 hover:bg-blue-400 text-white border-0">
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link to="/home" className="text-white hover:text-blue-200 transition-colors duration-200 text-lg font-medium">
                Accueil
              </Link>
              <Link to="/login">
                <Button variant="primary" className="bg-blue-500 hover:bg-blue-400 text-white border-0">
                  Se connecter
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" className="bg-indigo-500 hover:bg-indigo-400 text-white border-0">
                  S'inscrire
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
