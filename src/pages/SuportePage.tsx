import React from 'react';
import { MessageCircle, Mail, Phone, BookOpen, HelpCircle, Send } from 'lucide-react';

const faqItems = [
  {
    pergunta: 'Como adicionar um novo projeto?',
    resposta: 'Para adicionar um novo projeto, clique no botão "Novo Projeto" na sidebar ou na página de Projetos. Preencha o nome do projeto, selecione o cliente, defina o prazo e adicione a descrição. Você também pode adicionar colaboradores para trabalhar em grupo.'
  },
  {
    pergunta: 'Qual a diferença entre login de Designer e Cliente?',
    resposta: 'Designers têm acesso completo: podem criar projetos, editar tarefas no Kanban, adicionar colaboradores, gerar relatórios e acessar configurações. Clientes têm acesso limitado: podem apenas visualizar o Kanban do projeto e usar o chat integrado.'
  },
  {
    pergunta: 'Como funciona o sistema Kanban?',
    resposta: 'O Kanban organiza as tarefas em 4 colunas: A Fazer, Em Progresso, Revisão e Concluído. Designers podem arrastar e soltar cartões entre colunas, editar tarefas, adicionar descrições e prazos. Clientes visualizam em tempo real o andamento do projeto.'
  },
  {
    pergunta: 'Como adicionar colaboradores ao projeto?',
    resposta: 'Na página de detalhes do projeto, clique em "Adicionar Colaborador", selecione o designer desejado e defina o papel dele (Designer, Desenvolvedor, etc.). Todos os colaboradores podem editar o projeto e interagir no chat.'
  },
  {
    pergunta: 'Como funciona o sistema de avaliações?',
    resposta: 'Após concluir um projeto, clientes podem avaliar com estrelas (1-5) e deixar comentários. Designers também podem avaliar a experiência de trabalho com o cliente. Essas avaliações aparecem nos perfis e ajudam a construir reputação na plataforma.'
  },
  {
    pergunta: 'Posso usar o chat integrado?',
    resposta: 'Sim! Cada projeto tem um chat integrado onde designers, colaboradores e clientes podem conversar em tempo real. Isso mantém toda a comunicação centralizada e organizada dentro do projeto.'
  },
  {
    pergunta: 'Como funciona o modo noturno?',
    resposta: 'Vá em Configurações > Aparência e clique no ícone da lua para ativar o modo noturno. O tema será aplicado em toda a plataforma e suas preferências serão salvas automaticamente.'
  },
  {
    pergunta: 'Posso gerenciar minhas notificações?',
    resposta: 'Sim! Em Configurações > Notificações você pode ativar ou desativar: notificações por e-mail, notificações push, resumo semanal e alertas de mensagens de clientes. Personalize conforme sua preferência.'
  }
];

export function SuportePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[40px] font-semibold leading-[48px]">
          Central de Suporte
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[18px] font-normal leading-[24px]">
          Estamos aqui para ajudar você a aproveitar ao máximo o DesignFlow
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4">
            <MessageCircle size={24} />
          </div>
          <h4 className="text-slate-800 dark:text-slate-100 mb-2 font-['Kumbh_Sans',sans-serif] text-[18px] font-semibold leading-[24px]">
            Chat ao Vivo
          </h4>
          <p className="text-slate-600 dark:text-slate-400 mb-4 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
            Converse com nossa equipe em tempo real
          </p>
          <button className="text-blue-600 dark:text-blue-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            Iniciar Chat →
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
          <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h4 className="text-slate-800 dark:text-slate-100 mb-2 font-['Kumbh_Sans',sans-serif] text-[18px] font-semibold leading-[24px]">
            E-mail
          </h4>
          <p className="text-slate-600 dark:text-slate-400 mb-4 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
            Envie sua dúvida por e-mail
          </p>
          <a href="mailto:suporte@designflow.com" className="text-purple-600 dark:text-purple-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            suporte@designflow.com →
          </a>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border border-green-200 dark:border-green-700">
          <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center mb-4">
            <BookOpen size={24} />
          </div>
          <h4 className="text-slate-800 dark:text-slate-100 mb-2 font-['Kumbh_Sans',sans-serif] text-[18px] font-semibold leading-[24px]">
            Documentação
          </h4>
          <p className="text-slate-600 dark:text-slate-400 mb-4 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
            Guias e tutoriais completos
          </p>
          <button className="text-green-600 dark:text-green-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] hover:text-green-700 dark:hover:text-green-300 transition-colors">
            Acessar Docs →
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <HelpCircle size={20} />
          </div>
          <h3 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px]">
            Perguntas Frequentes
          </h3>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details
              key={index}
              className="group bg-slate-50 dark:bg-slate-700 rounded-xl p-5 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              <summary className="flex items-center justify-between font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[24px] text-slate-800 dark:text-slate-100 cursor-pointer list-none">
                {item.pergunta}
                <span className="text-blue-600 dark:text-blue-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
                {item.resposta}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
        <h3 className="text-slate-800 dark:text-slate-100 mb-2 font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px]">
          Ainda precisa de ajuda?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
          Envie sua dúvida ou sugestão e responderemos em até 24 horas
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] uppercase">
              Assunto
            </label>
            <input
              type="text"
              placeholder="Digite o assunto da sua mensagem"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-2 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] uppercase">
              Mensagem
            </label>
            <textarea
              rows={6}
              placeholder="Descreva sua dúvida ou sugestão..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] resize-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
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