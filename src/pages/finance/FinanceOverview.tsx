import React, { useState } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  Activity, ArrowUpRight, ArrowDownRight, CreditCard
} from 'lucide-react';

const mockIncomeExpenseData = [
  { name: 'Seg', receita: 4000, despesa: 2400 },
  { name: 'Ter', receita: 3000, despesa: 1398 },
  { name: 'Qua', receita: 2000, despesa: 9800 },
  { name: 'Qui', receita: 2780, despesa: 3908 },
  { name: 'Sex', receita: 1890, despesa: 4800 },
  { name: 'Sáb', receita: 2390, despesa: 3800 },
  { name: 'Dom', receita: 3490, despesa: 4300 },
];

const mockProfitData = [
  { name: 'Seg', lucro: 1600 },
  { name: 'Ter', lucro: 1602 },
  { name: 'Qua', lucro: -7800 },
  { name: 'Qui', lucro: -1128 },
  { name: 'Sex', lucro: -2910 },
  { name: 'Sáb', lucro: -1410 },
  { name: 'Dom', lucro: -810 },
];

const mockExpensesByCategory = [
  { name: 'Salários', value: 150000 },
  { name: 'Fornecedores', value: 300000 },
  { name: 'Energia', value: 25000 },
  { name: 'Manutenção', value: 15000 },
  { name: 'Impostos', value: 40000 },
];

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function FinanceOverview() {
  const [period, setPeriod] = useState('Semana');
  const [branch, setBranch] = useState('Todas');
  const [paymentMethod, setPaymentMethod] = useState('Todos');

  // Hardcoded overall metrics for presentation
  const receitaBruta = 520000;
  const devolucoes = 10000;
  const receitaLiquida = receitaBruta - devolucoes;
  const cmv = 280000; // Custo das mercadorias
  const despesas = 150000; 
  const lucroBruto = receitaLiquida - cmv;
  const lucroLiquido = receitaLiquida - despesas - cmv;
  const margem = (lucroLiquido / receitaLiquida) * 100;
  const caixaAtual = 350000;

  return (
    <div className="space-y-6 pt-6">
      
      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto scrollbar-hide pb-2 md:pb-0">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 shrink-0"
          >
            <option value="Hoje">Hoje</option>
            <option value="Semana">Esta Semana</option>
            <option value="Mes">Este Mês</option>
            <option value="Customizado">Customizado...</option>
          </select>
          
          <select 
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 shrink-0"
          >
            <option value="Todas">Todas Filiais</option>
            <option value="Sede">Sede (Montepuez)</option>
            <option value="Filial1">Filial Pemba</option>
          </select>

          <select 
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 shrink-0"
          >
            <option value="Todos">Todas Formas Pagamento</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="MPesa">M-Pesa</option>
            <option value="POS">POS / Cartão</option>
          </select>
        </div>
        <div className="text-sm font-bold text-slate-400 whitespace-nowrap">
          Visão Geral
        </div>
      </div>

      {/* MÉTRICAS PRINCIPAIS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Receita Bruta</h3>
            </div>
            <p className="text-2xl font-black text-slate-800">{receitaBruta.toLocaleString()} <span className="text-sm text-slate-400">MT</span></p>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <Activity className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Receita Líquida</h3>
            </div>
            <p className="text-2xl font-black text-slate-800">{receitaLiquida.toLocaleString()} <span className="text-sm text-slate-400">MT</span></p>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Despesas Totais</h3>
            </div>
            <p className="text-2xl font-black text-slate-800">{despesas.toLocaleString()} <span className="text-sm text-slate-400">MT</span></p>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-slate-900 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-0"></div>
           <div className="relative z-10">
             <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2 text-slate-300">
                   <Wallet className="w-4 h-4" />
                   <h3 className="text-xs font-bold uppercase tracking-wider">Caixa Atual</h3>
                 </div>
                 <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">Liquidez</span>
             </div>
             <p className="text-2xl font-black">{caixaAtual.toLocaleString()} <span className="text-sm text-slate-400">MT</span></p>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white">
           <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Lucro Bruto</h3>
           <div className="flex items-end justify-between">
              <p className="text-2xl font-black text-slate-800">{lucroBruto.toLocaleString()} <span className="text-sm text-slate-400 font-bold">MT</span></p>
           </div>
           <p className="text-[10px] text-slate-400 font-medium mt-1">Receita Líquida - Custo dos Produtos (CMV)</p>
        </Card>
        
        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white">
           <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Lucro Líquido</h3>
           <div className="flex items-end justify-between">
              <p className="text-2xl font-black text-emerald-600">{lucroLiquido.toLocaleString()} <span className="text-sm text-emerald-600/50 font-bold">MT</span></p>
           </div>
           <p className="text-[10px] text-slate-400 font-medium mt-1">Receita Líquida - CMV - Despesas Totais</p>
        </Card>

        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white col-span-2 md:col-span-1">
           <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Margem de Lucro (%)</h3>
           <div className="flex items-end gap-3 flex-1 h-full pb-2 mt-1">
              <div className="text-3xl font-black text-slate-800">{margem.toFixed(1)}%</div>
              <div className={`flex items-center text-xs font-bold mb-1 ${margem > 10 ? 'text-emerald-500' : 'text-amber-500'}`}>
                 <ArrowUpRight className="w-3 h-3 mr-0.5" />
                 Saudável
              </div>
           </div>
        </Card>
      </div>

      {/* GRÁFICOS */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <Card className="p-6 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Receita vs Despesa</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockIncomeExpenseData} margin={{ top: 5, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                   itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="receita" name="Receita" stroke="#3b82f6" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="despesa" name="Despesa" stroke="#ef4444" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Lucro Diário</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockProfitData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="lucro" name="Lucro" radius={[6,6,6,6]}>
                  {
                    mockProfitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.lucro > 0 ? '#10b981' : '#f43f5e'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white md:col-span-3">
           <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Top Despesas por Categoria</h3>
                 <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockExpensesByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {mockExpensesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                           itemStyle={{ fontWeight: 'bold' }}
                           formatter={(value) => `${Number(value).toLocaleString()} MT`}
                        />
                        <Legend 
                           layout="vertical" 
                           verticalAlign="middle" 
                           align="right"
                           wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              
              <div className="md:w-1/3 flex flex-col justify-center gap-4">
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">Maior Custo</h4>
                    <p className="text-lg font-black text-slate-800">Fornecedores <span className="text-sm font-bold text-slate-500 float-right">54%</span></p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">Atenção Necessária</h4>
                    <p className="text-lg font-black text-slate-800">Manutenção <span className="text-sm font-bold text-red-500 float-right">+15%</span></p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Comparado ao mês passado.</p>
                 </div>
              </div>
           </div>
        </Card>

        {/* Faturamento por Filial + Métodos */}
        <Card className="p-6 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white md:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
             <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Faturamento por Filial e Método</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Distribuição do Mix de Pagamentos</p>
             </div>
          </div>
          <div className="space-y-4">
             {/* Filial Sede */}
             <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                   <h4 className="font-black text-slate-800">Sede Global</h4>
                   <span className="font-bold text-emerald-600">320.000 MT</span>
                </div>
                <div className="space-y-2">
                   <div className="w-full flex items-center justify-between text-xs font-bold text-slate-600">
                      <div className="flex font-medium items-center gap-2"><div className="w-2 h-2 rounded bg-emerald-500"></div>Dinheiro Físico</div>
                      <span>150.000 MT</span>
                   </div>
                   <div className="w-full flex items-center justify-between text-xs font-bold text-slate-600">
                      <div className="flex font-medium items-center gap-2"><div className="w-2 h-2 rounded bg-indigo-500"></div>M-Pesa / Transf.</div>
                      <span>100.000 MT</span>
                   </div>
                   <div className="w-full flex items-center justify-between text-xs font-bold text-slate-600">
                      <div className="flex font-medium items-center gap-2"><div className="w-2 h-2 rounded bg-blue-500"></div>Cartão Bancário</div>
                      <span>70.000 MT</span>
                   </div>
                   <div className="w-full h-2 bg-slate-200 flex rounded-full overflow-hidden mt-1 gap-0.5">
                      <div className="bg-emerald-500 h-full" style={{width: '47%'}}></div>
                      <div className="bg-indigo-500 h-full" style={{width: '31%'}}></div>
                      <div className="bg-blue-500 h-full" style={{width: '22%'}}></div>
                   </div>
                </div>
             </div>
             
             {/* Filial Pemba */}
             <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                   <h4 className="font-black text-slate-800">Filial Pemba</h4>
                   <span className="font-bold text-emerald-600">200.000 MT</span>
                </div>
                <div className="space-y-2">
                   <div className="w-full flex items-center justify-between text-xs font-bold text-slate-600">
                      <div className="flex font-medium items-center gap-2"><div className="w-2 h-2 rounded bg-emerald-500"></div>Dinheiro Físico</div>
                      <span>120.000 MT</span>
                   </div>
                   <div className="w-full flex items-center justify-between text-xs font-bold text-slate-600">
                      <div className="flex font-medium items-center gap-2"><div className="w-2 h-2 rounded bg-indigo-500"></div>M-Pesa / Transf.</div>
                      <span>50.000 MT</span>
                   </div>
                   <div className="w-full flex items-center justify-between text-xs font-bold text-slate-600">
                      <div className="flex font-medium items-center gap-2"><div className="w-2 h-2 rounded bg-blue-500"></div>Cartão Bancário</div>
                      <span>30.000 MT</span>
                   </div>
                   <div className="w-full h-2 bg-slate-200 flex rounded-full overflow-hidden mt-1 gap-0.5">
                      <div className="bg-emerald-500 h-full" style={{width: '60%'}}></div>
                      <div className="bg-indigo-500 h-full" style={{width: '25%'}}></div>
                      <div className="bg-blue-500 h-full" style={{width: '15%'}}></div>
                   </div>
                </div>
             </div>
          </div>
        </Card>

        {/* Performance de Caixas (Filial) */}
        <Card className="p-6 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white md:col-span-1">
          <div className="flex flex-col mb-4 border-b border-slate-50 pb-4">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Top Caixas</h3>
             <p className="text-xs text-slate-400 font-medium mt-0.5">Operadores com mais vendas</p>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex flex-shrink-0 items-center justify-center text-xs">J</div>
                   <div>
                      <h4 className="font-bold text-slate-800 text-sm">João Sitolo</h4>
                      <p className="text-xs font-bold text-blue-600 uppercase">Sede Global</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-black text-slate-800 text-sm">180k MT</p>
                   <p className="text-[10px] text-slate-400 font-medium">94 vendas</p>
                </div>
             </div>

             <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold flex flex-shrink-0 items-center justify-center text-xs">M</div>
                   <div>
                      <h4 className="font-bold text-slate-800 text-sm">Maria Clara</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase">Sede Global</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-black text-slate-800 text-sm">110k MT</p>
                   <p className="text-[10px] text-slate-400 font-medium">65 vendas</p>
                </div>
             </div>

             <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold flex flex-shrink-0 items-center justify-center text-xs">C</div>
                   <div>
                      <h4 className="font-bold text-slate-800 text-sm">Carlos M.</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase">Filial Pemba</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-black text-slate-800 text-sm">85k MT</p>
                   <p className="text-[10px] text-slate-400 font-medium">42 vendas</p>
                </div>
             </div>
             
             <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold flex flex-shrink-0 items-center justify-center text-xs">A</div>
                   <div>
                      <h4 className="font-bold text-slate-800 text-sm">Ana Santos</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase">Filial Pemba</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-black text-slate-800 text-sm">80k MT</p>
                   <p className="text-[10px] text-slate-400 font-medium">38 vendas</p>
                </div>
             </div>
          </div>
        </Card>

      </div>
      <div className="h-6"></div> {/* Bottom Padding */}
    </div>
  );
}
