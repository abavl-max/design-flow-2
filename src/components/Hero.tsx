import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <header className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      
      <div className="relative py-12 md:py-20 px-4 md:px-5 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-4 md:mb-6">
          <Sparkles className="text-yellow-300" size={14} />
          <span className="text-white/90 font-['Kumbh_Sans',sans-serif] text-[12px] md:text-[14px] font-semibold leading-[16px]">Plataforma de Gestão de Design</span>
        </div>
        
        <h1 className="text-white mb-4 max-w-4xl mx-auto drop-shadow-lg font-['Maven_Pro',sans-serif] text-[28px] md:text-[48px] font-bold leading-tight md:leading-[58px]">
          DesignFlow: Transparência que Constrói Confiança.
        </h1>
        
        <p className="text-blue-100 mb-8 md:mb-12 max-w-3xl mx-auto font-['Kumbh_Sans',sans-serif] text-[16px] md:text-[18px] font-normal leading-[24px] px-2">
          Sua plataforma de acompanhamento de projetos de design que transforma o 
          processo em uma narrativa clara e verificável para o cliente.
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
          {['Kanban Intuitivo', 'Chat Integrado', 'Relatórios Automáticos', 'Timeline Visual'].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-white/90">
              <CheckCircle2 className="text-green-300" size={18} />
              <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px]">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
