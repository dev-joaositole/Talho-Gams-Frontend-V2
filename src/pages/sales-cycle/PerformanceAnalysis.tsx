import React, { useState, useMemo } from 'react';
import { GitCompare, TrendingUp, TrendingDown, Users, AlertCircle, LineChart, Target, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/hr/ui/select';
import { useSalesCycleContext } from './SalesCycleContext';

export interface BranchPerformance {
  id: string;
  name: string;
  revenue: number;
  ticketAvg: number;
  efficiency: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

export interface OperatorPerformance {
  id: string;
  name: string;
  branch: string;
  salesCount: number;
  revenue: number;
  r: number;
}

export const getBranchesPerformance = (): BranchPerformance[] => [
  { id: '1', name: 'Sede (Montepuez)', revenue: 1450000, ticketAvg: 1850, efficiency: 94, trend: 'up', percentage: 45 },
  { id: '2', name: 'Filial Maputo', revenue: 980000, ticketAvg: 2100, efficiency: 88, trend: 'up', percentage: 30 },
  { id: '3', name: 'Filial Nampula', revenue: 810000, ticketAvg: 1450, efficiency: 76, trend: 'down', percentage: 25 },
];

export const getOperatorsPerformance = (): OperatorPerformance[] => [
  { id: 'op1', name: 'Ana Silva', branch: 'Sede', salesCount: 1245, revenue: 850000, r: 1 },
  { id: 'op2', name: 'Carlos Cuambe', branch: 'Maputo', salesCount: 980, revenue: 620000, r: 2 },
  { id: 'op3', name: 'Marta Tembe', branch: 'Nampula', salesCount: 850, revenue: 540000, r: 3 },
  { id: 'op4', name: 'João Semente', branch: 'Sede', salesCount: 790, revenue: 490000, r: 4 },
];

export default function PerformanceAnalysis() {
  const { branchId, branchName, searchQuery } = useSalesCycleContext();
  const [showComparison, setShowComparison] = useState(false);
  const [period, setPeriod] = useState('mes');

  const branchesPerformance: BranchPerformance[] = useMemo(() => {
     let perf = getBranchesPerformance();
     if (branchId !== 'global') {
        perf = perf.filter(b => b.id === branchId);
        perf = perf.map(b => ({...b, percentage: 100}));
     }
     return perf;
  }, [branchId]);

  const operatorsPerformance: OperatorPerformance[] = useMemo(() => {
     let ops = getOperatorsPerformance();
     if (branchId !== 'global') {
         ops = ops.slice(0, 3).map((op, i) => ({...op, r: i+1}));
     }
     return ops;
  }, [branchId]);

  const filteredBranches = branchesPerformance.filter(b => !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredOperators = operatorsPerformance.filter(o => !searchQuery || o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.branch.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex justify-between items-end shrink-0">
         <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#111827]">Análise de Desempenho</span>
            <span className="text-[12px] text-[#6B7280]">Métricas e análise de vendas em {branchName}</span>
         </div>
         
         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {branchId === 'global' && (
              <button 
                 className="h-8 px-3 text-[12px] font-semibold bg-white text-[#374151] border border-[#E5E7EB] rounded-[6px] hover:bg-[#F9FAFB] flex items-center transition-colors"
                 onClick={() => setShowComparison(!showComparison)}
              >
                 <GitCompare className="w-3.5 h-3.5 mr-2 text-[#9CA3AF]" />
                 {showComparison ? 'Voltar à Visão Geral' : 'Comparar Filiais'}
              </button>
            )}
            <div className="h-8 bg-white border border-[#E5E7EB] rounded-[6px] flex items-center px-2.5">
               <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mr-2">Ref:</span>
               <select 
                 className="bg-transparent border-none text-[12px] font-semibold text-[#111827] focus:ring-0 cursor-pointer outline-none w-[110px]"
                 value={period}
                 onChange={(e) => setPeriod(e.target.value)}
               >
                 <option value="semana">Semana Passada</option>
                 <option value="mes">Mês Passado</option>
                 <option value="ano">Ano Passado</option>
               </select>
            </div>
         </div>
      </div>

      <div className="h-[calc(100vh-160px)] overflow-y-auto pr-1">
        {showComparison ? (
            <div className="bg-white rounded-[8px] p-5 border border-[#E5E7EB]">
              <h3 className="font-bold text-[#111827] text-[13px] mb-4">Comparativo Direto de Filiais</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                  {filteredBranches.map((branch, i) => (
                    <div key={i} className="min-w-[280px] flex-1 bg-[#F9FAFB] p-4 rounded-[8px] border border-[#E5E7EB] relative">
                        {i === 0 && <div className="absolute top-3 right-3 bg-[#E0E7FF] text-[#4F46E5] text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase tracking-wide">Líder Geração</div>}
                        <h4 className="font-semibold text-[13px] text-[#111827]">{branch.name}</h4>
                        <div className="text-[18px] font-bold text-[#111827] mt-1.5">{branch.revenue.toLocaleString()} <span className="text-[12px] font-normal text-[#6B7280]">MT</span></div>
                        
                        <div className="space-y-4 mt-5">
                          <div>
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Quota Mês</span>
                                <span className="text-[10px] font-bold text-[#111827]">{branch.percentage}%</span>
                              </div>
                              <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#111827] rounded-full" style={{width: `${branch.percentage}%`}}></div>
                              </div>
                          </div>
                          <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-3">
                              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Variação</span>
                              <span className={`text-[11px] font-semibold flex items-center ${branch.trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                                {branch.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 mr-1"/> : <TrendingDown className="w-3.5 h-3.5 mr-1"/>} 
                                {branch.trend === 'up' ? '+12' : '-3'}% vs {period}
                              </span>
                          </div>
                        </div>
                    </div>
                  ))}
              </div>
            </div>
        ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-[8px] border border-[#E5E7EB]">
                <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Crescimento de Receita</h3>
                <div className="flex justify-between items-end mt-1">
                  <div>
                      <span className="text-[18px] font-bold text-[#10B981] block">+15.4%</span>
                      <span className="text-[11px] text-[#6B7280] mt-0.5 block">vs período ant.</span>
                  </div>
                  <div className="w-8 h-8 rounded-[6px] bg-[#ECFDF5] flex items-center justify-center shrink-0 border border-[#D1FAE5]">
                      <TrendingUp className="w-4 h-4 text-[#10B981]" />
                  </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-[8px] border border-[#E5E7EB]">
                <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Ticket Médio</h3>
                <div className="flex justify-between items-end mt-1">
                  <div>
                      <span className="text-[18px] font-bold text-[#111827] block">1,250 <span className="text-[12px] font-normal text-[#6B7280]">MT</span></span>
                      <span className="text-[11px] text-[#6B7280] mt-0.5 block flex items-center gap-1"><TrendingUp className="w-3 h-3 text-[#10B981]"/>+2% em caixas</span>
                  </div>
                  <div className="w-8 h-8 rounded-[6px] bg-[#F3F4F6] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                      <Target className="w-4 h-4 text-[#4B5563]" />
                  </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-[8px] border border-[#E5E7EB]">
                <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Margem Est. Ebitda</h3>
                <div className="flex justify-between items-end mt-1">
                  <div>
                      <span className="text-[18px] font-bold text-[#111827] block">28.0%</span>
                      <span className="text-[11px] text-[#6B7280] mt-0.5 block flex items-center gap-1"><TrendingDown className="w-3 h-3 text-[#F59E0B]"/>-1% este mês</span>
                  </div>
                  <div className="w-8 h-8 rounded-[6px] bg-[#F3F4F6] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                      <LineChart className="w-4 h-4 text-[#4B5563]" />
                  </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Performance por Loja */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E5E7EB] flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[13px] font-bold text-[#111827]">
                      Eficácia da Rede
                  </h3>
                  <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Volume</div>
                </div>
                
                <div className="space-y-5 flex-1">
                  {filteredBranches.map((branch, i) => (
                    <div key={i} className="group relative pr-14">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-[12px] text-[#111827]">{branch.name}</span>
                          <span className={`text-[12px] font-bold ${i === 0 ? 'text-[#4F46E5]' : 'text-[#6B7280]'}`}>{branch.revenue.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${i === 0 ? 'bg-[#111827]' : 'bg-[#9CA3AF]'}`} style={{ width: `${branch.percentage}%` }}></div>
                        </div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end pt-3">
                          <span className={`text-[10px] font-bold flex items-center ${branch.trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                              {branch.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-0.5"/> : <TrendingDown className="w-3 h-3 mr-0.5"/>} 
                              {branch.trend === 'up' ? '12' : '3'}%
                          </span>
                        </div>
                    </div>
                  ))}
                  {filteredBranches.length === 0 && <div className="text-center text-[12px] text-[#9CA3AF] font-medium py-4">Nenhuma filial.</div>}
                </div>

                <div className="mt-5 bg-[#F9FAFB] p-3 rounded-[6px] flex gap-2.5 items-start border border-[#E5E7EB]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#6B7280] shrink-0 mt-0.5" />
                  <div>
                      <h4 className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wide">Atenção à Filial Central</h4>
                      <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">As conversões caíram ligeiramente nas últimas 2h, verifique as transações de quebra ou estornos registados pelo gerente hoje.</p>
                  </div>
                </div>
            </div>

            {/* Performance por Operador */}
            <div className="bg-white p-5 rounded-[8px] border border-[#E5E7EB] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-bold text-[#111827]">
                      Top Operadores (Caixas)
                  </h3>
                  <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Faturação</div>
                </div>

                <div className="space-y-0 divide-y divide-[#F3F4F6] flex-1">
                  {filteredOperators.map(op => (
                    <div key={op.name} className="py-2.5 flex items-center justify-between group rounded-[4px] -mx-2 px-2 hover:bg-[#F9FAFB]">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center font-bold text-[10px] ${op.r === 1 ? 'bg-[#111827] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                              {op.r}
                          </div>
                          <div>
                              <div className="font-semibold text-[12px] text-[#111827]">{op.name}</div>
                              <div className="text-[10px] text-[#6B7280] mt-0.5 uppercase tracking-wide">{op.branch}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[12px] text-[#111827]">{op.revenue.toLocaleString()}</div>
                          <div className="text-[10px] text-[#9CA3AF] flex items-center justify-end gap-1 mt-0.5">
                              TP: {(op.revenue / op.salesCount).toFixed(0)} MT
                          </div>
                        </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-5 bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151] font-semibold text-[11px] py-2 rounded-[6px] transition-colors focus:outline-none">
                  Ver Analítica de RH
                </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
