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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-2xl font-bold text-slate-800">Métricas de Desempenho</h1>
      </div>
      
      {/* Top Level KPIs */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="border border-slate-100 rounded-[20px] p-5 bg-white shrink-0 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#e0e7ff] text-[#4f46e5] flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 mb-1">Meta Diária</p>
            <h3 className="text-xl font-bold text-slate-800">85% <span className="text-[11px] text-slate-400 font-medium">Atingido</span></h3>
          </div>
        </div>

        <div className="border border-slate-100 rounded-[20px] p-5 bg-white shrink-0 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 mb-1">T.M Atendimento</p>
            <h3 className="text-xl font-bold text-slate-800">2m 15s</h3>
          </div>
        </div>

        <div className="border border-slate-100 rounded-[20px] p-5 bg-white shrink-0 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 mb-1">Ticket Médio</p>
            <h3 className="text-xl font-bold text-slate-800">2,450 MT</h3>
          </div>
        </div>
      </div>

      {/* Staff Performance Table/List */}
      <h3 className="text-[13px] font-bold text-slate-800 mt-2 flex items-center gap-2">
        <Award className="w-4 h-4 text-[#4f46e5]" /> 
        Desempenho da Equipa
      </h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        {filteredStaff.length === 0 && <div className="p-6 text-slate-500 text-[12px] text-center border border-slate-100 rounded-[20px] md:col-span-2">Nenhum operador encontrado</div>}
        {filteredStaff.map((staff, idx) => (
          <div key={staff.id} className="border border-slate-100 rounded-[20px] p-6 bg-white shrink-0 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-800">{staff.name}</span>
                <span className="text-[11px] font-medium text-slate-500">{staff.role}</span>
              </div>
              <div className="text-2xl font-bold text-slate-200">#{idx + 1}</div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-2">
                  <span>Pontuação</span>
                  <span>{staff.rating}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className="bg-[#4f46e5] h-1.5 rounded-full" 
                    style={{ width: `${staff.rating}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-50 mt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400">TOTAL VENDAS</span>
                  <span className="text-[12px] font-bold text-slate-700">{staff.sales} Registos</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-bold text-slate-400">RECEITA</span>
                  <span className="text-[12px] font-bold text-slate-700">{staff.revenue}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
