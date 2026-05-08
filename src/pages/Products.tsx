import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/pages/hr/ui/button';
import { Plus } from 'lucide-react';
import { getActiveBranch } from '@/lib/storage';

import ProductList from './products/ProductList';
import ProductCreate from './products/ProductCreate';
import Prices from './products/Prices';
import Stock from './products/Stock';
import CompositeProducts from './products/CompositeProducts';
import Variations from './products/Variations';

export const ProductsContext = React.createContext<{ branchId: string; setBranchId: (id: string) => void; searchQuery: string }>({
  branchId: 'global',
  setBranchId: () => {},
  searchQuery: ''
});

const tabs = [
  { label: 'Lista de Produtos', path: '/produtos' },
  { label: 'P. Compostos', path: '/produtos/compostos' },
  { label: 'Preços', path: '/produtos/precos' },
  { label: 'Variações', path: '/produtos/variacoes' },
  { label: 'Estoque', path: '/produtos/estoque' },
];

export default function Products() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeBranch = getActiveBranch();
  const branchId = activeBranch ? activeBranch.id : 'global';

  const actionNode = (
    <div className="flex items-center gap-4">
      <Button 
         onClick={() => navigate('/produtos/cadastro')}
         className="h-9 px-4 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] font-bold text-[13px] text-white shadow-sm transition-all"
      >
         <Plus strokeWidth={2.5} className="w-4 h-4 mr-1.5" /> Adicionar
      </Button>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="pt-2 md:pt-4 pb-4 w-full">
        <PageHeader 
          title="Gestão de Produtos" 
          description="Catálogo de carnes, preços e controlo de inventário." 
          tabs={tabs} 
          action={actionNode}
        />
      </div>
      
      <div className="relative">
        <ProductsContext.Provider value={{ branchId, setBranchId: () => {}, searchQuery }}>
          <Routes>
            <Route index element={<ProductList />} />
            <Route path="cadastro" element={<ProductCreate />} />
            <Route path="compostos" element={<CompositeProducts />} />
            <Route path="precos" element={<Prices />} />
            <Route path="variacoes" element={<Variations />} />
            <Route path="estoque" element={<Stock />} />
          </Routes>
        </ProductsContext.Provider>
      </div>
    </div>
  );
}
