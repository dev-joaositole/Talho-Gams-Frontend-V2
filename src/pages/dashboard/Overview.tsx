import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useDashboardContext } from './DashboardContext';

export default function Overview() {
  const { searchQuery } = useDashboardContext();

  const barData = [
    { name: '01', pv: 400, uv: 240 },
    { name: '02', pv: 300, uv: 139 },
    { name: '03', pv: 200, uv: 980 },
    { name: '04', pv: 278, uv: 390 },
    { name: '05', pv: 189, uv: 480 },
    { name: '06', pv: 239, uv: 380 },
    { name: '07', pv: 349, uv: 430 },
    { name: '08', pv: 200, uv: 300 },
    { name: '09', pv: 278, uv: 200 },
    { name: '10', pv: 189, uv: 278 },
    { name: '11', pv: 349, uv: 189 },
    { name: '12', pv: 200, uv: 349 },
  ].filter(d => !searchQuery || d.name.includes(searchQuery));

  const pieData = [
    { name: 'Tarde', value: 400, color: '#4f46e5' },
    { name: 'Noite', value: 300, color: '#818cf8' },
    { name: 'Manhã', value: 300, color: '#c7d2fe' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-center">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Receita Bruta</span>
           <span className="text-xl font-black text-slate-800">1,342,500 MT</span>
           <span className="text-[10px] text-emerald-500 font-bold mt-1">+12% vs mês ant.</span>
        </div>
        {/* Net Revenue */}
        <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-center">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Receita Líquida</span>
           <span className="text-xl font-black text-slate-800">818,450 MT</span>
           <span className="text-[10px] text-emerald-500 font-bold mt-1">+8% vs mês ant.</span>
        </div>
        {/* Active Cashiers */}
        <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-center">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Caixas Ativas</span>
           <span className="text-xl font-black text-slate-800">3 / 4</span>
           <div className="flex gap-1 mt-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-medium">Em operação</span>
           </div>
        </div>
        {/* Quick Actions */}
        <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm flex flex-col justify-center gap-2">
           <button className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-[#4f46e5] text-[11px] font-bold rounded-xl transition-colors text-center shadow-sm">
              + Nova Venda
           </button>
           <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold rounded-xl transition-colors text-center border border-slate-200">
              Ver Relatório Diário
           </button>
        </div>
      </div>

      {/* Grid Layout matches image approximately */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Section (Takes 2 columns) */}
        <div className="lg:col-span-2 border border-slate-100 rounded-[20px] p-6 bg-white shrink-0 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[13px] font-bold text-slate-500 mb-1">Receita</h3>
              <div className="text-2xl font-bold text-slate-800 mb-2">MZN 128,520</div>
              <div className="flex items-center gap-2">
                <span className="flex items-center text-[12px] font-bold text-emerald-500">
                  <TrendingUp className="w-3 h-3 mr-1" /> 2.1%
                </span>
                <span className="text-[12px] text-slate-400">vs semana passada</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-4">Vendas de 1-12 Dez, 2023</p>
            </div>
            <button className="text-[12px] font-bold text-[#4f46e5] bg-[#e0e7ff] px-4 py-2 rounded-xl transition-all hover:bg-[#c7d2fe]">Ver Relatório</button>
          </div>
          
          <div className="h-[200px] mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={barData} barSize={8} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                 <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Bar dataKey="pv" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                 <Bar dataKey="uv" fill="#f1f5f9" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
             <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500"><div className="w-2 h-2 rounded-full bg-[#4f46e5]"></div> Últimos 6 dias</div>
             <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500"><div className="w-2 h-2 rounded-full bg-[#f1f5f9]"></div> Semana Passada</div>
          </div>
        </div>

        {/* Order Time Section */}
        <div className="border border-slate-100 rounded-[20px] p-6 bg-white shrink-0 flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">Horário de Pedidos</h3>
                <p className="text-[11px] text-slate-400 mt-1">De 1-6 Dez, 2023</p>
             </div>
             <button className="text-[12px] font-bold text-[#4f46e5] bg-[#e0e7ff] px-3 py-1.5 rounded-xl transition-all hover:bg-[#c7d2fe]">Ver Relatório</button>
          </div>
          <div className="flex-1 flex justify-center items-center h-[160px]">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4">
             {pieData.map(item => (
                <div key={item.name} className="text-center">
                  <div className="flex items-center gap-1.5 justify-center mb-1 text-[11px] text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div> {item.name}
                  </div>
                  <div className="text-[12px] font-bold text-slate-700">
                     {item.value}
                  </div>
                </div>
             ))}
          </div>
        </div>

        {/* Your Rating Section */}
        <div className="border border-slate-100 rounded-[20px] p-6 bg-white shrink-0 flex flex-col items-center justify-center min-h-[300px] shadow-sm">
           <div className="w-full mb-4">
              <h3 className="text-[13px] font-bold text-slate-800">Suas Avaliações</h3>
              <p className="text-[11px] text-slate-400 mt-1">Satisfação dos clientes</p>
           </div>
           
           <div className="relative w-[180px] h-[180px] my-auto">
              <div className="absolute top-0 left-0 w-[90px] h-[90px] rounded-full bg-[#818cf8] flex items-center justify-center text-white border-4 border-white shadow-sm z-20 flex-col">
                 <span className="font-bold text-[14px]">85%</span>
                 <span className="text-[8px]">Higiene</span>
              </div>
              <div className="absolute bottom-0 left-[10px] w-[80px] h-[80px] rounded-full bg-[#38bdf8] flex items-center justify-center text-white border-4 border-white shadow-sm z-30 flex-col">
                 <span className="font-bold text-[13px]">92%</span>
                 <span className="text-[8px]">Embalagem</span>
              </div>
              <div className="absolute top-[30px] right-0 w-[110px] h-[110px] rounded-full bg-[#fb923c] flex items-center justify-center text-white border-4 border-white shadow-sm z-10 flex-col">
                 <span className="font-bold text-[16px]">85%</span>
                 <span className="text-[9px]">Sabor</span>
              </div>
           </div>
        </div>

        {/* Most Ordered Food */}
        <div className="border border-slate-100 rounded-[20px] p-6 bg-white shrink-0 relative shadow-sm">
          <div className="absolute right-0 top-[40px] bottom-0 w-[1px] bg-slate-100 hidden lg:block"></div>
          <div className="mb-6">
             <h3 className="text-[13px] font-bold text-slate-800">Produtos Mais Vendidos</h3>
             <p className="text-[11px] text-slate-400 mt-1">Top desempenho no período</p>
          </div>
          <div className="space-y-5 mt-8">
             {[
               { name: 'Bife Fresco', price: 'MZN 450', img: '🥩' },
               { name: 'Frango Inteiro', price: 'MZN 750', img: '🍗' },
               { name: 'Carne Picada', price: 'MZN 450', img: '🥓' },
               { name: 'Costelinha de Porco', price: 'MZN 450', img: '🍖' },
             ].map((food, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f9fafb] group-hover:bg-[#e0e7ff] transition-colors flex items-center justify-center text-lg shadow-sm border border-slate-100">{food.img}</div>
                      <span className="text-[13px] font-bold text-slate-700 transition-colors group-hover:text-[#4f46e5]">{food.name}</span>
                   </div>
                   <span className="text-[11px] font-medium text-slate-400">{food.price}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Order Chart */}
        <div className="border border-slate-100 rounded-[20px] p-6 bg-white shrink-0 flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[13px] font-bold text-slate-800 mb-2">Pedidos</h3>
                <div className="text-2xl font-bold text-slate-800 mb-1">2,568</div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center text-[12px] font-bold text-rose-500">
                    <TrendingDown className="w-3 h-3 mr-1" /> 2.1%
                  </span>
                  <span className="text-[12px] text-slate-400">vs semana passada</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-4">Vendas de 1-6 Dez, 2023</p>
             </div>
             <button className="text-[12px] font-bold text-[#4f46e5] bg-[#e0e7ff] px-3 py-1.5 rounded-xl transition-all hover:bg-[#c7d2fe]">Ver Relatório</button>
          </div>
          
          <div className="flex-1 mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={barData.slice(0, 6)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                 <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Area type="linear" dataKey="pv" stroke="#818cf8" strokeWidth={2} fill="transparent" />
                 <Area type="linear" dataKey="uv" stroke="#cbd5e1" strokeWidth={2} fill="transparent" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
             <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500"><div className="w-2 h-2 rounded-full bg-[#818cf8]"></div> Últimos 6 dias</div>
             <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500"><div className="w-2 h-2 rounded-full bg-[#cbd5e1]"></div> Semana Passada</div>
          </div>
        </div>

      </div>
    </div>
  );
}
