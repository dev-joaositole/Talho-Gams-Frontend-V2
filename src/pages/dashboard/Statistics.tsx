import React from 'react';
import { Card, CardContent } from '@/pages/hr/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { statisticsCategoryData, statisticsRevenueVsExpense } from '@/models/dashboardMocks';
import { useDashboardContext } from './DashboardContext';

const COLORS = ['#2563eb', '#3b82f6', '#93c5fd', '#dbeafe'];

export default function Statistics() {
  const { searchQuery } = useDashboardContext();

  const filteredCategoryData = statisticsCategoryData.filter(cat => {
     if (!searchQuery) return true;
     return cat.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-2xl font-bold text-slate-800">Estatísticas</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Despesas vs Receitas Chart */}
        <div className="border border-slate-100 rounded-[20px] p-6 bg-white shrink-0 shadow-sm flex flex-col justify-between">
          <div className="mb-6">
             <h3 className="text-[13px] font-bold text-slate-800">Receitas & Despesas</h3>
             <p className="text-[11px] text-slate-400 mt-1">Balanço financeiro semestral</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statisticsRevenueVsExpense} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} dy={10} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  formatter={(value: number) => `${value.toLocaleString()}`}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', color: '#64748b' }} />
                <Bar dataKey="revenue" name="Receitas" fill="#4f46e5" radius={[4, 4, 4, 4]} barSize={16} />
                <Bar dataKey="expense" name="Despesas" fill="#cbd5e1" radius={[4, 4, 4, 4]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categorias Distribution Chart */}
        <div className="border border-slate-100 rounded-[20px] p-6 bg-white shrink-0 shadow-sm flex flex-col justify-between">
          <div className="mb-2">
             <h3 className="text-[13px] font-bold text-slate-800">Distribuição por Categoria</h3>
             <p className="text-[11px] text-slate-400 mt-1">Distribuição de vendas por volume</p>
          </div>
          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {filteredCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', color: '#64748b' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
