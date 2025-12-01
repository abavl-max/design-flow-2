import React from 'react';
import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: Clock,
    label: 'Projetos em Andamento',
    value: '3',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: AlertCircle,
    label: 'Aguardando Feedback',
    value: '1',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    icon: CheckCircle,
    label: 'Feito Hoje',
    value: '2',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: TrendingUp,
    label: 'Progresso Geral',
    value: '52%',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
];

export function Stats() {
  return (
    <div className="mx-auto relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">{stat.label}</p>
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