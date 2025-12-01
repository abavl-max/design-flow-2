import React, { useState } from 'react';
import { User, Mail, Lock, Briefcase, Building, Phone, AlertCircle, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SignupPageProps {
  onSignupSuccess: () => void;
  onBackToLogin: () => void;
}

export function SignupPage({ onSignupSuccess, onBackToLogin }: SignupPageProps) {
  const { signup } = useAuth();
  const [tipoUsuario, setTipoUsuario] = useState<'designer' | 'cliente' | null>(null);
  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    empresa: '',
    cargo: '',
    especialidade: ''
  });

  const [erros, setErros] = useState<{[key: string]: string}>({});
  const [enviando, setEnviando] = useState(false);
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarFormulario = () => {
    const novosErros: {[key: string]: string} = {};

    if (!tipoUsuario) {
      novosErros.tipoUsuario = 'Selecione o tipo de usuário';
    }

    if (!formulario.nome.trim()) {
      novosErros.nome = 'Nome completo é obrigatório';
    }

    if (!formulario.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!validarEmail(formulario.email)) {
      novosErros.email = 'Email inválido';
    }

    if (!formulario.senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (formulario.senha.length < 6) {
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!formulario.confirmarSenha) {
      novosErros.confirmarSenha = 'Confirme sua senha';
    } else if (formulario.senha !== formulario.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    if (tipoUsuario === 'designer' && !formulario.especialidade.trim()) {
      novosErros.especialidade = 'Especialidade é obrigatória para designers';
    }

    if (tipoUsuario === 'cliente' && !formulario.empresa.trim()) {
      novosErros.empresa = 'Nome da empresa é obrigatório para clientes';
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

    // Simulação de cadastro - em produção seria uma chamada à API
    setTimeout(() => {
      setCadastroSucesso(true);
      setEnviando(false);
      
      // Faz o login automático após cadastro
      setTimeout(() => {
        signup(formulario.email, tipoUsuario!);
        onSignupSuccess();
      }, 1500);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleTipoUsuarioChange = (tipo: 'designer' | 'cliente') => {
    setTipoUsuario(tipo);
    if (erros.tipoUsuario) {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros.tipoUsuario;
        return novosErros;
      });
    }
  };

  if (cadastroSucesso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="font-['Maven_Pro',sans-serif] text-[28px] font-bold leading-[34px] text-slate-900 mb-3">
            Cadastro Realizado!
          </h2>
          <p className="font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] text-slate-600 mb-6">
            Sua conta foi criada com sucesso. Você será redirecionado para a plataforma.
          </p>
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-2xl w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-['Maven_Pro',sans-serif] text-[36px] font-bold leading-[44px] text-slate-900 mb-2">
            Criar Conta
          </h1>
          <p className="font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] text-slate-600">
            Preencha seus dados para começar a usar o DesignFlow
          </p>
        </div>

        {/* Seleção de Tipo de Usuário */}
        {!tipoUsuario && (
          <div className="space-y-4 mb-6">
            <p className="font-['Kumbh_Sans',sans-serif] text-[15px] font-semibold leading-[20px] text-slate-700 mb-3">
              Como você deseja usar a plataforma?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTipoUsuarioChange('designer')}
                className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-6 transition-all duration-300 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Briefcase size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-['Kumbh_Sans',sans-serif] text-[18px] font-bold leading-[22px] text-slate-900 mb-2">
                      Sou Designer
                    </h3>
                    <p className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px] text-slate-600">
                      Gerenciar projetos, tarefas e comunicação com clientes
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTipoUsuarioChange('cliente')}
                className="group relative bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl p-6 transition-all duration-300 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Building size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-['Kumbh_Sans',sans-serif] text-[18px] font-bold leading-[22px] text-slate-900 mb-2">
                      Sou Cliente
                    </h3>
                    <p className="font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[20px] text-slate-600">
                      Acompanhar projetos e se comunicar com designers
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {erros.tipoUsuario && (
              <div className="flex items-center gap-2 text-red-600 mt-2">
                <AlertCircle size={16} />
                <span className="font-['Kumbh_Sans',sans-serif] text-[13px]">{erros.tipoUsuario}</span>
              </div>
            )}
          </div>
        )}

        {/* Formulário */}
        {tipoUsuario && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tipo de Usuário Selecionado */}
            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  tipoUsuario === 'designer' ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                  {tipoUsuario === 'designer' ? (
                    <Briefcase size={20} className="text-white" />
                  ) : (
                    <Building size={20} className="text-white" />
                  )}
                </div>
                <div>
                  <p className="font-['Kumbh_Sans',sans-serif] text-[13px] font-medium leading-[16px] text-slate-600">
                    Cadastrando como
                  </p>
                  <p className="font-['Kumbh_Sans',sans-serif] text-[16px] font-bold leading-[20px] text-slate-900">
                    {tipoUsuario === 'designer' ? 'Designer' : 'Cliente'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTipoUsuario(null)}
                className="text-blue-600 hover:text-blue-700 font-['Kumbh_Sans',sans-serif] text-[13px] font-semibold"
              >
                Alterar
              </button>
            </div>

            {/* Nome Completo */}
            <div>
              <label htmlFor="nome" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formulario.nome}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] transition-all ${
                    erros.nome ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                  placeholder="Digite seu nome completo"
                />
              </div>
              {erros.nome && (
                <div className="flex items-center gap-1 mt-2 text-red-600">
                  <AlertCircle size={14} />
                  <span className="font-['Kumbh_Sans',sans-serif] text-[12px]">{erros.nome}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formulario.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] transition-all ${
                    erros.email ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                  }`}
                  placeholder="seu@email.com"
                />
              </div>
              {erros.email && (
                <div className="flex items-center gap-1 mt-2 text-red-600">
                  <AlertCircle size={14} />
                  <span className="font-['Kumbh_Sans',sans-serif] text-[12px]">{erros.email}</span>
                </div>
              )}
            </div>

            {/* Grid de 2 colunas para Senha e Confirmar Senha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Senha */}
              <div>
                <label htmlFor="senha" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                  Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={formulario.senha}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] transition-all ${
                      erros.senha ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                {erros.senha && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <AlertCircle size={14} />
                    <span className="font-['Kumbh_Sans',sans-serif] text-[12px]">{erros.senha}</span>
                  </div>
                )}
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmarSenha" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formulario.confirmarSenha}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] transition-all ${
                      erros.confirmarSenha ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                    placeholder="Digite a senha novamente"
                  />
                </div>
                {erros.confirmarSenha && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <AlertCircle size={14} />
                    <span className="font-['Kumbh_Sans',sans-serif] text-[12px]">{erros.confirmarSenha}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Campos específicos para Designer */}
            {tipoUsuario === 'designer' && (
              <>
                <div>
                  <label htmlFor="especialidade" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                    Especialidade *
                  </label>
                  <select
                    id="especialidade"
                    name="especialidade"
                    value={formulario.especialidade}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] transition-all ${
                      erros.especialidade ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                    }`}
                  >
                    <option value="">Selecione sua especialidade</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Web Design">Web Design</option>
                    <option value="Design Gráfico">Design Gráfico</option>
                    <option value="Branding">Branding</option>
                    <option value="Ilustração">Ilustração</option>
                    <option value="Motion Design">Motion Design</option>
                    <option value="Product Design">Product Design</option>
                  </select>
                  {erros.especialidade && (
                    <div className="flex items-center gap-1 mt-2 text-red-600">
                      <AlertCircle size={14} />
                      <span className="font-['Kumbh_Sans',sans-serif] text-[12px]">{erros.especialidade}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="telefone" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                    Telefone (opcional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formulario.telefone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] bg-white"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Campos específicos para Cliente */}
            {tipoUsuario === 'cliente' && (
              <>
                <div>
                  <label htmlFor="empresa" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                    Nome da Empresa *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={formulario.empresa}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] transition-all ${
                        erros.empresa ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'
                      }`}
                      placeholder="Ex: TechCorp Solutions"
                    />
                  </div>
                  {erros.empresa && (
                    <div className="flex items-center gap-1 mt-2 text-red-600">
                      <AlertCircle size={14} />
                      <span className="font-['Kumbh_Sans',sans-serif] text-[12px]">{erros.empresa}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cargo" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                      Cargo (opcional)
                    </label>
                    <input
                      type="text"
                      id="cargo"
                      name="cargo"
                      value={formulario.cargo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] bg-white"
                      placeholder="Ex: Gerente de Marketing"
                    />
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[20px] text-slate-700 mb-2">
                      Telefone (opcional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        id="telefone"
                        name="telefone"
                        value={formulario.telefone}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[15px] bg-white"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Botão de Cadastro */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </button>

            <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[13px] text-center mt-4">
              * Campos obrigatórios
            </p>
          </form>
        )}

        {/* Link para Login */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px]">
            Já tem uma conta?{' '}
            <button
              onClick={onBackToLogin}
              className="text-blue-600 hover:text-blue-700 font-semibold text-[15px]"
            >
              Fazer Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}