import React, { useState } from 'react';
import { Home, FolderKanban, User, Settings, HelpCircle, ChevronRight, X, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'projetos', label: 'Projetos', icon: FolderKanban },
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'suporte', label: 'Suporte', icon: HelpCircle },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate, isOpen, onClose }: SidebarProps) {
  const { user, logout, isDesigner } = useAuth();
  const [modalLogout, setModalLogout] = useState(false);
  
  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose();
  };
  
  const abrirModalLogout = () => {
    setModalLogout(true);
  };

  const fecharModalLogout = () => {
    setModalLogout(false);
  };
  
  const confirmarLogout = () => {
    logout();
    setModalLogout(false);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 w-72 bg-white border-l border-slate-200 flex flex-col h-screen z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-['Maven_Pro',sans-serif] text-[20px] font-bold leading-[24px]">DF</span>
              </div>
              <div>
                <h2 className="text-slate-800 font-['Maven_Pro',sans-serif] text-[20px] font-bold leading-[24px]">DesignFlow</h2>
                <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">Gestão de Design</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Botão Criar Novo Projeto (apenas para designers) */}
        {isDesigner && (
          <button
            onClick={() => handleNavigate('criar-projeto')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-[#007bff] text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 mb-4"
          >
            <Plus size={20} />
            <span className="font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px]">
              Novo Projeto
            </span>
          </button>
        )}
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          // Clientes não podem acessar configurações
          if (!isDesigner && item.id === 'configuracoes') {
            return null;
          }
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-600 hover:bg-slate-50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span className="font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px]">
                  {item.label}
                </span>
              </div>
              {isActive && <ChevronRight size={18} />}
            </button>
          );
        })}
        
        {/* Botão de Logout */}
        <button
          onClick={abrirModalLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50 mt-4"
        >
          <LogOut size={20} />
          <span className="font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[16px]">
            Sair
          </span>
        </button>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px] ${
            isDesigner ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-green-400 to-emerald-500'
          }`}>
            {user?.avatar}
          </div>
          <div className="flex-1">
            <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold leading-[16px]">{user?.nome}</p>
            <p className="text-slate-500 font-['Kumbh_Sans',sans-serif] text-[12px] font-normal leading-[16px]">
              {user?.tipo === 'designer' ? 'Designer' : 'Cliente'}
            </p>
          </div>
        </div>
      </div>
    </aside>

    {/* Modal de Confirmação de Logout */}
    {modalLogout && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h3 className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[24px] font-bold leading-[28px]">
              Confirmar Saída
            </h3>
            <button
              onClick={fecharModalLogout}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
                👋
              </div>
              <div>
                <p className="text-slate-800 font-['Kumbh_Sans',sans-serif] text-[16px] font-semibold leading-[20px] mb-1">
                  Tem certeza que deseja sair?
                </p>
                <p className="text-slate-600 font-['Kumbh_Sans',sans-serif] text-[14px] font-normal leading-[18px]">
                  Você será desconectado da sua conta.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-slate-200">
            <button
              onClick={fecharModalLogout}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarLogout}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-['Kumbh_Sans',sans-serif] text-[14px] font-semibold"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}