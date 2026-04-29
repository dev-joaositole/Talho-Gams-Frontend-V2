import React, { useState } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { LogOut, Wallet } from 'lucide-react';
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
      toast.error('Informe um valor de abertura válido.');
      return;
    }

    try {
      openShift(user.id, user.assignedBranchId, Number(initialFloat));
      toast.success('Caixa aberto com sucesso. Bom turno!');
      onOpen();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao abrir caixa.');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl overflow-hidden p-8 animate-in fade-in zoom-in-95">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 text-center">Abertura de Caixa</h2>
          <p className="text-slate-500 font-medium text-center text-sm mt-2">
            Olá, <span className="font-bold text-slate-700">{user.name}</span>. Informe o montante físico inicial para abrir o seu turno.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Saldo Inicial (Troco)</label>
            <Input 
              type="number"
              placeholder="Ex: 1500.00"
              className="h-14 bg-slate-50 border-slate-200 rounded-xl font-black text-2xl text-center"
              value={initialFloat}
              onChange={e => setInitialFloat(e.target.value)}
              autoFocus
            />
          </div>

          <Button 
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-600/20"
            onClick={handleOpen}
          >
            Abrir Caixa
          </Button>

          <Button 
            variant="ghost"
            className="w-full h-12 text-slate-500 hover:text-red-600 hover:bg-red-50 font-bold rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" /> Encerrar Sessão
          </Button>
        </div>
      </Card>
    </div>
  );
}
