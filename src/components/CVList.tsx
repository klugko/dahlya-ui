import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import { type CVFile } from '../types/cv';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';
import { FaSyncAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 

interface CVListProps {
  refreshTrigger: number; // Pour forcer le rafraîchissement depuis le parent
  // onViewRecommendations: (cvId: number) => void; // Ce callback n'est plus nécessaire directement
}

const CVList: React.FC<CVListProps> = ({ refreshTrigger }) => {
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook pour la navigation

  // Fonction pour récupérer les CVs
  const fetchCVs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<CVFile[]>('/cvs/my-cvs');
      setCvFiles(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement de vos CVs.');
      console.error('Erreur lors du chargement des CVs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCVs();
  }, [fetchCVs, refreshTrigger]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'bg-blue-100 text-blue-800';
      case 'parsed':
        return 'bg-green-100 text-green-800';
      case 'recommended':
        return 'bg-purple-100 text-purple-800';
      case 'parsing_failed':
      case 'recommendation_failed':
      case 'upload_failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'Téléversé (en attente de traitement)';
      case 'parsing': // Supposons un statut "parsing" intermédiaire
        return 'Analyse en cours...';
      case 'parsed':
        return 'Analysé (prêt pour les recommandations)';
      case 'generating_recommendations': // Supposons un statut "generating_recommendations"
        return 'Génération des recommandations...';
      case 'recommended':
        return 'Recommandations générées';
      case 'parsing_failed':
        return 'Échec de l\'analyse';
      case 'recommendation_failed':
        return 'Échec de la génération des recommandations';
      case 'upload_failed':
        return 'Échec du téléchargement';
      default:
        return status;
    }
  };

  const handleViewRecommendationsClick = (cvId: number) => {
    navigate(`/recommendations/${cvId}`);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Mes CVs Uploadés</h3>
        <Button onClick={fetchCVs} variant="secondary" disabled={loading} className="flex items-center space-x-2">
          {loading ? <LoadingSpinner /> : <FaSyncAlt />}
          <span>Rafraîchir</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner /> <span className="ml-2 text-gray-600">Chargement des CVs...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur !</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : cvFiles.length === 0 ? (
        <p className="text-gray-600">Aucun CV n'a été téléchargé pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {cvFiles.map((cv) => (
            <li key={cv.cv_id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <p className="text-lg font-semibold text-gray-900">{cv.filename}</p>
                <p className="text-sm text-gray-500">
                  Téléchargé le : {new Date(cv.upload_date).toLocaleDateString()} à {new Date(cv.upload_date).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(cv.status)}`}>
                  {getStatusText(cv.status)}
                </span>
                {cv.status === 'parsed' || cv.status === 'recommended' || cv.status === 'generating_recommendations' ? (
                  <Button
                    onClick={() => handleViewRecommendationsClick(cv.cv_id)}
                    variant="primary"
                    className="ml-2 py-1 px-3 text-sm"
                    disabled={cv.status === 'generating_recommendations'} // Désactiver si en cours de génération
                  >
                    {cv.status === 'generating_recommendations' ? 'Génération en cours...' : 'Voir Recommandations'}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="ml-2 py-1 px-3 text-sm cursor-not-allowed opacity-50"
                    disabled
                  >
                    Voir Recommandations
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CVList;
