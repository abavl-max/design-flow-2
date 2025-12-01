import React from 'react';
import { MessageCircle, Mail, Phone, BookOpen, HelpCircle, Send } from 'lucide-react';

const faqItems = [
  {
    pergunta: 'Como adicionar um novo projeto?',
    resposta: 'Para adicionar um novo projeto, vá até a página "Projetos" e clique no botão "Novo Projeto" no canto superior direito. Preencha as informações do projeto e do cliente.'
  },
  {
    pergunta: 'Como convido um cliente para visualizar o projeto?',
    resposta: 'Na página do projeto específico, clique em "Compartilhar" e insira o e-mail do seu cliente. Ele receberá um convite por e-mail com acesso direto ao painel do projeto.'
  },
  {
    pergunta: 'Posso personalizar as etapas do Kanban?',
    resposta: 'Sim! Acesse "Configurações" > "Personalização de Fluxo" para adicionar, remover ou renomear as colunas do seu Kanban de acordo com o seu processo de trabalho.'
  },
  {
    pergunta: 'Como gerar relatórios de progresso?',
    resposta: 'Os relatórios são gerados automaticamente com base nas atualizações que você faz em cada tarefa. Você também pode exportar relatórios detalhados em PDF ou Excel.'
  },
  {
    pergunta: 'Existe limite de projetos ou armazenamento?',
    resposta: 'O plano gratuito permite até 3 projetos ativos. Planos pagos oferecem projetos ilimitados e mais espaço de armazenamento para arquivos.'
  }
];

export function SuportePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-slate-800 font-['Maven_Pro',sans-serif] text-[40px] font-semibold leading-[48px]">
          Central de Suporte
        </h2>
        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[18px] font-normal leading-[24px]">
          Estamos aqui para ajudar você a aproveitar ao máximo o DesignFlow
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4">
            <MessageCircle size={24} />
          </div>
          <h4 className="text-slate-800 mb-2 font-['Kumbh_Sans',sans-serif] text-[18px] font-semibold leading-[24px]">
            Chat ao Vivo
          </h4>
          <p className="text-slate-600 mb-4 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
            Converse com nossa equipe em tempo real
          </p>
          <button className="text-blue-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] hover:text-blue-700 transition-colors">
            Iniciar Chat →
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h4 className="text-slate-800 mb-2 font-['Kumbh_Sans',sans-serif] text-[18px] font-semibold leading-[24px]">
            E-mail
          </h4>
          <p className="text-slate-600 mb-4 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
            Envie sua dúvida por e-mail
          </p>
          <a href="mailto:suporte@designflow.com" className="text-purple-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] hover:text-purple-700 transition-colors">
            suporte@designflow.com →
          </a>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center mb-4">
            <BookOpen size={24} />
          </div>
          <h4 className="text-slate-800 mb-2 font-['Kumbh_Sans',sans-serif] text-[18px] font-semibold leading-[24px]">
            Documentação
          </h4>
          <p className="text-slate-600 mb-4 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
            Guias e tutoriais completos
          </p>
          <button className="text-green-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] hover:text-green-700 transition-colors">
            Acessar Docs →
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <HelpCircle size={20} />
          </div>
          <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px]">
            Perguntas Frequentes
          </h3>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details
              key={index}
              className="group bg-slate-50 rounded-xl p-5 hover:bg-slate-100 transition-colors"
            >
              <summary className="flex items-center justify-between font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[24px] text-slate-800 cursor-pointer list-none">
                {item.pergunta}
                <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
                {item.resposta}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200">
        <h3 className="text-slate-800 mb-2 font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px]">
          Ainda precisa de ajuda?
        </h3>
        <p className="text-slate-600 mb-6 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
          Envie sua dúvida ou sugestão e responderemos em até 24 horas
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] uppercase">
              Assunto
            </label>
            <input
              type="text"
              placeholder="Digite o assunto da sua mensagem"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] uppercase">
              Mensagem
            </label>
            <textarea
              rows={6}
              placeholder="Descreva sua dúvida ou sugestão..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] resize-none"
            />
          </div>

          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg flex items-center gap-2 font-['Kumbh_Sans',sans-serif] text-[18px] font-semibold leading-[20px]">
            <Send size={20} />
            Enviar Mensagem
          </button>
        </div>
      </div>
    </div>
  );
}
