import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { RotateCcw } from 'lucide-react';
import { getActiveBranch } from '@/lib/storage';

import { SalesCycleContext } from './sales-cycle/SalesCycleContext';
import TopProducts from './sales-cycle/TopProducts';
import CyclesAnalysis from './sales-cycle/CyclesAnalysis';
import PerformanceAnalysis from './sales-cycle/PerformanceAnalysis';

const tabs = [
  { label: 'Relatório Artigos', path: '/ciclo-vendas' },
  { label: 'Ciclos', path: '/ciclo-vendas/ciclos' },
  { label: 'Desempenho', path: '/ciclo-vendas/analise' },
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
    if (location.pathname === '/ciclo-vendas') {
       navigate('/ciclo-vendas/', { replace: true });
    }
  }, [location, navigate]);

  const resetFilters = () => {
    setPeriod('mes');
  };

  const filterActions = (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <button 
        className="h-8 w-8 flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-[6px] transition-colors border border-[#E5E7EB]"
        onClick={resetFilters}
        title="Resetar filtros"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="pt-2 md:pt-4 pb-4 w-full">
        <PageHeader 
          title="Ciclo de Vendas" 
          description="Relatórios estruturados e padrões analíticos."
          tabs={tabs} 
          action={filterActions}
        />
      </div>
      
      <div className="relative">
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
