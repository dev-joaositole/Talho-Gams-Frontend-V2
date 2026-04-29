import React, { useState, useEffect } from 'react';
import { getGlobalProducts, getVariations, ProductVariation, Product, saveVariation, editVariation, deleteVariation } from '@/lib/storage';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Scissors, Plus, Edit2, Trash2, X } from 'lucide-react';
import { ConfirmDialog } from '@/pages/hr/ui/confirm-dialog';
import { toast } from 'sonner';

export default function Variations() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [newVarProdId, setNewVarProdId] = useState('');
  const [newVarName, setNewVarName] = useState('');
  const [newVarPercent, setNewVarPercent] = useState('');
  const [newVarBarcode, setNewVarBarcode] = useState('');
  const [newVarStock, setNewVarStock] = useState('');

  // Dialogs
  const [deleteData, setDeleteData] = useState<{id: string, name: string} | null>(null);

  const loadData = () => {
    setProducts(getGlobalProducts().filter(p => !p.isComposite));
    setVariations(getVariations());
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNewVarProdId('');
    setNewVarName('');
    setNewVarPercent('');
    setNewVarBarcode('');
    setNewVarStock('');
  };

  const handleOpenEdit = (v: ProductVariation) => {
     setEditingId(v.id);
     setNewVarProdId(v.productId);
     setNewVarName(v.name);
     setNewVarPercent(v.costPercentageIncrease.toString());
     setNewVarBarcode(v.barcode || '');
     setNewVarStock(v.stock?.toString() || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarProdId || !newVarName || !newVarPercent || !newVarBarcode) {
        toast.error("O código de barras, produto base, tipo e acréscimo são obrigatórios.");
        return;
    }
    
    try {
      const payload: Omit<ProductVariation, 'id'> = {
        productId: newVarProdId,
        name: newVarName,
        costPercentageIncrease: Number(newVarPercent),
        barcode: newVarBarcode,
        stock: newVarStock ? Number(newVarStock) : undefined
      };

      if (editingId) {
         editVariation(editingId, payload);
         toast.success("Variação atualizada com sucesso!");
      } else {
         saveVariation(payload);
         toast.success("Variação registrada com sucesso!");
      }
      
      resetForm();
      loadData();
    } catch(err) {
      toast.error("Ocorreu um erro ao guardar.");
    }
  };

  const confirmDelete = () => {
     if (!deleteData) return;
     try {
       deleteVariation(deleteData.id);
       setDeleteData(null);
       loadData();
       toast.success("Variação removida com sucesso!");
     } catch(err) {
       toast.error("Erro ao eliminar variação.");
     }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Variações e Cortes</h2>
            <p className="text-sm font-medium text-slate-500">Acréscimos percentuais sobre o produto base (Ex: Carne Moída, Cubos).</p>
          </div>
        </div>
        {editingId && (
          <Button onClick={resetForm} variant="outline" className="rounded-xl border-slate-200">
            Nova Variação
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1 bg-slate-50/50 border border-slate-100 shadow-none h-fit">
          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">{editingId ? 'Editar Variação' : 'Criar Variação'}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Produto Base <span className="text-red-500">*</span></label>
              <select 
                className="w-full h-11 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-100"
                value={newVarProdId}
                onChange={(e) => setNewVarProdId(e.target.value)}
                required
              >
                <option value="" disabled>Selecione...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Tipo (Nome) <span className="text-red-500">*</span></label>
              <Input placeholder="Ex: Moída" value={newVarName} onChange={e=>setNewVarName(e.target.value)} className="h-11 bg-white" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Código de Barras <span className="text-red-500">*</span></label>
              <Input placeholder="Ex: 8901234..." value={newVarBarcode} onChange={e=>setNewVarBarcode(e.target.value)} className="h-11 bg-white font-mono" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Acréscimo sobre o Custo (%) <span className="text-red-500">*</span></label>
              <Input type="number" placeholder="Ex: 15" value={newVarPercent} onChange={e=>setNewVarPercent(e.target.value)} className="h-11 bg-white font-bold" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">Restrição de Estoque (Opcional)</label>
              <Input type="number" placeholder="Livre caso vazio" value={newVarStock} onChange={e=>setNewVarStock(e.target.value)} className="h-11 bg-white" />
            </div>
            <Button type="submit" className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm mt-2">
              {editingId ? <><Edit2 className="w-4 h-4 mr-2" /> Atualizar Variação</> : <><Plus className="w-4 h-4 mr-2" /> Registar Variação</>}
            </Button>
          </form>
        </Card>

        <Card className="p-0 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] md:col-span-2 overflow-hidden h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Produto Base</th>
                  <th className="px-6 py-4">Variação</th>
                  <th className="px-6 py-4 text-center">Acréscimo</th>
                  <th className="px-6 py-4 text-right">Preço Estimado</th>
                  <th className="px-6 py-4 text-center">Estoque</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {variations.length > 0 ? variations.map(v => {
                  const baseProd = products.find(p => p.id === v.productId);
                  if(!baseProd) return null;
                  
                  const acrestValue = Number(baseProd.costPrice || 0) * (Number(v.costPercentageIncrease || 0) / 100);
                  const finalSimulated = Number(baseProd.globalPrice || 0) + acrestValue;

                  return (
                    <tr key={v.id} className="hover:bg-purple-50/20 group transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{v.barcode || '-'}</td>
                      <td className="px-6 py-4 font-bold text-slate-600">{baseProd.name}</td>
                      <td className="px-6 py-4 font-bold text-purple-700 bg-purple-50/30">{v.name}</td>
                      <td className="px-6 py-4 text-center font-black text-slate-700">+{v.costPercentageIncrease}%</td>
                      <td className="px-6 py-4 text-right">
                         <span className="block font-bold text-slate-800">{Number(finalSimulated || 0).toLocaleString()} MT</span>
                         <span className="block text-[10px] text-slate-400">Sobre Global</span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">
                        {v.stock !== undefined ? v.stock : '-'}
                      </td>
                      <td className="px-6 py-4 text-right opacity-10 md:opacity-100 group-hover:opacity-100 transition-opacity">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => handleOpenEdit(v)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                               <Edit2 className="w-4 h-4" />
                             </button>
                             <button onClick={() => setDeleteData({id: v.id, name: v.name})} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                    </tr>
                  );
                }) : (
                   <tr><td colSpan={7} className="text-center py-8 text-sm text-slate-400 font-medium">Não há variações registradas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* CONFIRMATION DIALOG */}
      <ConfirmDialog 
         open={!!deleteData}
         onOpenChange={(open) => !open && setDeleteData(null)}
         title="Remover Variação?"
         description={`Tem a certeza que deseja eliminar a variação "${deleteData?.name}"?`}
         onConfirm={confirmDelete}
         confirmText="Sim, Eliminar"
         variant="danger"
      />
    </div>
  );
}