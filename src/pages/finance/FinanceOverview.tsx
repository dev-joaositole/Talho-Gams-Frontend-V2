import React, { useState } from 'react';
import { Card } from '@/pages/hr/ui/card';
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

const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8']; // Institutional, sober colors

export default function FinanceOverview() {
  const [period, setPeriod] = useState('Semana');
  const [branch, setBranch] = useState('Todas');
  const [paymentMethod, setPaymentMethod] = useState('Todos');

  const receitaBruta = 520000;
  const devolucoes = 10000;
  const receitaLiquida = receitaBruta - devolucoes;
  const cmv = 280000;
  const despesas = 150000; 
  const lucroBruto = receitaLiquida - cmv;
  const lucroLiquido = receitaLiquida - despesas - cmv;
  const margem = (lucroLiquido / receitaLiquida) * 100;
  const caixaAtual = 350000;

  return (
    <div className="space-y-8 pt-2">
      
      {/* FILTROS FLAT */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-transparent">
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto scrollbar-hide pb-2 md:pb-0">
           <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-sm">
             {['Hoje', 'Semana', 'Mes', 'Customizado'].map(p => (
               <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                     period === p 
                     ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' 
                     : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
               >
                 {p === 'Mes' ? 'Mês' : p}
               </button>
             ))}
           </div>

          <select 
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-slate-200 shadow-sm shrink-0"
          >
            <option value="Todas">Todas Filiais</option>
            <option value="Sede">Sede (Montepuez)</option>
            <option value="Filial1">Filial Pemba</option>
          </select>

          <select 
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-slate-200 shadow-sm shrink-0"
          >
            <option value="Todos">Todas Formas Pagamento</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="MPesa">M-Pesa</option>
            <option value="POS">POS / Cartão</option>
          </select>
        </div>
      </div>

      {/* METRICAS PRINCIPAIS - FLAT SAAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Receita Bruta</h3>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{receitaBruta.toLocaleString()} <span className="text-sm font-normal text-slate-500">MT</span></p>
          </div>
        </div>

        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Receita Líquida</h3>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{receitaLiquida.toLocaleString()} <span className="text-sm font-normal text-slate-500">MT</span></p>
          </div>
        </div>

        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Despesas Totais</h3>
            <TrendingDown className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{despesas.toLocaleString()} <span className="text-sm font-normal text-slate-500">MT</span></p>
          </div>
        </div>

        <div className="p-5 border border-slate-800 rounded-xl bg-slate-900 dark:bg-zinc-950 text-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">Caixa Atual</h3>
            <Wallet className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight text-white">{caixaAtual.toLocaleString()} <span className="text-sm font-normal text-slate-500">MT</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
           <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Lucro Bruto</h3>
           <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-1">{lucroBruto.toLocaleString()} <span className="text-sm font-normal text-slate-500">MT</span></p>
           <p className="text-xs text-slate-400 font-medium">Receita Líquida - CMV</p>
        </div>
        
        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
           <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Lucro Líquido</h3>
           <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-1">{lucroLiquido.toLocaleString()} <span className="text-sm font-normal text-slate-500">MT</span></p>
           <p className="text-xs text-slate-400 font-medium">Após Despesas e Impostos</p>
        </div>

        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm col-span-2 md:col-span-1">
           <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Margem (%)</h3>
           <div className="flex items-end gap-3 flex-1 h-full">
              <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{margem.toFixed(1)}%</div>
              <div className="flex items-center text-xs font-medium mb-1.5 text-slate-500">
                 <ArrowUpRight className="w-3 h-3 mr-1" />
                 Saudável
              </div>
           </div>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="p-6 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl bg-white dark:bg-slate-900 md:col-span-2">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Receita vs Despesa</h3>
            <p className="text-sm text-slate-500">Evolução diária no período selecionado</p>
          </div>
          <div className="h-[280px]">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockIncomeExpenseData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                   itemStyle={{ fontSize: '13px', fontWeight: '500' }}
                   labelStyle={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="receita" name="Receita" stroke="#0f172a" strokeWidth={2} dot={{r: 3, strokeWidth: 1}} activeDot={{r: 5}} />
                <Line type="monotone" dataKey="despesa" name="Despesa" stroke="#94a3b8" strokeWidth={2} dot={{r: 3, strokeWidth: 1}} activeDot={{r: 5}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl bg-white dark:bg-slate-900">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Lucro Diário</h3>
            <p className="text-sm text-slate-500">Saldo global por dia</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockProfitData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                   cursor={{fill: '#f1f5f9'}}
                   contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   itemStyle={{ fontSize: '13px', fontWeight: '500' }}
                />
                <Bar dataKey="lucro" name="Lucro" radius={[4,4,4,4]}>
                  {
                    mockProfitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.lucro > 0 ? '#0f172a' : '#cbd5e1'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl bg-white dark:bg-slate-900 md:col-span-3">
           <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                 <div className="mb-6">
                   <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Top Despesas por Categoria</h3>
                   <p className="text-sm text-slate-500">Distribuição do orçamento de custos</p>
                 </div>
                 <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockExpensesByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {mockExpensesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                           itemStyle={{ fontSize: '13px', fontWeight: '500' }}
                           formatter={(value) => `${Number(value).toLocaleString()} MT`}
                        />
                        <Legend 
                           layout="vertical" 
                           verticalAlign="middle" 
                           align="right"
                           wrapperStyle={{ fontSize: '13px' }}
                           iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              
              <div className="md:w-1/3 flex flex-col justify-center gap-4">
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-500 mb-1">Maior Custo</h4>
                    <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">Fornecedores <span className="text-sm font-medium text-slate-500 float-right">54%</span></p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-500 mb-1">Atenção Necessária</h4>
                    <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">Manutenção <span className="text-sm font-medium text-slate-500 float-right">+15%</span></p>
                    <p className="text-xs text-slate-400 mt-2">Aumento em relação ao mês anterior.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Faturamento por Filial + Métodos */}
        <div className="p-6 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl bg-white dark:bg-slate-900 md:col-span-2">
          <div className="mb-6">
             <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Faturamento por Local</h3>
             <p className="text-sm text-slate-500">Detalhes do mix de métodos de pagamento</p>
          </div>
          <div className="space-y-4">
             {/* Filial Sede */}
             <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                   <h4 className="font-semibold text-slate-900 dark:text-slate-100">Sede Global</h4>
                   <span className="font-medium text-slate-900 dark:text-slate-100">320.000 MT</span>
                </div>
                <div className="space-y-3">
                   <div className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-slate-900 dark:bg-slate-100"></div>Dinheiro Físico</div>
                      <span>150.000 MT</span>
                   </div>
                   <div className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-slate-500"></div>M-Pesa / Transf.</div>
                      <span>100.000 MT</span>
                   </div>
                   <div className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-slate-300 dark:bg-slate-700"></div>Cartão Bancário</div>
                      <span>70.000 MT</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 flex rounded-full overflow-hidden mt-3 gap-[1px]">
                      <div className="bg-slate-900 dark:bg-slate-100 h-full" style={{width: '47%'}}></div>
                      <div className="bg-slate-500 h-full" style={{width: '31%'}}></div>
                      <div className="bg-slate-300 dark:bg-slate-600 h-full" style={{width: '22%'}}></div>
                   </div>
                </div>
             </div>
             
             {/* Filial Pemba */}
             <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                   <h4 className="font-semibold text-slate-900 dark:text-slate-100">Filial Pemba</h4>
                   <span className="font-medium text-slate-900 dark:text-slate-100">200.000 MT</span>
                </div>
                <div className="space-y-3">
                   <div className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-slate-900 dark:bg-slate-100"></div>Dinheiro Físico</div>
                      <span>120.000 MT</span>
                   </div>
                   <div className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-slate-500"></div>M-Pesa / Transf.</div>
                      <span>50.000 MT</span>
                   </div>
                   <div className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-slate-300 dark:bg-slate-700"></div>Cartão Bancário</div>
                      <span>30.000 MT</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 flex rounded-full overflow-hidden mt-3 gap-[1px]">
                      <div className="bg-slate-900 dark:bg-slate-100 h-full" style={{width: '60%'}}></div>
                      <div className="bg-slate-500 h-full" style={{width: '25%'}}></div>
                      <div className="bg-slate-300 dark:bg-slate-600 h-full" style={{width: '15%'}}></div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Performance de Caixas (Filial) */}
        <div className="p-6 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl bg-white dark:bg-slate-900 md:col-span-1">
          <div className="mb-6">
             <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Top Caixas</h3>
             <p className="text-sm text-slate-500">Operadores em destaque</p>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 flex flex-shrink-0 items-center justify-center text-xs">J</div>
                   <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">João Sitolo</h4>
                      <p className="text-xs text-slate-500">Sede Global</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">180k MT</p>
                   <p className="text-xs text-slate-500">94 vendas</p>
                </div>
             </div>
             
             <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

             <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 flex flex-shrink-0 items-center justify-center text-xs">M</div>
                   <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">Maria Clara</h4>
                      <p className="text-xs text-slate-500">Sede Global</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">110k MT</p>
                   <p className="text-xs text-slate-500">65 vendas</p>
                </div>
             </div>

             <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

             <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 flex flex-shrink-0 items-center justify-center text-xs">C</div>
                   <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">Carlos M.</h4>
                      <p className="text-xs text-slate-500">Filial Pemba</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">85k MT</p>
                   <p className="text-xs text-slate-500">42 vendas</p>
                </div>
             </div>
             
             <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

             <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 flex flex-shrink-0 items-center justify-center text-xs">A</div>
                   <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm">Ana Santos</h4>
                      <p className="text-xs text-slate-500">Filial Pemba</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">80k MT</p>
                   <p className="text-xs text-slate-500">38 vendas</p>
                </div>
             </div>
          </div>
        </div>

      </div>
      <div className="h-6"></div>
    </div>
  );
}
