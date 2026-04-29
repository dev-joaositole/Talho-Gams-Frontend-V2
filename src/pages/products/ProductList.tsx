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
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]">
        <div className="relative w-full md:w-96">
          <Input 
            placeholder="Pesquisar por nome ou código..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="h-11 bg-slate-50 border-transparent rounded-[12px]"
          />
        </div>
        
        <div className="flex flex-wrap align-center gap-4 w-full md:w-auto">
          {isAdmin && (
             <select 
               className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-[12px] text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100"
               value={filterBranchId}
               onChange={(e) => setFilterBranchId(e.target.value)}
             >
               <option value="all">Todas</option>
               {branches.map(b => (
                 <option key={b.id} value={b.id}>{b.name}</option>
               ))}
             </select>
          )}

          <label className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 rounded-[12px] h-11 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
            <input type="checkbox" checked={showComposites} onChange={(e) => setShowComposites(e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
             Compostos
          </label>
           
          <label className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 rounded-[12px] h-11 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
            <input type="checkbox" checked={showVariations} onChange={(e) => setShowVariations(e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
            Variações
          </label>
        </div>
      </div>

      <Card className="overflow-hidden p-0 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-5">Código</th>
                <th className="px-6 py-5">Produto</th>
                <th className="px-6 py-5">Categoria</th>
                <th className="px-4 py-5 text-right">Preço de Venda</th>
                <th className="px-8 py-5 text-right w-32">Estoque ({filterBranchId === 'all' ? 'Total' : 'Filial'})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => {
                const isVariation = p.isVariation;
                const availableStock = isVariation ? p.stock : (inventoryMap[p.id] || 0);

                return (
                  <tr key={p.id + (isVariation ? "_v" : "")} className={`hover:bg-slate-50/50 transition-colors ${isVariation ? 'bg-purple-50/20' : ''}`}>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{p.barcode || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                         {p.name}
                         {p.isComposite && <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 uppercase tracking-widest font-black">KIT</span>}
                         {isVariation && <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 text-purple-700 uppercase tracking-widest font-black">VARIAÇÃO</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                         {categories[p.categoryId] || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-800 text-right">{Number(p.globalPrice || 0).toLocaleString()} MT<span className="text-slate-400 font-normal text-xs ml-1">/{p.type}</span></td>
                    <td className="px-8 py-4 text-right">
                      {!p.isComposite ? (
                        <div className="inline-flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${availableStock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`font-black text-[15px] ${availableStock <= 10 ? 'text-red-600' : 'text-slate-700'}`}>
                            {availableStock}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 opacity-50 tooltip" title="Kits não possuem estoque isolado. Calculado no momento da venda.">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          <span className="text-slate-400 font-medium text-xs">Variável</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                 <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                       Nenhum produto encontrado com testos filtros.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
