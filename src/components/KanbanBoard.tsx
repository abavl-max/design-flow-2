import React from 'react';
import { TaskCard } from './TaskCard';
import { Circle, Clock, Eye, CheckCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  meta: string;
  progress?: number;
  assignee?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface Column {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  count: number;
  tasks: Task[];
}

const columns: Column[] = [
  {
    id: '1',
    title: 'Em Conceituação',
    icon: Circle,
    color: 'blue',
    count: 1,
    tasks: [
      {
        id: '1-1',
        title: 'Definição do Público-Alvo',
        meta: 'Progresso: 100% | Tempo: 2h',
        progress: 100,
        assignee: 'Ana Designer',
        priority: 'high'
      }
    ]
  },
  {
    id: '2',
    title: 'Design em Andamento',
    icon: Clock,
    color: 'purple',
    count: 2,
    tasks: [
      {
        id: '2-1',
        title: 'Wireframes da Home Page',
        meta: 'Progresso: 80% | Tempo: 4h30min',
        progress: 80,
        assignee: 'Ana Designer',
        priority: 'high'
      },
      {
        id: '2-2',
        title: 'Criação da Paleta de Cores',
        meta: 'Progresso: 30% | Tempo: 1h',
        progress: 30,
        assignee: 'Carlos Design',
        priority: 'medium'
      }
    ]
  },
  {
    id: '3',
    title: 'Revisão do Cliente',
    icon: Eye,
    color: 'yellow',
    count: 1,
    tasks: [
      {
        id: '3-1',
        title: 'Proposta de 3 Logos Iniciais',
        meta: 'Aguardando feedback',
        assignee: 'Ana Designer',
        priority: 'high'
      }
    ]
  },
  {
    id: '4',
    title: 'Concluído',
    icon: CheckCircle,
    color: 'green',
    count: 1,
    tasks: [
      {
        id: '4-1',
        title: 'Briefing Formalizado',
        meta: 'Finalizado em 26/11',
        progress: 100,
        assignee: 'Ana Designer',
        priority: 'medium'
      }
    ]
  }
];

export function KanbanBoard() {
  return (
    <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
      {columns.map((column) => {
        const Icon = column.icon;
        const colorClasses = {
          blue: 'bg-blue-50 border-blue-200 text-blue-700',
          purple: 'bg-purple-50 border-purple-200 text-purple-700',
          yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
          green: 'bg-green-50 border-green-200 text-green-700'
        };
        
        return (
          <div 
            key={column.id}
            className="bg-slate-50/50 backdrop-blur-sm rounded-2xl min-w-[320px] p-5 flex-shrink-0 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className={`${colorClasses[column.color]} p-2 rounded-lg border`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px]">{column.title}</div>
                </div>
              </div>
              <div className="bg-slate-200 text-slate-700 font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px] px-2.5 py-1 rounded-full">
                {column.count}
              </div>
            </div>
            
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} columnColor={column.color} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
