import React from 'react';
import { Card, CardContent } from '@/pages/hr/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { overviewSalesData, topProductsData, alertsData } from '@/models/dashboardMocks';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardContext } from './DashboardContext';

export default function Overview() {
  const navigate = useNavigate();
  const { searchQuery } = useDashboardContext();

  const filteredProducts = topProductsData.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.info.toLowerCase().includes(searchQuery.toLowerCase()));
  
  // Check for critical finance or stock alerts
  const criticalAlerts = alertsData.filter(a => a.type === 'critical' || a.type === 'warning').filter(a => !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.message.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {criticalAlerts.length > 0 && (
        <div 
           className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-amber-100 dark:bg-amber-900/40/50 transition-colors"
           onClick={() => navigate('/dashboard/alertas')}
        >
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                 <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                 <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100">Atenção no Sistema</h4>
                 <p className="text-xs text-amber-700 font-medium">{criticalAlerts.length} alertas pendentes (Despesas e Estoque). Clique para verificar.</p>
              </div>
           </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col justify-center min-h-[140px] px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
               <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Vendas de Hoje</p>
               <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">12,450MT</h3>
            </div>
          </div>
          <p className="text-sm font-semibold text-green-500 mt-4 tracking-wide">+15.2% vs ontem</p>
        </Card>
        
        <Card className="flex flex-col justify-center min-h-[140px] px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
               <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Lucro Atual</p>
               <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">4,320MT</h3>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-400 mt-4 tracking-wide">Margem média: 25%</p>
        </Card>

        <Card className="flex flex-col justify-center min-h-[140px] px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
               <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Alerta de Stock</p>
               <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">4 Itens</h3>
            </div>
          </div>
          <p className="text-sm font-semibold text-amber-500 mt-4 tracking-wide">Abaixo do limite</p>
        </Card>

        <Card className="flex flex-col justify-center min-h-[140px] px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
               <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Terminais / Caixas</p>
               <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">2 Abertos</h3>
            </div>
          </div>
          <p className="text-sm font-semibold text-blue-500 mt-4 tracking-wide">De 3 no total</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart Area */}
        <Card className="lg:col-span-4 min-h-[400px] flex flex-col justify-between">
          <div className="p-8 pb-0">
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Evolução da Faturação</h3>
             <p className="text-sm text-slate-400 font-medium">Ciclo dos últimos 7 dias operacionais</p>
          </div>
          <div className="h-[280px] w-full mt-4 p-4 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overviewSalesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} dx={-10} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px -8px rgba(0,0,0,0.12)' }} 
                />
                <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Products section */}
        <Card className="lg:col-span-3 min-h-[400px]">
          <div className="p-8 pb-6 border-b border-slate-50 dark:border-slate-800 max-w-full overflow-hidden">
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Top Mais Vendidos</h3>
             <p className="text-sm text-slate-400 font-medium">Hoje: Produtos por volume de vendas</p>
          </div>
          <CardContent className="p-8 pt-6">
            <div className="space-y-7">
              {filteredProducts.length === 0 && <div className="text-center text-slate-500 dark:text-slate-400 font-bold">Nenhum produto encontrado.</div>}
              {filteredProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 font-extrabold text-sm shadow-sm">
                      {product.badge}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-[15px] truncate">{product.name}</p>
                      <p className="text-[12px] text-slate-400 font-medium truncate">{product.info}</p>
                    </div>
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-sm shrink-0">
                    {product.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
