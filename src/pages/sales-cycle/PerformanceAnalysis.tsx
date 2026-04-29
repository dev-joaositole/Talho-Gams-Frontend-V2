import React, { useState } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { LineChart, Users, Building2, Ticket, TrendingUp, AlertOctagon, TrendingDown, GitCompare, Trophy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/hr/ui/select';
import { usePerformanceAnalysisController } from './controllers/usePerformanceAnalysisController';
import { useSalesCycleContext } from './SalesCycleContext';
import { Button } from '@/pages/hr/ui/button';

export default function PerformanceAnalysis() {
  const { period, setPeriod, branchesPerformance, operatorsPerformance } = usePerformanceAnalysisController();
  const { branchId, branchName, searchQuery } = useSalesCycleContext();
  const [showComparison, setShowComparison] = useState(false);

  // Filter based on search query
  const filteredBranches = branchesPerformance.filter(b => !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredOperators = operatorsPerformance.filter(o => !searchQuery || o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.f.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="pt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
         <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <LineChart className="w-6 h-6 text-purple-600" />
               Análise de Desempenho - {branchName}
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-1">Avaliação da eficiência global, funcionários e lojas.</p>
         </div>
         
         <div className="flex items-center gap-3">
            {branchId === 'global' && (
              <Button 
                 variant="outline" 
                 className="rounded-xl border-slate-200 shadow-sm"
                 onClick={() => setShowComparison(!showComparison)}
              >
                 <GitCompare className="w-4 h-4 mr-2 text-slate-500" />
                 {showComparison ? 'Voltar à Visão Geral' : 'Comparar Filiais'}
              </Button>
            )}
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm">
               <span className="text-xs font-bold text-slate-400 uppercase">Referência</span>
               <Select value={period} onValueChange={setPeriod}>
                 <SelectTrigger className="h-8 border-0 bg-transparent shadow-none p-0 focus:ring-0 font-bold text-slate-700 w-[120px]">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                   <SelectItem value="semana" className="font-bold cursor-pointer">Semana Passada</SelectItem>
                   <SelectItem value="mes" className="font-bold cursor-pointer">Mês Passado</SelectItem>
                   <SelectItem value="ano" className="font-bold cursor-pointer">Ano Passado</SelectItem>
                 </SelectContent>
               </Select>
            </div>
         </div>
      </div>

      {showComparison ? (
         <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm animate-in fade-in">
            <h3 className="font-black text-slate-800 text-lg mb-6">Comparativo Direto de Filiais</h3>
            <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
               {filteredBranches.map((branch, i) => (
                  <div key={i} className="min-w-[300px] flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                     {i === 0 && <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg border-2 border-white"><Trophy className="w-4 h-4 text-white" /></div>}
                     <h4 className="font-bold text-slate-700 mb-2">{branch.name}</h4>
                     <div className="text-3xl font-black text-slate-900 mb-4">{branch.revenue}</div>
                     
                     <div className="space-y-4">
                        <div>
                           <div className="text-xs font-bold text-slate-400 uppercase mb-1">Participação</div>
                           <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{width: `${branch.percentage}%`}}></div>
                           </div>
                           <div className="text-right text-xs font-bold text-slate-500 mt-1">{branch.percentage}%</div>
                        </div>
                        <div>
                           <div className="text-xs font-bold text-slate-400 uppercase mb-1">Crescimento Relativo</div>
                           <span className={`text-sm font-bold flex items-center ${branch.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                             {branch.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>} 
                             {branch.trendValue}% vs {period}
                           </span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      ) : (
      <>
      {/* KPI Comparativo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <Card className="bg-white p-6 rounded-3xl shadow-sm border-slate-200/60 relative overflow-hidden">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Crescimento de Receita</h3>
            <div className="flex items-baseline gap-2 mb-2">
               <span className="text-3xl font-black text-emerald-500">+15%</span>
               <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs font-bold text-slate-400">vs {period === 'mes' ? 'Mês anterior' : 'Período anterior'}</p>
         </Card>

         <Card className="bg-white p-6 rounded-3xl shadow-sm border-slate-200/60 relative overflow-hidden">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Ticket Médio (Fatura)</h3>
            <div className="flex items-baseline gap-2 mb-2">
               <span className="text-3xl font-black text-slate-800">1,250 MZN</span>
               <span className="text-sm font-bold text-emerald-500">+2%</span>
            </div>
            <p className="text-xs font-bold text-slate-400">Os clientes estão a comprar mais produtos por ida.</p>
         </Card>

         <Card className="bg-white p-6 rounded-3xl shadow-sm border-slate-200/60 relative overflow-hidden">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Margem de Lucro Est.</h3>
            <div className="flex items-baseline gap-2 mb-2">
               <span className="text-3xl font-black text-slate-800">28%</span>
               <span className="text-sm font-bold text-amber-500">-1%</span>
            </div>
            <p className="text-xs font-bold text-slate-400">Ligeira queda devido a aumento no preço de custo (Aves).</p>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Performance por Loja */}
         <Card className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-slate-200/60">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                  Performance por Estabelecimento
               </h3>
            </div>
            
            <div className="space-y-6">
               {filteredBranches.map((branch, i) => (
                 <div key={i} className="group relative pr-16">
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-slate-700">{branch.name}</span>
                       <span className={`font-black ${i === 0 ? 'text-indigo-600' : i === 1 ? 'text-blue-600' : 'text-slate-400'}`}>{branch.revenue}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full ${i === 0 ? 'bg-indigo-500' : i === 1 ? 'bg-blue-500' : 'bg-slate-400'}`} style={{ width: `${branch.percentage}%` }}></div>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end">
                       <span className={`text-xs font-bold flex items-center ${branch.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {branch.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1"/> : <TrendingDown className="w-3 h-3 mr-1"/>} 
                         {branch.trendValue}%
                       </span>
                    </div>
                 </div>
               ))}
               {filteredBranches.length === 0 && <div className="text-center text-slate-500 font-medium py-4">Nenhuma filial encontrada</div>}
            </div>

            <div className="mt-8 bg-rose-50 p-4 rounded-xl border border-rose-100 flex gap-4 items-start">
               <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
               <div>
                  <h4 className="text-sm font-bold text-rose-700">Anomalia nas Vendas - Filial Beira</h4>
                  <p className="text-xs font-medium text-rose-600 mt-1">A loja apresenta queda persistente. O ticket médio é 30% inferior ao das outras lojas. Pode ser necessário revisar a tabela de preços local ou operação da equipe.</p>
               </div>
            </div>
         </Card>

         {/* Performance por Operador */}
         <Card className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-slate-200/60">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  Top Operadores (Caixas)
               </h3>
               <div className="text-xs font-bold text-slate-400">Classificação por faturamento</div>
            </div>

            <div className="space-y-0 divide-y divide-slate-100">
               {filteredOperators.map(op => (
                 <div key={op.name} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${op.r === 1 ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'}`}>
                         {op.r}
                       </div>
                       <div>
                          <div className="font-bold text-slate-800">{op.name}</div>
                          <div className="text-xs font-bold text-slate-400">{op.f}</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="font-black text-slate-700">{op.v}</div>
                       <div className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1">
                         <Ticket className="w-3 h-3" /> TM: {op.t}
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <button className="w-full mt-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm py-3 rounded-xl transition-colors">
               Ver Relatório Completo da Equipe
            </button>
         </Card>
      </div>
      </>
      )}

    </div>
  );
}
