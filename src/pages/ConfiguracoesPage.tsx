import React, { useState, useEffect } from 'react';
import { Bell, Lock, Palette, Globe, Mail, Shield, Moon, Sun, Save, X, Check, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useTheme } from '../contexts/ThemeContext';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  weeklyDigest: boolean;
  clientMessages: boolean;
}

interface ConfigSettings {
  theme: 'light' | 'dark';
  primaryColor: string;
  notifications: NotificationSettings;
  language: string;
  timezone: string;
}

export function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();
  const [modalSalvarConfig, setModalSalvarConfig] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  const [modal2FA, setModal2FA] = useState(false);
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const [config, setConfig] = useState<ConfigSettings>({
    theme: 'light',
    primaryColor: 'bg-blue-600',
    notifications: {
      email: true,
      push: true,
      weeklyDigest: false,
      clientMessages: true
    },
    language: 'pt-BR',
    timezone: 'GMT-3'
  });

  // Carregar configurações salvas do localStorage ao montar e sincronizar com o contexto
  useEffect(() => {
    const savedConfig = localStorage.getItem('designflow_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        // Garantir que todas as propriedades necessárias existam
        setConfig(prev => ({
          ...prev,
          ...parsed,
          notifications: {
            email: parsed.notifications?.email ?? prev.notifications.email,
            push: parsed.notifications?.push ?? prev.notifications.push,
            weeklyDigest: parsed.notifications?.weeklyDigest ?? prev.notifications.weeklyDigest,
            clientMessages: parsed.notifications?.clientMessages ?? prev.notifications.clientMessages
          }
        }));
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
    // Sincronizar com o tema do contexto
    setConfig(prev => ({ ...prev, theme }));
  }, [theme]);

  const toggleNotification = (key: keyof NotificationSettings) => {
    setConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const abrirModalSalvarConfig = () => {
    setModalSalvarConfig(true);
  };

  const fecharModalSalvarConfig = () => {
    setModalSalvarConfig(false);
  };

  const confirmarSalvarConfig = () => {
    // Salvar no localStorage
    localStorage.setItem('designflow_config', JSON.stringify(config));
    setModalSalvarConfig(false);
    toast.success('Configurações salvas com sucesso!');
  };

  const abrirModalSenha = () => {
    setModalSenha(true);
  };

  const fecharModalSenha = () => {
    setModalSenha(false);
    setSenhaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
  };

  const confirmarAlterarSenha = () => {
    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (senhaData.novaSenha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    // Aqui você implementaria a lógica real de alteração de senha
    fecharModalSenha();
    toast.success('Senha alterada com sucesso!');
  };

  const abrirModal2FA = () => {
    setModal2FA(true);
  };

  const fecharModal2FA = () => {
    setModal2FA(false);
  };

  const confirmarAtivar2FA = () => {
    // Aqui você implementaria a lógica real de ativação do 2FA
    fecharModal2FA();
    toast.success('Autenticação de dois fatores ativada!');
  };

  const cores = [
    { class: 'bg-blue-600', name: 'Azul' },
    { class: 'bg-purple-600', name: 'Roxo' },
    { class: 'bg-green-600', name: 'Verde' },
    { class: 'bg-orange-600', name: 'Laranja' }
  ];

  const notificacoes = [
    { 
      key: 'email' as keyof NotificationSettings, 
      label: 'Notificações por E-mail', 
      desc: 'Receba atualizações importantes por e-mail' 
    },
    { 
      key: 'push' as keyof NotificationSettings, 
      label: 'Notificações Push', 
      desc: 'Notificações em tempo real no navegador' 
    },
    { 
      key: 'weeklyDigest' as keyof NotificationSettings, 
      label: 'Resumo Semanal', 
      desc: 'Relatório semanal de atividades' 
    },
    { 
      key: 'clientMessages' as keyof NotificationSettings, 
      label: 'Mensagens de Clientes', 
      desc: 'Alertas quando clientes comentarem' 
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-slate-800 dark:text-slate-100 font-['Maven_Pro',sans-serif] text-[40px] font-semibold leading-[48px]">
          Configurações
        </h2>
        <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[18px] font-normal leading-[24px]">
          Personalize sua experiência no DesignFlow
        </p>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-xl flex items-center justify-center">
            <Palette size={20} />
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
              Aparência
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
              Personalize o tema e cores da interface
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
            <div>
              <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                Tema
              </p>
              <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                Escolha entre modo claro ou escuro
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className={`p-3 bg-white border-2 ${config.theme === 'light' ? 'border-blue-500' : 'border-slate-200'} rounded-lg hover:bg-slate-50 transition-colors`}
                onClick={() => {
                  setConfig(prev => ({ ...prev, theme: 'light' }));
                  setTheme('light');
                }}
              >
                <Sun className={config.theme === 'light' ? 'text-blue-600' : 'text-slate-600'} size={20} />
              </button>
              <button
                className={`p-3 bg-slate-100 border-2 ${config.theme === 'dark' ? 'border-blue-500' : 'border-slate-200'} rounded-lg hover:bg-slate-200 transition-colors`}
                onClick={() => {
                  setConfig(prev => ({ ...prev, theme: 'dark' }));
                  setTheme('dark');
                }}
              >
                <Moon className={config.theme === 'dark' ? 'text-blue-600' : 'text-slate-600'} size={20} />
              </button>
            </div>
          </div>

          {/* Removido: Opção de mudança de cor principal */}
          {/* <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
            <div>
              <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                Cor Principal
              </p>
              <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                Defina a cor de destaque da interface
              </p>
            </div>
            <div className="flex gap-2">
              {cores.map((color) => (
                <button
                  key={color.class}
                  className={`w-10 h-10 ${color.class} rounded-lg ${config.primaryColor === color.class ? 'ring-2 ring-offset-2 ring-blue-500' : ''} hover:scale-110 transition-transform`}
                  onClick={() => setConfig(prev => ({ ...prev, primaryColor: color.class }))}
                />
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-xl flex items-center justify-center">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
              Notificações
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
              Gerencie como você recebe atualizações
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {notificacoes.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <div>
                <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                  {item.label}
                </p>
                <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  {item.desc}
                </p>
              </div>
              <button
                className={`
                  relative w-14 h-7 rounded-full transition-colors
                  ${config.notifications?.[item.key] ? 'bg-blue-600' : 'bg-slate-300'}
                `}
                onClick={() => toggleNotification(item.key)}
              >
                <span
                  className={`
                    absolute top-1 w-5 h-5 bg-white rounded-full transition-transform
                    ${config.notifications?.[item.key] ? 'right-1' : 'left-1'}
                  `}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-xl flex items-center justify-center">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
              Segurança e Privacidade
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
              Proteja sua conta e dados
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={abrirModalSenha}
          >
            <div className="flex items-center gap-3">
              <Lock className="text-slate-600" size={20} />
              <div className="text-left">
                <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                  Alterar Senha
                </p>
                <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  Última alteração: 15 dias atrás
                </p>
              </div>
            </div>
            <span className="text-blue-600">→</span>
          </button>

          <button
            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={abrirModal2FA}
          >
            <div className="flex items-center gap-3">
              <Shield className="text-slate-600" size={20} />
              <div className="text-left">
                <p className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                  Autenticação de Dois Fatores
                </p>
                <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  Adicione uma camada extra de segurança
                </p>
              </div>
            </div>
            <span className="text-blue-600">→</span>
          </button>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-xl flex items-center justify-center">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
              Idioma e Região
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
              Configure preferências regionais
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
            <label className="block text-slate-700 dark:text-slate-100 mb-2 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] uppercase">
              Idioma
            </label>
            <select
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] text-slate-800 dark:text-slate-100"
              value={config.language}
              onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value }))}
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
            <label className="block text-slate-700 dark:text-slate-100 mb-2 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] uppercase">
              Fuso Horário
            </label>
            <select
              className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] text-slate-800 dark:text-slate-100"
              value={config.timezone}
              onChange={(e) => setConfig(prev => ({ ...prev, timezone: e.target.value }))}
            >
              <option value="GMT-3">GMT-3 (Brasília)</option>
              <option value="GMT-5">GMT-5 (New York)</option>
              <option value="GMT+0">GMT+0 (London)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botão de Salvar Configurações */}
      <div className="flex justify-end">
        <button
          onClick={abrirModalSalvarConfig}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          <Save size={20} />
          Salvar Configurações
        </button>
      </div>

      {/* Modal de Confirmação de Salvamento */}
      {modalSalvarConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                Salvar Configurações
              </h3>
              <button
                onClick={fecharModalSalvarConfig}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                  ⚙️
                </div>
                <div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                    Confirmar alterações?
                  </p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px]">
                    Suas preferências serão atualizadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={fecharModalSalvarConfig}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarSalvarConfig}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alterar Senha */}
      {modalSenha && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-transparent dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-slate-800 dark:text-slate-100 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                Alterar Senha
              </h3>
              <button
                onClick={fecharModalSenha}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={mostrarSenhaAtual ? 'text' : 'password'}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="Senha Atual"
                    value={senhaData.senhaAtual}
                    onChange={(e) => setSenhaData(prev => ({ ...prev, senhaAtual: e.target.value }))}
                  />
                  <button
                    className="absolute top-3 right-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                  >
                    {mostrarSenhaAtual ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={mostrarNovaSenha ? 'text' : 'password'}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="Nova Senha"
                    value={senhaData.novaSenha}
                    onChange={(e) => setSenhaData(prev => ({ ...prev, novaSenha: e.target.value }))}
                  />
                  <button
                    className="absolute top-3 right-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                  >
                    {mostrarNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={mostrarConfirmarSenha ? 'text' : 'password'}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    placeholder="Confirmar Nova Senha"
                    value={senhaData.confirmarSenha}
                    onChange={(e) => setSenhaData(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                  />
                  <button
                    className="absolute top-3 right-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  >
                    {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={fecharModalSenha}
                className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAlterarSenha}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ativar 2FA */}
      {modal2FA && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
                Ativar Autenticação de Dois Fatores
              </h3>
              <button
                onClick={fecharModal2FA}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                  🔐
                </div>
                <div>
                  <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                    Confirmar ativação?
                  </p>
                  <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px]">
                    Adicione uma camada extra de segurança à sua conta.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button
                onClick={fecharModal2FA}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAtivar2FA}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}