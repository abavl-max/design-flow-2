import React, { useState } from 'react';
import { useAuth, UserType } from '../contexts/AuthContext';
import { Lock, Mail, Briefcase, UserCircle2, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToSignup?: () => void;
}

export function LoginPage({ onLoginSuccess, onBackToSignup }: LoginPageProps) {
  const [userType, setUserType] = useState<UserType>('designer');
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const success = await login(formData.email, formData.senha, userType);
      if (success) {
        onLoginSuccess();
      } else {
        setErro('Email, senha ou tipo de usuário incorretos');
      }
    } catch (error) {
      setErro('Erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
            <Briefcase className="text-white" size={32} />
          </div>
          <h1 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[32px] font-bold leading-[38px] mb-2">
            DesignFlow
          </h1>
          <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[20px]">
            Faça login para continuar
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Seleção de Tipo de Usuário */}
          <div className="mb-6">
            <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-3 block">
              Tipo de Conta
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('designer')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === 'designer'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Briefcase
                  className={`mx-auto mb-2 ${
                    userType === 'designer' ? 'text-blue-600' : 'text-slate-400'
                  }`}
                  size={24}
                />
                <p className={`font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] ${
                  userType === 'designer' ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  Designer
                </p>
                <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[14px] mt-1">
                  Acesso completo
                </p>
              </button>

              <button
                type="button"
                onClick={() => setUserType('cliente')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === 'cliente'
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <UserCircle2
                  className={`mx-auto mb-2 ${
                    userType === 'cliente' ? 'text-green-600' : 'text-slate-400'
                  }`}
                  size={24}
                />
                <p className={`font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] ${
                  userType === 'cliente' ? 'text-green-600' : 'text-slate-600'
                }`}>
                  Cliente
                </p>
                <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[14px] mt-1">
                  Visualização
                </p>
              </button>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] mb-2 block">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Kumbh_Sans',sans-serif] text-[14px]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-['Kumbh_Sans',sans-serif] text-[14px]">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white py-3 rounded-xl font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold hover:bg-blue-600 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processando...' : 'Entrar'}
            </button>
          </form>

          {/* Credenciais de teste */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] font-semibold leading-[14px] mb-2">
              Credenciais para teste:
            </p>
            <div className="space-y-2 text-slate-600 font-['Kumbh_Sans',sans-serif] text-[12px] leading-[16px]">
              <div className="bg-blue-50 p-2 rounded">
                <strong>Designer:</strong> designer@designflow.com
              </div>
              <div className="bg-green-50 p-2 rounded">
                <strong>Cliente:</strong> cliente@empresa.com
              </div>
              <p className="text-slate-500 text-[11px] mt-2">Senha: qualquer senha</p>
            </div>
          </div>

          {/* Link para cadastro */}
          {onBackToSignup && (
            <div className="mt-6 text-center">
              <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px]">
                Não tem uma conta?{' '}
                <button
                  onClick={onBackToSignup}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-[15px]"
                >
                  Criar conta
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}