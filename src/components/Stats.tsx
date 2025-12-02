import React from 'react';
import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useProjects } from '../contexts/ProjectsContext';

export function Stats() {
  const { projetos } = useProjects();
  
  // Garante que projetos é sempre um array
  const projetosArray = projetos || [];
  
  // Filtra apenas projetos não arquivados
  const projetosAtivos = projetosArray.filter(p => !p.arquivado);
  
  // Calcula estatísticas reais dos projetos
  const projetosEmAndamento = projetosAtivos.filter(p => p.status === 'Em Andamento').length;
  const aguardandoFeedback = projetosAtivos.filter(p => p.status === 'Revisão').length;
  
  // Calcula tarefas concluídas hoje baseado nas atividades
  const hoje = new Date().toLocaleDateString('pt-BR');
  const feitoHoje = projetosAtivos.reduce((total, projeto) => {
    if (projeto.atividades) {
      const atividadesHoje = projeto.atividades.filter(
        ativ => ativ.data === hoje && ativ.tipo === 'conclusao'
      );
      return total + atividadesHoje.length;
    }
    return total;
  }, 0);
  
  const progressoGeral = projetosAtivos.length > 0 
    ? Math.round(projetosAtivos.reduce((acc, p) => acc + p.progresso, 0) / projetosAtivos.length) 
    : 0;
  
  const stats = [
    {
      icon: Clock,
      label: 'Projetos em Andamento',
      value: projetosEmAndamento.toString(),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      icon: AlertCircle,
      label: 'Aguardando Feedback',
      value: aguardandoFeedback.toString(),
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900'
    },
    {
      icon: CheckCircle,
      label: 'Feito Hoje',
      value: feitoHoje.toString(),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      icon: TrendingUp,
      label: 'Progresso Geral',
      value: `${progressoGeral}%`,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    }
  ];

  return (
    <div className="mx-auto relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-transparent dark:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">{stat.label}</p>
                  <p className={`${stat.color} font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px]`}>{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}