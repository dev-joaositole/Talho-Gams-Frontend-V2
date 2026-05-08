import React, { useState, useEffect } from 'react';
import { getGlobalProducts, getInventory, Product, BranchInventory, getBranches, getCurrentUser, updateBranchInventory, updateGlobalStock, updateProduct } from '@/lib/storage';
import { Card } from '@/pages/hr/ui/card';
import { Input } from '@/pages/hr/ui/input';
import { Search, MapPin, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/pages/hr/ui/button';
import { toast } from 'sonner';

export default function Stock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<BranchInventory[]>([]);
  const [branches, setBranches] = useState<{id:string, name:string}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';
  const [selectedBranchId, setSelectedBranchId] = useState<string>(isAdmin ? '1' : (user?.assignedBranchId || '1'));
  
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});
  const [minStockInputs, setMinStockInputs] = useState<Record<string, string>>({});
  const [editingMin, setEditingMin] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setProducts(getGlobalProducts());
    setInventory(getInventory());
    setBranches(getBranches());
  }, []);

  const handleStockChange = (productId: string, val: string) => {
    setStockInputs({ ...stockInputs, [productId]: val });
  };

  const handleMinStockChange = (productId: string, val: string) => {
    setMinStockInputs({ ...minStockInputs, [productId]: val });
  };

  const saveLocalStock = (productId: string) => {
    const val = Number(stockInputs[productId]);
    if (!isNaN(val)) {
      updateBranchInventory(selectedBranchId, productId, { stock: val });
      toast.success("Estoque local atualizado!");
    }
    setInventory(getInventory()); 
    setStockInputs({...stockInputs, [productId]: ''});
  };
  
  const saveGlobalStock = (productId: string) => {
      const val = Number(stockInputs[productId]);
      if(!isNaN(val)) {
        updateGlobalStock(productId, val);
        toast.success("Estoque de todas as filiais forçadamente atualizado!");
        setInventory(getInventory()); 
        setStockInputs({...stockInputs, [productId]: ''});
      }
  };

  const handleMinClick = (p: Product, currentMin: number) => {
    if (window.confirm(`Deseja alterar o estoque mínimo para ${p.name}?`)) {
      setEditingMin({ ...editingMin, [p.id]: true });
      setMinStockInputs({ ...minStockInputs, [p.id]: currentMin.toString() });
    }
  };

  const saveMinStock = (productId: string) => {
    const val = Number(minStockInputs[productId]);
    if(!isNaN(val)) {
      updateProduct(productId, { minStock: val });
      toast.success("Estoque mínimo salvo com sucesso!");
      setProducts(getGlobalProducts());
    }
    setEditingMin({ ...editingMin, [productId]: false });
  };

  const filteredProducts = products.filter(p => !p.isComposite && (p.name.toLowerCase().includes(searchTerm.toLowerCase())));
  const selectedBranchName = branches.find(b => b.id === selectedBranchId)?.name;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Procurar produto para ajustar stock..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-[14px] text-[12px] font-medium transition-all shadow-sm"
          />
        </div>
        
        {isAdmin && (
           <div className="flex items-center gap-2 w-full lg:w-auto">
             <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
             <select 
               className="h-10 px-4 bg-white border border-slate-200 rounded-[14px] text-[12px] font-bold text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 shadow-sm w-full sm:w-auto transition-all cursor-pointer"
               value={selectedBranchId}
               onChange={(e) => setSelectedBranchId(e.target.value)}
             >
               {branches.map(b => (
                 <option key={b.id} value={b.id}>{b.name}</option>
               ))}
             </select>
           </div>
        )}
      </div>

      <div className="border border-slate-100 rounded-[20px] bg-white shadow-sm overflow-hidden whitespace-nowrap">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4 text-right"><Package className="w-3 h-3 inline mr-1"/>Estoque em {selectedBranchName}</th>
                <th className="px-6 py-4 text-right w-40">Mínimo</th>
                <th className="px-6 py-4 w-80">Atualizar Quantidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => {
                const branchInv = inventory.find(i => i.branchId === selectedBranchId && i.productId === p.id);
                const currentStock = branchInv ? branchInv.stock : 0;
                const min = p.minStock || 0;
                const isLow = min > 0 && currentStock <= min;
                const isEditingMin = editingMin[p.id];
                
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 font-bold text-[12px] text-slate-800">
                      <div className="flex items-center gap-2">
                        {p.name}
                        {isLow && <AlertTriangle className="w-4 h-4 text-orange-500" title="Estoque Mínimo Atingido" />}
                      </div>
                    </td>
                    <td className={`px-6 py-3 font-black text-right text-[12px] ${isLow ? 'text-orange-500' : 'text-slate-800'}`}>
                       {currentStock} <span className="text-[10px] text-slate-400 font-medium uppercase">{p.type}</span>
                    </td>
                    <td className="px-6 py-3 font-bold text-[12px] text-slate-400 text-right cursor-pointer" onClick={() => !isEditingMin && handleMinClick(p, min)}>
                       {isEditingMin ? (
                          <Input 
                            type="number"
                            step="0.01"
                            autoFocus
                            value={minStockInputs[p.id] ?? ''}
                            onChange={(e) => handleMinStockChange(p.id, e.target.value)}
                            onBlur={() => saveMinStock(p.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveMinStock(p.id);
                            }}
                            className="w-20 h-8 text-[12px] font-bold rounded-lg border-slate-200 text-right ml-auto"
                          />
                       ) : (
                         <div className="hover:text-blue-600 transition-colors" title="Clique para editar">
                           {min}
                         </div>
                       )}
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder={currentStock.toString()}
                          value={stockInputs[p.id] ?? ''}
                          onChange={(e) => handleStockChange(p.id, e.target.value)}
                          className="w-full h-8 text-right font-bold text-[12px] rounded-lg border-slate-200"
                        />
                        <Button size="sm" onClick={() => saveLocalStock(p.id)} className="h-8 px-3 rounded-lg bg-emerald-100 text-[11px] text-emerald-700 hover:bg-emerald-200 border-0 shadow-none font-bold">Local</Button>
                        {isAdmin && <Button size="sm" onClick={() => saveGlobalStock(p.id)} className="h-8 px-3 rounded-lg bg-slate-800 text-[11px] text-white hover:bg-slate-900 border-0 shadow-none font-bold" title="Forçar este valor para TODAS as filiais">Global</Button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
