import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { getActiveBranch } from '@/lib/storage';

import TradingOverview from './trading/TradingOverview';
import Purchases from './trading/Purchases';
import Suppliers from './trading/Suppliers';
import StockMovement from './trading/StockMovement';
import Returns from './trading/Returns';

export const TradingContext = React.createContext<{ branchId: string; setBranchId: (id: string) => void; searchQuery: string }>({
  branchId: 'global',
  setBranchId: () => {},
  searchQuery: ''
});

const tabs = [
  { label: 'Visão Operacional', path: '/compras-vendas' },
  { label: 'Compras', path: '/compras-vendas/compras' },
  { label: 'Fornecedores', path: '/compras-vendas/fornecedores' },
  { label: 'Movimentação', path: '/compras-vendas/movimentacao' },
  { label: 'Devoluções', path: '/compras-vendas/devolucoes' },
];

export default function Trading() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeBranch = getActiveBranch();
  const branchId = activeBranch ? activeBranch.id : 'global';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="pt-2 md:pt-4 pb-4 w-full">
        <PageHeader 
          title="Compras e Vendas" 
          description="Fluxo operacional de caixa e entrada de mercadorias." 
          tabs={tabs} 
        />
      </div>
      
      <div className="relative">
        <TradingContext.Provider value={{ branchId, setBranchId: () => {}, searchQuery }}>
          <Routes>
            <Route index element={<TradingOverview />} />
            <Route path="compras" element={<Purchases />} />
            <Route path="fornecedores" element={<Suppliers />} />
            <Route path="movimentacao" element={<StockMovement />} />
            <Route path="devolucoes" element={<Returns />} />
          </Routes>
        </TradingContext.Provider>
      </div>
    </div>
  );
}
