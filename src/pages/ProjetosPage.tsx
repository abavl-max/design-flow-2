import React, { useState } from 'react';
import { FolderKanban, Clock, Users, CheckCircle, AlertCircle, Award, Calendar, Star, MessageSquare, TrendingUp, Search, Filter, X, FolderPlus, Sparkles, Archive, Trash2, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectsContext';

interface ProjetosPageProps {
  onProjectSelect?: (projectId: number) => void;
  onNovoProjeto?: () => void;
}

export function ProjetosPage({ onProjectSelect, onNovoProjeto }: ProjetosPageProps) {
  const { isDesigner, user } = useAuth();
  const { projetos: todosOsProjetos, atualizarProjeto, removerProjeto } = useProjects();
  
  // Filtra projetos não arquivados primeiro, depois filtra ativos e concluídos
  const projetosNaoArquivados = todosOsProjetos.filter(p => !p.arquivado);
  const projetos = projetosNaoArquivados.filter(p => p.status !== 'Concluído');
  const projetosConcluidos = projetosNaoArquivados.filter(p => p.status === 'Concluído');
  const projetosArquivados = todosOsProjetos.filter(p => p.arquivado);
  
  const [visualizacao, setVisualizacao] = useState<'ativos' | 'historico' | 'arquivados'>('ativos');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('todos');
  const [filtroAvaliacao, setFiltroAvaliacao] = useState('todas');
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Estados do modal de avaliação
  const [modalAvaliacaoAberto, setModalAvaliacaoAberto] = useState(false);
  const [projetoParaAvaliar, setProjetoParaAvaliar] = useState<number | null>(null);
  const [estrelasAvaliacao, setEstrelasAvaliacao] = useState(5);
  const [comentarioAvaliacao, setComentarioAvaliacao] = useState('');
  
  const totalProjetosConcluidos = projetosConcluidos.length;
  const mediaAvaliacoes = totalProjetosConcluidos > 0 ? (projetosConcluidos.reduce((acc, p) => acc + ((p.avaliacaoCliente || p.avaliacao)?.estrelas || 5), 0) / totalProjetosConcluidos).toFixed(1) : '0.0';
  const totalTarefas = projetosConcluidos.reduce((acc, p) => acc + (p.tarefas?.concluidas || 0), 0);
  const mediaSatisfacao = totalProjetosConcluidos > 0 ? Math.round(projetosConcluidos.reduce((acc, p) => acc + (p.satisfacao || 100), 0) / totalProjetosConcluidos) : 0;
  
  // Verifica se existe pelo menos um projeto com avaliação real
  const temAvaliacoes = projetosConcluidos.some(p => (p.avaliacaoCliente !== null && p.avaliacaoCliente !== undefined) || (p.avaliacao !== null && p.avaliacao !== undefined));
  
  // Calcula estatísticas dos projetos ativos
  const totalProjetosAtivos = projetos.length;
  const clientesAtivos = new Set(projetos.map(p => p.cliente)).size;
  const proximaDataEntrega = projetos
    .filter(p => p.dataEntrega)
    .map(p => p.dataEntrega)
    .sort((a, b) => {
      const [diaA, mesA, anoA] = a.split('/');
      const [diaB, mesB, anoB] = b.split('/');
      const dataA = new Date(parseInt(anoA), parseInt(mesA) - 1, parseInt(diaA));
      const dataB = new Date(parseInt(anoB), parseInt(mesB) - 1, parseInt(diaB));
      return dataA.getTime() - dataB.getTime();
    })[0] || 'N/A';
  
  // Função para obter todos os clientes únicos
  const clientesUnicos = Array.from(new Set(projetosConcluidos.map(p => p.cliente)));
  
  // Função de filtragem
  const projetosFiltrados = projetosConcluidos.filter(projeto => {
    // Filtro de busca por texto
    if (buscaTexto && !projeto.nome.toLowerCase().includes(buscaTexto.toLowerCase()) && !projeto.cliente.toLowerCase().includes(buscaTexto.toLowerCase())) {
      return false;
    }
    
    // Filtro por cliente
    if (filtroCliente !== 'todos' && projeto.cliente !== filtroCliente) {
      return false;
    }
    
    // Filtro por avaliação
    if (filtroAvaliacao !== 'todas') {
      if (filtroAvaliacao === '5' && projeto.avaliacao?.estrelas !== 5) return false;
      if (filtroAvaliacao === '4+' && projeto.avaliacao?.estrelas < 4) return false;
    }
    
    // Filtro por período
    if (filtroPeriodo !== 'todos') {
      const dataConclusão = new Date(projeto.dataConclusao.split('/').reverse().join('-'));
      const hoje = new Date();
      const diffMeses = (hoje.getFullYear() - dataConclusão.getFullYear()) * 12 + (hoje.getMonth() - dataConclusão.getMonth());
      
      if (filtroPeriodo === '3meses' && diffMeses > 3) return false;
      if (filtroPeriodo === '6meses' && diffMeses > 6) return false;
      if (filtroPeriodo === '1ano' && diffMeses > 12) return false;
    }
    
    return true;
  });
  
  const limparFiltros = () => {
    setBuscaTexto('');
    setFiltroCliente('todos');
    setFiltroAvaliacao('todas');
    setFiltroPeriodo('todos');
  };
  
  const filtrosAtivos = buscaTexto || filtroCliente !== 'todos' || filtroAvaliacao !== 'todas' || filtroPeriodo !== 'todos';
  
  // Handlers para projetos arquivados
  const handleDesarquivar = (projetoId: number) => {
    if (window.confirm('Deseja desarquivar este projeto?')) {
      atualizarProjeto(projetoId, { arquivado: false });
    }
  };

  const handleExcluirDefinitivamente = (projetoId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto PERMANENTEMENTE? Esta ação não pode ser desfeita.')) {
      removerProjeto(projetoId);
    }
  };
  
  // Handlers para avaliação de projetos (cliente)
  const abrirModalAvaliacao = (projetoId: number) => {
    setProjetoParaAvaliar(projetoId);
    setEstrelasAvaliacao(5);
    setComentarioAvaliacao('');
    setModalAvaliacaoAberto(true);
  };
  
  const fecharModalAvaliacao = () => {
    setModalAvaliacaoAberto(false);
    setProjetoParaAvaliar(null);
    setEstrelasAvaliacao(5);
    setComentarioAvaliacao('');
  };
  
  const enviarAvaliacao = () => {
    if (!projetoParaAvaliar || !comentarioAvaliacao.trim()) {
      alert('Por favor, adicione um comentário sobre o projeto.');
      return;
    }
    
    const hoje = new Date();
    const dataFormatada = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
    
    if (isDesigner) {
      // Avaliação do designer sobre trabalhar com o cliente
      atualizarProjeto(projetoParaAvaliar, {
        avaliacaoDesigner: {
          estrelas: estrelasAvaliacao,
          comentario: comentarioAvaliacao,
          nomeAvaliador: user?.nome || 'Designer',
          dataAvaliacao: dataFormatada
        }
      });
    } else {
      // Avaliação do cliente sobre o projeto
      // Calcula a satisfação baseada nas estrelas (1 estrela = 20%, 2 = 40%, 3 = 60%, 4 = 80%, 5 = 100%)
      const nivelSatisfacao = estrelasAvaliacao * 20;
      
      atualizarProjeto(projetoParaAvaliar, {
        satisfacao: nivelSatisfacao,
        avaliacaoCliente: {
          estrelas: estrelasAvaliacao,
          comentario: comentarioAvaliacao,
          nomeAvaliador: user?.nome || 'Cliente',
          cargoAvaliador: 'Cliente',
          dataAvaliacao: dataFormatada,
          pontosFortes: [],
          impacto: ''
        },
        // Manter compatibilidade com campo antigo
        avaliacao: {
          estrelas: estrelasAvaliacao,
          comentario: comentarioAvaliacao,
          nomeAvaliador: user?.nome || 'Cliente',
          cargoAvaliador: 'Cliente',
          dataAvaliacao: dataFormatada,
          pontosFortes: [],
          impacto: ''
        }
      });
    }
    
    fecharModalAvaliacao();
  };
  
  return (
    <div className="space-y-8">
      {/* Header com botões de navegação */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="mb-2 text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[40px] font-semibold leading-[48px]">
            {visualizacao === 'ativos' && 'Meus Projetos'}
            {visualizacao === 'historico' && 'Histórico de Projetos'}
            {visualizacao === 'arquivados' && 'Projetos Arquivados'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[18px] font-normal leading-[24px]">
            {visualizacao === 'ativos' && 'Selecione um projeto para visualizar detalhes e acompanhar o progresso'}
            {visualizacao === 'historico' && 'Projetos concluídos com sucesso e avaliações dos clientes'}
            {visualizacao === 'arquivados' && 'Projetos que foram arquivados e podem ser restaurados ou excluídos permanentemente'}
          </p>
        </div>
        
        {/* Botão de alternância */}
        <div className="flex gap-3">
          <button
            onClick={() => setVisualizacao('ativos')}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200
              ${visualizacao === 'ativos'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }
            `}
          >
            <FolderKanban size={20} />
            <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] tracking-wide whitespace-nowrap">
              Projetos Ativos
            </span>
            {totalProjetosAtivos > 0 && (
              <span className={`
                px-2 py-0.5 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-bold
                ${visualizacao === 'ativos' ? 'bg-blue-700' : 'bg-blue-100 text-blue-700'}
              `}>
                {totalProjetosAtivos}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setVisualizacao('historico')}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200
              ${visualizacao === 'historico'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }
            `}
          >
            <Award size={20} />
            <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">
              Histórico
            </span>
            <span className={`
              px-2 py-0.5 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-bold
              ${visualizacao === 'historico' ? 'bg-green-700' : 'bg-blue-100 text-blue-700'}
            `}>
              {totalProjetosConcluidos}
            </span>
          </button>
          
          <button
            onClick={() => setVisualizacao('arquivados')}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200
              ${visualizacao === 'arquivados'
                ? 'bg-slate-600 text-white shadow-lg shadow-slate-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }
            `}
          >
            <Archive size={20} />
            <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">
              Arquivados
            </span>
            {projetosArquivados.length > 0 && (
              <span className={`
                px-2 py-0.5 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-bold
                ${visualizacao === 'arquivados' ? 'bg-slate-700' : 'bg-slate-100 text-slate-700'}
              `}>
                {projetosArquivados.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards - Projetos Ativos */}
      {visualizacao === 'ativos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <FolderKanban size={20} />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Total de Projetos</p>
          <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">{totalProjetosAtivos}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Em Andamento</p>
          <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">{totalProjetosAtivos}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Próximo Prazo</p>
          <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-bold leading-[24px]">{proximaDataEntrega.includes('/') ? proximaDataEntrega.substring(0, 5) : 'N/A'}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Clientes Ativos</p>
          <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">{clientesAtivos}</p>
        </div>
        </div>
      )}

      {/* Stats Cards - Histórico */}
      {visualizacao === 'historico' && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${temAvaliacoes ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`}>
          {temAvaliacoes && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 rounded-xl flex items-center justify-center">
                    <Star size={20} />
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
                  Avaliação Média
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
                    {mediaAvaliacoes}
                  </p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= parseFloat(mediaAvaliacoes) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300 dark:text-slate-600'}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
                  Satisfação Média
                </p>
                <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
                  {mediaSatisfacao}%
                </p>
              </div>
            </>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
              Total de Tarefas
            </p>
            <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
              {totalTarefas}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
              Avaliações
            </p>
            <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
              {totalProjetosConcluidos}
            </p>
          </div>
        </div>
      )}

      {/* Projects List - Projetos Ativos */}
      {visualizacao === 'ativos' && (
        <>
          {projetos.length === 0 ? (
            /* Empty State - Nenhum projeto ativo */
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 md:p-16 border border-slate-200 dark:border-slate-700 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FolderPlus size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[28px] font-semibold leading-[36px] mb-3">
                  {isDesigner ? 'Nenhum Projeto Ativo' : 'Nenhum Projeto Disponível'}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] mb-8">
                  {isDesigner 
                    ? 'Voc ainda não possui projetos ativos. Comece criando seu primeiro projeto para gerenciar suas tarefas no sistema Kanban.'
                    : 'Você ainda não está participando de nenhum projeto ativo. Aguarde seu designer criar um novo projeto e convidá-lo.'}
                </p>
                
                {isDesigner && (
                  <button
                    onClick={onNovoProjeto}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold inline-flex items-center gap-2 hover:-translate-y-1"
                  >
                    <Sparkles size={20} />
                    Criar Primeiro Projeto
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Lista de Projetos */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projetos.map((projeto) => {
              const corClasses = {
                blue: 'border-blue-500 bg-blue-50',
                purple: 'border-purple-500 bg-purple-50',
                green: 'border-green-500 bg-green-50',
                orange: 'border-orange-500 bg-orange-50'
              };

              const statusClasses = {
                'Em Andamento': 'bg-blue-100 text-blue-700',
                'Revisão': 'bg-yellow-100 text-yellow-700',
                'Planejamento': 'bg-slate-100 text-slate-700'
              };

              return (
                <div
                  key={projeto.id}
                  onClick={() => onProjectSelect?.(projeto.id)}
                  className={`
                    bg-white dark:bg-slate-800 rounded-2xl p-6 border-l-4 border border-slate-200 dark:border-slate-700
                    hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1
                    ${projeto.ativo ? 'ring-2 ring-blue-500 shadow-lg' : ''}
                  `}
                  style={{ borderLeftColor: projeto.ativo ? '#3b82f6' : undefined }}
                >
                  {projeto.ativo && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px]">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Projeto Atual
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-slate-800 dark:text-slate-100 mb-1 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                        {projeto.nome}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                        {projeto.cliente}
                      </p>
                    </div>
                    <span className={`${statusClasses[projeto.status]} px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px] ml-3`}>
                      {projeto.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px]">
                          Progresso Geral
                        </span>
                        <span className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">
                          {projeto.progresso}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${projeto.progresso}%` }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <CheckCircle size={16} />
                        <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                          {projeto.tarefas.concluidas}/{projeto.tarefas.total} tarefas
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Clock size={16} />
                        <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                          {projeto.prazo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </>
      )}

      {/* Histórico - Projetos Concluídos */}
      {visualizacao === 'historico' && (
        <div className="space-y-8">
          {/* Filtros */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                Filtros
              </h3>
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {mostrarFiltros ? <X size={20} /> : <Filter size={20} />}
              </button>
            </div>
            {mostrarFiltros && (
              <div className="space-y-4 mt-4">
                {/* Busca por texto */}
                <div className="flex items-center gap-3">
                  <Search size={16} className="text-slate-500 dark:text-slate-400" />
                  <input
                    type="text"
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                    placeholder="Buscar por nome ou cliente"
                    className="flex-1 bg-slate-50 dark:bg-slate-700 rounded-xl p-3 border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>

                {/* Filtro por cliente */}
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-slate-500 dark:text-slate-400" />
                  <select
                    value={filtroCliente}
                    onChange={(e) => setFiltroCliente(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-700 rounded-xl p-3 border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                  >
                    <option value="todos">Todos os Clientes</option>
                    {clientesUnicos.map(cliente => (
                      <option key={cliente} value={cliente}>{cliente}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por avaliação */}
                <div className="flex items-center gap-3">
                  <Star size={16} className="text-slate-500 dark:text-slate-400" />
                  <select
                    value={filtroAvaliacao}
                    onChange={(e) => setFiltroAvaliacao(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-700 rounded-xl p-3 border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                  >
                    <option value="todas">Todas as Avaliações</option>
                    <option value="5">5 Estrelas</option>
                    <option value="4+">4+ Estrelas</option>
                  </select>
                </div>

                {/* Filtro por período */}
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-slate-500 dark:text-slate-400" />
                  <select
                    value={filtroPeriodo}
                    onChange={(e) => setFiltroPeriodo(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-700 rounded-xl p-3 border border-slate-200 dark:border-slate-600 focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                  >
                    <option value="todos">Todos os Períodos</option>
                    <option value="3meses">Últimos 3 Meses</option>
                    <option value="6meses">Últimos 6 Meses</option>
                    <option value="1ano">Último Ano</option>
                  </select>
                </div>

                {/* Botão de limpar filtros */}
                {filtrosAtivos && (
                  <button
                    onClick={limparFiltros}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Lista de projetos filtrados */}
          {projetosFiltrados.length === 0 ? (
            /* Empty State - Nenhum projeto no histórico */
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 md:p-16 border border-slate-200 dark:border-slate-700 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award size={40} className="text-green-600 dark:text-green-400" />
                </div>
                
                <h3 className="text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[28px] font-semibold leading-[36px] mb-3">
                  {filtrosAtivos ? 'Nenhum Projeto Encontrado' : 'Nenhum Projeto Concluído'}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
                  {filtrosAtivos 
                    ? 'Não encontramos projetos que correspondam aos filtros aplicados. Tente ajustar os critérios de busca.'
                    : 'Você ainda não possui projetos concluídos. Quando finalizar um projeto, ele aparecerá aqui com todas as avaliações e métricas.'
                  }
                </p>
                
                {filtrosAtivos && (
                  <button
                    onClick={limparFiltros}
                    className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-['Kumbh_Sans',sans-serif] text-[15px] font-semibold"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Lista de projetos */
            <>
              {projetosFiltrados.map((projeto) => (
                <div
                  key={projeto.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Informações do Projeto */}
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Informações principais */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px] mb-1">
                              {projeto.nome}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[16px] font-medium leading-[20px] mb-2">
                              {projeto.cliente}
                            </p>
                            <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px]">
                              <CheckCircle size={12} />
                              Concluído
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[15px] font-normal leading-[22px] mt-4">
                          {projeto.resumo}
                        </p>
                      </div>

                      {/* Estatísticas e datas */}
                      <div className="lg:w-80 flex-shrink-0 space-y-4">
                        {/* Datas */}
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-slate-500 dark:text-slate-400 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-slate-500 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px]">
                                Início
                              </p>
                              <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                                {projeto.dataInicio}
                              </p>
                            </div>
                          </div>
                          
                          <div className="h-px bg-slate-200 dark:bg-slate-600" />
                          
                          <div className="flex items-center gap-3">
                            <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-slate-500 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px]">
                                Conclusão
                              </p>
                              <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                                {projeto.dataConclusao}
                              </p>
                            </div>
                          </div>
                          
                          <div className="h-px bg-slate-200 dark:bg-slate-600" />
                          
                          <div className="flex items-center gap-3">
                            <Clock size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-slate-500 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px]">
                                Duração
                              </p>
                              <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                                {projeto.duracao}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Métricas */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3 text-center">
                            <p className="text-blue-600 dark:text-blue-400 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                              {projeto.tarefasConcluidas}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mt-1">
                              Tarefas
                            </p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3 text-center">
                            <p className="text-green-600 dark:text-green-400 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                              {projeto.satisfacao}%
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mt-1">
                              Satisfação
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botão Avaliar Projeto para Clientes */}
                  {!isDesigner && !projeto.avaliacaoCliente && !projeto.avaliacao && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-t border-slate-200 dark:border-slate-700 p-6 lg:p-8">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center text-2xl">
                            ⭐
                          </div>
                          <div>
                            <h4 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[18px] font-semibold leading-[22px] mb-1">
                              Avalie este projeto
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px]">
                              Conte-nos o que achou do resultado final
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalAvaliacao(projeto.id);
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-['Kumbh_Sans',sans-serif] text-[15px] font-semibold whitespace-nowrap"
                        >
                          <Star size={18} />
                          Avaliar Projeto
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Botão Avaliar Cliente para Designers */}
                  {isDesigner && !projeto.avaliacaoDesigner && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-t border-slate-200 dark:border-slate-700 p-6 lg:p-8">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-2xl">
                            💼
                          </div>
                          <div>
                            <h4 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[18px] font-semibold leading-[22px] mb-1">
                              Avalie este cliente
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px]">
                              Como foi trabalhar com esta empresa?
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirModalAvaliacao(projeto.id);
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-['Kumbh_Sans',sans-serif] text-[15px] font-semibold whitespace-nowrap"
                        >
                          <Star size={18} />
                          Avaliar Cliente
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Seção de Avaliação */}
                  {projeto.avaliacao && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t border-slate-200 dark:border-slate-700 p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-xl flex items-center justify-center">
                          <Star size={20} />
                        </div>
                        <h4 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                          Avaliação do Cliente
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Avaliação e Comentário */}
                        <div className="lg:col-span-2 space-y-4">
                          {/* Estrelas */}
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={24}
                                  className={
                                    star <= projeto.avaliacao?.estrelas
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-slate-300 dark:text-slate-600'
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-bold leading-[24px]">
                              {projeto.avaliacao?.estrelas}.0
                            </span>
                          </div>

                          {/* Comentário */}
                          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
                            <div className="flex items-start gap-3 mb-3">
                              <MessageSquare size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                              <div className="flex-1">
                                <p className="text-slate-700 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[15px] font-normal leading-[22px] italic">
                                  "{projeto.avaliacao?.comentario}"
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-600">
                              <div>
                                <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                                  {projeto.avaliacao?.nomeAvaliador}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                                  {projeto.avaliacao?.cargoAvaliador}
                                </p>
                              </div>
                              <p className="text-slate-500 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                                {projeto.avaliacao?.dataAvaliacao}
                              </p>
                            </div>
                          </div>

                          {/* Pontos Fortes */}
                          <div>
                            <p className="text-slate-700 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px] mb-3">
                              Pontos Fortes Destacados:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {projeto.avaliacao?.pontosFortes.map((ponto, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg font-['Kumbh_Sans',sans-serif] text-[13px] font-medium leading-[16px]"
                                >
                                  ✓ {ponto}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Impacto e Métricas */}
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
                              <p className="text-slate-700 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                                Impacto no Negócio
                              </p>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
                              {projeto.avaliacao?.impacto}
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-5 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-2">
                              <Award size={18} className="text-green-700 dark:text-green-400" />
                              <p className="text-green-800 dark:text-green-300 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                                Projeto Bem-Sucedido
                              </p>
                            </div>
                            <p className="text-green-700 dark:text-green-400 font-['Kumbh_Sans',sans-serif] text-[13px] font-normal leading-[18px]">
                              Cliente satisfeito e objetivos alcançados
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Projetos Arquivados */}
      {visualizacao === 'arquivados' && (
        <div className="space-y-6">
          {projetosArquivados.length === 0 ? (
            /* Empty State - Nenhum projeto arquivado */
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 md:p-16 border border-slate-200 dark:border-slate-700 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Archive size={40} className="text-slate-600 dark:text-slate-400" />
                </div>
                
                <h3 className="text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[28px] font-semibold leading-[36px] mb-3">
                  Nenhum Projeto Arquivado
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
                  Você no possui projetos arquivados no momento. Projetos arquivados aparecem aqui e podem ser restaurados ou excluídos permanentemente.
                </p>
              </div>
            </div>
          ) : (
            /* Lista de Projetos Arquivados */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projetosArquivados.map((projeto) => {
                const statusClasses = {
                  'Em Andamento': 'bg-blue-100 text-blue-700',
                  'Revisão': 'bg-yellow-100 text-yellow-700',
                  'Planejamento': 'bg-slate-100 text-slate-700',
                  'Concluído': 'bg-green-100 text-green-700'
                };

                return (
                  <div
                    key={projeto.id}
                    className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border-l-4 border-slate-400 dark:border-slate-500 border border-slate-300 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Badge Arquivado */}
                    <div className="mb-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px]">
                        <Archive size={12} />
                        Arquivado
                      </span>
                      <span className={`${statusClasses[projeto.status]} px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px]`}>
                        {projeto.status}
                      </span>
                    </div>

                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-slate-800 dark:text-slate-100 mb-1 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                        {projeto.nome}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                        {projeto.cliente}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px]">
                          Progresso Geral
                        </span>
                        <span className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">
                          {projeto.progresso}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-300 dark:bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-slate-500 dark:bg-slate-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${projeto.progresso}%` }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 mb-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <CheckCircle size={16} />
                        <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                          {projeto.tarefas.concluidas}/{projeto.tarefas.total} tarefas
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Clock size={16} />
                        <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                          {projeto.prazo}
                        </span>
                      </div>
                    </div>

                    {/* Ações */}
                    {isDesigner && (
                      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => handleDesarquivar(projeto.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
                        >
                          <RotateCcw size={16} />
                          Desarquivar
                        </button>
                        <button
                          onClick={() => handleExcluirDefinitivamente(projeto.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de Avaliação */}
      {modalAvaliacaoAberto && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${isDesigner ? 'from-purple-400 to-indigo-500' : 'from-amber-400 to-orange-500'} rounded-xl flex items-center justify-center text-white`}>
                  <Star size={20} />
                </div>
                <h3 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                  {isDesigner ? 'Avaliar Cliente' : 'Avaliar Projeto'}
                </h3>
              </div>
              <button
                onClick={fecharModalAvaliacao}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Seleção de Estrelas */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-3">
                  {isDesigner ? 'Como foi trabalhar com este cliente?' : 'Como você avalia este projeto?'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEstrelasAvaliacao(star)}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <Star
                        size={40}
                        className={
                          star <= estrelasAvaliacao
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-slate-300 dark:text-slate-600 hover:text-yellow-400'
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                    {estrelasAvaliacao}.0
                  </span>
                </div>
              </div>

              {/* Comentário */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-3">
                  {isDesigner ? 'Descreva sua experiência com este cliente *' : 'Conte-nos o que achou do projeto *'}
                </label>
                <textarea
                  value={comentarioAvaliacao}
                  onChange={(e) => setComentarioAvaliacao(e.target.value)}
                  placeholder={isDesigner 
                    ? "Como foi a comunicação? O cliente foi colaborativo? Recomendaria trabalhar com ele novamente?" 
                    : "Descreva sua experiência com o projeto, o que você mais gostou e como ele impactou seu negócio..."}
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] resize-none bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
                <p className="text-slate-500 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[13px] mt-2">
                  Mínimo de 10 caracteres
                </p>
              </div>

              {/* Informação */}
              <div className={`${isDesigner ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'} border rounded-xl p-4`}>
                <p className={`${isDesigner ? 'text-purple-800 dark:text-purple-300' : 'text-blue-800 dark:text-blue-300'} font-['Kumbh_Sans',sans-serif] text-[14px] leading-[20px]`}>
                  {isDesigner 
                    ? '💼 Sua avaliação ajuda outros designers a conhecerem melhor este cliente e melhora a experiência da comunidade.'
                    : '💡 Sua avaliação ajuda a melhorar nossos serviços e proporciona feedbacks valiosos para a equipe de design.'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={fecharModalAvaliacao}
                className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-['Kumbh_Sans',sans-serif] text-[15px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={enviarAvaliacao}
                className={`flex-1 px-6 py-3 ${isDesigner ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'} text-white rounded-xl hover:shadow-lg transition-all duration-300 font-['Kumbh_Sans',sans-serif] text-[15px] font-semibold`}
              >
                Enviar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}