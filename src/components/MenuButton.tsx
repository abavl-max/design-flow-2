import React from 'react';
import { Menu } from 'lucide-react';

interface MenuButtonProps {
  onClick: () => void;
}

export function MenuButton({ onClick }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 z-30 w-12 h-12 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      <Menu size={24} />
    </button>
  );
}
