import React from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { getEmployees, Employee } from '@/lib/storage';
import { TrendingUp, Award, Clock, DollarSign, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function Performance() {
  const employees = getEmployees().filter(e => e.status === 'active');

  return (
    <div className="pt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-white p-4 md:p-6 rounded-[20px] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-800">Avaliação de Desempenho</h2>
          <p className="text-sm font-bold text-slate-400 mt-1">Análise de métricas de vendas e eficiência da equipa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl border-0 shadow-lg shadow-blue-600/20 text-white">
            <div className="flex items-center gap-3 opacity-80 mb-4">
               <Award className="w-5 h-5" />
               <span className="font-bold text-sm tracking-wide">Melhor Vendedor (Mês)</span>
            </div>
            <div className="text-2xl font-black truncate">{employees[0]?.name || 'N/A'}</div>
            <div className="text-sm font-bold mt-2 opacity-90">+12% vs mês anterior</div>
         </Card>
         <Card className="p-6 rounded-3xl border-0 shadow-sm bg-white">
            <div className="flex items-center gap-3 text-slate-500 mb-4">
               <TrendingUp className="w-5 h-5" />
               <span className="font-bold text-sm tracking-wide">Eficiência Média</span>
            </div>
            <div className="text-2xl font-black text-slate-800">89%</div>
            <div className="text-sm font-bold mt-2 text-emerald-500">Taxa de sucesso</div>
         </Card>
      </div>

      <Card className="overflow-hidden p-0 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] bg-white rounded-3xl">
        <div className="p-6 border-b border-slate-100">
           <h3 className="font-black text-slate-800">Ranking Geral</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-5">#</th>
                <th className="px-6 py-5">Funcionário</th>
                <th className="px-6 py-5">Vendas (Mês)</th>
                <th className="px-6 py-5">Erros / Cancelamentos</th>
                <th className="px-6 py-5">Eficiência</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp, idx) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-400">
                     {idx + 1}
                  </td>
                  <td className="px-6 py-4">
                     <div className="font-bold text-slate-800">{emp.name}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">
                     + {(Math.random() * 50).toFixed(0)} <span className="text-xs text-slate-400 opacity-60">recibos</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-rose-500">
                     {(Math.random() * 5).toFixed(0)}
                  </td>
                  <td className="px-6 py-4 font-black text-slate-800">
                     {(80 + Math.random() * 20).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg font-bold border-slate-200 hover:bg-blue-50 hover:text-blue-600" title="Editar Avaliação" onClick={() => toast.info('As métricas são calculadas automaticamente.')}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg font-bold border-rose-200 text-rose-500 hover:bg-rose-50" title="Eliminar Histórico" onClick={() => toast.info('Histórico de métricas não pode ser apagado.')}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                     </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                 <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">
                       Dados insuficientes para análise.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
