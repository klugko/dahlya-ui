import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import UploadCV from '../components/UploadCV';
import CVList from '../components/CVList';

const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState('');
  const [refreshCVs, setRefreshCVs] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (err) {
        setUserError('Erreur lors du chargement des informations utilisateur.');
        console.error(err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUploadSuccess = () => {
    setRefreshCVs(prev => prev + 1);
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
        <p className="ml-3 text-lg text-gray-700">Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-15 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700">Tableau de Bord</h1>
          <Button onClick={logout} variant="secondary">
            Déconnexion
          </Button>
        </div>

        {user && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Bienvenue, {user.fullname || user.email}!</h2>
            <p className="text-blue-700">Email : {user.email}</p>
          </div>
        )}

        {userError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <strong className="font-bold">Erreur !</strong>
            <span className="block sm:inline"> {userError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UploadCV onUploadSuccess={handleUploadSuccess} />
          <CVList refreshTrigger={refreshCVs} /> {/* Plus de `onViewRecommendations` ici */}
        </div>
        {/* La section des recommandations est maintenant sur une page dédiée */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recommandations</h3>
            <p className="text-gray-600">
              Cliquez sur "Voir Recommandations" à côté d'un CV analysé pour afficher ses recommandations détaillées.
            </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
