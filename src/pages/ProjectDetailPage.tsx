import React, { useState } from 'react';
import { ArrowLeft, Send, Paperclip, Clock, User, MessageCircle, CheckCircle2, MoreVertical, Eye, Plus, X, FileText, Download, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProjectDetailPageProps {
  projectId: number;
  onBack: () => void;
}

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  responsavel: string;
  prioridade: string;
  comentarios: number;
  anexos?: Array<{
    nome: string;
    tipo: 'imagem' | 'documento';
    url: string;
  }>;
}

interface Coluna {
  id: string;
  titulo: string;
  cor: string;
  tarefas: Tarefa[];
}

interface AtividadeDiaria {
  tipo: 'tarefa_criada' | 'status_alterado';
  tarefa: string;
  coluna: string;
  timestamp: Date;
  prioridade?: string;
  colunaAnterior?: string;
}

export function ProjectDetailPage({ projectId, onBack }: ProjectDetailPageProps) {
  const { user, isDesigner, isCliente } = useAuth();
  const [mensagem, setMensagem] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [colunaAtual, setColunaAtual] = useState<string | null>(null);
  const [novaTarefa, setNovaTarefa] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'Média'
  });
  const [atividadesDoDia, setAtividadesDoDia] = useState<AtividadeDiaria[]>([]);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);
  const [modalExclusao, setModalExclusao] = useState(false);
  const [tarefaParaExcluir, setTarefaParaExcluir] = useState<{id: number, colunaId: string} | null>(null);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<number | null>(null);
  const [tarefaFiltrada, setTarefaFiltrada] = useState<number | null>(null);
  const [tarefaParaComentar, setTarefaParaComentar] = useState<number | null>(null);
  const chatRef = React.useRef<HTMLDivElement>(null);
  const mensagensRef = React.useRef<HTMLDivElement>(null);
  
  // Mock data - em produção viria de uma API
  const projeto = {
    id: projectId,
    nome: projectId === 1 ? 'Redesign Website Corporativo' : 
          projectId === 2 ? 'App Mobile E-commerce' :
          projectId === 3 ? 'Identidade Visual Startup' : 'Dashboard Analytics',
    cliente: projectId === 1 ? 'TechCorp Solutions' : 
             projectId === 2 ? 'Fashion Store' :
             projectId === 3 ? 'InovaTech' : 'DataViz Inc',
    status: 'Em Andamento',
    progresso: 65
  };

  const [colunas, setColunas] = useState<Coluna[]>([
    {
      id: 'conceituacao',
      titulo: 'Em Conceituação',
      cor: 'bg-purple-500',
      tarefas: [
        {
          id: 1,
          titulo: 'Pesquisa de Referências',
          descricao: 'Coletar inspirações e criar moodboard',
          responsavel: 'Designer',
          prioridade: 'Alta',
          comentarios: 3,
          anexos: [
            { nome: 'moodboard-v1.png', tipo: 'imagem', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400' },
            { nome: 'referencias.pdf', tipo: 'documento', url: '#' }
          ]
        },
        {
          id: 2,
          titulo: 'Definir Paleta de Cores',
          descricao: 'Escolher cores principais e secundárias',
          responsavel: 'Designer',
          prioridade: 'Média',
          comentarios: 1
        }
      ]
    },
    {
      id: 'andamento',
      titulo: 'Design em Andamento',
      cor: 'bg-blue-500',
      tarefas: [
        {
          id: 3,
          titulo: 'Wireframes Homepage',
          descricao: 'Criar estrutura básica da página inicial',
          responsavel: 'Designer',
          prioridade: 'Alta',
          comentarios: 5
        },
        {
          id: 4,
          titulo: 'Design Sistema',
          descricao: 'Componentes e tokens de design',
          responsavel: 'Designer',
          prioridade: 'Alta',
          comentarios: 2
        },
        {
          id: 5,
          titulo: 'Protótipo Interativo',
          descricao: 'Criar fluxo de navegação',
          responsavel: 'Designer',
          prioridade: 'Média',
          comentarios: 0
        }
      ]
    },
    {
      id: 'revisao',
      titulo: 'Revisão do Cliente',
      cor: 'bg-orange-500',
      tarefas: [
        {
          id: 6,
          titulo: 'Layout da Página Sobre',
          descricao: 'Aguardando feedback sobre estrutura',
          responsavel: 'Cliente',
          prioridade: 'Alta',
          comentarios: 8
        },
        {
          id: 7,
          titulo: 'Iconografia',
          descricao: 'Revisão do conjunto de ícones',
          responsavel: 'Cliente',
          prioridade: 'Baixa',
          comentarios: 2
        }
      ]
    },
    {
      id: 'concluido',
      titulo: 'Concluído',
      cor: 'bg-green-500',
      tarefas: [
        {
          id: 8,
          titulo: 'Logo Principal',
          descricao: 'Versões aprovadas pelo cliente',
          responsavel: 'Designer',
          prioridade: 'Alta',
          comentarios: 12
        },
        {
          id: 9,
          titulo: 'Tipografia',
          descricao: 'Fontes definidas e aprovadas',
          responsavel: 'Designer',
          prioridade: 'Média',
          comentarios: 4
        }
      ]
    }
  ]);

  const abrirModal = (colunaId: string) => {
    setColunaAtual(colunaId);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setColunaAtual(null);
    setNovaTarefa({
      titulo: '',
      descricao: '',
      prioridade: 'Média'
    });
  };

  const adicionarTarefa = () => {
    if (!novaTarefa.titulo.trim() || !colunaAtual) return;

    const novoId = Math.max(...colunas.flatMap(c => c.tarefas.map(t => t.id))) + 1;
    
    setColunas(colunas.map(coluna => {
      if (coluna.id === colunaAtual) {
        // Processar anexos da tarefa
        const anexosTarefa = arquivosTarefa.map(file => ({
          nome: file.name,
          tipo: (file.type.startsWith('image/') ? 'imagem' : 'documento') as 'imagem' | 'documento',
          url: URL.createObjectURL(file) // Em produção, fazer upload real
        }));

        return {
          ...coluna,
          tarefas: [
            ...coluna.tarefas,
            {
              id: novoId,
              titulo: novaTarefa.titulo,
              descricao: novaTarefa.descricao,
              responsavel: 'Designer',
              prioridade: novaTarefa.prioridade,
              comentarios: 0,
              anexos: anexosTarefa.length > 0 ? anexosTarefa : undefined
            }
          ]
        };
      }
      return coluna;
    }));

    // Registrar atividade do dia
    setAtividadesDoDia([
      ...atividadesDoDia,
      {
        tipo: 'tarefa_criada',
        tarefa: novaTarefa.titulo,
        coluna: colunas.find(c => c.id === colunaAtual)?.titulo || '',
        timestamp: new Date(),
        prioridade: novaTarefa.prioridade
      }
    ]);

    setArquivosTarefa([]);
    fecharModal();
  };

  const abrirMenuTarefa = (id: number) => {
    setMenuAberto(menuAberto === id ? null : id);
  };

  const abrirEdicao = (tarefa: Tarefa, colunaId: string) => {
    setTarefaEditando({ ...tarefa });
    setModalEdicao(true);
    setMenuAberto(null);
  };

  const fecharEdicao = () => {
    setModalEdicao(false);
    setTarefaEditando(null);
  };

  const salvarEdicao = () => {
    if (!tarefaEditando || !tarefaEditando.titulo.trim()) return;

    // Processar novos anexos
    const novosAnexos = arquivosTarefa.map(file => ({
      nome: file.name,
      tipo: (file.type.startsWith('image/') ? 'imagem' : 'documento') as 'imagem' | 'documento',
      url: URL.createObjectURL(file)
    }));

    // Combinar anexos existentes com novos
    const anexosCombinados = [
      ...(tarefaEditando.anexos || []),
      ...novosAnexos
    ];

    setColunas(colunas.map(coluna => ({
      ...coluna,
      tarefas: coluna.tarefas.map(t => 
        t.id === tarefaEditando.id ? {
          ...tarefaEditando,
          anexos: anexosCombinados.length > 0 ? anexosCombinados : undefined
        } : t
      )
    })));

    setArquivosTarefa([]);
    fecharEdicao();
  };

  const abrirExclusao = (tarefaId: number, colunaId: string) => {
    setTarefaParaExcluir({ id: tarefaId, colunaId });
    setModalExclusao(true);
    setMenuAberto(null);
  };

  const fecharExclusao = () => {
    setModalExclusao(false);
    setTarefaParaExcluir(null);
  };

  const confirmarExclusao = () => {
    if (!tarefaParaExcluir) return;

    setColunas(colunas.map(coluna => ({
      ...coluna,
      tarefas: coluna.tarefas.filter(t => t.id !== tarefaParaExcluir.id)
    })));

    fecharExclusao();
  };

  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);
  const [arquivosTarefa, setArquivosTarefa] = useState<File[]>([]);
  const inputArquivoRef = React.useRef<HTMLInputElement>(null);
  const inputArquivoTarefaRef = React.useRef<HTMLInputElement>(null);

  const handleSelecionarArquivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArquivosSelecionados(Array.from(e.target.files));
    }
  };

  const handleSelecionarArquivosTarefa = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArquivosTarefa(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removerArquivo = (index: number) => {
    setArquivosSelecionados(prev => prev.filter((_, i) => i !== index));
  };

  const removerArquivoTarefa = (index: number) => {
    setArquivosTarefa(prev => prev.filter((_, i) => i !== index));
  };

  const [listaMensagens, setListaMensagens] = useState([
    {
      id: 1,
      autor: 'designer',
      nome: 'Marina Silva',
      mensagem: 'Olá! Acabei de finalizar os wireframes da homepage. Gostaria de revisar?',
      hora: '10:30',
      avatar: 'MS',
      tarefaId: 3,
      anexos: [
        { nome: 'wireframe-homepage.png', tipo: 'imagem', url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400' }
      ]
    },
    {
      id: 2,
      autor: 'cliente',
      nome: 'Carlos Mendes',
      mensagem: 'Bom dia Marina! Sim, adoraria ver. Pode compartilhar?',
      hora: '10:45',
      avatar: 'CM',
      tarefaId: 3
    },
    {
      id: 3,
      autor: 'designer',
      nome: 'Marina Silva',
      mensagem: 'Claro! Acabei de mover para "Revisão do Cliente". Fique à vontade para comentar diretamente no card.',
      hora: '10:47',
      avatar: 'MS',
      tarefaId: 3
    },
    {
      id: 4,
      autor: 'designer',
      nome: 'Marina Silva',
      mensagem: 'Relatório Rápido: Hoje finalizei os wireframes e iniciei o design do sistema de componentes. Previsão para conclusão dessa fase: 2 dias.',
      hora: '11:00',
      avatar: 'MS',
      isRelatorio: true
    },
    {
      id: 5,
      autor: 'cliente',
      nome: 'Carlos Mendes',
      mensagem: 'Perfeito! Vou revisar até o fim do dia e retorno com feedback.',
      hora: '11:15',
      avatar: 'CM',
      tarefaId: 3,
      anexos: [
        { nome: 'requisitos-atualizados.pdf', tipo: 'documento', url: '#' },
        { nome: 'referencias-visual.pdf', tipo: 'documento', url: '#' }
      ]
    },
    {
      id: 6,
      autor: 'designer',
      nome: 'Marina Silva',
      mensagem: 'Ótimo! Qualquer dúvida estou à disposição 😊',
      hora: '11:16',
      avatar: 'MS',
      tarefaId: 3
    },
    {
      id: 7,
      autor: 'cliente',
      nome: 'Carlos Mendes',
      mensagem: 'Marina, sobre a página "Sobre", acho que podemos adicionar mais espaço entre as seções. O que acha?',
      hora: '14:20',
      avatar: 'CM',
      tarefaId: 6
    },
    {
      id: 8,
      autor: 'designer',
      nome: 'Marina Silva',
      mensagem: 'Ótima sugestão! Vou ajustar o espaçamento e já atualizo o layout.',
      hora: '14:25',
      avatar: 'MS',
      tarefaId: 6
    },
    {
      id: 9,
      autor: 'cliente',
      nome: 'Carlos Mendes',
      mensagem: 'Adorei os ícones! Muito bem escolhidos. Aprovado!',
      hora: '15:10',
      avatar: 'CM',
      tarefaId: 7
    },
    {
      id: 10,
      autor: 'designer',
      nome: 'Marina Silva',
      mensagem: 'Que bom que gostou! Vou marcar como concluído então.',
      hora: '15:12',
      avatar: 'MS',
      tarefaId: 7
    },
    {
      id: 11,
      autor: 'cliente',
      nome: 'Carlos Mendes',
      mensagem: 'As referências que você trouxe estão incríveis! Especialmente aquelas do Dribbble.',
      hora: '09:30',
      avatar: 'CM',
      tarefaId: 1
    },
    {
      id: 12,
      autor: 'designer',
      nome: 'Marina Silva',
      mensagem: 'Obrigada! Vou seguir por essa linha visual então.',
      hora: '09:35',
      avatar: 'MS',
      tarefaId: 1
    },
    {
      id: 13,
      autor: 'cliente',
      nome: 'Carlos Mendes',
      mensagem: 'Poderia explorar mais tons de azul? Acho que combina mais com nossa identidade.',
      hora: '11:45',
      avatar: 'CM',
      tarefaId: 2
    }
  ]);

  const prioridadeClasses = {
    Alta: 'bg-red-100 text-red-700 border-red-200',
    Média: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Baixa: 'bg-green-100 text-green-700 border-green-200'
  };

  const gerarRelatorioRapido = () => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    let relatorio = `📊 Relatório Rápido do Dia (${hoje})\n\n`;

    if (atividadesDoDia.length === 0) {
      relatorio += 'Nenhuma atividade registrada hoje.';
    } else {
      const tarefasCriadas = atividadesDoDia.filter(a => a.tipo === 'tarefa_criada');
      const statusAlterados = atividadesDoDia.filter(a => a.tipo === 'status_alterado');

      if (tarefasCriadas.length > 0) {
        relatorio += `✅ Tarefas Criadas (${tarefasCriadas.length}):\n`;
        tarefasCriadas.forEach((atividade, index) => {
          relatorio += `${index + 1}. "${atividade.tarefa}" em ${atividade.coluna}`;
          if (atividade.prioridade) {
            relatorio += ` (Prioridade: ${atividade.prioridade})`;
          }
          relatorio += `\n`;
        });
      }

      if (statusAlterados.length > 0) {
        relatorio += `\n🔄 Alterações de Status (${statusAlterados.length}):\n`;
        statusAlterados.forEach((atividade, index) => {
          relatorio += `${index + 1}. "${atividade.tarefa}" movida de ${atividade.colunaAnterior} → ${atividade.coluna}\n`;
        });
      }
    }

    // Adicionar relatório ao chat
    const novaHora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const novoRelatorio = {
      id: listaMensagens.length + 1,
      autor: 'designer',
      nome: user?.nome || 'Designer',
      mensagem: relatorio,
      hora: novaHora,
      avatar: user?.nome?.split(' ').map(n => n[0]).join('') || 'DS',
      isRelatorio: true
    };

    setListaMensagens([...listaMensagens, novoRelatorio]);
  };

  const navegarParaComentariosDaTarefa = (tarefaId: number) => {
    setTarefaFiltrada(tarefaId);
    setTarefaSelecionada(tarefaId);
    setTarefaParaComentar(tarefaId); // Seleciona automaticamente para comentar
    
    // Scroll suave até o chat
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Scroll mensagens para o topo
      if (mensagensRef.current) {
        mensagensRef.current.scrollTop = 0;
      }
    }, 100);
    
    // Remove o destaque após 2 segundos (mas mantém o filtro)
    setTimeout(() => {
      setTarefaSelecionada(null);
    }, 2000);
  };

  const limparFiltro = () => {
    setTarefaFiltrada(null);
    setTarefaSelecionada(null);
  };

  const enviarMensagem = () => {
    if (mensagem.trim() || arquivosSelecionados.length > 0) {
      const novaHora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      // Processar anexos
      const anexos = arquivosSelecionados.map(file => ({
        nome: file.name,
        tipo: file.type.startsWith('image/') ? 'imagem' : 'documento',
        url: URL.createObjectURL(file) // Em produção, fazer upload real
      }));
      
      const novaMensagem = {
        id: listaMensagens.length + 1,
        autor: isDesigner ? 'designer' : 'cliente',
        nome: user?.nome || (isDesigner ? 'Designer' : 'Cliente'),
        mensagem: mensagem,
        hora: novaHora,
        avatar: user?.nome?.split(' ').map(n => n[0]).join('') || (isDesigner ? 'DS' : 'CL'),
        tarefaId: tarefaParaComentar || undefined,
        anexos: anexos.length > 0 ? anexos : undefined
      };
      setListaMensagens([...listaMensagens, novaMensagem]);
      setMensagem('');
      setArquivosSelecionados([]);
      // Não limpa a tarefa selecionada para permitir múltiplos comentários na mesma tarefa
    }
  };
  
  const obterTituloDaTarefa = (tarefaId: number) => {
    for (const coluna of colunas) {
      const tarefa = coluna.tarefas.find(t => t.id === tarefaId);
      if (tarefa) return tarefa.titulo;
    }
    return '';
  };

  const mensagensFiltradas = tarefaFiltrada 
    ? listaMensagens.filter(msg => msg.tarefaId === tarefaFiltrada)
    : listaMensagens;

  const contarComentariosDaTarefa = (tarefaId: number) => {
    return listaMensagens.filter(msg => msg.tarefaId === tarefaId).length;
  };

  const obterTodasAsTarefas = () => {
    const tarefas: { id: number; titulo: string; coluna: string }[] = [];
    colunas.forEach(coluna => {
      coluna.tarefas.forEach(tarefa => {
        tarefas.push({
          id: tarefa.id,
          titulo: tarefa.titulo,
          coluna: coluna.titulo
        });
      });
    });
    return tarefas;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 md:py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-medium"
          >
            <ArrowLeft size={20} />
            Voltar para Home
          </button>
          
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-slate-800 mb-2 font-['Kumbh_Sans',sans-serif] text-[24px] md:text-[32px] font-bold leading-tight">
                  {projeto.nome}
                </h1>
                <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] md:text-[16px] font-normal leading-[20px]">
                  Cliente: {projeto.cliente}
                </p>
                {isCliente && (
                  <div className="flex items-center gap-2 mt-2 text-slate-500">
                    <Eye size={16} />
                    <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                      Modo Visualização
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 md:gap-4 self-start">
                <div className="text-left md:text-right">
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] md:text-[14px] font-medium leading-[16px] mb-1">
                    Progresso Geral
                  </p>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] md:text-[24px] font-bold leading-[28px]">
                    {projeto.progresso}%
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] md:text-[14px] font-semibold leading-[16px] whitespace-nowrap">
                  {projeto.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Kanban Board - 2 colunas */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
              <h2 className="text-slate-800 mb-4 md:mb-6 font-['Kumbh_Sans',sans-serif] text-[20px] md:text-[24px] font-bold leading-[28px]">
                Quadro Kanban
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {colunas.map((coluna) => (
                  <div key={coluna.id} className="flex flex-col">
                    <div className={`${coluna.cor} text-white px-4 py-3 rounded-t-xl`}>
                      <h3 className="font-['Kumbh_Sans',sans-serif] text-[14px] font-bold leading-[16px]">
                        {coluna.titulo}
                      </h3>
                      <p className="font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[14px] opacity-90 mt-1">
                        {coluna.tarefas.length} {coluna.tarefas.length === 1 ? 'tarefa' : 'tarefas'}
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-b-xl p-3 space-y-3 min-h-[300px] md:min-h-[400px] flex flex-col">
                      {coluna.tarefas.map((tarefa) => (
                        <div
                          key={tarefa.id}
                          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 relative"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px] flex-1">
                              {tarefa.titulo}
                            </h4>
                            {isDesigner && (
                              <div className="relative">
                                <button 
                                  onClick={() => abrirMenuTarefa(tarefa.id)}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  <MoreVertical size={16} />
                                </button>
                                
                                {menuAberto === tarefa.id && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-10" 
                                      onClick={() => setMenuAberto(null)}
                                    />
                                    <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-40 z-20">
                                      <button
                                        onClick={() => abrirEdicao(tarefa, coluna.id)}
                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px] flex items-center gap-2"
                                      >
                                        <span>✏️</span>
                                        Editar
                                      </button>
                                      <button
                                        onClick={() => abrirExclusao(tarefa.id, coluna.id)}
                                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px] flex items-center gap-2"
                                      >
                                        <span>🗑️</span>
                                        Excluir
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] mb-3">
                            {tarefa.descricao}
                          </p>
                          
                          {/* Anexos da Tarefa */}
                          {tarefa.anexos && tarefa.anexos.length > 0 && (
                            <div className="mb-3 space-y-1">
                              {tarefa.anexos.map((anexo, idx) => (
                                <div 
                                  key={idx} 
                                  className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 cursor-pointer group text-xs"
                                  onClick={() => window.open(anexo.url, '_blank')}
                                >
                                  {anexo.tipo === 'imagem' ? (
                                    <ImageIcon size={12} className="flex-shrink-0" />
                                  ) : (
                                    <FileText size={12} className="flex-shrink-0" />
                                  )}
                                  <span className="truncate group-hover:underline font-['Kumbh_Sans',sans-serif]">
                                    {anexo.nome}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className={`${prioridadeClasses[tarefa.prioridade as keyof typeof prioridadeClasses]} px-2 py-1 rounded-md font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold leading-[12px] border`}>
                              {tarefa.prioridade}
                            </span>
                            
                            {tarefa.comentarios > 0 && (
                              <button 
                                onClick={() => navegarParaComentariosDaTarefa(tarefa.id)}
                                className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer group"
                                title={`Ver ${contarComentariosDaTarefa(tarefa.id)} ${contarComentariosDaTarefa(tarefa.id) === 1 ? 'comentário' : 'comentários'} no chat`}
                              >
                                <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
                                <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px]">
                                  {contarComentariosDaTarefa(tarefa.id)}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Botão Adicionar Tarefa */}
                      {isDesigner && (
                        <button
                          onClick={() => abrirModal(coluna.id)}
                          className="mt-auto border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600"
                        >
                          <Plus size={18} />
                          <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">
                            Adicionar Tarefa
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat - 1 coluna */}
          <div ref={chatRef} className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg flex flex-col h-[600px] md:h-[700px] xl:h-[800px]">
              {/* Chat Header */}
              <div className="p-4 md:p-6 border-b border-slate-200">
                <h2 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[18px] md:text-[20px] font-bold leading-[24px]">
                  Chat do Projeto
                </h2>
                <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[13px] md:text-[14px] font-normal leading-[16px] mt-1">
                  Comunicação com o cliente
                </p>
              </div>

              {/* Banner de Filtro */}
              {tarefaFiltrada && (
                <div className="px-4 md:px-6 pt-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-3 md:p-4 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                      <MessageCircle size={20} />
                      <div>
                        <p className="font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[14px] opacity-90">
                          Filtrando comentários
                        </p>
                        <p className="font-['Kumbh_Sans',sans-serif] text-[14px] font-bold leading-[18px]">
                          {contarComentariosDaTarefa(tarefaFiltrada)} {contarComentariosDaTarefa(tarefaFiltrada) === 1 ? 'comentário' : 'comentários'} sobre: {obterTituloDaTarefa(tarefaFiltrada)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={limparFiltro}
                      className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
                      title="Mostrar todas as mensagens"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Mensagens */}
              <div ref={mensagensRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4">
                {mensagensFiltradas.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.autor === 'designer' ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-['Kumbh_Sans',sans-serif] text-[12px] font-bold ${
                      msg.autor === 'designer' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {msg.avatar}
                    </div>
                    
                    <div className={`flex-1 ${msg.autor === 'designer' ? 'items-start' : 'items-end'} flex flex-col`}>
                      {msg.tarefaId && (
                        <div className={`mb-1 ${msg.autor === 'designer' ? 'mr-auto' : 'ml-auto'}`}>
                          <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg font-['Kumbh_Sans',sans-serif] text-[10px] font-semibold">
                            <MessageCircle size={10} />
                            {obterTituloDaTarefa(msg.tarefaId)}
                          </span>
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-3 max-w-[85%] transition-all duration-300 ${
                        msg.isRelatorio
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : msg.autor === 'designer'
                          ? 'bg-blue-100 text-slate-800'
                          : 'bg-green-100 text-slate-800'
                      } ${msg.tarefaId === tarefaSelecionada ? 'ring-4 ring-yellow-400 ring-opacity-50 scale-105' : ''}`}>
                        {msg.isRelatorio && (
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/30">
                            <Clock size={14} />
                            <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-bold leading-[14px]">
                              RELATÓRIO RÁPIDO
                            </span>
                          </div>
                        )}
                        <p className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px] whitespace-pre-line">
                          {msg.mensagem}
                        </p>
                        
                        {/* Anexos */}
                        {(msg as any).anexos && (msg as any).anexos.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {(msg as any).anexos.map((anexo: any, idx: number) => (
                              <div key={idx}>
                                {anexo.tipo === 'imagem' ? (
                                  <div className="relative group">
                                    <img 
                                      src={anexo.url} 
                                      alt={anexo.nome}
                                      className="rounded-lg max-w-full h-auto max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => window.open(anexo.url, '_blank')}
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ImageIcon size={12} className="inline mr-1" />
                                      {anexo.nome}
                                    </div>
                                  </div>
                                ) : (
                                  <a 
                                    href={anexo.url}
                                    download={anexo.nome}
                                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all hover:scale-105 ${
                                      msg.isRelatorio 
                                        ? 'bg-white/20 border-white/30 hover:bg-white/30' 
                                        : msg.autor === 'designer'
                                        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                                        : 'bg-green-50 border-green-200 hover:bg-green-100'
                                    }`}
                                  >
                                    <FileText size={16} className={msg.isRelatorio ? 'text-white' : 'text-slate-600'} />
                                    <span className={`text-xs flex-1 ${msg.isRelatorio ? 'text-white' : 'text-slate-700'}`}>
                                      {anexo.nome}
                                    </span>
                                    <Download size={14} className={msg.isRelatorio ? 'text-white' : 'text-slate-400'} />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[14px] mt-1">
                        {msg.hora}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input de mensagem */}
              <div className="p-4 md:p-6 border-t border-slate-200 bg-white">
                <div className="space-y-3">
                  {/* Área de Composição de Mensagem */}
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-200">
                    {/* Seletor de Tarefa Compacto */}
                    <div className="flex items-center gap-2">
                      <MessageCircle size={16} className="text-slate-400 flex-shrink-0" />
                      <select
                        value={tarefaParaComentar || ''}
                        onChange={(e) => setTarefaParaComentar(e.target.value ? Number(e.target.value) : null)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[13px] bg-white hover:border-blue-400 transition-colors"
                      >
                        <option value="">Comentário Geral</option>
                        {colunas.map((coluna) => (
                          <optgroup key={coluna.id} label={coluna.titulo}>
                            {coluna.tarefas.map((tarefa) => (
                              <option key={tarefa.id} value={tarefa.id}>
                                {tarefa.titulo}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      {tarefaParaComentar && (
                        <button
                          onClick={() => {
                            setTarefaParaComentar(null);
                            setTarefaFiltrada(null);
                            setTarefaSelecionada(null);
                          }}
                          className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          title="Limpar seleção"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    {/* Preview de Arquivos Selecionados */}
                    {arquivosSelecionados.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold">
                            {arquivosSelecionados.length} {arquivosSelecionados.length === 1 ? 'arquivo selecionado' : 'arquivos selecionados'}
                          </span>
                          <button
                            onClick={() => setArquivosSelecionados([])}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold"
                          >
                            Limpar todos
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {arquivosSelecionados.map((file, index) => (
                            <div key={index} className="relative group">
                              {file.type.startsWith('image/') ? (
                                <div className="relative">
                                  <img 
                                    src={URL.createObjectURL(file)} 
                                    alt={file.name}
                                    className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200"
                                  />
                                  <button
                                    onClick={() => removerArquivo(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ) : (
                                <div className="relative bg-slate-100 border-2 border-slate-200 rounded-lg p-2 w-20 h-20 flex flex-col items-center justify-center">
                                  <FileText size={24} className="text-slate-600" />
                                  <span className="text-[8px] text-slate-600 mt-1 text-center truncate w-full px-1">
                                    {file.name}
                                  </span>
                                  <button
                                    onClick={() => removerArquivo(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Input de Mensagem */}
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={inputArquivoRef}
                        onChange={handleSelecionarArquivos}
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        className="hidden"
                      />
                      <button
                        onClick={() => inputArquivoRef.current?.click()}
                        className="bg-slate-100 text-slate-600 px-3 py-2.5 rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2 border border-slate-300"
                        title="Anexar arquivo"
                      >
                        <Paperclip size={18} />
                      </button>
                      <input
                        type="text"
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[14px] bg-white"
                      />
                      <button
                        onClick={enviarMensagem}
                        disabled={!mensagem.trim() && arquivosSelecionados.length === 0}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Enviar mensagem"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Botão Relatório (apenas designer e chat geral) */}
                  {isDesigner && !tarefaParaComentar && (
                    <button 
                      onClick={gerarRelatorioRapido}
                      className="w-full text-purple-600 hover:text-white bg-purple-50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 font-['Kumbh_Sans',sans-serif] text-[13px] font-semibold flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all border border-purple-200 hover:border-transparent"
                    >
                      <Clock size={16} />
                      Gerar Relatório Rápido
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Adicionar Tarefa */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-bold leading-[24px]">
                Nova Tarefa
              </h3>
              <button
                onClick={fecharModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  value={novaTarefa.titulo}
                  onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
                  placeholder="Ex: Criar wireframes da homepage"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                />
              </div>

              <div>
                <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                  Descrição
                </label>
                <textarea
                  value={novaTarefa.descricao}
                  onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
                  placeholder="Descreva os detalhes da tarefa..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px] resize-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                  Prioridade
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setNovaTarefa({ ...novaTarefa, prioridade: 'Alta' })}
                    className={`py-2 px-3 rounded-lg border-2 transition-all font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold ${
                      novaTarefa.prioridade === 'Alta'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-200 text-slate-600 hover:border-red-300'
                    }`}
                  >
                    Alta
                  </button>
                  <button
                    onClick={() => setNovaTarefa({ ...novaTarefa, prioridade: 'Média' })}
                    className={`py-2 px-3 rounded-lg border-2 transition-all font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold ${
                      novaTarefa.prioridade === 'Média'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-slate-200 text-slate-600 hover:border-yellow-300'
                    }`}
                  >
                    Média
                  </button>
                  <button
                    onClick={() => setNovaTarefa({ ...novaTarefa, prioridade: 'Baixa' })}
                    className={`py-2 px-3 rounded-lg border-2 transition-all font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold ${
                      novaTarefa.prioridade === 'Baixa'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-200 text-slate-600 hover:border-green-300'
                    }`}
                  >
                    Baixa
                  </button>
                </div>
              </div>

              {/* Anexos */}
              <div>
                <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                  Anexos
                </label>
                <input
                  type="file"
                  ref={inputArquivoTarefaRef}
                  onChange={handleSelecionarArquivosTarefa}
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => inputArquivoTarefaRef.current?.click()}
                  className="w-full py-3 px-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-slate-600 hover:text-blue-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium"
                >
                  <Paperclip size={16} />
                  Adicionar Arquivos
                </button>
                
                {arquivosTarefa.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {arquivosTarefa.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon size={16} className="text-blue-600 flex-shrink-0" />
                        ) : (
                          <FileText size={16} className="text-slate-600 flex-shrink-0" />
                        )}
                        <span className="flex-1 text-slate-700 font-['Kumbh_Sans',sans-serif] text-[13px] truncate">
                          {file.name}
                        </span>
                        <button
                          onClick={() => removerArquivoTarefa(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-blue-800 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                  <strong>Coluna:</strong> {colunas.find(c => c.id === colunaAtual)?.titulo}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={fecharModal}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarTarefa}
                disabled={!novaTarefa.titulo.trim()}
                className={`flex-1 px-4 py-3 rounded-xl transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold ${
                  novaTarefa.titulo.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Adicionar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Tarefa */}
      {modalEdicao && tarefaEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                Editar Tarefa
              </h3>
              <button
                onClick={fecharEdicao}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  value={tarefaEditando.titulo}
                  onChange={(e) => setTarefaEditando({ ...tarefaEditando, titulo: e.target.value })}
                  placeholder="Ex: Criar wireframes da homepage"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                />
              </div>

              <div>
                <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                  Descrição
                </label>
                <textarea
                  value={tarefaEditando.descricao}
                  onChange={(e) => setTarefaEditando({ ...tarefaEditando, descricao: e.target.value })}
                  placeholder="Descreva os detalhes da tarefa..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px] resize-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                  Prioridade
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTarefaEditando({ ...tarefaEditando, prioridade: 'Alta' })}
                    className={`py-2 px-3 rounded-lg border-2 transition-all font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold ${
                      tarefaEditando.prioridade === 'Alta'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-slate-200 text-slate-600 hover:border-red-300'
                    }`}
                  >
                    Alta
                  </button>
                  <button
                    onClick={() => setTarefaEditando({ ...tarefaEditando, prioridade: 'Média' })}
                    className={`py-2 px-3 rounded-lg border-2 transition-all font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold ${
                      tarefaEditando.prioridade === 'Média'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-slate-200 text-slate-600 hover:border-yellow-300'
                    }`}
                  >
                    Média
                  </button>
                  <button
                    onClick={() => setTarefaEditando({ ...tarefaEditando, prioridade: 'Baixa' })}
                    className={`py-2 px-3 rounded-lg border-2 transition-all font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold ${
                      tarefaEditando.prioridade === 'Baixa'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-200 text-slate-600 hover:border-green-300'
                    }`}
                  >
                    Baixa
                  </button>
                </div>
              </div>

              {/* Anexos */}
              <div>
                <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                  Anexos
                </label>
                
                {/* Anexos existentes */}
                {tarefaEditando.anexos && tarefaEditando.anexos.length > 0 && (
                  <div className="mb-3 space-y-2">
                    <span className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium">
                      Anexos atuais:
                    </span>
                    {tarefaEditando.anexos.map((anexo, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
                        {anexo.tipo === 'imagem' ? (
                          <ImageIcon size={16} className="text-blue-600 flex-shrink-0" />
                        ) : (
                          <FileText size={16} className="text-slate-600 flex-shrink-0" />
                        )}
                        <span className="flex-1 text-slate-700 font-['Kumbh_Sans',sans-serif] text-[13px] truncate">
                          {anexo.nome}
                        </span>
                        <button
                          onClick={() => {
                            const novosAnexos = tarefaEditando.anexos?.filter((_, i) => i !== index);
                            setTarefaEditando({ ...tarefaEditando, anexos: novosAnexos?.length ? novosAnexos : undefined });
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remover anexo"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Adicionar novos anexos */}
                <button
                  type="button"
                  onClick={() => inputArquivoTarefaRef.current?.click()}
                  className="w-full py-3 px-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-slate-600 hover:text-blue-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium"
                >
                  <Paperclip size={16} />
                  Adicionar Mais Arquivos
                </button>
                
                {arquivosTarefa.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <span className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium">
                      Novos arquivos:
                    </span>
                    {arquivosTarefa.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon size={16} className="text-green-600 flex-shrink-0" />
                        ) : (
                          <FileText size={16} className="text-green-600 flex-shrink-0" />
                        )}
                        <span className="flex-1 text-slate-700 font-['Kumbh_Sans',sans-serif] text-[13px] truncate">
                          {file.name}
                        </span>
                        <button
                          onClick={() => removerArquivoTarefa(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={fecharEdicao}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicao}
                disabled={!tarefaEditando.titulo.trim()}
                className={`flex-1 px-4 py-3 rounded-xl transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold ${
                  tarefaEditando.titulo.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {modalExclusao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                Confirmar Exclusão
              </h3>
              <button
                onClick={fecharExclusao}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
                  ⚠️
                </div>
                <div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                    Tem certeza que deseja excluir esta tarefa?
                  </p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px]">
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={fecharExclusao}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Excluir Tarefa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
