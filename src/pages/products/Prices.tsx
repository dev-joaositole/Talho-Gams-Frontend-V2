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
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]">
        <div className="relative w-full md:w-96">
          <Input 
            placeholder="Procurar produto para precificar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="h-11 bg-slate-50 border-transparent rounded-[12px]"
          />
        </div>
        
        {isAdmin && (
           <div className="flex items-center gap-2">
             <MapPin className="w-5 h-5 text-slate-400" />
             <select 
               className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-[12px] text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
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

      <Card className="overflow-hidden p-0 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-5">Produto</th>
                <th className="px-6 py-5 text-right w-40"><Globe className="w-4 h-4 inline mr-1"/>Preço Global</th>
                <th className="px-6 py-5 text-center">Dif. Margem ({selectedBranchName})</th>
                <th className="px-6 py-5 w-72">Modificar em {selectedBranchName}</th>
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
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {p.name}
                      <span className="block text-[10px] text-slate-400 font-medium mt-0.5">Custo base: {p.costPrice} MT</span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 text-right text-[15px]">
                       {Number(p.globalPrice || 0).toLocaleString()} <span className="text-xs text-slate-400 font-medium">MT</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       {diffNode}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            step="0.01"
                            placeholder={activePrice.toString()}
                            value={overrideInputs[p.id] ?? ''}
                            onChange={(e) => handleOverrideChange(p.id, e.target.value)}
                            className="w-full h-9 text-right font-bold rounded-lg border-slate-200"
                          />
                          <Button size="sm" onClick={() => triggerSaveOverride(p.id)} className="h-9 px-3 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 border-0 shadow-none font-bold">Local</Button>
                          {isAdmin && <Button size="sm" onClick={() => triggerSaveGlobal(p.id)} className="h-9 px-3 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 border-0 shadow-none font-bold" title="Aplicar a todas as filiais">Global</Button>}
                        </div>
                        {hasOverride && <div className="text-[10px] text-amber-600 font-medium text-right">* Preço local ativado</div>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

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
