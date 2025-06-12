import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertDialog from '../components/AlertDialog';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/users/token', { email, password });
      auth.login(response.data.access_token);
      // Redirection gérée par useAuth
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur de connexion. Veuillez vérifier vos identifiants.');
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Connexion</h2>
        <form onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="votre.email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Mot de passe"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Se connecter'}
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            S'inscrire
          </Link>
        </p>
      </div>

      <AlertDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Erreur de Connexion"
        message={error}
        type="error"
      />
    </div>
  );
};

export default LoginPage;
