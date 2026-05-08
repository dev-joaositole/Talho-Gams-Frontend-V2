import React, { useState, useEffect } from 'react';
import { getGlobalProducts, getInventory, Product, BranchInventory, getBranches, getCurrentUser, updateBranchInventory, updateGlobalProductPrice } from '@/lib/storage';
import { Card } from '@/pages/hr/ui/card';
import { Input } from '@/pages/hr/ui/input';
import { Search, MapPin, Globe } from 'lucide-react';
import { Button } from '@/pages/hr/ui/button';
import { ConfirmDialog } from '@/pages/hr/ui/confirm-dialog';
import { toast } from 'sonner';

export default function Prices() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<BranchInventory[]>([]);
  const [branches, setBranches] = useState<{id:string, name:string}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';
  const [selectedBranchId, setSelectedBranchId] = useState<string>(isAdmin ? '1' : (user?.assignedBranchId || '1'));
  
  // Track inputs for overrides
  const [overrideInputs, setOverrideInputs] = useState<Record<string, string>>({});

  // Confirmation state
  const [pendingSave, setPendingSave] = useState<{productId: string, type: 'global' | 'local', val: number | string} | null>(null);

  useEffect(() => {
    setProducts(getGlobalProducts());
    setInventory(getInventory());
    setBranches(getBranches());
  }, []);

  const handleOverrideChange = (productId: string, val: string) => {
    setOverrideInputs({ ...overrideInputs, [productId]: val });
  };

  const triggerSaveOverride = (productId: string) => {
     const val = overrideInputs[productId];
     if (val === undefined) return;
     setPendingSave({productId, type: 'local', val});
  };

  const triggerSaveGlobal = (productId: string) => {
     const val = Number(overrideInputs[productId]);
     if (isNaN(val) || val <= 0) return;
     setPendingSave({productId, type: 'global', val});
  };

  const confirmAction = () => {
    if (!pendingSave) return;
    const { productId, type, val } = pendingSave;

    try {
        if (type === 'local') {
            const numVal = Number(val);
            if (!isNaN(numVal) && numVal > 0) {
              updateBranchInventory(selectedBranchId, productId, { branchPrice: numVal });
              toast.success("Preço local atualizado com sucesso!");
            } else if (val === "") {
              updateBranchInventory(selectedBranchId, productId, { branchPrice: undefined });
              toast.success("Preço local removido (agora usa o preço global).");
            }
            setInventory(getInventory()); // refresh
        } else if (type === 'global') {
            const numVal = Number(val);
            updateGlobalProductPrice(productId, numVal);
            setProducts(getGlobalProducts());
            toast.success("Preço global atualizado com sucesso!");
        }
        
        // Limpar o input depois de salvar com sucesso
        setOverrideInputs({ ...overrideInputs, [productId]: '' });
        setPendingSave(null);
    } catch(err) {
        toast.error("Erro ao alterar preço.");
        setPendingSave(null);
    }
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
            placeholder="Procurar produto para precificar..." 
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

      <div className="border border-slate-100 rounded-[20px] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4 text-right w-40"><Globe className="w-3 h-3 inline mr-1"/>Preço Global</th>
                <th className="px-6 py-4 text-center">Dif. Margem ({selectedBranchName})</th>
                <th className="px-6 py-4 w-72">Modificar em {selectedBranchName}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((p) => {
                const branchInv = inventory.find(i => i.branchId === selectedBranchId && i.productId === p.id);
                const hasOverride = branchInv && branchInv.branchPrice !== undefined;
                const activePrice = hasOverride ? branchInv.branchPrice! : p.globalPrice;
                
                const diff = activePrice - p.globalPrice;
                let diffNode = <span className="text-slate-400 font-medium">Igual à sede</span>;
                if(diff > 0) diffNode = <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">+{diff} MT</span>;
                else if (diff < 0) diffNode = <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">{diff} MT</span>;
                
                return (
                  <tr key={p.id} className={`hover:bg-slate-50/50 transition-colors ${hasOverride ? 'bg-amber-50/20' : ''}`}>
                    <td className="px-6 py-3 font-bold text-[12px] text-slate-800">
                      {p.name}
                      <span className="block text-[10px] text-slate-400 font-medium mt-0.5">Custo base: {p.costPrice} MT</span>
                    </td>
                    <td className="px-6 py-3 font-black text-slate-800 text-right text-[12px]">
                       {Number(p.globalPrice || 0).toLocaleString()} <span className="text-[10px] text-slate-400 font-medium">MT</span>
                    </td>
                    <td className="px-6 py-3 text-[11px] text-center">
                       {diffNode}
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            step="0.01"
                            placeholder={activePrice.toString()}
                            value={overrideInputs[p.id] ?? ''}
                            onChange={(e) => handleOverrideChange(p.id, e.target.value)}
                            className="w-full h-8 text-right font-bold text-[12px] rounded-lg border-slate-200"
                          />
                          <Button size="sm" onClick={() => triggerSaveOverride(p.id)} className="h-8 px-3 rounded-lg bg-amber-100 text-[11px] text-amber-700 hover:bg-amber-200 border-0 shadow-none font-bold">Local</Button>
                          {isAdmin && <Button size="sm" onClick={() => triggerSaveGlobal(p.id)} className="h-8 px-3 rounded-lg bg-indigo-100 text-[11px] text-indigo-700 hover:bg-indigo-200 border-0 shadow-none font-bold" title="Aplicar a todas as filiais">Global</Button>}
                        </div>
                        {hasOverride && <div className="text-[9px] uppercase tracking-wider text-amber-600 font-bold text-right">* Preço local ativado</div>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRMATION DIALOG */}
      <ConfirmDialog 
         open={!!pendingSave}
         onOpenChange={(open) => !open && setPendingSave(null)}
         title="Alterar Preço?"
         description={
            pendingSave?.val === "" 
            ? "O preço local será removido, o produto voltará a assumir o Preço Global." 
            : `Tem a certeza que pretende alterar o preço ${pendingSave?.type === 'global' ? 'Global em TODAS as filiais' : `na filial ${selectedBranchName}`} para ${pendingSave?.val} MT?`
         }
         onConfirm={confirmAction}
         confirmText="Sim, Alterar"
         variant="default"
      />
    </div>
  );
}
