import React, { useState } from 'react';
import { FolderKanban, Clock, Users, CheckCircle, AlertCircle, Award, Calendar, Star, MessageSquare, TrendingUp, Search, Filter, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const projetos = [
  {
    id: 1,
    nome: 'TechCorp - Identidade Visual',
    cliente: 'TechCorp Inc.',
    status: 'Em Andamento',
    progresso: 52,
    tarefas: { total: 4, concluidas: 1 },
    prazo: '15/12/2025',
    cor: 'blue',
    ativo: true
  },
  {
    id: 2,
    nome: 'E-commerce ModaStyle',
    cliente: 'ModaStyle Brasil',
    status: 'Em Andamento',
    progresso: 75,
    tarefas: { total: 8, concluidas: 6 },
    prazo: '10/12/2025',
    cor: 'purple',
    ativo: false
  },
  {
    id: 3,
    nome: 'App Mobile FitTracker',
    cliente: 'FitTracker Solutions',
    status: 'Revisão',
    progresso: 90,
    tarefas: { total: 12, concluidas: 11 },
    prazo: '05/12/2025',
    cor: 'green',
    ativo: false
  },
  {
    id: 4,
    nome: 'Landing Page Startup AI',
    cliente: 'AI Innovations',
    status: 'Planejamento',
    progresso: 15,
    tarefas: { total: 6, concluidas: 1 },
    prazo: '20/12/2025',
    cor: 'orange',
    ativo: false
  }
];

const projetosConcluidos = [
  {
    id: 5,
    nome: 'Redesign Portal Corporativo',
    cliente: 'Empresa Global Tech',
    resumo: 'Redesign completo do portal interno incluindo nova identidade visual, sistema de design components, e implementação responsiva para todos os dispositivos.',
    dataInicio: '15/08/2024',
    dataConclusao: '10/11/2024',
    duracao: '3 meses',
    tarefasConcluidas: 28,
    satisfacao: 98,
    avaliacao: {
      estrelas: 5,
      comentario: 'Trabalho excepcional! O novo portal superou todas as nossas expectativas. A equipe demonstrou profissionalismo e atenção aos detalhes em todas as etapas do projeto.',
      nomeAvaliador: 'Carlos Mendes',
      cargoAvaliador: 'Diretor de TI',
      dataAvaliacao: '12/11/2024',
      pontosFortes: ['Comunicação excelente', 'Entrega no prazo', 'Qualidade do design', 'Suporte pós-entrega'],
      impacto: 'Aumento de 45% na satisfação dos usuários internos'
    }
  },
  {
    id: 6,
    nome: 'App Delivery FoodExpress',
    cliente: 'FoodExpress Ltda',
    resumo: 'Desenvolvimento de interface completa para aplicativo de delivery, incluindo fluxos de pedido, rastreamento em tempo real, e sistema de avaliações.',
    dataInicio: '01/06/2024',
    dataConclusao: '30/08/2024',
    duracao: '3 meses',
    tarefasConcluidas: 35,
    satisfacao: 100,
    avaliacao: {
      estrelas: 5,
      comentario: 'Projeto impecável do início ao fim! A interface ficou intuitiva e moderna. Os usuários adoraram a experiência de uso e já vimos aumento significativo nas conversões.',
      nomeAvaliador: 'Marina Silva',
      cargoAvaliador: 'CEO',
      dataAvaliacao: '02/09/2024',
      pontosFortes: ['Design inovador', 'UX excepcional', 'Iterações rápidas', 'Proatividade'],
      impacto: 'Crescimento de 60% nas vendas via app no primeiro mês'
    }
  },
  {
    id: 7,
    nome: 'Branding Café Artesanal',
    cliente: 'Café do Vale',
    resumo: 'Criação de identidade visual completa, incluindo logotipo, paleta de cores, tipografia, embalagens, e materiais de comunicação para rede de cafeterias.',
    dataInicio: '10/09/2024',
    dataConclusao: '25/10/2024',
    duracao: '1.5 meses',
    tarefasConcluidas: 18,
    satisfacao: 95,
    avaliacao: {
      estrelas: 5,
      comentario: 'A nova identidade visual capturou perfeitamente a essência da nossa marca. As embalagens estão lindas e recebemos inúmeros elogios dos clientes. Recomendo muito!',
      nomeAvaliador: 'Roberto Costa',
      cargoAvaliador: 'Proprietário',
      dataAvaliacao: '27/10/2024',
      pontosFortes: ['Criatividade', 'Alinhamento com a marca', 'Flexibilidade', 'Atenção ao feedback'],
      impacto: 'Reconhecimento da marca aumentou em 35% na região'
    }
  },
  {
    id: 8,
    nome: 'Dashboard Analytics Pro',
    cliente: 'DataVision Analytics',
    resumo: 'Interface de dashboard para visualização de dados corporativos com gráficos interativos, filtros avançados, e exportação de relatórios customizados.',
    dataInicio: '05/07/2024',
    dataConclusao: '20/09/2024',
    duracao: '2.5 meses',
    tarefasConcluidas: 24,
    satisfacao: 97,
    avaliacao: {
      estrelas: 5,
      comentario: 'Dashboard extremamente funcional e visualmente atraente. A usabilidade ficou excelente e nossos clientes conseguem navegar facilmente pelos dados complexos.',
      nomeAvaliador: 'Ana Paula Rodrigues',
      cargoAvaliador: 'Head de Produto',
      dataAvaliacao: '22/09/2024',
      pontosFortes: ['Organização', 'Pensamento analítico', 'Resolução de problemas', 'Iteração baseada em feedback'],
      impacto: 'Redução de 50% no tempo de análise de dados pelos usuários'
    }
  },
  {
    id: 9,
    nome: 'Site Institucional Consultoria',
    cliente: 'Excelência Consultoria',
    resumo: 'Website institucional moderno com CMS integrado, seções de blog, portfólio de cases, formulários de contato, e otimização SEO completa.',
    dataInicio: '20/05/2024',
    dataConclusao: '15/07/2024',
    duracao: '2 meses',
    tarefasConcluidas: 22,
    satisfacao: 94,
    avaliacao: {
      estrelas: 4,
      comentario: 'Ótimo trabalho no geral! O site ficou profissional e elegante. Tivemos alguns pequenos ajustes após a entrega, mas o suporte foi rápido em resolver. Muito satisfeitos com o resultado final.',
      nomeAvaliador: 'Fernando Oliveira',
      cargoAvaliador: 'Sócio-Diretor',
      dataAvaliacao: '18/07/2024',
      pontosFortes: ['Design clean', 'SEO bem implementado', 'Suporte ágil', 'Documentação clara'],
      impacto: 'Aumento de 80% no tráfego orgânico em 2 meses'
    }
  }
];

interface ProjetosPageProps {
  onProjectSelect?: (projectId: number) => void;
  onNovoProjeto?: () => void;
}

export function ProjetosPage({ onProjectSelect, onNovoProjeto }: ProjetosPageProps) {
  const { isDesigner } = useAuth();
  const [visualizacao, setVisualizacao] = useState<'ativos' | 'historico'>('ativos');
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('todos');
  const [filtroAvaliacao, setFiltroAvaliacao] = useState('todas');
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  const totalProjetosConcluidos = projetosConcluidos.length;
  const mediaAvaliacoes = (projetosConcluidos.reduce((acc, p) => acc + p.avaliacao.estrelas, 0) / totalProjetosConcluidos).toFixed(1);
  const totalTarefas = projetosConcluidos.reduce((acc, p) => acc + p.tarefasConcluidas, 0);
  const mediaSatisfacao = Math.round(projetosConcluidos.reduce((acc, p) => acc + p.satisfacao, 0) / totalProjetosConcluidos);
  
  // Função para obter todos os clientes únicos
  const clientesUnicos = Array.from(new Set(projetosConcluidos.map(p => p.cliente)));
  
  // Função de filtragem
  const projetosFiltrados = projetosConcluidos.filter(projeto => {
    // Filtro de busca por texto
    if (buscaTexto && !projeto.nome.toLowerCase().includes(buscaTexto.toLowerCase()) && !projeto.cliente.toLowerCase().includes(buscaTexto.toLowerCase())) {
      return false;
    }
    
    // Filtro por cliente
    if (filtroCliente !== 'todos' && projeto.cliente !== filtroCliente) {
      return false;
    }
    
    // Filtro por avaliação
    if (filtroAvaliacao !== 'todas') {
      if (filtroAvaliacao === '5' && projeto.avaliacao.estrelas !== 5) return false;
      if (filtroAvaliacao === '4+' && projeto.avaliacao.estrelas < 4) return false;
    }
    
    // Filtro por período
    if (filtroPeriodo !== 'todos') {
      const dataConclusão = new Date(projeto.dataConclusao.split('/').reverse().join('-'));
      const hoje = new Date();
      const diffMeses = (hoje.getFullYear() - dataConclusão.getFullYear()) * 12 + (hoje.getMonth() - dataConclusão.getMonth());
      
      if (filtroPeriodo === '3meses' && diffMeses > 3) return false;
      if (filtroPeriodo === '6meses' && diffMeses > 6) return false;
      if (filtroPeriodo === '1ano' && diffMeses > 12) return false;
    }
    
    return true;
  });
  
  const limparFiltros = () => {
    setBuscaTexto('');
    setFiltroCliente('todos');
    setFiltroAvaliacao('todas');
    setFiltroPeriodo('todos');
  };
  
  const filtrosAtivos = buscaTexto || filtroCliente !== 'todos' || filtroAvaliacao !== 'todas' || filtroPeriodo !== 'todos';
  
  return (
    <div className="space-y-8">
      {/* Header com botões de navegação */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="mb-2 text-slate-800 font-['Maven_Pro',sans-serif] text-[40px] font-semibold leading-[48px]">
            {visualizacao === 'ativos' ? 'Meus Projetos' : 'Histórico de Projetos'}
          </h2>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[18px] font-normal leading-[24px]">
            {visualizacao === 'ativos' 
              ? 'Selecione um projeto para visualizar detalhes e acompanhar o progresso'
              : 'Projetos concluídos com sucesso e avaliações dos clientes'
            }
          </p>
        </div>
        
        {/* Botão de alternância */}
        <div className="flex gap-3">
          <button
            onClick={() => setVisualizacao('ativos')}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200
              ${visualizacao === 'ativos'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }
            `}
          >
            <FolderKanban size={20} />
            <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">
              Projetos Ativos
            </span>
          </button>
          
          <button
            onClick={() => setVisualizacao('historico')}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200
              ${visualizacao === 'historico'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }
            `}
          >
            <Award size={20} />
            <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">
              Histórico
            </span>
            <span className={`
              px-2 py-0.5 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-bold
              ${visualizacao === 'historico' ? 'bg-green-700' : 'bg-blue-100 text-blue-700'}
            `}>
              {totalProjetosConcluidos}
            </span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Projetos Ativos */}
      {visualizacao === 'ativos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <FolderKanban size={20} />
            </div>
          </div>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Total de Projetos</p>
          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">4</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Em Andamento</p>
          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">2</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Próximo Prazo</p>
          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-bold leading-[24px]">05/12</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">Clientes Ativos</p>
          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">4</p>
        </div>
        </div>
      )}

      {/* Stats Cards - Histórico */}
      {visualizacao === 'historico' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                <Star size={20} />
              </div>
            </div>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
              Avaliação Média
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
                {mediaAvaliacoes}
              </p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= parseFloat(mediaAvaliacoes) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300'}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
              Satisfação Média
            </p>
            <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
              {mediaSatisfacao}%
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
            </div>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
              Total de Tarefas
            </p>
            <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
              {totalTarefas}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
            </div>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-medium leading-[16px] mb-1">
              Avaliações
            </p>
            <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px]">
              {totalProjetosConcluidos}
            </p>
          </div>
        </div>
      )}

      {/* Projects List - Projetos Ativos */}
      {visualizacao === 'ativos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projetos.map((projeto) => {
          const corClasses = {
            blue: 'border-blue-500 bg-blue-50',
            purple: 'border-purple-500 bg-purple-50',
            green: 'border-green-500 bg-green-50',
            orange: 'border-orange-500 bg-orange-50'
          };

          const statusClasses = {
            'Em Andamento': 'bg-blue-100 text-blue-700',
            'Revisão': 'bg-yellow-100 text-yellow-700',
            'Planejamento': 'bg-slate-100 text-slate-700'
          };

          return (
            <div
              key={projeto.id}
              onClick={() => onProjectSelect?.(projeto.id)}
              className={`
                bg-white rounded-2xl p-6 border-l-4 border border-slate-200 
                hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1
                ${projeto.ativo ? 'ring-2 ring-blue-500 shadow-lg' : ''}
              `}
              style={{ borderLeftColor: projeto.ativo ? '#3b82f6' : undefined }}
            >
              {projeto.ativo && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px]">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Projeto Atual
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-slate-800 mb-1 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    {projeto.nome}
                  </h3>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                    {projeto.cliente}
                  </p>
                </div>
                <span className={`${statusClasses[projeto.status]} px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px] ml-3`}>
                  {projeto.status}
                </span>
              </div>

              <div className="space-y-4">
                {/* Progress */}
                <div>
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

                {/* Info */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle size={16} />
                    <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                      {projeto.tarefas.concluidas}/{projeto.tarefas.total} tarefas
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock size={16} />
                    <span className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                      {projeto.prazo}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Botão Novo Projeto - Apenas para Designers */}
      {visualizacao === 'ativos' && isDesigner && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="mb-2 font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px]">
                Iniciar um novo projeto?
              </h3>
              <p className="font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] opacity-90">
                Crie um novo projeto e organize suas tarefas no sistema Kanban
              </p>
            </div>
            <button
              onClick={onNovoProjeto}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] whitespace-nowrap"
            >
              + Novo Projeto
            </button>
          </div>
        </div>
      )}

      {/* Histórico - Projetos Concluídos */}
      {visualizacao === 'historico' && (
        <div className="space-y-8">
          {/* Filtros */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                Filtros
              </h3>
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="text-slate-600 hover:text-slate-800"
              >
                {mostrarFiltros ? <X size={20} /> : <Filter size={20} />}
              </button>
            </div>
            {mostrarFiltros && (
              <div className="space-y-4 mt-4">
                {/* Busca por texto */}
                <div className="flex items-center gap-3">
                  <Search size={16} className="text-slate-500" />
                  <input
                    type="text"
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                    placeholder="Buscar por nome ou cliente"
                    className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Filtro por cliente */}
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-slate-500" />
                  <select
                    value={filtroCliente}
                    onChange={(e) => setFiltroCliente(e.target.value)}
                    className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="todos">Todos os Clientes</option>
                    {clientesUnicos.map(cliente => (
                      <option key={cliente} value={cliente}>{cliente}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por avaliação */}
                <div className="flex items-center gap-3">
                  <Star size={16} className="text-slate-500" />
                  <select
                    value={filtroAvaliacao}
                    onChange={(e) => setFiltroAvaliacao(e.target.value)}
                    className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="todas">Todas as Avaliações</option>
                    <option value="5">5 Estrelas</option>
                    <option value="4+">4+ Estrelas</option>
                  </select>
                </div>

                {/* Filtro por período */}
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-slate-500" />
                  <select
                    value={filtroPeriodo}
                    onChange={(e) => setFiltroPeriodo(e.target.value)}
                    className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="todos">Todos os Períodos</option>
                    <option value="3meses">Últimos 3 Meses</option>
                    <option value="6meses">Últimos 6 Meses</option>
                    <option value="1ano">Último Ano</option>
                  </select>
                </div>

                {/* Botão de limpar filtros */}
                {filtrosAtivos && (
                  <button
                    onClick={limparFiltros}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Lista de projetos filtrados */}
          {projetosFiltrados.map((projeto) => (
            <div
              key={projeto.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Informações do Projeto */}
              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Informações principais */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-semibold leading-[28px] mb-1">
                          {projeto.nome}
                        </h3>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[16px] font-medium leading-[20px] mb-2">
                          {projeto.cliente}
                        </p>
                        <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[16px]">
                          <CheckCircle size={12} />
                          Concluído
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[15px] font-normal leading-[22px] mt-4">
                      {projeto.resumo}
                    </p>
                  </div>

                  {/* Estatísticas e datas */}
                  <div className="lg:w-80 flex-shrink-0 space-y-4">
                    {/* Datas */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-slate-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px]">
                            Início
                          </p>
                          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                            {projeto.dataInicio}
                          </p>
                        </div>
                      </div>
                      
                      <div className="h-px bg-slate-200" />
                      
                      <div className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px]">
                            Conclusão
                          </p>
                          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                            {projeto.dataConclusao}
                          </p>
                        </div>
                      </div>
                      
                      <div className="h-px bg-slate-200" />
                      
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-blue-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px]">
                            Duração
                          </p>
                          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                            {projeto.duracao}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-blue-600 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                          {projeto.tarefasConcluidas}
                        </p>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mt-1">
                          Tarefas
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <p className="text-green-600 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                          {projeto.satisfacao}%
                        </p>
                        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-medium leading-[14px] mt-1">
                          Satisfação
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de Avaliação */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-slate-200 p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                    <Star size={20} />
                  </div>
                  <h4 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
                    Avaliação do Cliente
                  </h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Avaliação e Comentário */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Estrelas */}
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={24}
                            className={
                              star <= projeto.avaliacao.estrelas
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-slate-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-bold leading-[24px]">
                        {projeto.avaliacao.estrelas}.0
                      </span>
                    </div>

                    {/* Comentário */}
                    <div className="bg-white rounded-xl p-5 border border-slate-200">
                      <div className="flex items-start gap-3 mb-3">
                        <MessageSquare size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[15px] font-normal leading-[22px] italic">
                            "{projeto.avaliacao.comentario}"
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                          <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                            {projeto.avaliacao.nomeAvaliador}
                          </p>
                          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                            {projeto.avaliacao.cargoAvaliador}
                          </p>
                        </div>
                        <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
                          {projeto.avaliacao.dataAvaliacao}
                        </p>
                      </div>
                    </div>

                    {/* Pontos Fortes */}
                    <div>
                      <p className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px] mb-3">
                        Pontos Fortes Destacados:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {projeto.avaliacao.pontosFortes.map((ponto, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-['Kumbh_Sans',sans-serif] text-[13px] font-medium leading-[16px]"
                          >
                            ✓ {ponto}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Impacto e Métricas */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-5 border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={18} className="text-green-600" />
                        <p className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                          Impacto no Negócio
                        </p>
                      </div>
                      <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px]">
                        {projeto.avaliacao.impacto}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-5 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award size={18} className="text-green-700" />
                        <p className="text-green-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[18px]">
                          Projeto Bem-Sucedido
                        </p>
                      </div>
                      <p className="text-green-700 font-['Kumbh_Sans',sans-serif] text-[13px] font-normal leading-[18px]">
                        Cliente satisfeito e objetivos alcançados
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}