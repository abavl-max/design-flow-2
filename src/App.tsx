import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Sidebar } from './components/Sidebar';
import { MenuButton } from './components/MenuButton';
import { SplashScreen } from './components/SplashScreen';
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
import { ProjectsProvider } from './contexts/ProjectsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner@2.0.3';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [paginaAnterior, setPaginaAnterior] = useState<string>('home'); // Rastreia a página de origem
  const [showSplash, setShowSplash] = useState(true);
  
  // Mostra splash screen primeiro
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }
  
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
    setPaginaAnterior(currentPage); // Salva a página atual como origem
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

  const handleProjetoCriado = (projectId: number) => {
    // Navega automaticamente para o projeto recém-criado
    console.log('App - Navegando para projeto ID:', projectId);
    setPaginaAnterior('criar-projeto'); // Veio da criação de projeto
    setSelectedProjectId(projectId);
    setCurrentPage('project-detail');
  };
  
  const handleBackFromProject = () => {
    setSelectedProjectId(null);
    setCurrentPage(paginaAnterior); // Volta para a página de origem
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onProjectSelect={handleProjectSelect} onNovoProjeto={() => setCurrentPage('criar-projeto')} />;
      case 'project-detail':
        return selectedProjectId ? (
          <ProjectDetailPage 
            projectId={selectedProjectId} 
            onBack={handleBackFromProject}
            paginaOrigem={paginaAnterior}
          />
        ) : (
          <HomePage onProjectSelect={handleProjectSelect} onNovoProjeto={() => setCurrentPage('criar-projeto')} />
        );
      case 'projetos':
        return <ProjetosPage onProjectSelect={handleProjectSelect} onNovoProjeto={() => setCurrentPage('criar-projeto')} />;
      case 'criar-projeto':
        return <CriarProjetoPage onBack={handleBackToProjetos} onProjetoCriado={handleProjetoCriado} />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Toaster position="top-right" richColors />
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
    <ThemeProvider>
      <AuthProvider>
        <ProjectsProvider>
          <AppContent />
        </ProjectsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}