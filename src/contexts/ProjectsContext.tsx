import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Projeto {
  id: number;
  nome: string;
  cliente: string;
  descricao: string;
  dataInicio: string;
  dataEntrega: string;
  status: 'Em Andamento' | 'Concluído' | 'Pausado' | 'Aguardando Feedback' | 'Revisão' | 'Planejamento';
  progresso: number;
  cor?: string;
  criadoPor: string; // userId do designer que criou
  tarefas?: {
    concluidas: number;
    emAndamento: number;
    total: number;
  };
  diasRestantes?: number;
  mensagensNovas?: number;
  ultimaAtualizacao?: string;
  ativo?: boolean;
  prazo?: string;
  tarefasConcluidas?: number;
  satisfacao?: number;
  resumo?: string;
  dataConclusao?: string;
  duracao?: string;
  atividades?: Array<{
    tipo: 'tarefa_criada' | 'status_alterado' | 'conclusao' | 'criacao' | 'movimentacao' | 'retorno';
    tarefa: string;
    coluna: string;
    timestamp: Date;
    prioridade?: string;
    colunaAnterior?: string;
    data?: string;
  }>;
  // Novos campos para persistir dados do Kanban e Chat
  colunas?: Array<{
    id: string;
    titulo: string;
    cor: string;
    tarefas: Array<{
      id: number;
      titulo: string;
      descricao: string;
      responsavel: string;
      prioridade: string;
      comentarios: number;
      colunaOrigem?: string;
      anexos?: Array<{
        nome: string;
        tipo: 'imagem' | 'documento';
        url: string;
      }>;
    }>;
  }>;
  mensagens?: Array<{
    id: number;
    autor: string;
    nome?: string;
    mensagem?: string;
    texto?: string;
    hora: string;
    tipo?: 'enviada' | 'recebida';
    avatar: string;
    tarefaId?: number;
    isRelatorio?: boolean;
    anexos?: Array<{
      nome: string;
      tipo: 'imagem' | 'documento';
      url: string;
    }>;
  }>;
  avaliacao?: {
    estrelas: number;
    comentario: string;
    nomeAvaliador: string;
    cargoAvaliador: string;
    dataAvaliacao: string;
    pontosFortes: string[];
    impacto: string;
  };
}

interface ProjectsContextData {
  projetos: Projeto[];
  adicionarProjeto: (projeto: Omit<Projeto, 'id'>) => number;
  atualizarProjeto: (id: number, dados: Partial<Projeto>) => void;
  removerProjeto: (id: number) => void;
  obterProjetoPorId: (id: number) => Projeto | undefined;
}

const ProjectsContext = createContext<ProjectsContextData>({} as ProjectsContextData);

// Projetos de exemplo para conta demo
const PROJETOS_DEMO: Projeto[] = [
  {
    id: 1,
    nome: 'Redesign Website Corporativo',
    cliente: 'TechCorp Solutions',
    descricao: 'Modernização completa do site institucional',
    dataInicio: '2024-01-15',
    dataEntrega: '2024-03-30',
    status: 'Em Andamento',
    progresso: 65,
    cor: '#007bff',
    criadoPor: 'demo-designer',
    tarefas: {
      concluidas: 8,
      emAndamento: 5,
      total: 15
    },
    diasRestantes: 45,
    mensagensNovas: 3,
    ultimaAtualizacao: 'Hoje'
  },
  {
    id: 2,
    nome: 'App Mobile E-commerce',
    cliente: 'Fashion Store',
    descricao: 'Aplicativo de vendas online para moda',
    dataInicio: '2024-02-01',
    dataEntrega: '2024-04-15',
    status: 'Em Andamento',
    progresso: 45,
    cor: '#28a745',
    criadoPor: 'demo-designer',
    tarefas: {
      concluidas: 12,
      emAndamento: 8,
      total: 25
    },
    diasRestantes: 30,
    mensagensNovas: 0,
    ultimaAtualizacao: 'Ontem'
  },
  {
    id: 3,
    nome: 'Identidade Visual Startup',
    cliente: 'InovaTech',
    descricao: 'Criação de marca completa para startup de tecnologia',
    dataInicio: '2024-01-20',
    dataEntrega: '2024-02-28',
    status: 'Concluído',
    progresso: 100,
    cor: '#ffc107',
    criadoPor: 'demo-designer',
    tarefas: {
      concluidas: 10,
      emAndamento: 0,
      total: 10
    },
    diasRestantes: 0,
    mensagensNovas: 0,
    ultimaAtualizacao: 'Há 3 dias'
  },
  {
    id: 4,
    nome: 'Dashboard Analytics',
    cliente: 'DataViz Inc',
    descricao: 'Interface de visualização de dados',
    dataInicio: '2024-02-10',
    dataEntrega: '2024-05-01',
    status: 'Em Andamento',
    progresso: 30,
    cor: '#dc3545',
    criadoPor: 'demo-designer',
    tarefas: {
      concluidas: 6,
      emAndamento: 10,
      total: 20
    },
    diasRestantes: 60,
    mensagensNovas: 1,
    ultimaAtualizacao: 'Há 2 horas'
  }
];

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projetos, setProjetos] = useState<Projeto[]>([]);

  // Carrega projetos demo se for conta demo
  useEffect(() => {
    const savedUser = localStorage.getItem('designflow_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // Carrega projetos demo apenas para o usuário demo
      if (user.email === 'designer@designflow.com' || user.email === 'cliente@empresa.com') {
        setProjetos(PROJETOS_DEMO);
      }
    }
  }, []);
  
  // Observa mudanças no usuário para atualizar projetos quando logar/deslogar
  useEffect(() => {
    const handleUserChange = () => {
      const savedUser = localStorage.getItem('designflow_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.email === 'designer@designflow.com' || user.email === 'cliente@empresa.com') {
          setProjetos(PROJETOS_DEMO);
        } else {
          // Para contas novas, limpa os projetos
          setProjetos([]);
        }
      } else {
        // Se não há usuário logado, limpa os projetos
        setProjetos([]);
      }
    };

    window.addEventListener('designflow_user_changed', handleUserChange);
    return () => window.removeEventListener('designflow_user_changed', handleUserChange);
  }, []);

  const adicionarProjeto = (projeto: Omit<Projeto, 'id'>) => {
    console.log('ProjectsContext - projetos atuais:', projetos.map(p => ({ id: p.id, nome: p.nome })));
    const novoId = projetos.length > 0 ? Math.max(...projetos.map(p => p.id)) + 1 : 1;
    const novoProjeto = {
      ...projeto,
      id: novoId
    };
    console.log('ProjectsContext - Novo projeto criado com ID:', novoId);
    setProjetos([...projetos, novoProjeto]);
    return novoId;
  };

  const atualizarProjeto = (id: number, dados: Partial<Projeto>) => {
    setProjetos(projetos.map(p => p.id === id ? { ...p, ...dados } : p));
  };

  const removerProjeto = (id: number) => {
    setProjetos(projetos.filter(p => p.id !== id));
  };

  const obterProjetoPorId = (id: number) => {
    return projetos.find(p => p.id === id);
  };

  return (
    <ProjectsContext.Provider
      value={{
        projetos,
        adicionarProjeto,
        atualizarProjeto,
        removerProjeto,
        obterProjetoPorId
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects deve ser usado dentro de um ProjectsProvider');
  }
  return context;
}