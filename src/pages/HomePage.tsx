import React from 'react';
import { Stats } from '../components/Stats';
import { Clock, MessageCircle, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onProjectSelect: (projectId: number) => void;
  onNovoProjeto?: () => void;
}

const projetosAtivos = [
  {
    id: 1,
    nome: 'TechCorp - Identidade Visual',
    cliente: 'TechCorp Inc.',
    status: 'Em Andamento',
    progresso: 52,
    tarefas: { total: 4, concluidas: 1, emAndamento: 2 },
    prazo: '15/12/2025',
    diasRestantes: 18,
    ultimaAtualizacao: 'Há 2 horas',
    mensagensNovas: 3,
    cor: 'blue'
  },
  {
    id: 2,
    nome: 'E-commerce ModaStyle',
    cliente: 'ModaStyle Brasil',
    status: 'Em Andamento',
    progresso: 75,
    tarefas: { total: 8, concluidas: 6, emAndamento: 1 },
    prazo: '10/12/2025',
    diasRestantes: 13,
    ultimaAtualizacao: 'Há 5 horas',
    mensagensNovas: 1,
    cor: 'purple'
  },
  {
    id: 3,
    nome: 'App Mobile FitTracker',
    cliente: 'FitTracker Solutions',
    status: 'Revisão',
    progresso: 90,
    tarefas: { total: 12, concluidas: 11, emAndamento: 1 },
    prazo: '05/12/2025',
    diasRestantes: 8,
    ultimaAtualizacao: 'Há 1 dia',
    mensagensNovas: 5,
    cor: 'green'
  },
  {
    id: 4,
    nome: 'Landing Page Startup AI',
    cliente: 'AI Innovations',
    status: 'Planejamento',
    progresso: 15,
    tarefas: { total: 6, concluidas: 1, emAndamento: 0 },
    prazo: '20/12/2025',
    diasRestantes: 23,
    ultimaAtualizacao: 'Há 3 horas',
    mensagensNovas: 0,
    cor: 'orange'
  }
];

export function HomePage({ onProjectSelect, onNovoProjeto }: HomePageProps) {
  const { isDesigner } = useAuth();
  
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="mb-2 text-slate-800 font-['Maven_Pro',sans-serif] text-[24px] md:text-[32px] font-semibold leading-tight">
          Painel de Projetos Ativos
        </h2>
        <p className="text-slate-600 max-w-2xl font-['Kumbh_Sans',sans-serif] text-[16px] md:text-[18px] font-normal leading-[24px]">
          Acompanhe o progresso de todos os seus projetos em tempo real
        </p>
      </div>
      
      <Stats />

      {/* Lista de Projetos Ativos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {projetosAtivos.map((projeto) => {
          const statusClasses = {
            'Em Andamento': 'bg-blue-100 text-blue-700',
            'Revisão': 'bg-yellow-100 text-yellow-700',
            'Planejamento': 'bg-slate-100 text-slate-700'
          };

          const isPrazoProximo = projeto.diasRestantes <= 10;

          return (
            <div
              key={projeto.id}
              onClick={() => onProjectSelect(projeto.id)}
              className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                <div className="flex-1">
                  <h3 className="text-slate-800 mb-1 font-['Kumbh_Sans',sans-serif] text-[18px] md:text-[20px] font-semibold leading-[24px]">
                    {projeto.nome}
                  </h3>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[13px] md:text-[14px] font-normal leading-[16px]">
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

              {/* Tasks Summary */}
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
                <div className="bg-green-50 rounded-lg p-2 md:p-3 border border-green-200">
                  <div className="flex items-center gap-1 md:gap-2 mb-1">
                    <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                    <span className="text-green-700 font-['Kumbh_Sans',sans-serif] text-[11px] md:text-[12px] font-semibold leading-tight">
                      Concluídas
                    </span>
                  </div>
                  <p className="text-green-800 font-['Kumbh_Sans',sans-serif] text-[18px] md:text-[20px] font-bold leading-[24px]">
                    {projeto.tarefas.concluidas}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-2 md:p-3 border border-blue-200">
                  <div className="flex items-center gap-1 md:gap-2 mb-1">
                    <TrendingUp size={14} className="text-blue-600 flex-shrink-0" />
                    <span className="text-blue-700 font-['Kumbh_Sans',sans-serif] text-[11px] md:text-[12px] font-semibold leading-tight">
                      Progresso
                    </span>
                  </div>
                  <p className="text-blue-800 font-['Kumbh_Sans',sans-serif] text-[18px] md:text-[20px] font-bold leading-[24px]">
                    {projeto.tarefas.emAndamento}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-2 md:p-3 border border-slate-200">
                  <div className="flex items-center gap-1 md:gap-2 mb-1">
                    <CheckCircle size={14} className="text-slate-600 flex-shrink-0" />
                    <span className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[11px] md:text-[12px] font-semibold leading-tight">
                      Total
                    </span>
                  </div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[18px] md:text-[20px] font-bold leading-[24px]">
                    {projeto.tarefas.total}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 ${isPrazoProximo ? 'text-orange-600' : 'text-slate-600'}`}>
                    {isPrazoProximo && <AlertCircle size={16} />}
                    {!isPrazoProximo && <Clock size={16} />}
                    <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                      {projeto.diasRestantes} dias
                    </span>
                  </div>
                  
                  {projeto.mensagensNovas > 0 && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <MessageCircle size={16} />
                      <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">
                        {projeto.mensagensNovas} {projeto.mensagensNovas === 1 ? 'nova' : 'novas'}
                      </span>
                    </div>
                  )}
                </div>

                <span className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                  {projeto.ultimaAtualizacao}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {isDesigner && (
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
              className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] whitespace-nowrap"
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