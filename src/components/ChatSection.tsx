import React from 'react';
import { MessageCircle, Paperclip, Send, Clock } from 'lucide-react';

export function ChatSection() {
  return (
    <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 p-3 rounded-xl text-white">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="text-slate-800 mb-1 font-['Kumbh_Sans',sans-serif] text-[18px] font-semibold leading-[24px]">
                Detalhes e Comunicação: Wireframes da Home Page
              </h3>
              <div className="flex flex-wrap items-center gap-3 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                  Em Andamento (80%)
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">
                  <strong className="font-semibold">Designer:</strong> Ana Designer
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px] text-slate-600">
            <Clock size={16} />
            <span>4h30min</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
        {/* Designer Message */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px]">
              AD
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">Ana Designer</span>
              <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] text-slate-500">11:00h</span>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-5 rounded-2xl rounded-tl-none">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-100 text-blue-700 font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px] px-2.5 py-1 rounded-full">
                  Relatório de Desempenho
                </div>
              </div>
              <ul className="space-y-3 text-slate-700 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
                <li className="flex gap-3">
                  <span className="text-blue-600 flex-shrink-0">✓</span>
                  <div>
                    <strong className="text-slate-800 font-semibold">O que foi feito?</strong>
                    <p className="mt-1">Finalizei a estrutura de navegação e 3 layouts de wireframe mobile.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 flex-shrink-0">✓</span>
                  <div>
                    <strong className="text-slate-800 font-semibold">O que mudou?</strong>
                    <p className="mt-1">Arquivo Figma 1.1 anexado ao cartão.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 flex-shrink-0">→</span>
                  <div>
                    <strong className="text-slate-800 font-semibold">Próximo Passo?</strong>
                    <p className="mt-1">Iniciar a estruturação do desktop após o almoço.</p>
                  </div>
                </li>
              </ul>
              <div className="mt-4 pt-3 border-t border-blue-200">
                <div className="flex items-center gap-2 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px] text-blue-700">
                  <Paperclip size={16} />
                  <span>wireframe_mobile_v1.1.fig</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Message */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px]">
              JC
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">João Cliente</span>
              <span className="font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px] text-slate-500">11:15h</span>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-2xl rounded-tl-none">
              <p className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
                Obrigado pela atualização, Ana! Ótimo ver que a versão mobile já está estruturada. 🎉
              </p>
            </div>
          </div>
        </div>

        {/* New message indicator */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px] px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            Aguardando novo relatório do designer...
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-50 p-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <Paperclip className="text-slate-600" size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]"
          />
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg flex items-center gap-2 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px]">
            <Send size={18} />
            <span>Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
