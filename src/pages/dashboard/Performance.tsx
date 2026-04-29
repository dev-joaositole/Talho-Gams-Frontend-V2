import React from 'react';
import { Card } from '@/pages/hr/ui/card';
import { staffPerformanceData } from '@/models/dashboardMocks';
import { Award, Target, Timer, TrendingUp } from 'lucide-react';
import { useDashboardContext } from './DashboardContext';

export default function Performance() {
  const { searchQuery } = useDashboardContext();

  const filteredStaff = staffPerformanceData.filter(staff => {
     if (!searchQuery) return true;
     const q = searchQuery.toLowerCase();
     return staff.name.toLowerCase().includes(q) || staff.role.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Level KPIs */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-8 pb-6 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Meta Diária</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">85% <span className="text-sm text-slate-400 font-medium">Atingido</span></h3>
          </div>
        </Card>

        <Card className="p-8 pb-6 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center shrink-0">
            <Timer className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Atendimento Médio</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">2m 15s</h3>
          </div>
        </Card>

        <Card className="p-8 pb-6 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/40 text-green-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Ticket Médio</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">2,450 MT</h3>
          </div>
        </Card>
      </div>

      {/* Staff Performance Table/List */}
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 mt-8 flex items-center gap-2">
        <Award className="w-6 h-6 text-blue-600" /> 
        Performance da Equipa
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {filteredStaff.length === 0 && <div className="p-6 text-slate-500 dark:text-slate-400 font-bold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center md:col-span-2">Nenhum operador encontrado</div>}
        {filteredStaff.map((staff, idx) => (
          <Card key={staff.id} className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{staff.name}</span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{staff.role}</span>
              </div>
              <div className="text-2xl font-black text-slate-200">#{idx + 1}</div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                  <span>Avaliação (Score)</span>
                  <span>{staff.rating}/100</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${staff.rating}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-slate-50 dark:border-slate-800 mt-4">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Vendas</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{staff.sales} Registos</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Faturação</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{staff.revenue}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
