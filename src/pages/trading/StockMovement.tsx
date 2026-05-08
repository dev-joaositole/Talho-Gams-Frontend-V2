import React, { useState, useEffect, useContext } from 'react';
import { Filter, ArrowUpRight, ArrowDownRight, PackageSearch, AlertTriangle, RefreshCw, X, Search } from 'lucide-react';
import { TradingContext } from '../Trading';
import { StockMovement as StockMovementModel, getStockMovements, saveStockMovement } from './models/trading';
import { getGlobalProducts, Product } from '@/lib/storage';
import { toast } from 'sonner';

export default function StockMovement() {
  const { branchId, searchQuery } = useContext(TradingContext);
  const [movements, setMovements] = useState<StockMovementModel[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [productId, setProductId] = useState('');
  const [type, setType] = useState<'Entrada' | 'Saida' | 'Ajuste'>('Ajuste');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('Ajuste de Inventário');

  useEffect(() => {
    setMovements(getStockMovements());
    setProducts(getGlobalProducts());
  }, []);

  const filteredMovements = movements.filter(m => {
    if (branchId !== 'global' && m.branchId !== branchId) return false;
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const product = products.find(prod => prod.id === m.productId);
        return product?.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSaveAndAdjust = () => {
    if (!productId || !qty || Number(qty) <= 0) {
      toast.error('Preencha os dados.');
      return;
    }

    saveStockMovement({
      branchId: branchId === 'global' ? 'sede' : branchId,
      productId,
      quantity: Number(qty),
      type,
      reason: reason as any,
      date: new Date().toISOString(),
      userId: 'admin'
    });

    toast.success('Movimentação guardada.');
    setIsFormOpen(false);
    setMovements(getStockMovements());
    setProductId('');
    setQty('');
    setReason('Ajuste de Inventário');
  };

  const getReasonColor = (type: string) => {
    switch(type) {
      case 'Entrada': return 'text-[#10B981] bg-[#ECFDF5] border-[#A7F3D0]';
      case 'Saida': return 'text-[#F59E0B] bg-[#FFFBEB] border-[#FDE68A]';
      case 'Ajuste': return 'text-[#3B82F6] bg-[#EFF6FF] border-[#BFDBFE]';
      default: return 'text-[#6B7280] bg-[#F9FAFB] border-[#E5E7EB]';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Entrada': return <ArrowUpRight className="w-3.5 h-3.5 ml-1" />;
      case 'Saida': return <ArrowDownRight className="w-3.5 h-3.5 ml-1" />;
      case 'Ajuste': return <RefreshCw className="w-3.5 h-3.5 ml-1" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-140px)]">
      {/* HEADER */}
      <div className="flex justify-between items-end shrink-0">
         <div className="flex gap-4">
            <div className="border border-[#E5E7EB] rounded-[6px] px-4 py-2 bg-white flex flex-col justify-center min-w-[140px]">
               <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Movimentos</span>
               <span className="text-[18px] font-bold text-[#111827]">{filteredMovements.length}</span>
            </div>
         </div>
         <div className="flex gap-2">
           <button className="h-10 px-4 bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#374151] text-[12px] font-medium rounded-[6px] transition-colors flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Filtros
           </button>
           <button 
             onClick={() => setIsFormOpen(true)}
             className="h-10 px-4 bg-[#111827] hover:bg-[#1F2937] text-white text-[12px] font-medium rounded-[6px] shadow-sm transition-colors flex items-center gap-2"
           >
             <AlertTriangle className="w-3.5 h-3.5 text-[#FBBF24]" /> Forçar Ajuste
           </button>
         </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 flex flex-col bg-white border border-[#E5E7EB] rounded-[8px] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {filteredMovements.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF]">
               <Search className="w-6 h-6 mb-2 opacity-50" />
               <span className="text-[12px] font-medium">Nenhum registo</span>
             </div>
          ) : (
             <table className="w-full text-left border-collapse">
               <thead className="bg-[#F9FAFB] text-[#6B7280] text-[11px] uppercase sticky top-0 border-b border-[#E5E7EB] shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                 <tr>
                   <th className="px-4 py-2 font-semibold">Data/Hora</th>
                   <th className="px-4 py-2 font-semibold">Produto</th>
                   <th className="px-4 py-2 font-semibold hidden md:table-cell">Operação</th>
                   <th className="px-4 py-2 font-semibold">Ref/Motivo</th>
                   <th className="px-4 py-2 font-semibold text-right">Qtd</th>
                 </tr>
               </thead>
               <tbody className="text-[12px] text-[#374151] divide-y divide-[#F3F4F6]">
                 {[...filteredMovements].reverse().map(m => {
                    const p = products.find(prod => prod.id === m.productId);
                    return (
                      <tr key={m.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-[#6B7280]">
                           {new Date(m.date).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#111827]">
                           {p?.name || m.productId}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                           <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] border text-[10px] font-semibold ${getReasonColor(m.type)}`}>
                              {m.type} {getTypeIcon(m.type)}
                           </span>
                        </td>
                        <td className="px-4 py-3">
                           <div className="font-medium text-[#374151]">{m.reason}</div>
                           <div className="text-[10px] text-[#9CA3AF] uppercase block mt-0.5">{m.id}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-[#111827]">
                           {m.type === 'Saida' ? '-' : '+'}{m.quantity} {p?.type === 'kg' ? 'KG' : 'UN'}
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
              <div className="h-14 border-b border-[#E5E7EB] flex items-center justify-between px-5 shrink-0 bg-[#FFFBEB]">
                 <div className="flex items-center gap-2 text-[#92400E] font-semibold text-[13px]">
                   <AlertTriangle className="w-4 h-4" /> Ajuste Manual
                 </div>
                 <button onClick={() => setIsFormOpen(false)} className="text-[#B45309] hover:text-[#92400E] transition-colors">
                    <X className="w-4 h-4" />
                 </button>
              </div>

              <div className="p-5 space-y-4">
                 <div>
                    <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Artigo</label>
                    <select 
                      className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
                      value={productId}
                      onChange={e => setProductId(e.target.value)}
                    >
                      <option value="">Selecione o artigo</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Operação</label>
                       <select 
                         className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
                         value={type}
                         onChange={e => setType(e.target.value as any)}
                       >
                         <option value="Ajuste">Acerto</option>
                         <option value="Saida">Quebra (Saída)</option>
                         <option value="Entrada">Bónus (Entrada)</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Qtd / Peso</label>
                       <input 
                         type="number" 
                         value={qty} 
                         onChange={e=>setQty(e.target.value)} 
                         className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-semibold" 
                         placeholder="0" 
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Motivo</label>
                    <input 
                      type="text"
                      value={reason} 
                      onChange={e=>setReason(e.target.value)} 
                      className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" 
                      placeholder="Ex: Quebra..." 
                    />
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
                   onClick={handleSaveAndAdjust}
                   className="flex-1 h-9 bg-[#F59E0B] hover:bg-[#D97706] text-white font-medium text-[12px] rounded-[6px] shadow-sm transition-colors"
                 >
                   Confirmar
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
