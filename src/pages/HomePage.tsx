import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { FaFileUpload, FaBrain, FaLightbulb, FaDesktop, FaArrowRight } from 'react-icons/fa'; // Icônes pour les fonctionnalités

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Définition des fonctionnalités pour la chronologie en zigzag
  const features = [
    {
      id: 1,
      icon: <FaFileUpload className="text-blue-500 text-5xl mb-4" />,
      title: "Chargement de CV Simplifié",
      description: "Téléchargez vos CVs aux formats PDF ou Word (.docx) en quelques clics. Notre système s'occupe de l'ingestion, assurant une lecture et un traitement sans accroc, pour une expérience utilisateur fluide.",
    },
    {
      id: 2,
      icon: <FaBrain className="text-green-500 text-5xl mb-4" />,
      title: "Analyse Sémantique Intelligente",
      description: "Grâce à des technologies de pointe en Traitement du Langage Naturel (NLP), nous extrayons et comprenons les informations clés de votre CV : formations, expériences professionnelles, compétences techniques et soft skills, et bien plus encore. Notre IA identifie le cœur de votre profil.",
    },
    {
      id: 3,
      icon: <FaLightbulb className="text-purple-500 text-5xl mb-4" />,
      title: "Recommandations Professionnelles Personnalisées",
      description: "Découvrez des suggestions précises de types de postes, d'environnements de travail idéaux (startup, grande entreprise, freelance), ainsi que des formations complémentaires et des compétences clés à développer, toutes générées par l'IA GPT-4o pour maximiser votre potentiel.",
    },
    {
      id: 4,
      icon: <FaDesktop className="text-yellow-500 text-5xl mb-4" />,
      title: "Visualisation Intuitive et Moderne",
      description: "Accédez à vos résultats de manière claire, concise et agréable via une interface utilisateur conçue pour la fluidité et la compréhension immédiate. Profitez d'une mise en page adaptative et d'un design professionnel sur tous vos appareils (mobile, tablette, desktop).",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex flex-col items-center pt-16 pb-12">
      {/* Section Hero - Impactante et Accueillante */}
      <section className="text-center mb-20 px-4 max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in-down drop-shadow-lg">
          Découvrez Votre Chemin Professionnel
        </h1>
        <p className="text-xl md:text-2xl font-light opacity-90 mb-10 animate-fade-in-up">
          Analyse de CV par IA pour une orientation carrière sur mesure. Transformez votre potentiel en opportunités.
        </p>
        <div className="animate-fade-in-up-delay">
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register">
                <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg hover:shadow-xl group">
                  S'inscrire <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg hover:shadow-xl group">
                  Se connecter <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/dashboard">
              <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg hover:shadow-xl group">
                Accéder au Tableau de Bord <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Section Fonctionnalités - Chronologie Verticale en Zigzag */}
      <section className="w-full max-w-6xl px-4 mb-20 relative">
        <h2 className="text-4xl font-bold text-center text-white mb-16 drop-shadow-md">
          Comment ça marche ?
        </h2>

        {/* Ligne Verticale Centrale (visible sur les grands écrans) */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-white bg-opacity-20 rounded-full z-0"></div>

        <div className="space-y-16">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`flex flex-col md:flex-row items-center relative z-10 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : '' // Alternance pour l'effet zigzag
              }`}
            >
              {/* Côté Icône/Titre */}
              <div className="md:w-1/2 flex justify-center p-4">
                <div className={`flex flex-col items-center text-center p-6 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm shadow-xl transition-transform duration-300 hover:scale-105 ${index % 2 === 0 ? 'md:mr-[-50px]' : 'md:ml-[-50px]'}`}>
                  {feature.icon}
                  <h3 className="text-2xl font-semibold text-white mb-2">{feature.title}</h3>
                </div>
              </div>

              {/* Point de Connexion (visible sur les grands écrans) */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -my-8 w-6 h-6 bg-white border-4 border-blue-400 rounded-full shadow-lg z-20"></div>

              {/* Côté Description */}
              <div className="md:w-1/2 p-4 flex justify-center">
                <div className="bg-white text-gray-800 p-8 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 max-w-md w-full">
                  <p className="text-lg leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section Appel à l'Action - Clôture Engageante */}
      <section className="text-center px-4 max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-md">
          Prêt à Découvrir Votre Potentiel ?
        </h2>
        <p className="text-xl md:text-2xl font-light opacity-90 mb-10">
          Rejoignez des milliers de professionnels qui transforment leur carrière grâce à des insights basés sur l'IA.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          {!isAuthenticated ? (
            <>
              <Link to="/register">
                <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg hover:shadow-xl">
                  Commencer Gratuitement
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg hover:shadow-xl">
                  Accéder à mon Compte
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4 shadow-lg hover:shadow-xl">
                Aller au Tableau de Bord
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
