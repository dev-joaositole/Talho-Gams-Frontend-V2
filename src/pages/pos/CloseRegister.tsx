import React, { useState } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { LogOut, ArrowLeft, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  // Calcular esperado: (fundo + vendas a dinheiro + entradas) - (sangrias + despesas + saídas)
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
      toast.error('Informe do montante no cofre físico para encerramento.');
      return;
    }

    try {
      closeShift(shift.id, Number(actualCash));
      if (diff !== 0) {
        toast.warning(`Turno encerrado. Diferença reportada de ${diff} MT no relatório.`);
      } else {
        toast.success(`Turno encerrado perfeitamente (Sem Quebras).`);
      }
      
      // se for operator logout
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        logoutUser();
        navigate('/login');
      }
      
    } catch (e: any) {
      toast.error(e.message || 'Ocorreu um erro.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-100 p-4 relative">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/caixa')}
        className="absolute top-6 left-6 h-12 px-4 rounded-xl font-bold text-slate-500 hover:text-slate-800 bg-white shadow-sm"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Voltar ao POS
      </Button>

      <Card className="w-full max-w-xl bg-white border-0 shadow-2xl rounded-3xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-slate-50 text-center">
          <div className="w-16 h-16 bg-slate-200 text-slate-600 rounded-full flex mx-auto items-center justify-center mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Fecho de Turno</h2>
          <p className="text-slate-500 font-medium text-sm mt-2">
            Operador responsável: <span className="font-bold text-slate-700">{user.name}</span>
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 gap-4">
            <div>
               <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Abertura (Troco Inicial)</p>
               <p className="text-lg font-black text-slate-800">{shift.initialFloat.toLocaleString()} MT</p>
            </div>
            <div>
               <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Faturado no Digital (TPA)</p>
               <p className="text-lg font-black text-blue-600">{totalSalesDigital.toLocaleString()} MT</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200 mt-2">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Calculado Físico (Dinheiro que tem que estar no cofre)</p>
               <p className="text-2xl font-black text-slate-800">{expectedCash.toLocaleString()} MT</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 block">Contagem Real (Cofre Físico)</label>
            <Input 
              type="number"
              placeholder="Ex: 5600.00"
              className="h-16 bg-white border-2 border-slate-200 focus-visible:border-slate-800 focus-visible:ring-0 rounded-2xl font-black text-3xl text-center"
              value={actualCash}
              onChange={e => setActualCash(e.target.value)}
              autoFocus
            />
          </div>

          {actualCash !== '' && diff !== null && (
            <div className={`p-4 rounded-xl flex items-start gap-3 border ${diff === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
              {diff === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              )}
              <div>
                 <h4 className={`text-sm font-bold ${diff === 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                   {diff === 0 ? 'Valores conferem.' : 'Diferença de Caixa Detetada (Quebra)'}
                 </h4>
                 <p className={`text-xs mt-1 font-medium ${diff === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                   {diff === 0 
                     ? 'Gere um relatório perfeito na nuvem.' 
                     : `O sistema previa ${expectedCash.toLocaleString()} MT. Reportando diferença de ${diff.toLocaleString()} MT para os Superiores.`}
                 </p>
              </div>
            </div>
          )}

          <Button 
            className="w-full h-14 bg-slate-800 hover:bg-slate-900 text-white font-bold text-lg rounded-xl shadow-lg shadow-slate-800/20"
            onClick={handleClose}
          >
            Encerrar e Enviar Relatório
          </Button>
        </div>
      </Card>
    </div>
  );
}
