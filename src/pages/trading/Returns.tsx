import React, { useState, useEffect, useContext } from 'react';
import { RefreshCcw, Search, ExternalLink, Key, AlertTriangle, X } from 'lucide-react';
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
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const product = products.find(prod => prod.id === r.productId);
        return product?.name.toLowerCase().includes(q) || r.saleId.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleProcessReturn = () => {
    if (!saleId || !productId || !qty || !reason) {
      toast.error('Preencha os dados.');
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

    toast.success('Devolução processada e estoque ajustado.');
    setIsFormOpen(false);
    setReturns(getReturns());
    // Reset
    setSaleId(''); setProductId(''); setQty(''); setReason('');
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-140px)]">
      {/* HEADER ACTIONS / METRICS */}
      <div className="flex justify-between items-end shrink-0">
         <div className="flex gap-4">
            <div className="border border-[#E5E7EB] rounded-[6px] px-4 py-2 bg-white flex flex-col justify-center min-w-[140px]">
               <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Devoluções</span>
               <span className="text-[18px] font-bold text-[#111827]">{filteredReturns.length}</span>
            </div>
         </div>
         <button 
           onClick={() => setIsFormOpen(true)}
           className="h-10 px-4 bg-[#EF4444] hover:bg-[#DC2626] text-white text-[12px] font-medium rounded-[6px] shadow-sm transition-colors flex items-center gap-2"
         >
           <RefreshCcw className="w-3.5 h-3.5" /> Iniciar Devolução
         </button>
      </div>

      {/* TABLE */}
      <div className="flex-1 flex flex-col bg-white border border-[#E5E7EB] rounded-[8px] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {filteredReturns.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF]">
               <Search className="w-6 h-6 mb-2 opacity-50" />
               <span className="text-[12px] font-medium">Nenhum registo</span>
             </div>
          ) : (
             <table className="w-full text-left border-collapse">
               <thead className="bg-[#F9FAFB] text-[#6B7280] text-[11px] uppercase sticky top-0 border-b border-[#E5E7EB] shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                 <tr>
                   <th className="px-4 py-2 font-semibold">Estado</th>
                   <th className="px-4 py-2 font-semibold">Data / Venda ID</th>
                   <th className="px-4 py-2 font-semibold">Artigo Devolvido</th>
                   <th className="px-4 py-2 font-semibold hidden md:table-cell">Motivo</th>
                   <th className="px-4 py-2 font-semibold text-right">Solução</th>
                 </tr>
               </thead>
               <tbody className="text-[12px] text-[#374151] divide-y divide-[#F3F4F6]">
                 {filteredReturns.map(r => {
                    const p = products.find(prod => prod.id === r.productId);
                    return (
                      <tr key={r.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center text-[10px] uppercase font-semibold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-[4px] border border-[#A7F3D0]">
                             {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                           <div className="font-semibold text-[#111827]">{new Date(r.date).toLocaleDateString('pt-PT')}</div>
                           <div className="text-[10px] text-[#2563EB] font-bold uppercase tracking-wide cursor-pointer hover:underline mt-0.5">REF: {r.saleId} <ExternalLink className="w-2.5 h-2.5 inline" /></div>
                        </td>
                        <td className="px-4 py-3">
                           <div className="font-semibold text-[#111827]">{p?.name || r.productId}</div>
                           <div className="text-[10px] text-[#6B7280] font-medium mt-0.5">Voltou ao estoque: <span className="text-[#10B981] font-bold">+{r.quantity} {p?.type === 'kg' ? 'KG' : 'UN'}</span></div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell font-medium text-[#4B5563]">
                           {r.reason}
                        </td>
                        <td className="px-4 py-3 text-right">
                           <div className="inline-flex items-center px-2 py-0.5 bg-[#F3F4F6] border border-[#E5E7EB] rounded-[4px] text-[10px] font-semibold text-[#374151] uppercase">
                              {r.refundMethod}
                           </div>
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
        <div className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="w-full max-w-sm bg-white rounded-[8px] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
              <div className="h-14 border-b border-[#E5E7EB] flex items-center justify-between px-5 shrink-0 bg-[#FEF2F2]">
                 <div className="flex items-center gap-2 text-[#991B1B] font-semibold text-[13px]">
                   <RefreshCcw className="w-4 h-4" /> Nova Devolução
                 </div>
                 <button onClick={() => setIsFormOpen(false)} className="text-[#DC2626] hover:text-[#991B1B] transition-colors">
                    <X className="w-4 h-4" />
                 </button>
              </div>

              <div className="p-5 space-y-4">
                 <div>
                    <div className="flex justify-between items-center mb-1.5">
                       <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide">ID Venda (DOC)</label>
                    </div>
                    <div className="relative">
                       <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                       <input 
                         type="text"
                         value={saleId} 
                         onChange={e=>setSaleId(e.target.value)} 
                         placeholder="Ex: 409923..." 
                         className="w-full h-9 pl-9 pr-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] uppercase font-semibold text-[#111827]" 
                         autoFocus
                       />
                    </div>
                 </div>

                 <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[6px] space-y-4">
                    <div>
                       <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Artigo Devolvido</label>
                       <select 
                         className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white font-semibold text-[#111827]"
                         value={productId}
                         onChange={e => setProductId(e.target.value)}
                       >
                         <option value="">Selecione o artigo...</option>
                         {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                       </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">QTD Devolvida</label>
                           <input 
                             type="number" 
                             value={qty} 
                             onChange={e=>setQty(e.target.value)} 
                             placeholder="0" 
                             className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-semibold text-[#111827]" 
                           />
                        </div>
                        <div>
                           <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Solução</label>
                           <select 
                             className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white text-[#111827]"
                             value={refundMethod}
                             onChange={e => setRefundMethod(e.target.value as any)}
                           >
                             <option value="Reembolso">Reembolso</option>
                             <option value="Troca">Troca Direta</option>
                             <option value="Crédito">Crédito</option>
                           </select>
                        </div>
                    </div>
                    
                    <div>
                       <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Motivo</label>
                       <input 
                         type="text"
                         value={reason} 
                         onChange={e=>setReason(e.target.value)} 
                         placeholder="Justificativa" 
                         className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] text-[#111827]" 
                       />
                    </div>
                 </div>
              </div>

              <div className="h-14 px-5 border-t border-[#E5E7EB] flex items-center gap-3 shrink-0 bg-[#F9FAFB]">
                 <button 
                   onClick={() => setIsFormOpen(false)}
                   className="flex-1 h-9 bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#374151] font-medium text-[12px] rounded-[6px] transition-colors"
                 >
                   Cancelar
                 </button>
                 <button 
                   onClick={handleProcessReturn}
                   className="flex-1 h-9 bg-[#111827] hover:bg-[#1F2937] text-white font-medium text-[12px] rounded-[6px] shadow-sm transition-colors flex items-center justify-center gap-1.5"
                 >
                   <Key className="w-3.5 h-3.5" /> Confirmar
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
