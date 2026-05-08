import React, { useState, useMemo } from 'react';
import { BarChart3, Clock, CalendarDays, Activity, MousePointerClick, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/hr/ui/select';
import { useSalesCycleContext } from './SalesCycleContext';

export type CycleViewType = 'diario' | 'semanal';

export interface CycleDailyData {
  h: string;
  v: number;
  label?: string;
}

export interface CycleWeeklyData {
  dia: string;
  v: number;
}

export const getDailyData = (): CycleDailyData[] => [
  { h: '07', v: 12 }, { h: '08', v: 45 }, { h: '09', v: 80 }, { h: '10', v: 110, label: 'Pico' },
  { h: '11', v: 130, label: 'Máx' }, { h: '12', v: 95 }, { h: '13', v: 60 }, { h: '14', v: 55 },
  { h: '15', v: 75 }, { h: '16', v: 115, label: 'Pico' }, { h: '17', v: 125 }, { h: '18', v: 90 },
  { h: '19', v: 40 }, { h: '20', v: 15, label: 'Baixo' }
];

export const getWeeklyData = (): CycleWeeklyData[] => [
  { dia: 'Seg', v: 450 }, { dia: 'Ter', v: 380 }, { dia: 'Qua', v: 410 },
  { dia: 'Qui', v: 520 }, { dia: 'Sex', v: 780 }, { dia: 'Sáb', v: 950 }, { dia: 'Dom', v: 620 }
];

export default function CyclesAnalysis() {
  const { branchName, branchId, period } = useSalesCycleContext();
  const [view, setView] = useState<CycleViewType>('diario');

  const dailyData = useMemo(() => {
    let data = getDailyData();
    if (branchId !== 'global') {
        const shift = branchId === '2' ? -6 : (branchId === '3' ? 2 : 0);
        data = data.map((d, i, arr) => {
           let newIndex = (i + shift) % arr.length;
           if (newIndex < 0) newIndex += arr.length;
           return {
              ...d,
              v: arr[newIndex].v,
           };
        });
        data.forEach(d => d.label = '');
        const maxVal = Math.max(...data.map(d=>d.v));
        const minVal = Math.min(...data.map(d=>d.v));
        data.forEach(d => {
           if (d.v === maxVal) d.label = 'Máx';
           else if (d.v > maxVal * 0.8) d.label = 'Pico';
           else if (d.v === minVal) d.label = 'Baixo';
        });
    }
    return data;
  }, [branchId]);

  const weeklyData = useMemo(() => {
    let data = getWeeklyData();
    if (branchId !== 'global') {
       data = data.map(d => ({
           ...d,
           v: Math.floor(d.v * (Math.random() * 0.6 + 0.4))
       }));
    }
    return data;
  }, [branchId, period]);

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex justify-between items-end shrink-0">
         <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#111827]">Análise de Ciclos Temporais</span>
            <span className="text-[12px] text-[#6B7280]">Padrões de venda diários e semanais em {branchName}</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-8 bg-white border border-[#E5E7EB] rounded-[6px] flex items-center px-2.5">
               <CalendarDays className="w-3.5 h-3.5 text-[#9CA3AF] mr-2" />
               <select 
                 className="bg-transparent border-none text-[12px] font-semibold text-[#111827] focus:ring-0 cursor-pointer outline-none"
                 value={view}
                 onChange={(e) => setView(e.target.value as CycleViewType)}
               >
                 <option value="diario">Ciclo Diário (Horas)</option>
                 <option value="semanal">Ciclo Semanal (Dias)</option>
               </select>
            </div>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-160px)]">
         <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            <div className="bg-white border border-[#E5E7EB] p-5 rounded-[8px] flex-shrink-0">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-[12px] text-[#111827] uppercase tracking-wide">
                     {view === 'diario' && 'Volume de Vendas por Hora'}
                     {view === 'semanal' && 'Volume de Vendas por Dia da Semana'}
                  </h3>
                  <div className="text-[10px] font-bold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-[4px] uppercase tracking-wider">Histórico</div>
               </div>

               {view === 'diario' && (
                 <div className="h-56 flex items-end justify-between gap-1 pt-4 border-b border-[#F3F4F6]">
                    {dailyData.map((bar, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 group">
                         {bar.label && <span className={`text-[9px] font-bold mb-1.5 px-1 py-0.5 rounded-[2px] uppercase tracking-wide ${bar.label === 'Baixo' ? 'bg-[#F3F4F6] text-[#6B7280]' : 'bg-[#E0E7FF] text-[#4F46E5]'} opacity-0 group-hover:opacity-100 transition-opacity`}>{bar.label}</span>}
                         <div className={`w-full max-w-[20px] rounded-t-[2px] transition-all hover:opacity-80 ${bar.v > 80 ? 'bg-[#111827]' : bar.v < 40 ? 'bg-[#E5E7EB]' : 'bg-[#9CA3AF]'}`} style={{ height: `${bar.v}%` }}></div>
                         <span className="text-[10px] font-medium text-[#6B7280] mt-2">{bar.h}</span>
                      </div>
                    ))}
                 </div>
               )}

               {view === 'semanal' && (
                 <div className="h-56 flex items-end justify-around gap-4 pt-4 border-b border-[#F3F4F6]">
                    {weeklyData.map((bar, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 group w-12">
                         <span className="text-[9px] font-bold text-[#6B7280] mb-1.5 opacity-0 group-hover:opacity-100">{bar.v}%</span>
                         <div className={`w-full max-w-[32px] rounded-t-[2px] transition-all ${bar.v > 80 ? 'bg-[#111827]' : 'bg-[#9CA3AF]'}`} style={{ height: `${bar.v}%` }}></div>
                         <span className="text-[10px] font-semibold text-[#6B7280] mt-2 uppercase">{bar.dia}</span>
                      </div>
                    ))}
                 </div>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-shrink-0">
               <div className="bg-white p-4 rounded-[8px] border border-[#E5E7EB] flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#F3F4F6] text-[#4B5563] rounded-[6px] flex items-center justify-center shrink-0">
                     <Activity className="w-4 h-4" />
                  </div>
                  <div>
                     <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Período de Alta Gestão</div>
                     <div className="text-[14px] font-semibold text-[#111827] mt-1">18h - 19h</div>
                     <div className="text-[11px] text-[#4B5563] mt-1.5 leading-relaxed">Representa 25% do volume diário de tickets. Recomenda-se escala máxima.</div>
                  </div>
               </div>

               <div className="bg-white p-4 rounded-[8px] border border-[#E5E7EB] flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#F3F4F6] text-[#4B5563] rounded-[6px] flex items-center justify-center shrink-0">
                     <Clock className="w-4 h-4" />
                  </div>
                  <div>
                     <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Período Ocioso</div>
                     <div className="text-[14px] font-semibold text-[#111827] mt-1">14h - 15h</div>
                     <div className="text-[11px] text-[#4B5563] mt-1.5 leading-relaxed">Menor fluxo do dia. Perfeito para limpeza, inventário e pausas programadas.</div>
                  </div>
               </div>
            </div>
         </div>

         <div className="w-[300px] flex flex-col gap-4 shrink-0 overflow-y-auto">
            <span className="font-bold text-[#111827] text-[12px] uppercase tracking-wide">Observações do Sistema</span>

            <div className="bg-white border border-[#E5E7EB] p-4 rounded-[8px]">
               <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">Padrão Detectado</div>
               <div className="font-semibold text-[#111827] text-[12px] mb-1.5">Vendas aumentam aos Sábados</div>
               <p className="text-[#4B5563] text-[11px] mb-3 leading-relaxed">Historicamente, o fim de semana exige maior reposição de produtos frescos e congelados.</p>
               <button className="w-full text-[11px] font-bold text-[#111827] bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] py-1.5 rounded-[4px] transition-colors cursor-pointer focus:outline-none">
                  Verificar Escalas
               </button>
            </div>

            <div className="bg-white border border-[#E5E7EB] p-4 rounded-[8px]">
               <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">Sugestão de Ação</div>
               <div className="font-semibold text-[#111827] text-[12px] mb-1.5">Promover produtos em horários mortos</div>
               <p className="text-[#4B5563] text-[11px] leading-relaxed">Aproveite as 14h às 16h para girar stock com menor prazo de validade criando pacotes promocionais diários.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
