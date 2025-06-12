import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-auto"> {/* mt-auto pour pousser en bas */}
      <div className="container mx-auto text-center text-sm md:text-base">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Dahlya - Système d'Orientation Professionnelle. Tous droits réservés.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="#" className="text-gray-400 hover:text-white transition-colors duration-200">
            Politique de Confidentialité
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="#" className="text-gray-400 hover:text-white transition-colors duration-200">
            Conditions d'Utilisation
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="#" className="text-gray-400 hover:text-white transition-colors duration-200">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
