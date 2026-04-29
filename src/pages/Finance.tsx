import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { getActiveBranch } from '@/lib/storage';

import FinanceOverview from './finance/FinanceOverview';
import Expenses from './finance/Expenses';
import Revenues from './finance/Revenues';
import Reports from './finance/Reports';
import CashierManagement from './finance/CashierManagement';

export const FinanceContext = React.createContext<{ branchId: string; setBranchId: (id: string) => void; searchQuery: string }>({
  branchId: 'global',
  setBranchId: () => {},
  searchQuery: ''
});

const tabs = [
  { label: 'Visão Financeira', path: '/financeiro' },
  { label: 'Despesas', path: '/financeiro/despesas' },
  { label: 'Receitas', path: '/financeiro/receitas' },
  { label: 'Caixa', path: '/financeiro/caixa' },
  { label: 'Relatórios', path: '/financeiro/relatorios' },
];

export default function Finance() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeBranch = getActiveBranch();
  const branchId = activeBranch ? activeBranch.id : 'global';

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="px-6 md:px-10 pt-6 md:pt-10 shrink-0 bg-[#f4f7f9] z-10 w-full mb-4">
        <PageHeader 
          title="Gestão Financeira" 
          description="Controle total de dinheiro do sistema e fluxo de caixa." 
          tabs={tabs} 
          onSearch={setSearchQuery}
          searchPlaceholder="Pesquisar finanças..."
        />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-6 md:pb-10 scrollbar-hide relative">
        <FinanceContext.Provider value={{ branchId, setBranchId: () => {}, searchQuery }}>
          <Routes>
            <Route index element={<FinanceOverview />} />
            <Route path="despesas" element={<Expenses />} />
            <Route path="receitas" element={<Revenues />} />
            <Route path="caixa" element={<CashierManagement />} />
            <Route path="relatorios" element={<Reports />} />
          </Routes>
        </FinanceContext.Provider>
      </div>
    </div>
  );
}
