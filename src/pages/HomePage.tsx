import React, { useState } from 'react';
import { Stats } from '../components/Stats';
import { Clock, MessageCircle, CheckCircle, TrendingUp, AlertCircle, FolderPlus, Sparkles, Archive, Trash2, MoreVertical, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectsContext';

interface HomePageProps {
  onProjectSelect: (projectId: number) => void;
  onNovoProjeto?: () => void;
}

export function HomePage({ onProjectSelect, onNovoProjeto }: HomePageProps) {
  const { isDesigner } = useAuth();
  const { projetos, atualizarProjeto, removerProjeto } = useProjects();
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  
  // Garante que projetos é sempre um array
  const projetosArray = projetos || [];
  
  // Filtra apenas projetos em andamento e não arquivados para a home
  const projetosAtivos = projetosArray.filter(p => p.status === 'Em Andamento' && !p.arquivado);
  
  // Conta todos os projetos não arquivados (independente do status)
  const projetosNaoArquivados = projetosArray.filter(p => !p.arquivado);
  
  const handleArquivar = (e: React.MouseEvent, projetoId: number) => {
    e.stopPropagation(); // Impede que o clique abra o projeto
    setMenuAberto(null); // Fecha o menu
    if (window.confirm('Deseja arquivar este projeto? Você poderá acessá-lo novamente na seção de projetos arquivados.')) {
      atualizarProjeto(projetoId, { arquivado: true });
    }
  };

  const handleConcluir = (e: React.MouseEvent, projetoId: number) => {
    e.stopPropagation(); // Impede que o clique abra o projeto
    setMenuAberto(null); // Fecha o menu
    if (window.confirm('Deseja marcar este projeto como concluído? Ele será movido para o histórico.')) {
      const hoje = new Date();
      const dataFormatada = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
      
      atualizarProjeto(projetoId, { 
        status: 'Concluído',
        dataConclusao: dataFormatada,
        progresso: 100
      });
    }
  };

  const handleExcluir = (e: React.MouseEvent, projetoId: number) => {
    e.stopPropagation(); // Impede que o clique abra o projeto
    setMenuAberto(null); // Fecha o menu
    if (window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
      removerProjeto(projetoId);
    }
  };

  const toggleMenu = (e: React.MouseEvent, projetoId: number) => {
    e.stopPropagation(); // Impede que o clique abra o projeto
    setMenuAberto(menuAberto === projetoId ? null : projetoId);
  };
  
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="mb-2 text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[24px] md:text-[32px] font-semibold leading-tight">
          Painel de Projetos Ativos
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl font-['Kumbh_Sans',sans-serif] text-[16px] md:text-[18px] font-normal leading-[24px]">
          Acompanhe o progresso de todos os seus projetos em tempo real
        </p>
      </div>
      
      <Stats />

      {/* Empty State - Nenhum projeto */}
      {projetosAtivos.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 md:p-16 border border-slate-200 dark:border-slate-700 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FolderPlus size={40} className="text-blue-600 dark:text-blue-400" />
            </div>
            
            <h3 className="text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[28px] font-semibold leading-[36px] mb-3">
              {isDesigner ? 'Bem-vindo ao DesignFlow!' : 'Nenhum Projeto Ativo'}
            </h3>
            
            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] mb-8">
              {isDesigner 
                ? 'Comece criando seu primeiro projeto e convide clientes para acompanhar o progresso em tempo real através do sistema Kanban interativo.'
                : 'Você ainda não está participando de nenhum projeto. Aguarde seu designer criar um novo projeto e convidá-lo para acompanhar.'}
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
            
            {!isDesigner && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-6 mt-6">
                <p className="text-blue-800 dark:text-blue-300 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[20px]">
                  💡 Dica: Quando seu designer criar um projeto, você receberá acesso para visualizar o quadro Kanban e acompanhar todas as etapas do trabalho.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Lista de Projetos Ativos */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {projetosAtivos.map((projeto) => {
            const statusClasses = {
              'Em Andamento': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
              'Revisão': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
              'Planejamento': 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            };

            const isPrazoProximo = projeto.diasRestantes <= 10;

            return (
              <div
                key={projeto.id}
                onClick={() => onProjectSelect(projeto.id)}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 relative group"
              >
                {/* Menu de opções - canto superior direito */}
                {isDesigner && (
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      onClick={(e) => toggleMenu(e, projeto.id)}
                      title="Opções"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {/* Dropdown menu */}
                    {menuAberto === projeto.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 overflow-hidden">
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                          onClick={(e) => handleArquivar(e, projeto.id)}
                        >
                          <Archive size={16} />
                          <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-medium">Arquivar projeto</span>
                        </button>
                        <div className="border-t border-slate-100 dark:border-slate-700"></div>
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400"
                          onClick={(e) => handleConcluir(e, projeto.id)}
                        >
                          <CheckCircle2 size={16} />
                          <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-medium">Concluir projeto</span>
                        </button>
                        <div className="border-t border-slate-100 dark:border-slate-700"></div>
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400"
                          onClick={(e) => handleExcluir(e, projeto.id)}
                        >
                          <Trash2 size={16} />
                          <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-medium">Excluir projeto</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2 pr-10">
                  <div className="flex-1">
                    <h3 className="text-slate-800 dark:text-slate-100 mb-1 font-['Kumbh_Sans',sans-serif] text-[18px] md:text-[20px] font-semibold leading-[24px]">
                      {projeto.nome}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[13px] md:text-[14px] font-normal leading-[16px]">
                      {projeto.cliente}
                    </p>
                  </div>
                  <span className={`${statusClasses[projeto.status]} px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px] self-start`}>
                    {projeto.status}
                  </span>
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
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${projeto.progresso}%` }}
                    />
                  </div>
                </div>

                {/* Tasks Summary */}
                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2 md:p-3 border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-1 md:gap-2 mb-1">
                      <CheckCircle size={14} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-green-700 dark:text-green-300 font-['Kumbh_Sans',sans-serif] text-[11px] md:text-[12px] font-semibold leading-tight">
                        Concluídas
                      </span>
                    </div>
                    <p className="text-green-800 dark:text-green-200 font-['Kumbh_Sans',sans-serif] text-[18px] md:text-[20px] font-bold leading-[24px]">
                      {projeto.tarefas.concluidas}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2 md:p-3 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-1 md:gap-2 mb-1">
                      <TrendingUp size={14} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="text-blue-700 dark:text-blue-300 font-['Kumbh_Sans',sans-serif] text-[11px] md:text-[12px] font-semibold leading-tight">
                        Progresso
                      </span>
                    </div>
                    <p className="text-blue-800 dark:text-blue-200 font-['Kumbh_Sans',sans-serif] text-[18px] md:text-[20px] font-bold leading-[24px]">
                      {projeto.tarefas.emAndamento}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2 md:p-3 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-1 md:gap-2 mb-1">
                      <CheckCircle size={14} className="text-slate-600 dark:text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-['Kumbh_Sans',sans-serif] text-[11px] md:text-[12px] font-semibold leading-tight">
                        Total
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[18px] md:text-[20px] font-bold leading-[24px]">
                      {projeto.tarefas.total}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 ${isPrazoProximo ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {isPrazoProximo && <AlertCircle size={16} />}
                      {!isPrazoProximo && <Clock size={16} />}
                      <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                        {projeto.diasRestantes} dias
                      </span>
                    </div>
                    
                    {projeto.mensagensNovas > 0 && (
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <MessageCircle size={16} />
                        <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">
                          {projeto.mensagensNovas} {projeto.mensagensNovas === 1 ? 'nova' : 'novas'}
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="text-slate-500 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                    {projeto.ultimaAtualizacao}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      {isDesigner && projetosAtivos.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-2 font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px]">
                Pronto para começar um novo projeto?
              </h3>
              <p className="font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] opacity-90">
                Crie um novo projeto e convide seus clientes para acompanhar o progresso
              </p>
            </div>
            <button
              className="bg-white dark:bg-slate-100 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-white transition-colors font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] whitespace-nowrap"
              onClick={onNovoProjeto}
            >
              + Novo Projeto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}