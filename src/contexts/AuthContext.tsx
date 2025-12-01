import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'designer' | 'cliente';

interface User {
  id: number;
  nome: string;
  email: string;
  tipo: UserType;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string, tipo: UserType) => Promise<boolean>;
  signup: (email: string, tipo: UserType) => void;
  cadastrar: (nome: string, email: string, senha: string, tipo: UserType) => Promise<boolean>;
  logout: () => void;
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
        avatar: 'MS'
      },
      'cliente@empresa.com': {
        id: 2,
        nome: 'Carlos Mendes',
        email: 'cliente@empresa.com',
        tipo: 'cliente' as UserType,
        avatar: 'CM'
      }
    };

    const foundUser = mockUsers[email as keyof typeof mockUsers];
    
    if (foundUser && foundUser.tipo === tipo) {
      setUser(foundUser);
      localStorage.setItem('designflow_user', JSON.stringify(foundUser));
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
      avatar: ''
    };
    
    setUser(newUser);
    localStorage.setItem('designflow_user', JSON.stringify(newUser));
  };

  const cadastrar = async (nome: string, email: string, senha: string, tipo: UserType): Promise<boolean> => {
    // Simulação de cadastro - em produção, isso seria uma chamada à API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: Date.now(),
      nome,
      email,
      tipo,
      avatar: nome.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    };
    
    setUser(newUser);
    localStorage.setItem('designflow_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('designflow_user');
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