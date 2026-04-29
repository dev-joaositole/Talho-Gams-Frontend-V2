import React, { useState, useEffect, useContext } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownRight, PackageSearch, AlertTriangle, RefreshCw } from 'lucide-react';
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
    return true;
  });

  const handleSaveAndAdjust = () => {
    if (!productId || !qty || Number(qty) <= 0) {
      toast.error('Preencha um produto válido e quantidade maior que 0.');
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

    toast.success('Movimentação guardada e estoque ajustado com sucesso.');
    setIsFormOpen(false);
    setMovements(getStockMovements());
    setProductId('');
    setQty('');
    setReason('Ajuste de Inventário');
  };

  const getReasonColor = (type: string) => {
    switch(type) {
      case 'Entrada': return 'text-emerald-600 bg-emerald-50';
      case 'Saida': return 'text-amber-600 bg-amber-50';
      case 'Ajuste': return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Entrada': return <ArrowUpRight className="w-4 h-4 ml-1" />;
      case 'Saida': return <ArrowDownRight className="w-4 h-4 ml-1" />;
      case 'Ajuste': return <RefreshCw className="w-4 h-4 ml-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
               <PackageSearch className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800 leading-tight">Log de Estoque</h2>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{filteredMovements.length} Registos Oficiais</p>
            </div>
         </div>
         
         <div className="flex gap-3 w-full md:w-auto">
           <Button variant="outline" className="h-12 w-full md:w-auto font-bold border-slate-200">
              <Filter className="w-4 h-4 mr-2" /> Filtros
           </Button>
           <Button 
             onClick={() => setIsFormOpen(true)}
             className="h-12 w-full md:w-auto px-6 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md"
           >
             <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Forçar Ajuste
           </Button>
         </div>
      </div>

      <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Data / Hora</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Operação</th>
                <th className="px-6 py-4">Motivo / DOC</th>
                <th className="px-6 py-4">Filial</th>
                <th className="px-6 py-4 text-right">Qtd Movida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <p className="font-medium">Nenhuma movimentação no período selecionado.</p>
                  </td>
                </tr>
              ) : (
                [...filteredMovements].reverse().map(m => {
                  const p = products.find(prod => prod.id === m.productId);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-500">
                        {new Date(m.date).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {p?.name || m.productId}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getReasonColor(m.type)}`}>
                           {m.type} {getTypeIcon(m.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="font-bold text-slate-600">{m.reason}</div>
                         <div className="text-[10px] text-slate-400 font-bold tracking-wider">{m.id}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 uppercase font-medium">{m.branchId}</td>
                      <td className="px-6 py-4 text-right font-black text-slate-800 text-base">
                         {m.type === 'Saida' ? '-' : '+'}{m.quantity} {p?.type === 'kg' ? 'KG' : 'UN'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL / DRAWER LANÇAR AJUSTE FORÇADO */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <Card className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-0 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50/30">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                       <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 leading-none">Ajuste Manual</h2>
                      <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mt-1">Ação Auditável do Supervisor</p>
                    </div>
                 </div>
                 <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">✕</Button>
              </div>

              <div className="p-6 space-y-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Produto Alvo</label>
                    <select 
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                      value={productId}
                      onChange={e => setProductId(e.target.value)}
                    >
                      <option value="">Selecione o produto</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Tipo de Ajuste</label>
                       <select 
                         className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                         value={type}
                         onChange={e => setType(e.target.value as any)}
                       >
                         <option value="Ajuste">Acerto Inventário (Zerar)</option>
                         <option value="Saida">Quebra / Perda (Saída)</option>
                         <option value="Entrada">Bónus (Entrada)</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Quantidade / Peso</label>
                       <Input type="number" value={qty} onChange={e=>setQty(e.target.value)} className="h-12 bg-slate-50 border-slate-200 rounded-xl font-black text-lg" placeholder="0" />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Justificativa / Motivo</label>
                    <Input value={reason} onChange={e=>setReason(e.target.value)} className="h-12 bg-slate-50 border-slate-200 rounded-xl" placeholder="Ex: Produto estragado, Ajuste de Balanço..." />
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                      Ao gravar, o estoque da filial será impactado instantaneamente. Esta ação gera um log irreversível no sistema (auditável).
                    </p>
                 </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex gap-4 bg-white rounded-b-[24px]">
                 <Button variant="ghost" className="flex-1 h-12 font-bold" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                 <Button className="flex-[2] h-12 font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/20" onClick={handleSaveAndAdjust}>
                   Forçar Ajuste de Estoque
                 </Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
