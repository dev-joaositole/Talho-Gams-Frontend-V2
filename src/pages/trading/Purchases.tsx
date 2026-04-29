import React, { useState, useEffect, useContext } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/hr/ui/select';
import { Plus, Search, Edit, Trash2, CheckCircle2, TrendingUp, PackageSearch, AlertTriangle } from 'lucide-react';
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
    return true; // We can add search filter later
  });

  const handleAddToCart = () => {
    if (!productToAdd || !qtyToAdd || !priceToAdd) {
      toast.error('Preencha os campos do produto.');
      return;
    }
    setCart([...cart, { productId: productToAdd, quantity: Number(qtyToAdd), unitPrice: Number(priceToAdd) }]);
    setProductToAdd('');
    setQtyToAdd('');
    setPriceToAdd('');
  };

  const handleFinishPurchase = () => {
    if (!selectedSupplier) {
      toast.error('Selecione um fornecedor.');
      return;
    }
    if (cart.length === 0) {
      toast.error('Adicione produtos à compra.');
      return;
    }

    const totalValue = cart.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
    
    savePurchase({
      supplierId: selectedSupplier,
      branchId: branchId === 'global' ? 'sede' : branchId, // fallback if global
      date: new Date().toISOString(),
      items: cart,
      totalValue,
      status: 'Concluída',
      userId: 'admin' // In real app, get from session
    });

    toast.success('Compra registada com sucesso! Estoque atualizado.');
    setIsFormOpen(false);
    setPurchases(getPurchases());
    setCart([]);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
         <div className="flex-1 flex gap-4 w-full">
            <Card className="p-4 border-0 shadow-sm rounded-2xl flex-1 flex items-center gap-4 bg-white">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Compras</p>
                 <h3 className="text-2xl font-black text-slate-800">{filteredPurchases.length}</h3>
               </div>
            </Card>
            <Card className="p-4 border-0 shadow-sm rounded-2xl flex-1 flex items-center gap-4 bg-white">
               <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <PackageSearch className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valor Investido</p>
                 <h3 className="text-2xl font-black text-slate-800">
                    {filteredPurchases.reduce((acc, p) => acc + p.totalValue, 0).toLocaleString()} <span className="text-sm font-bold text-slate-400">MT</span>
                 </h3>
               </div>
            </Card>
         </div>

         <Button 
           onClick={() => setIsFormOpen(true)}
           className="h-14 px-6 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl shadow-md w-full md:w-auto"
         >
           <Plus className="w-5 h-5 mr-2" /> Registar Compra
         </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Fornecedor</th>
                <th className="px-6 py-4">Itens</th>
                <th className="px-6 py-4">Filial</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <p className="font-medium">Nenhuma compra registada.</p>
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(p => {
                  const supplier = suppliers.find(s => s.id === p.supplierId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-medium text-slate-600">{new Date(p.date).toLocaleDateString('pt-PT')}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{supplier?.name || p.supplierId}</td>
                      <td className="px-6 py-4 text-slate-500">{p.items.length} produtos</td>
                      <td className="px-6 py-4 text-slate-500 uppercase">{p.branchId}</td>
                      <td className="px-6 py-4 font-black text-slate-800">{p.totalValue.toLocaleString()} MT</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                           <CheckCircle2 className="w-3 h-3 mr-1" /> Concluída
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL DE NOVA COMPRA */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end p-0 md:p-4">
           <Card className="w-full md:w-[600px] bg-white h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-[24px] shadow-2xl flex flex-col animate-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                 <div>
                   <h2 className="text-xl font-black text-slate-800">Entrada de Mercadoria</h2>
                   <p className="text-sm font-medium text-slate-500 mt-1">Registrar compra e atualizar estoque automaticamente</p>
                 </div>
                 <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-10 w-10 p-0 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800">
                    ✕
                 </Button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Fornecedor</label>
                    <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                      <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold">
                        <SelectValue placeholder="Selecione o fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                   <h3 className="text-sm font-bold text-slate-800">Adicionar Produtos</h3>
                   <div className="grid grid-cols-12 gap-3">
                     <div className="col-span-12 md:col-span-6">
                        <Select value={productToAdd} onValueChange={setProductToAdd}>
                          <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl font-medium">
                            <SelectValue placeholder="Produto" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                     </div>
                     <div className="col-span-6 md:col-span-3">
                        <Input type="number" placeholder="Qtd" value={qtyToAdd} onChange={e => setQtyToAdd(e.target.value)} className="h-11 rounded-xl bg-white" />
                     </div>
                     <div className="col-span-6 md:col-span-3">
                        <Input type="number" placeholder="Custo/Un" value={priceToAdd} onChange={e => setPriceToAdd(e.target.value)} className="h-11 rounded-xl bg-white" />
                     </div>
                     <div className="col-span-12">
                        <Button onClick={handleAddToCart} variant="outline" className="w-full h-11 font-bold rounded-xl border-dashed">
                          + Adicionar Produto à Lista
                        </Button>
                     </div>
                   </div>
                 </div>

                 {cart.length > 0 && (
                   <div className="border border-slate-100 rounded-2xl overflow-hidden">
                     <div className="bg-slate-50 p-3 text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                       <span>Produtos</span>
                       <span>Subtotal</span>
                     </div>
                     <div className="divide-y divide-slate-100">
                       {cart.map((item, idx) => {
                         const p = products.find(prod => prod.id === item.productId);
                         return (
                           <div key={idx} className="p-3 flex justify-between items-center text-sm">
                             <div>
                               <p className="font-bold text-slate-800">{p?.name}</p>
                               <p className="text-slate-500">{item.quantity} x {item.unitPrice} MT</p>
                             </div>
                             <p className="font-black text-slate-800">{(item.quantity * item.unitPrice).toLocaleString()} MT</p>
                           </div>
                         );
                       })}
                     </div>
                     <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
                       <span className="font-bold">Total da Compra</span>
                       <span className="text-lg font-black">{cart.reduce((a,c) => a + (c.quantity * c.unitPrice), 0).toLocaleString()} MT</span>
                     </div>
                   </div>
                 )}
              </div>

              <div className="p-6 border-t border-slate-100 flex gap-4 shrink-0 bg-white">
                 <Button variant="ghost" className="flex-1 h-12 font-bold" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                 <Button className="flex-[2] h-12 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20" onClick={handleFinishPurchase}>
                   Gravar e Atualizar Estoque
                 </Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
