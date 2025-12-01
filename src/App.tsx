import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Sidebar } from './components/Sidebar';
import { MenuButton } from './components/MenuButton';
import { HomePage } from './pages/HomePage';
import { ProjetosPage } from './pages/ProjetosPage';
import { PerfilPage } from './pages/PerfilPage';
import { SuportePage } from './pages/SuportePage';
import { ConfiguracoesPage } from './pages/ConfiguracoesPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { CriarProjetoPage } from './pages/CriarProjetoPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  // Se não estiver logado, mostra a página de cadastro ou login
  if (!user) {
    if (showLogin) {
      return (
        <LoginPage 
          onLoginSuccess={() => {
            setShowLogin(false);
            setCurrentPage('home');
          }}
          onBackToSignup={() => setShowLogin(false)}
        />
      );
    }
    return (
      <SignupPage 
        onSignupSuccess={() => {
          setCurrentPage('home');
        }}
        onBackToLogin={() => setShowLogin(true)}
      />
    );
  }

  const handleProjectSelect = (projectId: number) => {
    setSelectedProjectId(projectId);
    setCurrentPage('project-detail');
  };

  const handleBackToHome = () => {
    setSelectedProjectId(null);
    setCurrentPage('home');
  };

  const handleBackToProjetos = () => {
    setCurrentPage('projetos');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onProjectSelect={handleProjectSelect} onNovoProjeto={() => setCurrentPage('criar-projeto')} />;
      case 'project-detail':
        return selectedProjectId ? (
          <ProjectDetailPage projectId={selectedProjectId} onBack={handleBackToHome} />
        ) : (
          <HomePage onProjectSelect={handleProjectSelect} onNovoProjeto={() => setCurrentPage('criar-projeto')} />
        );
      case 'projetos':
        return <ProjetosPage onProjectSelect={handleProjectSelect} onNovoProjeto={() => setCurrentPage('criar-projeto')} />;
      case 'criar-projeto':
        return <CriarProjetoPage onBack={handleBackToProjetos} onProjetoCriado={handleBackToProjetos} />;
      case 'perfil':
        return <PerfilPage />;
      case 'suporte':
        return <SuportePage />;
      case 'configuracoes':
        return <ConfiguracoesPage />;
      default:
        return <HomePage onProjectSelect={handleProjectSelect} onNovoProjeto={() => setCurrentPage('criar-projeto')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {currentPage === 'home' && <Hero />}
      <MenuButton onClick={() => setIsSidebarOpen(true)} />
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="py-6 md:py-12 px-4 md:px-8 lg:px-16 max-w-[1800px] mx-auto w-full">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}