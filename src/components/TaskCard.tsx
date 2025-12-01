import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: {
    title: string;
    meta: string;
    progress?: number;
    assignee?: string;
    priority?: 'high' | 'medium' | 'low';
  };
  columnColor: string;
}

export function TaskCard({ task, columnColor }: TaskCardProps) {
  const borderColors = {
    blue: 'border-l-blue-500',
    purple: 'border-l-purple-500',
    yellow: 'border-l-yellow-500',
    green: 'border-l-green-500'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-orange-100 text-orange-700',
    low: 'bg-blue-100 text-blue-700'
  };

  const priorityLabels = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      className={`group bg-white border border-slate-200 ${borderColors[columnColor]} border-l-4 p-4 rounded-xl shadow-sm`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-slate-800 mb-1 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px]">
            {task.title}
          </h4>
        </div>
        {task.priority && (
          <span className={`${priorityColors[task.priority]} font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px] px-2 py-1 rounded-full ml-2 flex-shrink-0`}>
            {priorityLabels[task.priority]}
          </span>
        )}
      </div>

      {task.progress !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[16px] text-slate-600">Progresso</span>
            <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px] text-slate-700">{task.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] text-slate-600">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{task.meta}</span>
        </div>
      </div>

      {task.assignee && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px]">
            {getInitials(task.assignee)}
          </div>
          <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] text-slate-600">{task.assignee}</span>
        </div>
      )}
    </div>
  );
}
