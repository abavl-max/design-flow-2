import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, FileText, Tag, AlertCircle } from 'lucide-react';
import { useProjects } from '../contexts/ProjectsContext';
import { useAuth } from '../contexts/AuthContext';

interface CriarProjetoPageProps {
  onBack: () => void;
  onProjetoCriado?: (projectId: number) => void;
}

export function CriarProjetoPage({ onBack, onProjetoCriado }: CriarProjetoPageProps) {
  const { adicionarProjeto } = useProjects();
  const { user } = useAuth();
  const [formulario, setFormulario] = useState({
    nome: '',
    cliente: '',
    descricao: '',
    prazo: '',
    prioridade: 'Média',
    orcamento: '',
    categoria: ''
  });

  const [erros, setErros] = useState<{[key: string]: string}>({});
  const [enviando, setEnviando] = useState(false);
  
  // Data mínima para o prazo (hoje)
  const dataMinima = new Date().toISOString().split('T')[0];

  const validarFormulario = () => {
    const novosErros: {[key: string]: string} = {};

    if (!formulario.nome.trim()) {
      novosErros.nome = 'Nome do projeto é obrigatório';
    }

    if (!formulario.cliente.trim()) {
      novosErros.cliente = 'Nome do cliente é obrigatório';
    }

    if (!formulario.descricao.trim()) {
      novosErros.descricao = 'Descrição do projeto é obrigatória';
    }

    if (!formulario.prazo) {
      novosErros.prazo = 'Prazo de entrega é obrigatório';
    }

    if (!formulario.categoria) {
      novosErros.categoria = 'Categoria do projeto é obrigatória';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);

    // Simulação de envio - em produção seria uma chamada à API
    setTimeout(() => {
      // Calcular dias restantes
      const hoje = new Date();
      const dataEntrega = new Date(formulario.prazo);
      const diasRestantes = Math.ceil((dataEntrega.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

      // Adicionar o projeto ao contexto
      const novoProjetoId = adicionarProjeto({
        nome: formulario.nome,
        cliente: formulario.cliente,
        descricao: formulario.descricao,
        dataInicio: new Date().toISOString().split('T')[0],
        dataEntrega: formulario.prazo,
        status: 'Em Andamento',
        progresso: 0,
        cor: '#007bff',
        criadoPor: user?.email || 'designer',
        tarefas: {
          concluidas: 0,
          emAndamento: 0,
          total: 0
        },
        diasRestantes: diasRestantes > 0 ? diasRestantes : 0,
        mensagensNovas: 0,
        ultimaAtualizacao: 'Agora',
        // Inicializa colunas vazias para o Kanban
        colunas: [
          {
            id: 'conceituacao',
            titulo: 'Em Conceituação',
            cor: 'bg-purple-500',
            tarefas: []
          },
          {
            id: 'andamento',
            titulo: 'Design em Andamento',
            cor: 'bg-blue-500',
            tarefas: []
          },
          {
            id: 'revisao',
            titulo: 'Revisão do Cliente',
            cor: 'bg-orange-500',
            tarefas: []
          },
          {
            id: 'concluido',
            titulo: 'Concluído',
            cor: 'bg-green-500',
            tarefas: []
          }
        ],
        // Inicializa mensagens vazias
        mensagens: [],
        atividades: []
      });

      console.log('Projeto criado:', formulario);
      console.log('CriarProjetoPage - ID do novo projeto:', novoProjetoId);
      setEnviando(false);
      
      // Callback de sucesso
      if (onProjetoCriado) {
        onProjetoCriado(novoProjetoId);
      }
      
      // Volta para a página anterior
      onBack();
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (erros[name]) {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros[name];
        return novosErros;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-4 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          
          <div>
            <h1 className="font-['Maven_Pro',sans-serif] text-[32px] font-bold leading-[40px] text-slate-900 mb-2">
              Criar Novo Projeto
            </h1>
            <p className="font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] text-slate-600">
              Preencha as informações abaixo para adicionar um novo projeto ao sistema
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8">
            <div className="space-y-6">
              {/* Nome do Projeto */}
              <div>
                <label htmlFor="nome" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                  Nome do Projeto *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formulario.nome}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] transition-all ${
                      erros.nome ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                    placeholder="Ex: Redesign Website Corporativo"
                  />
                </div>
                {erros.nome && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <AlertCircle size={14} />
                    <span className="font-['Kumbh_Sans',sans-serif] text-[12px]">{erros.nome}</span>
                  </div>
                )}
              </div>

              {/* Cliente */}
              <div>
                <label htmlFor="cliente" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                  Cliente *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    id="cliente"
                    name="cliente"
                    value={formulario.cliente}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] transition-all ${
                      erros.cliente ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                    placeholder="Ex: TechCorp Solutions"
                  />
                </div>
                {erros.cliente && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <AlertCircle size={14} />
                    <span className="font-['Kumbh_Sans',sans-serif] text-[12px]">{erros.cliente}</span>
                  </div>
                )}
              </div>

              {/* Categoria */}
              <div>
                <label htmlFor="categoria" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                  Categoria *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    id="categoria"
                    name="categoria"
                    value={formulario.categoria}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] transition-all ${
                      erros.categoria ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Web Design">Web Design</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Branding">Branding</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Identidade Visual">Identidade Visual</option>
                    <option value="Marketing Digital">Marketing Digital</option>
                  </select>
                </div>
                {erros.categoria && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <AlertCircle size={14} />
                    <span className="font-['Kumbh_Sans',sans-serif] text-[12px]">{erros.categoria}</span>
                  </div>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label htmlFor="descricao" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                  Descrição do Projeto *
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formulario.descricao}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] resize-none transition-all ${
                    erros.descricao ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                  placeholder="Descreva os objetivos e escopo do projeto..."
                />
                {erros.descricao && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <AlertCircle size={14} />
                    <span className="font-['Kumbh_Sans',sans-serif] text-[12px]">{erros.descricao}</span>
                  </div>
                )}
              </div>

              {/* Grid de 2 colunas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prazo */}
                <div>
                  <label htmlFor="prazo" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                    Prazo de Entrega *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="date"
                      id="prazo"
                      name="prazo"
                      value={formulario.prazo}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] transition-all ${
                        erros.prazo ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                      }`}
                      min={dataMinima}
                    />
                  </div>
                  {erros.prazo && (
                    <div className="flex items-center gap-1 mt-2 text-red-600">
                      <AlertCircle size={14} />
                      <span className="font-['Kumbh_Sans',sans-serif] text-[12px]">{erros.prazo}</span>
                    </div>
                  )}
                </div>

                {/* Prioridade */}
                <div>
                  <label htmlFor="prioridade" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                    Prioridade
                  </label>
                  <select
                    id="prioridade"
                    name="prioridade"
                    value={formulario.prioridade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] bg-white"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Orçamento */}
              <div>
                <label htmlFor="orcamento" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                  Orçamento (opcional)
                </label>
                <input
                  type="text"
                  id="orcamento"
                  name="orcamento"
                  value={formulario.orcamento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] bg-white"
                  placeholder="Ex: R$ 15.000,00"
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[15px] font-semibold"
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-['Kumbh_Sans',sans-serif] text-[15px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Criando...
                </>
              ) : (
                'Criar Projeto'
              )}
            </button>
          </div>

          {/* Nota de Campos Obrigatórios */}
          <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[13px] text-center">
            * Campos obrigatórios
          </p>
        </form>
      </div>
    </div>
  );
}