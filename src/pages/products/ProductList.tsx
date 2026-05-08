import React, { useState, useEffect } from 'react';
import { getGlobalProducts, getCategories, getInventory, getActiveBranch, getBranches, getCurrentUser, getVariations, Product, Category, ProductVariation } from '@/lib/storage';
import { Card } from '@/pages/hr/ui/card';
import { Input } from '@/pages/hr/ui/input';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showComposites, setShowComposites] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const [filterBranchId, setFilterBranchId] = useState<string>('all');
  const [branches, setBranches] = useState<{id:string, name:string}[]>([]);
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setProducts(getGlobalProducts());
    setVariations(getVariations());
    setBranches(getBranches());
    
    const cats = getCategories();
    const catMap: Record<string, string> = {};
    cats.forEach(c => { catMap[c.id] = c.name });
    setCategories(catMap);

    const currentBranchToFilter = filterBranchId === 'all' ? (getActiveBranch()?.id || '') : filterBranchId;
    const inv = getInventory();
    const currentBranchStock: Record<string, number> = {};
    inv.filter(i => filterBranchId === 'all' || i.branchId === currentBranchToFilter).forEach(i => {
       if(!currentBranchStock[i.productId]) currentBranchStock[i.productId] = 0;
       currentBranchStock[i.productId] += i.stock;
    });
    setInventoryMap(currentBranchStock);
  }, [filterBranchId]);

  const displayItems = () => {
     let items: any[] = [...products];
     if (showVariations) {
        const mappedVars = variations.map(v => {
           const base = products.find(p => p.id === v.productId);
           return {
              id: v.id,
              isVariation: true,
              name: base ? `${base.name} - ${v.name}` : v.name,
              categoryId: base ? base.categoryId : '',
              barcode: v.barcode || (base ? base.barcode : ''),
              type: base ? base.type : 'un',
              costPrice: base ? base.costPrice * (1 + v.costPercentageIncrease / 100) : 0,
              globalPrice: base ? base.globalPrice + (base.costPrice * (v.costPercentageIncrease / 100)) : 0,
              isComposite: false,
              stock: v.stock || 0
           };
        });
        items = [...items, ...mappedVars];
     }
     return items;
  };

  const filteredProducts = displayItems().filter(p => {
    const searchString = typeof p.barcode === 'string' ? p.barcode : '';
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || searchString.includes(searchTerm);
    const matchComposite = showComposites ? true : !p.isComposite;
    return matchSearch && matchComposite;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Pesquisar produto ou código..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-[14px] text-[12px] font-medium transition-all shadow-sm"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {isAdmin && (
             <select 
               className="h-10 px-4 bg-white border border-slate-200 rounded-[14px] text-[12px] font-bold text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 shadow-sm w-full sm:w-auto transition-all cursor-pointer"
               value={filterBranchId}
               onChange={(e) => setFilterBranchId(e.target.value)}
             >
               <option value="all">Todas as Filiais</option>
               {branches.map(b => (
                 <option key={b.id} value={b.id}>{b.name}</option>
               ))}
             </select>
          )}

          <label className="flex flex-1 sm:flex-none items-center justify-center gap-2 text-[12px] font-bold text-slate-600 bg-white px-4 rounded-[14px] h-10 border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all select-none">
            <input type="checkbox" checked={showComposites} onChange={(e) => setShowComposites(e.target.checked)} className="w-[14px] h-[14px] rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 transition-colors" />
             Kits
          </label>
           
          <label className="flex flex-1 sm:flex-none items-center justify-center gap-2 text-[12px] font-bold text-slate-600 bg-white px-4 rounded-[14px] h-10 border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all select-none">
            <input type="checkbox" checked={showVariations} onChange={(e) => setShowVariations(e.target.checked)} className="w-[14px] h-[14px] rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 transition-colors" />
            Variações
          </label>
        </div>
      </div>

      <div className="border border-slate-100 rounded-[20px] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-4 py-4 text-right">Preço de Venda</th>
                <th className="px-8 py-4 text-right w-32">Estoque ({filterBranchId === 'all' ? 'Total' : 'Filial'})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => {
                const isVariation = p.isVariation;
                const availableStock = isVariation ? p.stock : (inventoryMap[p.id] || 0);

                return (
                  <tr key={p.id + (isVariation ? "_v" : "")} className={`hover:bg-slate-50/50 transition-colors ${isVariation ? 'bg-purple-50/20' : ''}`}>
                    <td className="px-6 py-3 text-slate-500 font-mono text-[11px]">{p.barcode || '-'}</td>
                    <td className="px-6 py-3">
                      <div className="font-bold text-slate-800 text-[12px] flex items-center gap-2">
                         {p.name}
                         {p.isComposite && <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-widest font-bold">KIT</span>}
                         {isVariation && <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-50 text-slate-600 border border-slate-200 uppercase tracking-widest font-bold">VAR</span>}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-50 border border-slate-100 text-slate-600">
                         {categories[p.categoryId] || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-[12px] text-slate-800 text-right">{Number(p.globalPrice || 0).toLocaleString()} MT<span className="text-slate-400 font-normal text-[10px] ml-1">/{p.type}</span></td>
                    <td className="px-8 py-3 text-right">
                      {!p.isComposite ? (
                        <div className="inline-flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${availableStock > 10 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                          <span className={`font-bold text-[12px] ${availableStock <= 10 ? 'text-rose-600' : 'text-slate-700'}`}>
                            {availableStock}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 opacity-50" title="Kits não possuem estoque isolado. Calculado no momento da venda.">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Variável</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[12px] text-slate-400 font-medium">
                       Nenhum produto encontrado com testos filtros.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
