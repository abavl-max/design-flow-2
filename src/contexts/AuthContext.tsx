import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'designer' | 'cliente';

interface Experiencia {
  cargo: string;
  empresa: string;
  periodo: string;
}

interface PerfilInfo {
  telefone?: string;
  localizacao?: string;
  cargo?: string;
  sobre?: string;
  experiencias?: Experiencia[];
  habilidades?: string[];
  empresaNome?: string;  // Para clientes
  segmento?: string;      // Para clientes
  membroDesde?: string;
}

interface User {
  id: number;
  nome: string;
  email: string;
  tipo: UserType;
  avatar: string;
  perfil?: PerfilInfo;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string, tipo: UserType) => Promise<boolean>;
  signup: (email: string, tipo: UserType) => void;
  cadastrar: (nome: string, email: string, senha: string, tipo: UserType) => Promise<boolean>;
  logout: () => void;
  updateProfile: (perfil: PerfilInfo) => void;
  isDesigner: boolean;
  isCliente: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, senha: string, tipo: UserType): Promise<boolean> => {
    // Simulação de login - em produção, isso seria uma chamada à API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock de usuários para demonstração
    const mockUsers = {
      'designer@designflow.com': {
        id: 1,
        nome: 'Marina Silva',
        email: 'designer@designflow.com',
        tipo: 'designer' as UserType,
        avatar: 'MS',
        perfil: {
          telefone: '+55 (11) 98765-4321',
          localizacao: 'São Paulo, Brasil',
          cargo: 'Designer Sênior & Criativo',
          sobre: 'Designer com mais de 8 anos de experiência em branding, design de interfaces e experiência do usuário. Apaixonado por criar soluções visuais que conectam marcas com seus públicos de forma autêntica e memorável.',
          experiencias: [
            {
              cargo: 'Designer Sênior',
              empresa: 'DesignFlow Studio',
              periodo: 'Jan 2024 - Presente'
            },
            {
              cargo: 'Designer de Produto',
              empresa: 'TechVision Labs',
              periodo: 'Mar 2020 - Dez 2023'
            }
          ],
          habilidades: ['UI/UX Design', 'Branding', 'Figma', 'Adobe Creative Suite', 'Prototipagem', 'Design Systems', 'Ilustração', 'Motion Design'],
          membroDesde: 'Jan 2024'
        }
      },
      'cliente@empresa.com': {
        id: 2,
        nome: 'Carlos Mendes',
        email: 'cliente@empresa.com',
        tipo: 'cliente' as UserType,
        avatar: 'CM',
        perfil: {
          telefone: '+55 (11) 98765-4321',
          localizacao: 'São Paulo, Brasil',
          empresaNome: 'TechCorp Solutions',
          segmento: 'Tecnologia e Inovação',
          membroDesde: 'Jan 2024'
        }
      }
    };

    const foundUser = mockUsers[email as keyof typeof mockUsers];
    
    if (foundUser && foundUser.tipo === tipo) {
      setUser(foundUser);
      localStorage.setItem('designflow_user', JSON.stringify(foundUser));
      // Dispara evento customizado para atualizar projetos
      window.dispatchEvent(new Event('designflow_user_changed'));
      return true;
    }
    
    return false;
  };

  const signup = (email: string, tipo: UserType) => {
    // Simulação de signup - em produção, isso seria uma chamada à API
    const newUser: User = {
      id: Date.now(),
      nome: '',
      email,
      tipo,
      avatar: '',
      perfil: {
        membroDesde: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
      }
    };
    
    setUser(newUser);
    localStorage.setItem('designflow_user', JSON.stringify(newUser));
    // Dispara evento customizado para atualizar projetos
    window.dispatchEvent(new Event('designflow_user_changed'));
  };

  const cadastrar = async (nome: string, email: string, senha: string, tipo: UserType): Promise<boolean> => {
    // Simulação de cadastro - em produção, isso seria uma chamada à API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: Date.now(),
      nome,
      email,
      tipo,
      avatar: nome.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      perfil: {
        membroDesde: new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
      }
    };
    
    setUser(newUser);
    localStorage.setItem('designflow_user', JSON.stringify(newUser));
    // Dispara evento customizado para atualizar projetos
    window.dispatchEvent(new Event('designflow_user_changed'));
    return true;
  };

  const updateProfile = (perfil: PerfilInfo) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      perfil: {
        ...user.perfil,
        ...perfil
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('designflow_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('designflow_user');
    // Dispara evento customizado para limpar projetos
    window.dispatchEvent(new Event('designflow_user_changed'));
  };

  // Carregar usuário do localStorage ao iniciar
  React.useEffect(() => {
    const savedUser = localStorage.getItem('designflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        cadastrar,
        logout,
        updateProfile,
        isDesigner: user?.tipo === 'designer',
        isCliente: user?.tipo === 'cliente'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}