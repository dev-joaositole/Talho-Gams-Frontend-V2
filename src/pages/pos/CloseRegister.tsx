import React, { useState } from 'react';
import { ArrowLeft, Lock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { User, Shift, closeShift, logoutUser } from '@/lib/storage';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CloseRegisterProps {
  user: User;
  shift: Shift;
  onClose: () => void;
}

export default function CloseRegister({ user, shift, onClose }: CloseRegisterProps) {
  const [actualCash, setActualCash] = useState('');
  const navigate = useNavigate();

  const expectedCash = shift.initialFloat + shift.movements
    .filter(m => (m.type === 'sale' && m.paymentMethod === 'Dinheiro') || m.type === 'adjustment_in')
    .reduce((acc, curr) => acc + curr.amount, 0)
  - shift.movements
    .filter(m => m.type === 'sangria' || m.type === 'expense_payment' || m.type === 'adjustment_out')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSalesDigital = shift.movements
    .filter(m => m.type === 'sale' && m.paymentMethod !== 'Dinheiro')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const diff = actualCash ? Number(actualCash) - expectedCash : null;

  const handleClose = () => {
    if (!actualCash || isNaN(Number(actualCash)) || Number(actualCash) < 0) {
      toast.error('Valor inválido.');
      return;
    }

    try {
      closeShift(shift.id, Number(actualCash));
      if (diff !== 0) {
        toast.warning(`Sessão terminada. Desvio de ${diff} MT registado.`);
      } else {
        toast.success(`Sessão terminada sem desvios.`);
      }
      
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        logoutUser();
        navigate('/login');
      }
      
    } catch (e: any) {
      toast.error(e.message || 'Erro do sistema.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-[#F9FAFB] p-4 relative font-sans">
      <button 
        onClick={() => navigate('/caixa')}
        className="absolute top-6 left-6 h-10 px-4 rounded-[6px] font-medium text-[13px] text-[#4B5563] hover:bg-white border border-transparent hover:border-[#E5E7EB] hover:shadow-sm transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="w-[420px] bg-white border border-[#E5E7EB] shadow-xl rounded-[12px] flex flex-col p-6 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-start mb-6">
           <div>
              <div className="w-10 h-10 bg-[#F3F4F6] text-[#111827] rounded-[8px] flex items-center justify-center mb-3 border border-[#E5E7EB]">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-[16px] font-semibold text-[#111827]">Fecho de Sessão</h2>
              <p className="text-[#6B7280] font-medium text-[13px] mt-0.5">Operador: {user.name}</p>
           </div>
           <div className="text-right">
              <span className="text-[11px] font-medium text-[#4B5563] bg-[#F3F4F6] px-2 py-1 rounded-[4px] border border-[#E5E7EB]">
                 Turno {shift.id.split('-')[0].toUpperCase()}
              </span>
           </div>
        </div>

        <div className="space-y-6 pt-2">
          <div className="bg-[#F9FAFB] rounded-[8px] p-4 border border-[#E5E7EB] space-y-3">
            <div className="flex justify-between items-center text-[13px]">
               <span className="text-[#6B7280] font-medium">Fundo Inicial</span>
               <span className="font-semibold text-[#111827]">{shift.initialFloat.toLocaleString()} MT</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
               <span className="text-[#6B7280] font-medium">Faturação TPA/Digital</span>
               <span className="font-semibold text-[#111827]">{totalSalesDigital.toLocaleString()} MT</span>
            </div>
            <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-end">
               <span className="text-[11px] text-[#6B7280] uppercase tracking-wide font-medium">Saldo Calculado (Numerário)</span>
               <span className="text-[18px] font-bold text-[#111827]">{expectedCash.toLocaleString()} <span className="text-[12px] font-medium text-[#6B7280]">MT</span></span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide mb-1.5 block">Contagem no Cofre (MT)</label>
            <input 
              type="number"
              placeholder="0.00"
              className="w-full h-12 bg-white border border-[#E5E7EB] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] rounded-[6px] text-center font-bold text-[18px] transition-all shadow-sm"
              value={actualCash}
              onChange={e => setActualCash(e.target.value)}
              autoFocus
            />
          </div>

          {actualCash !== '' && diff !== null && (
            <div className={`p-3 rounded-[6px] flex items-start gap-2.5 border ${diff === 0 ? 'bg-[#F0FDF4] border-[#BBF7D0]' : 'bg-[#FEF2F2] border-[#FECACA]'}`}>
              {diff === 0 ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              )}
              <div>
                 <h4 className={`text-[12px] font-semibold ${diff === 0 ? 'text-[#166534]' : 'text-[#991B1B]'}`}>
                   {diff === 0 ? 'Sessão validada' : 'Desvio detetado'}
                 </h4>
                 <p className={`text-[11px] mt-0.5 ${diff === 0 ? 'text-[#15803D]' : 'text-[#B91C1C]'}`}>
                   {diff === 0 
                     ? 'Saldo coincide perfeitamente.' 
                     : `Diferença de ${diff.toLocaleString()} MT registada.`}
                 </p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button 
              className="w-full h-11 bg-[#111827] hover:bg-[#1F2937] text-white font-semibold text-[13px] rounded-[6px] shadow-sm transition-colors flex items-center justify-center gap-2"
              onClick={handleClose}
            >
              <FileText className="w-4 h-4" /> Emitir Relatório e Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
