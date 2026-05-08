import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { getShifts, Shift, getCurrentUser } from '@/lib/storage';
import { Wallet, CheckCircle, AlertTriangle, Terminal, MonitorPlay } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CashierManagement() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    // In a real app we would join Users and Branches to get their names.
    // We already have shifts stored with userId and branchId.
    setShifts(getShifts().sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime()));
  }, []);

  return (
    <div className="pt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-white p-4 md:p-6 rounded-[20px] shadow-sm border border-slate-100">
        <div>
           <h2 className="text-xl font-black text-slate-800">Controlo de Terminais de Caixa</h2>
           <p className="text-sm font-bold text-slate-400 mt-1">Sessões e Turnos Físicos operados pelas Filiais.</p>
        </div>
        
        {/* Shortcut for Admin/Manager to open POS themselves */}
        {currentUser?.role !== 'operator' && (
           <Button className="h-12 w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20" onClick={() => navigate('/caixa')}>
             <MonitorPlay className="w-5 h-5 mr-3" /> Acessar Terminal POS (Como Admin)
           </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {shifts.map((shift) => (
           <Card key={shift.id} className="p-0 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white overflow-hidden flex flex-col">
              <div className={`p-4 border-b ${shift.status === 'open' ? 'bg-blue-50 border-blue-100/50' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${shift.status === 'open' ? 'bg-blue-600' : 'bg-slate-200'}`}>
                         <Terminal className={`w-5 h-5 ${shift.status === 'open' ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <div>
                         <h3 className="font-bold text-slate-800 tracking-tight text-sm">Turno #{shift.id.slice(6, 12)}</h3>
                         <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mt-1 inline-block ${shift.status === 'open' ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'}`}>
                           {shift.status === 'open' ? 'Aberto (Em curso)' : 'Fechado'}
                         </span>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Abertura</p>
                      <p className="text-xs font-bold text-slate-700">{new Date(shift.openedAt).toLocaleTimeString('pt-PT', {hour: '2-digit', minute: '2-digit'})} ({new Date(shift.openedAt).toLocaleDateString()})</p>
                   </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col gap-4">
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Abertura c/ Fundo</p>
                       <p className="text-sm font-black text-slate-800">{shift.initialFloat.toLocaleString()} MT</p>
                    </div>
                    {shift.status === 'closed' ? (
                      <div className="bg-slate-50 p-3 rounded-2xl">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Faturado/Digital</p>
                         <p className="text-sm font-black text-blue-600">
                           {shift.movements.filter(m => m.type === 'sale' && m.paymentMethod !== 'Dinheiro').reduce((a,b) => a+b.amount, 0).toLocaleString()} MT
                         </p>
                      </div>
                    ) : (
                      <div className="bg-emerald-50/50 p-3 rounded-2xl">
                         <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider mb-1">Mvts Atuais</p>
                         <p className="text-sm font-black text-emerald-700">{shift.movements.length} transações</p>
                      </div>
                    )}
                 </div>

                 {shift.status === 'closed' && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex-1 flex flex-col justify-center">
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Esperado no Cofre</span>
                          <span className="font-black text-slate-800">{shift.expectedCloseAmount?.toLocaleString()} MT</span>
                       </div>
                       <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cofre Contado</span>
                          <span className="font-black text-slate-800">{shift.actualCloseAmount?.toLocaleString()} MT</span>
                       </div>
                       
                       <div className={`mt-4 p-3 rounded-xl flex items-start gap-2 border ${shift.discrepancy === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                         {shift.discrepancy === 0 ? (
                           <>
                             <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                             <div>
                               <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Fecho Correto</p>
                             </div>
                           </>
                         ) : (
                           <>
                             <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                             <div>
                               <p className="text-[11px] font-bold text-red-800 uppercase tracking-wider mb-0.5">Quebra Encontrada</p>
                               <p className="text-lg font-black text-red-600">{shift.discrepancy?.toLocaleString()} MT</p>
                             </div>
                           </>
                         )}
                       </div>
                    </div>
                 )}

              </div>
           </Card>
         ))}
         
         {shifts.length === 0 && (
           <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Wallet className="w-8 h-8" />
             </div>
             <p className="font-bold text-slate-400 text-lg">Nenhum turno ou caixa operado.</p>
             <p className="text-sm font-medium text-slate-400 mt-1 leading-relaxed max-w-md mx-auto">
               Assim que os operadores iniciarem seus fluxos de trabalho usando os painéis locais, os relatórios aparecerão aqui.
             </p>
           </div>
         )}
      </div>

    </div>
  );
}
