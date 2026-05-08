import React, { useState } from 'react';
import { LogOut, MonitorSmartphone } from 'lucide-react';
import { User, openShift, logoutUser } from '@/lib/storage';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface OpenRegisterProps {
  user: User;
  onOpen: () => void;
}

export default function OpenRegister({ user, onOpen }: OpenRegisterProps) {
  const [initialFloat, setInitialFloat] = useState('');
  const navigate = useNavigate();

  const handleOpen = () => {
    if (!initialFloat || isNaN(Number(initialFloat)) || Number(initialFloat) < 0) {
      toast.error('Valor inválido.');
      return;
    }

    try {
      openShift(user.id, user.assignedBranchId, Number(initialFloat));
      toast.success('Ponto de venda ativo');
      onOpen();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao iniciar');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-[#F9FAFB] p-4 font-sans">
      <div className="w-[340px] bg-white border border-[#E5E7EB] shadow-xl rounded-[12px] p-6 animate-in fade-in zoom-in-95">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-[#F3F4F6] text-[#111827] rounded-[8px] flex items-center justify-center mb-4 border border-[#E5E7EB]">
            <MonitorSmartphone className="w-5 h-5" />
          </div>
          <h2 className="text-[16px] font-semibold text-[#111827]">Terminal Bloqueado</h2>
          <p className="text-[#6B7280] font-medium text-[13px] mt-1 text-center">
            {user.name}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide mb-1.5 block">Fundo de Maneio (MT)</label>
            <input 
              type="number"
              placeholder="0.00"
              className="w-full h-12 bg-white border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-center font-bold text-[18px] text-[#111827] transition-all shadow-sm"
              value={initialFloat}
              onChange={e => setInitialFloat(e.target.value)}
              autoFocus
            />
          </div>

          <button 
            className="w-full h-11 bg-[#111827] hover:bg-[#1F2937] text-white font-semibold text-[13px] rounded-[6px] transition-colors shadow-sm"
            onClick={handleOpen}
          >
            Iniciar Sessão
          </button>

          <button 
            className="w-full h-10 flex items-center justify-center gap-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] font-medium text-[12px] rounded-[6px] transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-3.5 h-3.5" /> Voltar ao Sistema
          </button>
        </div>
      </div>
    </div>
  );
}
