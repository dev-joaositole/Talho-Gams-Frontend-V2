import React, { useState, useEffect, useContext } from 'react';
import { Plus, Search, Edit, Trash2, CheckCircle2, TrendingUp, PackageSearch, Activity, PackagePlus, ShoppingBag, X } from 'lucide-react';
import { TradingContext } from '../Trading';
import { Purchase, getPurchases, savePurchase, getSuppliers, Supplier } from './models/trading';
import { Product, getGlobalProducts } from '@/lib/storage';
import { toast } from 'sonner';

export default function Purchases() {
  const { branchId, searchQuery } = useContext(TradingContext);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [cart, setCart] = useState<{ productId: string; quantity: number; unitPrice: number; }[]>([]);
  const [productToAdd, setProductToAdd] = useState('');
  const [qtyToAdd, setQtyToAdd] = useState('');
  const [priceToAdd, setPriceToAdd] = useState('');

  useEffect(() => {
    setPurchases(getPurchases());
    setSuppliers(getSuppliers());
    setProducts(getGlobalProducts());
  }, []);

  const filteredPurchases = purchases.filter(p => {
    if (branchId !== 'global' && p.branchId !== branchId) return false;
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const supplier = suppliers.find(s => s.id === p.supplierId);
        return supplier?.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddToCart = () => {
    if (!productToAdd || !qtyToAdd || !priceToAdd) {
      toast.error('Preencha os dados do artigo.');
      return;
    }
    setCart([...cart, { productId: productToAdd, quantity: Number(qtyToAdd), unitPrice: Number(priceToAdd) }]);
    setProductToAdd('');
    setQtyToAdd('');
    setPriceToAdd('');
  };

  const handleFinishPurchase = () => {
    if (!selectedSupplier) {
      toast.error('Selecione o fornecedor.');
      return;
    }
    if (cart.length === 0) {
      toast.error('Adicione artigos.');
      return;
    }

    const totalValue = cart.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
    
    savePurchase({
      supplierId: selectedSupplier,
      branchId: branchId === 'global' ? 'sede' : branchId,
      date: new Date().toISOString(),
      items: cart,
      totalValue,
      status: 'Concluída',
      userId: 'admin'
    });

    toast.success('Compra registada.');
    setIsFormOpen(false);
    setPurchases(getPurchases());
    setCart([]);
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-140px)]">
      {/* HEADER ACTIONS / METRICS */}
      <div className="flex justify-between items-end shrink-0">
         <div className="flex gap-4">
            <div className="border border-[#E5E7EB] rounded-[6px] px-4 py-2 bg-white flex flex-col justify-center min-w-[140px]">
               <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Compras</span>
               <span className="text-[18px] font-bold text-[#111827]">{filteredPurchases.length}</span>
            </div>
            <div className="border border-[#E5E7EB] rounded-[6px] px-4 py-2 bg-white flex flex-col justify-center min-w-[140px]">
               <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Valor Investido</span>
               <span className="text-[18px] font-bold text-[#111827]">
                  {filteredPurchases.reduce((acc, p) => acc + p.totalValue, 0).toLocaleString()} <span className="text-[11px] font-medium text-[#6B7280]">MT</span>
               </span>
            </div>
         </div>
         <button 
           onClick={() => setIsFormOpen(true)}
           className="h-10 px-4 bg-[#111827] hover:bg-[#1F2937] text-white text-[12px] font-medium rounded-[6px] shadow-sm transition-colors flex items-center gap-2"
         >
           <ShoppingBag className="w-3.5 h-3.5" /> Registar Compra
         </button>
      </div>

      {/* TABLE */}
      <div className="flex-1 flex flex-col bg-white border border-[#E5E7EB] rounded-[8px] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {filteredPurchases.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF]">
               <Search className="w-6 h-6 mb-2 opacity-50" />
               <span className="text-[12px] font-medium">Nenhum registo</span>
             </div>
          ) : (
             <table className="w-full text-left border-collapse">
               <thead className="bg-[#F9FAFB] text-[#6B7280] text-[11px] uppercase sticky top-0 border-b border-[#E5E7EB] shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                 <tr>
                   <th className="px-4 py-2 font-semibold">Data</th>
                   <th className="px-4 py-2 font-semibold">Fornecedor</th>
                   <th className="px-4 py-2 font-semibold hidden md:table-cell">Lote/Itens</th>
                   <th className="px-4 py-2 font-semibold text-right">Total (MT)</th>
                   <th className="px-4 py-2 font-semibold text-right">Estado</th>
                 </tr>
               </thead>
               <tbody className="text-[12px] text-[#374151] divide-y divide-[#F3F4F6]">
                 {filteredPurchases.map(p => {
                    const supplier = suppliers.find(s => s.id === p.supplierId);
                    return (
                      <tr key={p.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-4 py-2 whitespace-nowrap text-[#6B7280]">
                           {new Date(p.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 font-medium text-[#111827]">
                           {supplier?.name || p.supplierId}
                        </td>
                        <td className="px-4 py-2 hidden md:table-cell text-[#6B7280]">
                           {p.items.length} un.
                        </td>
                        <td className="px-4 py-2 font-semibold text-right">
                           {p.totalValue.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <span className="inline-flex items-center text-[11px] font-medium text-[#10B981]">
                             <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Concluída
                          </span>
                        </td>
                      </tr>
                    );
                 })}
               </tbody>
             </table>
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm z-50 flex justify-end">
           <div className="w-full md:w-[480px] bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right-8 duration-300">
              <div className="h-14 border-b border-[#E5E7EB] flex items-center justify-between px-5 shrink-0 bg-[#F9FAFB]">
                 <div className="flex items-center gap-2 text-[#111827] font-semibold text-[13px]">
                   <PackagePlus className="w-4 h-4" /> Entrada de Mercadoria
                 </div>
                 <button onClick={() => setIsFormOpen(false)} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                 <div>
                    <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Fornecedor</label>
                    <select 
                      className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
                      value={selectedSupplier}
                      onChange={e => setSelectedSupplier(e.target.value)}
                    >
                       <option value="">Selecione...</option>
                       {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                 </div>

                 <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[6px] space-y-3">
                    <h3 className="text-[12px] font-semibold text-[#111827]">Artigos</h3>
                    
                    <select 
                      className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
                      value={productToAdd}
                      onChange={e => setProductToAdd(e.target.value)}
                    >
                       <option value="">Selecione um artigo...</option>
                       {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    
                    <div className="flex gap-2">
                       <input 
                         type="number" 
                         placeholder="Qtd (Un.)" 
                         value={qtyToAdd} 
                         onChange={e => setQtyToAdd(e.target.value)}
                         className="w-1/2 h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                       />
                       <input 
                         type="number" 
                         placeholder="Custo (MT)" 
                         value={priceToAdd} 
                         onChange={e => setPriceToAdd(e.target.value)}
                         className="w-1/2 h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                       />
                    </div>
                    
                    <button 
                      onClick={handleAddToCart}
                      className="w-full h-9 bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#374151] font-medium text-[12px] rounded-[6px] transition-colors"
                    >
                      + Inserir
                    </button>
                 </div>

                 {cart.length > 0 && (
                   <div className="border border-[#E5E7EB] rounded-[6px] overflow-hidden bg-white">
                     <div className="bg-[#F9FAFB] px-3 py-2 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide border-b border-[#E5E7EB]">
                       Resumo de Entrada
                     </div>
                     <div className="divide-y divide-[#F3F4F6]">
                       {cart.map((item, idx) => {
                         const p = products.find(prod => prod.id === item.productId);
                         return (
                           <div key={idx} className="p-3 flex justify-between items-center text-[12px]">
                             <div>
                               <p className="font-semibold text-[#111827]">{p?.name}</p>
                               <p className="text-[#6B7280]">{item.quantity} un × {item.unitPrice} MT</p>
                             </div>
                             <p className="font-medium text-[#111827]">{(item.quantity * item.unitPrice).toLocaleString()}</p>
                           </div>
                         );
                       })}
                     </div>
                     <div className="p-3 bg-[#F9FAFB] border-t border-[#E5E7EB] flex justify-between items-center">
                       <span className="text-[12px] font-semibold text-[#4B5563]">Total Processado</span>
                       <span className="text-[14px] font-bold text-[#111827]">{cart.reduce((a,c) => a + (c.quantity * c.unitPrice), 0).toLocaleString()} MT</span>
                     </div>
                   </div>
                 )}
              </div>

              <div className="h-16 px-5 border-t border-[#E5E7EB] flex items-center gap-3 shrink-0 bg-[#F9FAFB]">
                 <button 
                   onClick={() => setIsFormOpen(false)}
                   className="flex-1 h-9 bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#374151] font-medium text-[12px] rounded-[6px] transition-colors"
                 >
                   Cancelar
                 </button>
                 <button 
                   onClick={handleFinishPurchase}
                   className="flex-1 h-9 bg-[#111827] hover:bg-[#1F2937] text-white font-medium text-[12px] rounded-[6px] shadow-sm transition-colors"
                 >
                   Registar Entrada
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
