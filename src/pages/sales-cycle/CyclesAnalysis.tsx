import React from 'react';
import { Card } from '@/pages/hr/ui/card';
import { BarChart3, Clock, CalendarDays, Zap, TrendingUp, HelpCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/hr/ui/select';
import { useCyclesAnalysisController } from './controllers/useCyclesAnalysisController';
import { useSalesCycleContext } from './SalesCycleContext';

export default function CyclesAnalysis() {
  const { view, setView, dailyData, weeklyData } = useCyclesAnalysisController();
  const { branchName } = useSalesCycleContext();

  return (
    <div className="pt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
         <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <BarChart3 className="w-6 h-6 text-indigo-600" />
               Análise de Ciclos Temporais - {branchName}
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-1">Descubra quando o negócio vende mais e porquê.</p>
         </div>
         
         <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
               <CalendarDays className="w-4 h-4 text-slate-400" />
               <Select value={view} onValueChange={setView}>
                 <SelectTrigger className="h-8 border-0 bg-transparent shadow-none p-0 focus:ring-0 font-bold text-slate-700 w-[140px]">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                   <SelectItem value="diario" className="font-bold cursor-pointer">Ciclo Diário (Horas)</SelectItem>
                   <SelectItem value="semanal" className="font-bold cursor-pointer">Ciclo Semanal (Dias)</SelectItem>
                   <SelectItem value="mensal" className="font-bold cursor-pointer">Evolução Mensal</SelectItem>
                 </SelectContent>
               </Select>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white p-8 rounded-3xl shadow-sm border-slate-200/60">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-slate-800 text-lg">
                     {view === 'diario' && 'Volume de Vendas por Hora'}
                     {view === 'semanal' && 'Volume de Vendas por Dia da Semana'}
                     {view === 'mensal' && 'Evolução de Receita do Mês'}
                  </h3>
                  <div className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">Baseado em dados históricos</div>
               </div>

               {/* Fake Chart Graphics */}
               {view === 'diario' && (
                 <div className="h-64 flex items-end justify-between gap-2 px-2">
                    {dailyData.map((bar, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 group">
                         {bar.label && <span className={`text-[10px] font-bold mb-2 p-1 rounded ${bar.label === 'Morto' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'} opacity-0 group-hover:opacity-100 transition-opacity`}>{bar.label}</span>}
                         <div className={`w-full rounded-t-sm transition-all duration-500 hover:opacity-80 ${bar.v > 80 ? 'bg-indigo-600' : bar.v < 40 ? 'bg-slate-300' : 'bg-indigo-400'}`} style={{ height: `${bar.v}%` }}></div>
                         <span className="text-xs font-bold text-slate-400 mt-3">{bar.h}</span>
                      </div>
                    ))}
                 </div>
               )}

               {view === 'semanal' && (
                 <div className="h-64 flex items-end justify-around gap-4 px-4">
                    {weeklyData.map((bar, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 group w-12">
                         <span className="text-xs font-bold text-slate-500 mb-2 opacity-0 group-hover:opacity-100">{bar.v}%</span>
                         <div className={`w-full max-w-[48px] rounded-t-lg transition-all duration-500 ${bar.v > 80 ? 'bg-blue-600' : 'bg-blue-300'}`} style={{ height: `${bar.v}%` }}></div>
                         <span className="text-sm font-bold text-slate-500 mt-4">{bar.d}</span>
                      </div>
                    ))}
                 </div>
               )}

               {view === 'mensal' && (
                 <div className="flex flex-col h-64 justify-center items-center opacity-50">
                    <TrendingUp className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="font-bold text-slate-400">Gráfico de linha de Evolução Mensal</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">O sistema compila os 30 dias automaticamente.</p>
                 </div>
               )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="bg-white p-6 rounded-3xl shadow-sm border-slate-200/60 flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                     <Clock className="w-6 h-6" />
                  </div>
                  <div>
                     <div className="text-sm font-bold text-slate-400 uppercase">Horário de Ouro</div>
                     <div className="text-2xl font-black text-slate-800 mt-1 18:00 - 19:00">18h - 19h</div>
                     <div className="text-sm font-medium text-slate-500 mt-2">Corresponde a 25% da faturação diária. Recomendado ter 2 caixas abertos.</div>
                  </div>
               </Card>

               <Card className="bg-white p-6 rounded-3xl shadow-sm border-slate-200/60 flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                     <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                     <div className="text-sm font-bold text-slate-400 uppercase">Período Crítico (Baixa)</div>
                     <div className="text-2xl font-black text-slate-800 mt-1">14h - 15h</div>
                     <div className="text-sm font-medium text-slate-500 mt-2">Menor fluxo do dia. Perfeito para limpeza, pausa de funcionários ou gestão de stock.</div>
                  </div>
               </Card>
            </div>
         </div>

         {/* Insights Inteligentes Sidebar */}
         <div className="space-y-6">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
               <Zap className="w-5 h-5 text-amber-500" />
               Insights da I.A.
            </h3>

            <Card className="bg-amber-50 border-0 p-6 rounded-3xl shadow-sm border-l-4 border-l-amber-400">
               <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Padrão Detectado</div>
               <div className="font-black text-slate-800 text-lg mb-2">Vendas aumentam 40% aos Sábados</div>
               <p className="text-slate-600 text-sm font-medium mb-4">Historicamente, sextas e sábados são os dias mais fortes, exigindo todo o staff disponível.</p>
               <button className="text-xs font-bold text-amber-700 bg-amber-200/50 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors">Ajustar Escalas de RH</button>
            </Card>

            <Card className="bg-slate-50 border-slate-200/60 p-6 rounded-3xl shadow-sm">
               <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Sugestão de Ação</div>
               <div className="font-black text-slate-800 text-lg mb-2">Promover produtos parados</div>
               <p className="text-slate-600 text-sm font-medium mb-4">Aproveite o período das 14h às 16h para criar ofertas momentâneas (Happy Hour do Talho) para girar o stock de carnes brancas.</p>
               <button className="text-xs font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-lg transition-colors border border-slate-300">Nova Promoção</button>
            </Card>

            <Card className="bg-indigo-50 border-0 p-6 rounded-3xl shadow-sm border-l-4 border-l-indigo-500">
               <div className="text-sm font-bold text-indigo-500/80 uppercase tracking-widest mb-1">Previsão</div>
               <div className="font-black text-slate-800 text-lg mb-2">Alto fluxo amanhã de manhã</div>
               <p className="text-slate-600 text-sm font-medium">Dia de pagamento salarial na cidade amanhã. O sistema prevê aumento de 60% na compra de carnes de 1ª linha.</p>
            </Card>
         </div>
      </div>
    </div>
  );
}
