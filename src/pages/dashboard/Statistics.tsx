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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Despesas vs Receitas Chart */}
        <Card className="min-h-[420px] flex flex-col justify-between">
          <div className="p-8 pb-0">
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Receitas vs Despesas</h3>
             <p className="text-sm text-slate-400 font-medium">Balanço financeiro semestral</p>
          </div>
          <div className="h-[320px] w-full mt-4 p-4 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statisticsRevenueVsExpense} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#transparent" fontSize={0} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px -8px rgba(0,0,0,0.12)' }} 
                  formatter={(value: number) => `${value.toLocaleString()} MT`}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="revenue" name="Receitas" fill="#2563eb" radius={[6, 6, 6, 6]} barSize={24} />
                <Bar dataKey="expense" name="Despesas" fill="#94a3b8" radius={[6, 6, 6, 6]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categorias Distribution Chart */}
        <Card className="min-h-[420px] flex flex-col justify-between">
          <div className="p-8 pb-0">
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Distribuição por Categoria</h3>
             <p className="text-sm text-slate-400 font-medium">Percentagem de vendas baseada no tipo de carne</p>
          </div>
          <div className="h-[320px] w-full mt-2 flex items-center justify-center p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {filteredCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px -8px rgba(0,0,0,0.12)' }} 
                />
                <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
