import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/pages/hr/ui/button';
import { RotateCcw } from 'lucide-react';
import { getActiveBranch } from '@/lib/storage';

import { SalesCycleContext } from './sales-cycle/SalesCycleContext';
import TopProducts from './sales-cycle/TopProducts';
import CyclesAnalysis from './sales-cycle/CyclesAnalysis';
import PerformanceAnalysis from './sales-cycle/PerformanceAnalysis';

const tabs = [
  { label: 'Produtos mais vendidos', path: '/ciclo-vendas' },
  { label: 'Ciclos', path: '/ciclo-vendas/ciclos' },
  { label: 'Análise de Desempenho', path: '/ciclo-vendas/analise' },
];

export default function SalesCycle() {
  const navigate = useNavigate();
  const location = useLocation();
  const [period, setPeriod] = useState('mes');
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeBranch = getActiveBranch();
  const branchId = activeBranch ? activeBranch.id : 'global';
  const branchName = activeBranch ? activeBranch.name : 'Visão Global';

  useEffect(() => {
    // Redirection to the absolute exact match if strictly /ciclo-vendas matched without closing slash
    if (location.pathname === '/ciclo-vendas') {
       navigate('/ciclo-vendas/', { replace: true });
    }
  }, [location, navigate]);

  const resetFilters = () => {
    setPeriod('mes');
  };

  const filterActions = (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-1 rounded-[14px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-slate-100">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-10 w-10 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
        onClick={resetFilters}
        title="Resetar filtros"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="px-6 md:px-10 pt-6 md:pt-10 shrink-0 bg-[#f4f7f9] dark:bg-slate-950 z-10 w-full mb-4">
        <PageHeader 
          title="Ciclo de Vendas" 
          description="Gestão operacional de vendas e tendências."
          tabs={tabs} 
          action={filterActions}
          onSearch={setSearchQuery}
          searchPlaceholder="Pesquisar faturas, produtos ou detalhes..."
        />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-6 md:pb-10 scrollbar-hide relative">
        <SalesCycleContext.Provider value={{ branchId, setBranchId: () => {}, period, setPeriod, resetFilters, branchName, searchQuery }}>
          <Routes>
            <Route index element={<TopProducts />} />
            <Route path="ciclos" element={<CyclesAnalysis />} />
            <Route path="analise" element={<PerformanceAnalysis />} />
          </Routes>
        </SalesCycleContext.Provider>
      </div>
    </div>
  );
}
