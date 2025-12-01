import React, { useState } from 'react';
import { FolderKanban, Clock, Users, CheckCircle, AlertCircle, Award, Calendar, Star, MessageSquare, TrendingUp, Search, Filter, X, FolderPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectsContext';

interface ProjetosPageProps {
  onProjectSelect?: (projectId: number) => void;
  onNovoProjeto?: () => void;
}

export function ProjetosPage({ onProjectSelect, onNovoProjeto }: ProjetosPageProps) {
  const { isDesigner } = useAuth();
  const { projetos: todosOsProjetos } = useProjects();
  
  // Filtra projetos ativos e concluídos
  const projetos = todosOsProjetos.filter(p => p.status !== 'Concluído');
  const projetosConcluidos = todosOsProjetos.filter(p => p.status === 'Concluído');
  
  const [visualizacao, setVisualizacao] = useState<'ativos' | 'historico'>('ativos');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('todos');
  const [filtroAvaliacao, setFiltroAvaliacao] = useState('todas');
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  const totalProjetosConcluidos = projetosConcluidos.length;
  const mediaAvaliacoes = totalProjetosConcluidos > 0 ? (projetosConcluidos.reduce((acc, p) => acc + (p.avaliacao?.estrelas || 5), 0) / totalProjetosConcluidos).toFixed(1) : '0.0';
  const totalTarefas = projetosConcluidos.reduce((acc, p) => acc + (p.tarefas?.concluidas || 0), 0);
  const mediaSatisfacao = totalProjetosConcluidos > 0 ? Math.round(projetosConcluidos.reduce((acc, p) => acc + (p.satisfacao || 100), 0) / totalProjetosConcluidos) : 0;
  
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
  
  return (
    <div className="space-y-8">
      {/* Header com botões de navegação */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="mb-2 text-slate-800 font-['Maven_Pro',sans-serif] text-[40px] font-semibold leading-[48px]">
            {visualizacao === 'ativos' ? 'Meus Projetos' : 'Histórico de Projetos'}
          </h2>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[18px] font-normal leading-[24px]">
            {visualizacao === 'ativos' 
              ? 'Selecione um projeto para visualizar detalhes e acompanhar o progresso'
              : 'Projetos concluídos com sucesso e avaliações dos clientes'
            }
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
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }
            `}
          >
            <FolderKanban size={20} />
            <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">
              Projetos Ativos
            </span>
          </button>
          
          <button
            onClick={() => setVisualizacao('historico')}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200
              ${visualizacao === 'historico'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
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
        </div>
      </div>

      {/* Stats Cards - Projetos Ativos */}
      {visualizacao === 'ativos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <FolderKanban size={20} />
            </div>
          </div>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Total de Projetos</p>
          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">{totalProjetosAtivos}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Em Andamento</p>
          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">{totalProjetosAtivos}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Próximo Prazo</p>
          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-bold leading-[24px]">{proximaDataEntrega.includes('/') ? proximaDataEntrega.substring(0, 5) : 'N/A'}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Clientes Ativos</p>
          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">{clientesAtivos}</p>
        </div>
        </div>
      )}

      {/* Stats Cards - Histórico */}
      {visualizacao === 'historico' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                <Star size={20} />
              </div>
            </div>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
              Avaliação Média
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
                {mediaAvaliacoes}
              </p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= parseFloat(mediaAvaliacoes) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300'}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
              Satisfação Média
            </p>
            <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
              {mediaSatisfacao}%
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
            </div>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
              Total de Tarefas
            </p>
            <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
              {totalTarefas}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
            </div>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
              Avaliações
            </p>
            <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
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
            <div className="bg-white rounded-2xl p-12 md:p-16 border border-slate-200 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FolderPlus size={40} className="text-blue-600" />
                </div>
                
                <h3 className="text-slate-800 font-['Maven_Pro',sans-serif] text-[28px] font-semibold leading-[36px] mb-3">
                  {isDesigner ? 'Nenhum Projeto Ativo' : 'Nenhum Projeto Disponível'}
                </h3>
                
                <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] mb-8">
                  {isDesigner 
                    ? 'Você ainda não possui projetos ativos. Comece criando seu primeiro projeto para gerenciar suas tarefas no sistema Kanban.'
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
                    bg-white rounded-2xl p-6 border-l-4 border border-slate-200 
                    hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1
                    ${projeto.ativo ? 'ring-2 ring-blue-500 shadow-lg' : ''}
                  `}
                  style={{ borderLeftColor: projeto.ativo ? '#3b82f6' : undefined }}
                >
                  {projeto.ativo && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px]">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Projeto Atual
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-slate-800 mb-1 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                        {projeto.nome}
                      </h3>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
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
                        <span className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px]">
                          Progresso Geral
                        </span>
                        <span className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">
                          {projeto.progresso}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${projeto.progresso}%` }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-slate-600">
                        <CheckCircle size={16} />
                        <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                          {projeto.tarefas.concluidas}/{projeto.tarefas.total} tarefas
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
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
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                Filtros
              </h3>
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="text-slate-600 hover:text-slate-800"
              >
                {mostrarFiltros ? <X size={20} /> : <Filter size={20} />}
              </button>
            </div>
            {mostrarFiltros && (
              <div className="space-y-4 mt-4">
                {/* Busca por texto */}
                <div className="flex items-center gap-3">
                  <Search size={16} className="text-slate-500" />
                  <input
                    type="text"
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                    placeholder="Buscar por nome ou cliente"
                    className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Filtro por cliente */}
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-slate-500" />
                  <select
                    value={filtroCliente}
                    onChange={(e) => setFiltroCliente(e.target.value)}
                    className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="todos">Todos os Clientes</option>
                    {clientesUnicos.map(cliente => (
                      <option key={cliente} value={cliente}>{cliente}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por avaliação */}
                <div className="flex items-center gap-3">
                  <Star size={16} className="text-slate-500" />
                  <select
                    value={filtroAvaliacao}
                    onChange={(e) => setFiltroAvaliacao(e.target.value)}
                    className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="todas">Todas as Avaliações</option>
                    <option value="5">5 Estrelas</option>
                    <option value="4+">4+ Estrelas</option>
                  </select>
                </div>

                {/* Filtro por período */}
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-slate-500" />
                  <select
                    value={filtroPeriodo}
                    onChange={(e) => setFiltroPeriodo(e.target.value)}
                    className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
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
            <div className="bg-white rounded-2xl p-12 md:p-16 border border-slate-200 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award size={40} className="text-green-600" />
                </div>
                
                <h3 className="text-slate-800 font-['Maven_Pro',sans-serif] text-[28px] font-semibold leading-[36px] mb-3">
                  {filtrosAtivos ? 'Nenhum Projeto Encontrado' : 'Nenhum Projeto Concluído'}
                </h3>
                
                <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
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
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Informações do Projeto */}
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Informações principais */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px] mb-1">
                              {projeto.nome}
                            </h3>
                            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[16px] font-medium leading-[20px] mb-2">
                              {projeto.cliente}
                            </p>
                            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px]">
                              <CheckCircle size={12} />
                              Concluído
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[15px] font-normal leading-[22px] mt-4">
                          {projeto.resumo}
                        </p>
                      </div>

                      {/* Estatísticas e datas */}
                      <div className="lg:w-80 flex-shrink-0 space-y-4">
                        {/* Datas */}
                        <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-slate-500 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px]">
                                Início
                              </p>
                              <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                                {projeto.dataInicio}
                              </p>
                            </div>
                          </div>
                          
                          <div className="h-px bg-slate-200" />
                          
                          <div className="flex items-center gap-3">
                            <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px]">
                                Conclusão
                              </p>
                              <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                                {projeto.dataConclusao}
                              </p>
                            </div>
                          </div>
                          
                          <div className="h-px bg-slate-200" />
                          
                          <div className="flex items-center gap-3">
                            <Clock size={16} className="text-blue-600 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px]">
                                Duração
                              </p>
                              <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                                {projeto.duracao}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Métricas */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 rounded-xl p-3 text-center">
                            <p className="text-blue-600 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                              {projeto.tarefasConcluidas}
                            </p>
                            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mt-1">
                              Tarefas
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-xl p-3 text-center">
                            <p className="text-green-600 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                              {projeto.satisfacao}%
                            </p>
                            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mt-1">
                              Satisfação
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seção de Avaliação */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-slate-200 p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                        <Star size={20} />
                      </div>
                      <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
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
                                    : 'text-slate-300'
                                }
                              />
                            ))}
                          </div>
                          <span className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-bold leading-[24px]">
                            {projeto.avaliacao?.estrelas}.0
                          </span>
                        </div>

                        {/* Comentário */}
                        <div className="bg-white rounded-xl p-5 border border-slate-200">
                          <div className="flex items-start gap-3 mb-3">
                            <MessageSquare size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <p className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[15px] font-normal leading-[22px] italic">
                                "{projeto.avaliacao?.comentario}"
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div>
                              <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                                {projeto.avaliacao?.nomeAvaliador}
                              </p>
                              <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                                {projeto.avaliacao?.cargoAvaliador}
                              </p>
                            </div>
                            <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                              {projeto.avaliacao?.dataAvaliacao}
                            </p>
                          </div>
                        </div>

                        {/* Pontos Fortes */}
                        <div>
                          <p className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px] mb-3">
                            Pontos Fortes Destacados:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {projeto.avaliacao?.pontosFortes.map((ponto, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-['Kumbh_Sans',sans-serif] text-[13px] font-medium leading-[16px]"
                              >
                                ✓ {ponto}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Impacto e Métricas */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-5 border border-slate-200">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={18} className="text-green-600" />
                            <p className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                              Impacto no Negócio
                            </p>
                          </div>
                          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
                            {projeto.avaliacao?.impacto}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-5 border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Award size={18} className="text-green-700" />
                            <p className="text-green-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                              Projeto Bem-Sucedido
                            </p>
                          </div>
                          <p className="text-green-700 font-['Kumbh_Sans',sans-serif] text-[13px] font-normal leading-[18px]">
                            Cliente satisfeito e objetivos alcançados
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}