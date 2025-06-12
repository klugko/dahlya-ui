import React, { useState } from 'react';
import api from '../api/api';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import AlertDialog from './AlertDialog';

interface UploadCVProps {
  onUploadSuccess: () => void; // Callback pour notifier le parent d'un succès
}

const UploadCV: React.FC<UploadCVProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error' | 'info'>('info');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Validation simple du type de fichier côté client
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setDialogTitle('Type de fichier invalide');
        setDialogMessage('Seuls les fichiers PDF et DOCX sont acceptés.');
        setDialogType('error');
        setDialogOpen(true);
        setSelectedFile(null); // Réinitialiser le fichier sélectionné
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setDialogTitle('Aucun fichier sélectionné');
      setDialogMessage('Veuillez sélectionner un fichier PDF ou DOCX à télécharger.');
      setDialogType('info');
      setDialogOpen(true);
      return;
    }

    setLoading(true);
    setDialogTitle('');
    setDialogMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/cvs/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important pour l'upload de fichiers
        },
      });
      setDialogTitle('Succès de l\'upload');
      setDialogMessage(response.data.message || 'Votre CV a été téléchargé avec succès.');
      setDialogType('success');
      setDialogOpen(true);
      setSelectedFile(null); // Réinitialiser le champ de fichier
      onUploadSuccess(); // Notifier le parent pour rafraîchir la liste des CV
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Une erreur est survenue lors de l\'upload du CV.';
      setDialogTitle('Erreur d\'upload');
      setDialogMessage(errorMessage);
      setDialogType('error');
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Télécharger un nouveau CV</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="file"
          id="cvFile"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {selectedFile && (
          <p className="text-sm text-gray-600">Fichier sélectionné : <span className="font-semibold">{selectedFile.name}</span></p>
        )}
        <Button
          type="submit"
          disabled={loading || !selectedFile}
          className="w-full"
        >
          {loading ? <LoadingSpinner /> : 'Télécharger le CV'}
        </Button>
      </form>

      <AlertDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={dialogTitle}
        message={dialogMessage}
        type={dialogType}
      />
    </div>
  );
};

export default UploadCV;
