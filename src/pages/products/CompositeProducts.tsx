import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Layers, X, Plus, Package, Edit2, Trash2 } from 'lucide-react';
import { getGlobalProducts, getCategories, saveCategory, saveProductBase, editProduct, deleteProduct, Product } from '@/lib/storage';
import { ConfirmDialog } from '@/pages/hr/ui/confirm-dialog';
import { toast } from 'sonner';

export default function CompositeProducts() {
  const [composites, setComposites] = useState<Product[]>([]);
  const [baseProducts, setBaseProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [kitName, setKitName] = useState('');
  const [kitDesc, setKitDesc] = useState('');
  const [kitPrice, setKitPrice] = useState('');
  const [kitBarcode, setKitBarcode] = useState('');
  
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [componentQty, setComponentQty] = useState(1);
  const [kitItems, setKitItems] = useState<{product: Product, qty: number}[]>([]);

  // Dialogs
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<{id: string, name: string} | null>(null);

  const loadData = () => {
    const all = getGlobalProducts();
    setComposites(all.filter(p => p.isComposite));
    setBaseProducts(all.filter(p => !p.isComposite));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
     setEditingId(null);
     setKitName('');
     setKitDesc('');
     setKitPrice('');
     setKitBarcode('');
     setKitItems([]);
     setIsModalOpen(true);
  };

  const handleOpenEdit = (kit: Product) => {
     setEditingId(kit.id);
     setKitName(kit.name);
     setKitDesc(kit.description || '');
     setKitPrice(kit.globalPrice.toString());
     setKitBarcode(kit.barcode || '');
     
     // Load items
     if (kit.components) {
        const loadedItems = kit.components.map(c => {
           const p = baseProducts.find(base => base.id === c.productId);
           if (!p) return null;
           return { product: p, qty: c.quantity };
        }).filter(Boolean) as {product: Product, qty: number}[];
        setKitItems(loadedItems);
     } else {
        setKitItems([]);
     }
     
     setIsModalOpen(true);
  };

  const handleAddItem = () => {
    if (!selectedComponentId || componentQty <= 0) return;
    const prod = baseProducts.find(p => p.id === selectedComponentId);
    if (!prod) return;

    const existing = kitItems.find(i => i.product.id === selectedComponentId);
    if (existing) {
       setKitItems(kitItems.map(i => i.product.id === selectedComponentId ? { ...i, qty: i.qty + componentQty } : i));
    } else {
       setKitItems([...kitItems, { product: prod, qty: componentQty }]);
    }
    setComponentQty(1);
    setSelectedComponentId('');
  };

  const handleRemoveItem = (id: string) => {
    setKitItems(kitItems.filter(i => i.product.id !== id));
  };
  
  const validateAndPromptSave = () => {
    const finalPrice = Number(kitPrice);
    if (!kitName || isNaN(finalPrice) || kitItems.length === 0) {
        toast.error("Preencha o nome, o preço final de venda e inclua pelo menos 1 composição.");
        return;
    }
    confirmSaveKit();
  };

  const confirmSaveKit = () => {
    try {
      const finalPrice = Number(kitPrice);
      const totalCost = kitItems.reduce((acc, item) => acc + ((item.product.costPrice || 0) * item.qty), 0);

      // Category fallback
      let cats = getCategories();
      let kitCat = cats.find(c => c.name === 'Kits/Compostos');
      if(!kitCat){
          kitCat = saveCategory({name: 'Kits/Compostos'});
      }

      const payload = {
        name: kitName,
        description: kitDesc,
        globalPrice: finalPrice,
        costPrice: totalCost,
        type: 'un' as const,
        categoryId: kitCat.id,
        barcode: kitBarcode,
        isComposite: true,
        components: kitItems.map(i => ({ productId: i.product.id, quantity: i.qty }))
      };

      if (editingId) {
        editProduct(editingId, payload);
      } else {
        saveProductBase(payload);
      }

      setConfirmSaveOpen(false);
      setIsModalOpen(false);
      loadData();
      toast.success("Composto salvo com sucesso!");
    } catch(err) {
      toast.error("Erro ao salvar produto composto.");
    }
  };

  const confirmDelete = () => {
     if (!deleteData) return;
     try {
       deleteProduct(deleteData.id);
       setDeleteData(null);
       loadData();
       toast.success("O kit foi removido permanentemente.");
     } catch(err) {
       toast.error("Ocorreu um erro ao excluir.");
     }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Layers className="w-6 h-6 text-indigo-600" /> Produtos Compostos
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Configure cabazes físicos, combos ou menus. Quantidades afetam o stock dos originais.</p>
        </div>
        <Button 
          onClick={handleOpenNew}
          className="h-11 px-6 rounded-[12px] bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-md shadow-indigo-600/20"
        >
           Configurar Novo Kit
        </Button>
      </div>

      <Card className="overflow-hidden p-0 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-5">Nome do Kit</th>
                <th className="px-6 py-5">Descrição</th>
                <th className="px-6 py-5">Código de Barras</th>
                <th className="px-6 py-5 text-center">Itens (Qtd)</th>
                <th className="px-6 py-5 text-right border-l border-slate-100">Custo Total</th>
                <th className="px-6 py-5 text-right bg-slate-50/50">Preço final</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {composites.length > 0 ? (
                 composites.map(kit => (
                   <tr key={kit.id} className="hover:bg-slate-50/50 group">
                     <td className="px-6 py-5 font-bold text-slate-800">{kit.name}</td>
                     <td className="px-6 py-5 text-slate-500">{kit.description || '-'}</td>
                     <td className="px-6 py-5 text-slate-500 font-mono text-xs">{kit.barcode || '-'}</td>
                     <td className="px-6 py-5 text-center font-bold text-slate-700 bg-slate-50/30">
                        {kit.components ? kit.components.length : 0} Item(s)
                     </td>
                     <td className="px-6 py-5 text-right border-l border-slate-100">
                        {(kit.costPrice || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">MT</span>
                     </td>
                     <td className="px-6 py-5 text-right bg-slate-50/30 font-black text-indigo-700">
                        {Number(kit.globalPrice || 0).toLocaleString()} <span className="text-xs text-indigo-400/70 font-normal">MT</span>
                     </td>
                     <td className="px-6 py-5 text-right opacity-10 md:opacity-100 group-hover:opacity-100 transition-opacity">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => handleOpenEdit(kit)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                             <Edit2 className="w-4 h-4" />
                           </button>
                           <button onClick={() => setDeleteData({id: kit.id, name: kit.name})} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))
               ) : (
                 <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">Nenhum produto composto registado.</td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL CONFIGURAR KIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="flex items-center justify-between p-6 md:px-8 border-b border-slate-50">
                 <h2 className="text-[22px] font-medium text-slate-800 font-serif">
                   {editingId ? 'Editar Kit' : 'Configurar Novo Kit'}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                   <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="p-6 md:px-8 overflow-y-auto">
                 <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-600 block">Nome do Kit <span className="text-red-500">*</span></label>
                          <Input 
                            value={kitName}
                            onChange={(e) => setKitName(e.target.value)}
                            className="h-11 rounded-xl bg-slate-50/40 border-slate-200/80 focus-visible:ring-blue-100 font-semibold"
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-600 block">Descrição</label>
                          <Input 
                            value={kitDesc}
                            onChange={(e) => setKitDesc(e.target.value)}
                            className="h-11 rounded-xl bg-slate-50/40 border-slate-200/80 focus-visible:ring-blue-100"
                          />
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-600 block">Código de Barras (Opcional)</label>
                          <Input 
                            value={kitBarcode}
                            onChange={(e) => setKitBarcode(e.target.value)}
                            className="h-11 rounded-xl bg-slate-50/40 border-slate-200/80 focus-visible:ring-blue-100 font-mono text-sm"
                            placeholder="Deixe vazio se não tiver"
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-600 block">Preço Final de Venda (MT) <span className="text-red-500">*</span></label>
                          <Input 
                            type="number"
                            min="0"
                            step="0.01"
                            value={kitPrice}
                            onChange={(e) => setKitPrice(e.target.value)}
                            className="h-11 rounded-xl bg-slate-50/40 border-slate-200/80 focus-visible:ring-blue-100 font-bold text-indigo-700"
                          />
                       </div>
                    </div>

                    <div className="bg-[#f8fafc] border border-slate-100/80 rounded-2xl p-6 flex flex-col">
                       <h3 className="text-[15px] font-bold text-slate-700 mb-4">Composição do Kit</h3>
                       
                       <div className="flex items-center gap-3 mb-5">
                          <div className="flex-1">
                             <select
                               value={selectedComponentId}
                               onChange={(e) => setSelectedComponentId(e.target.value)}
                               className="w-full h-11 px-3 bg-white border border-slate-200/80 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
                             >
                                <option value="" disabled>Selecione o produto</option>
                                {baseProducts.map(b => <option key={b.id} value={b.id}>{b.name} ({b.type})</option>)}
                             </select>
                          </div>
                          <div className="w-20">
                             <Input 
                                type="number" 
                                min="1" 
                                step="0.01"
                                value={componentQty} 
                                onChange={(e) => setComponentQty(Number(e.target.value))}
                                className="h-11 rounded-xl text-center shadow-sm border-slate-200/80 font-bold" 
                             />
                          </div>
                          <Button 
                             onClick={handleAddItem}
                             className="h-11 w-11 p-0 shrink-0 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-none border-0"
                          >
                             <Plus className="w-5 h-5 font-bold" />
                          </Button>
                       </div>

                       <div className="bg-white border text-center border-slate-100 rounded-xl min-h-[160px] flex-1 flex flex-col shadow-sm">
                           {kitItems.length === 0 ? (
                             <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400">
                                Nenhum item adicionado.
                             </div>
                           ) : (
                             <ul className="divide-y divide-slate-50 flex-1 overflow-y-auto max-h-[160px]">
                                {kitItems.map((item) => (
                                  <li key={item.product.id} className="flex items-center justify-between p-3 px-4 hover:bg-slate-50/50">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                           <Package className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className="text-left">
                                          <p className="text-sm font-bold text-slate-700">{item.product.name}</p>
                                          <p className="text-[10px] text-slate-500 font-medium">Custo uni: {item.product.costPrice} MT</p>
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-4">
                                        <span className="text-sm font-black text-slate-700 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md">{item.qty} <span className="font-semibold text-[10px] uppercase text-slate-400">{item.product.type}</span></span>
                                        <button onClick={() => handleRemoveItem(item.product.id)} className="text-red-400 hover:text-red-600 p-1">
                                           <X className="w-4 h-4" />
                                        </button>
                                     </div>
                                  </li>
                                ))}
                             </ul>
                           )}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 border-t border-slate-100">
                 <div className="text-sm font-bold text-slate-500">
                    Custo somado: <span className="text-slate-800 text-base">{kitItems.reduce((acc, i) => acc + ((i.product.costPrice || 0) * i.qty), 0).toLocaleString()} MT</span>
                 </div>
                 <Button 
                   onClick={validateAndPromptSave}
                   className="h-[46px] w-full md:w-auto px-10 rounded-xl bg-[#1a56ff] hover:bg-blue-700 font-semibold text-[15px] shadow-sm text-white"
                 >
                    {editingId ? 'Salvar Alterações' : 'Salvar Kit no Firebase'}
                 </Button>
              </div>
           </div>
        </div>
      )}

      {/* CONFIRMATION DIALOGS */}
      <ConfirmDialog 
         open={!!deleteData}
         onOpenChange={(open) => !open && setDeleteData(null)}
         title="Eliminar Produto Composto?"
         description={`Tem a certeza que deseja eliminar "${deleteData?.name}"? Esta ação removerá o kit, mas os produtos base não serão afetados.`}
         onConfirm={confirmDelete}
         confirmText="Sim, Eliminar"
         variant="danger"
      />

    </div>
  );
}
