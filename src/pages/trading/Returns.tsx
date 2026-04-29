import React, { useState, useEffect, useContext } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { RefreshCcw, Search, ExternalLink, Key, AlertTriangle } from 'lucide-react';
import { TradingContext } from '../Trading';
import { Return, getReturns, saveReturn, getSales, Sale } from './models/trading';
import { getGlobalProducts, Product } from '@/lib/storage';
import { toast } from 'sonner';

export default function Returns() {
  const { branchId, searchQuery } = useContext(TradingContext);
  const [returns, setReturns] = useState<Return[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [saleId, setSaleId] = useState('');
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');
  const [refundMethod, setRefundMethod] = useState<'Reembolso' | 'Crédito' | 'Troca'>('Reembolso');

  useEffect(() => {
    setReturns(getReturns());
    setSales(getSales());
    setProducts(getGlobalProducts());
  }, []);

  const filteredReturns = returns.filter(r => {
    if (branchId !== 'global' && r.branchId !== branchId) return false;
    return true;
  });

  const handleProcessReturn = () => {
    if (!saleId || !productId || !qty || !reason) {
      toast.error('Preencha os campos obrigatórios da devolução.');
      return;
    }

    // Verify if sale exists/is valid (Mock check for now)
    
    saveReturn({
      saleId,
      branchId: branchId === 'global' ? 'sede' : branchId,
      productId,
      quantity: Number(qty),
      reason,
      refundMethod,
      date: new Date().toISOString(),
      userId: 'admin',
      status: 'Finalizada'
    });

    toast.success('Devolução processada com sucesso. Estoque e financeiro ajustados.');
    setIsFormOpen(false);
    setReturns(getReturns());
    // Reset
    setSaleId(''); setProductId(''); setQty(''); setReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
         <div>
            <h2 className="text-xl font-black text-slate-800">Devoluções e Estornos</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Tratamento de reembolsos, devoluções e ajuste fiduciário de clientes.</p>
         </div>
         <Button 
           onClick={() => setIsFormOpen(true)}
           className="h-11 px-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md"
         >
           <RefreshCcw className="w-4 h-4 mr-2" /> Iniciar Devolução
         </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data / ID Venda</th>
                <th className="px-6 py-4">Produto Devolvido</th>
                <th className="px-6 py-4">Motivo</th>
                <th className="px-6 py-4">Resolvido via</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <p className="font-medium">Nenhuma devolução registada.</p>
                  </td>
                </tr>
              ) : (
                filteredReturns.map(r => {
                  const p = products.find(prod => prod.id === r.productId);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                           {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="font-bold text-slate-800">{new Date(r.date).toLocaleDateString('pt-PT')}</div>
                         <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider cursor-pointer hover:underline">REF: {r.saleId} <ExternalLink className="w-2.5 h-2.5 inline" /></div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="font-bold text-slate-800">{p?.name || r.productId}</div>
                         <div className="text-[11px] text-slate-500 font-bold">Voltou ao estoque: <span className="text-emerald-600">+{r.quantity} {p?.type === 'kg' ? 'KG' : 'UN'}</span></div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                         {r.reason}
                      </td>
                      <td className="px-6 py-4">
                         <div className="inline-flex items-center px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
                            {r.refundMethod}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <Button variant="ghost" size="sm" className="font-bold text-slate-400 hover:text-slate-800">Recibo</Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL DE DEVOLUÇÃO */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <Card className="w-full max-w-lg bg-white rounded-[24px] shadow-2xl p-0 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                 <div>
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><RefreshCcw className="w-5 h-5 text-red-500" /> Nova Devolução</h2>
                 </div>
                 <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">✕</Button>
              </div>

              <div className="p-6 space-y-5">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex justify-between">
                       REFERÊNCIA DA VENDA (DOC) <span className="text-blue-600 cursor-pointer hover:underline">Procurar na Base de Dados</span>
                    </label>
                    <div className="relative">
                       <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <Input 
                         value={saleId} 
                         onChange={e=>setSaleId(e.target.value)} 
                         placeholder="Insira o Nª do Recibo Ex: 409923..." 
                         className="h-12 pl-11 bg-slate-50 border-slate-200 rounded-xl font-bold uppercase" 
                         autoFocus
                       />
                    </div>
                 </div>

                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-800">Detalhes da Mercadoria Devolvida</h3>
                    
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Produto Constante na Venda</label>
                       <select 
                         className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                         value={productId}
                         onChange={e => setProductId(e.target.value)}
                       >
                         <option value="">Selecione o produto...</option>
                         {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                       </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">QTD Devolvida</label>
                           <Input type="number" value={qty} onChange={e=>setQty(e.target.value)} placeholder="0" className="h-12 bg-white border-slate-200 rounded-xl font-black text-lg" />
                        </div>
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Método de Solução</label>
                           <select 
                             className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                             value={refundMethod}
                             onChange={e => setRefundMethod(e.target.value as any)}
                           >
                             <option value="Reembolso">Reembolso (Dinheiro/Cartão)</option>
                             <option value="Troca">Troca Direta por Item</option>
                             <option value="Crédito">Crédito Pro Cliente</option>
                           </select>
                        </div>
                    </div>
                    
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Motivo do Cliente</label>
                       <Input value={reason} onChange={e=>setReason(e.target.value)} placeholder="Ex: Carne envelhecida, Produto errado..." className="h-12 bg-white border-slate-200 rounded-xl" />
                    </div>
                 </div>

                 <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 font-bold leading-relaxed">
                      Ao proceder com a devolução: o Caixa sofrerá abatimento do valor se for Reembolso. O Estoque da sua filial será realimentado imediatamente após a confirmação.
                    </p>
                 </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex gap-4 bg-white rounded-b-[24px]">
                 <Button variant="ghost" className="flex-1 h-12 font-bold" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                 <Button className="flex-[2] h-12 font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-lg" onClick={handleProcessReturn}>
                   <Key className="w-4 h-4 mr-2" />
                   Confirmar Autorização
                 </Button>
              </div>
           </Card>
        </div>
      )}

    </div>
  );
}
