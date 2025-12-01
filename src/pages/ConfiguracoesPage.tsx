import React, { useState } from 'react';
import { Bell, Lock, Palette, Globe, Mail, Shield, Moon, Sun, Save, X } from 'lucide-react';

export function ConfiguracoesPage() {
  const [modalSalvarConfig, setModalSalvarConfig] = useState(false);

  const abrirModalSalvarConfig = () => {
    setModalSalvarConfig(true);
  };

  const fecharModalSalvarConfig = () => {
    setModalSalvarConfig(false);
  };

  const confirmarSalvarConfig = () => {
    // Aqui você salvaria as configurações
    setModalSalvarConfig(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-slate-800 font-['Maven_Pro',sans-serif] text-[40px] font-semibold leading-[48px]">
          Configurações
        </h2>
        <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[18px] font-normal leading-[24px]">
          Personalize sua experiência no DesignFlow
        </p>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Palette size={20} />
          </div>
          <div>
            <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
              Aparência
            </h3>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
              Personalize o tema e cores da interface
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                Tema
              </p>
              <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                Escolha entre modo claro ou escuro
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-white border-2 border-blue-500 rounded-lg">
                <Sun className="text-blue-600" size={20} />
              </button>
              <button className="p-3 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors">
                <Moon className="text-slate-600" size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                Cor Principal
              </p>
              <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                Defina a cor de destaque da interface
              </p>
            </div>
            <div className="flex gap-2">
              {['bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-orange-600'].map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 ${color} rounded-lg ${color === 'bg-blue-600' ? 'ring-2 ring-offset-2 ring-blue-500' : ''} hover:scale-110 transition-transform`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
              Notificações
            </h3>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
              Gerencie como você recebe atualizações
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Notificações por E-mail', desc: 'Receba atualizações importantes por e-mail', enabled: true },
            { label: 'Notificações Push', desc: 'Notificações em tempo real no navegador', enabled: true },
            { label: 'Resumo Semanal', desc: 'Relatório semanal de atividades', enabled: false },
            { label: 'Mensagens de Clientes', desc: 'Alertas quando clientes comentarem', enabled: true }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                  {item.label}
                </p>
                <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  {item.desc}
                </p>
              </div>
              <button
                className={`
                  relative w-14 h-7 rounded-full transition-colors
                  ${item.enabled ? 'bg-blue-600' : 'bg-slate-300'}
                `}
              >
                <span
                  className={`
                    absolute top-1 w-5 h-5 bg-white rounded-full transition-transform
                    ${item.enabled ? 'right-1' : 'left-1'}
                  `}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
              Segurança e Privacidade
            </h3>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
              Proteja sua conta e dados
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="text-slate-600" size={20} />
              <div className="text-left">
                <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                  Alterar Senha
                </p>
                <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  Última alteração: 15 dias atrás
                </p>
              </div>
            </div>
            <span className="text-blue-600">→</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="text-slate-600" size={20} />
              <div className="text-left">
                <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px] mb-1">
                  Autenticação de Dois Fatores
                </p>
                <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
                  Adicione uma camada extra de segurança
                </p>
              </div>
            </div>
            <span className="text-blue-600">→</span>
          </button>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[20px] font-semibold leading-[24px]">
              Idioma e Região
            </h3>
            <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[16px]">
              Configure preferências regionais
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <label className="block text-slate-700 mb-2 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] uppercase">
              Idioma
            </label>
            <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
              <option>Português (Brasil)</option>
              <option>English (US)</option>
              <option>Español</option>
            </select>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <label className="block text-slate-700 mb-2 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] uppercase">
              Fuso Horário
            </label>
            <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-['Kumbh_Sans',sans-serif] text-[16px] font-normal leading-[24px]">
              <option>GMT-3 (Brasília)</option>
              <option>GMT-5 (New York)</option>
              <option>GMT+0 (London)</option>
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
    </div>
  );
}
