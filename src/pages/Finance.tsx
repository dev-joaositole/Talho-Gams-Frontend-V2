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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="pt-2 md:pt-4 pb-4 w-full">
        <PageHeader 
          title="Gestão Financeira" 
          description="Controle total de dinheiro do sistema e fluxo de caixa." 
          tabs={tabs} 
        />
      </div>
      
      <div className="relative">
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
