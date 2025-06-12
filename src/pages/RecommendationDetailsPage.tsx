import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { type Recommendation, type CVFile } from '../types/cv';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertDialog from '../components/AlertDialog';
import Button from '../components/Button';
import { FaArrowLeft } from 'react-icons/fa'; 

const RecommendationDetailsPage: React.FC = () => {
  const { cvId } = useParams<{ cvId: string }>(); // Récupère l'ID du CV depuis l'URL
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error' | 'info'>('info');

  const fetchRecommendations = useCallback(async () => {
    if (!cvId) return;

    setLoading(true);
    setError(null);
    setRecommendation(null); // Réinitialise les recommandations

    try {
      // 1. Tenter de récupérer les recommandations existantes
      const response = await api.get<Recommendation>(`/recommendations/${cvId}/`);
      setRecommendation(response.data);
      setLoading(false);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        // 2. Si recommandations non trouvées, vérifier le statut du CV
        try {
          const cvStatusResponse = await api.get<CVFile>(`/cvs/${cvId}/status/`);
          const cvStatus = cvStatusResponse.data.status;

          if (cvStatus === 'parsed') {
            // 3. Si le CV est parsé mais pas de recommandations, tenter de les générer
            setDialogMessage('Recommandations non trouvées. Génération en cours...');
            setDialogType('info');
            setDialogOpen(true);

            const generateResponse = await api.post<Recommendation>(`/recommendations/generate/${cvId}`);
            setRecommendation(generateResponse.data);
            setDialogMessage('Recommandations générées avec succès !');
            setDialogType('success');
            setDialogOpen(true);
          } else {
            // 4. Si le CV n'est pas parsé, ou a échoué, afficher un message d'erreur approprié
            setError(`Recommandations non disponibles pour ce CV. Statut actuel: ${cvStatus}.`);
            setDialogMessage(`Recommandations non disponibles pour ce CV. Statut actuel: ${cvStatus}.`);
            setDialogType('error');
            setDialogOpen(true);
          }
        } catch (statusErr: any) {
          setError(statusErr.response?.data?.detail || 'Impossible de vérifier le statut du CV.');
          setDialogMessage(statusErr.response?.data?.detail || 'Impossible de vérifier le statut du CV.');
          setDialogType('error');
          setDialogOpen(true);
        }
      } else {
        setError(err.response?.data?.detail || 'Erreur lors de la récupération des recommandations.');
        setDialogMessage(err.response?.data?.detail || 'Erreur lors de la récupération des recommandations.');
        setDialogType('error');
        setDialogOpen(true);
      }
      setLoading(false);
    }
  }, [cvId]); // Dépend de cvId

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
        <p className="ml-3 text-lg text-gray-700">Chargement des recommandations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={handleGoBack} variant="secondary" className="flex items-center space-x-2">
            <FaArrowLeft />
            <span>Retour au tableau de bord</span>
          </Button>
          <h1 className="text-4xl font-extrabold text-blue-700">Recommandations</h1>
          <div></div> {/* Placeholder pour alignement */}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <strong className="font-bold">Erreur !</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {recommendation ? (
          <div className="space-y-6">
            {/* Type de poste suggéré */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-800 mb-3">Type de poste suggéré</h3>
              <p className="text-blue-700 text-lg">{recommendation.job_type || 'Non spécifié.'}</p>
            </div>

            {/* Environnement de travail idéal */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-3">Environnement de travail idéal</h3>
              <p className="text-green-700 text-lg">{recommendation.environment || 'Non spécifié.'}</p>
            </div>

            {/* Formations complémentaires utiles */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-2xl font-bold text-yellow-800 mb-3">Formations complémentaires utiles</h3>
              {recommendation.suggested_trainings && recommendation.suggested_trainings.length > 0 ? (
                <ul className="list-disc list-inside text-yellow-700 text-lg space-y-1">
                  {recommendation.suggested_trainings.map((training, index) => (
                    <li key={index}>{training}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-yellow-700 text-lg">Aucune formation suggérée pour le moment.</p>
              )}
            </div>

            {/* Compétences à développer */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-2xl font-bold text-purple-800 mb-3">Compétences à développer</h3>
              {recommendation.skills_to_develop && recommendation.skills_to_develop.length > 0 ? (
                <ul className="list-disc list-inside text-purple-700 text-lg space-y-1">
                  {recommendation.skills_to_develop.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-purple-700 text-lg">Aucune compétence à développer suggérée pour le moment.</p>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-6 text-center">
              Généré le: {new Date(recommendation.generation_date).toLocaleDateString()}
            </p>
          </div>
        ) : (
          !error && (
            <div className="text-center text-gray-600 p-8">
              <p className="text-lg">Aucune recommandation trouvée pour ce CV. En attente de génération ou d'analyse...</p>
              <p className="text-sm mt-2">Le processus de génération peut prendre quelques instants après l'analyse initiale du CV.</p>
            </div>
          )
        )}
      </div>

      <AlertDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={dialogType === 'success' ? 'Succès' : dialogType === 'error' ? 'Erreur' : 'Info'}
        message={dialogMessage}
        type={dialogType}
      />
    </div>
  );
};

export default RecommendationDetailsPage;
