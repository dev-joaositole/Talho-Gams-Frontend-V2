import React, { useContext, useState } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { ArrowRight, ShoppingCart, TrendingUp, PackageSearch, Activity, Building2, Clock, ShoppingBag, Banknote, MapPin, CheckCircle2, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { TradingContext } from '../Trading';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '@/pages/hr/ui/confirm-dialog';
import { useCurrentSalesController } from '../sales-cycle/controllers/useCurrentSalesController';
import { getCurrentUser } from '@/lib/storage';

export default function TradingOverview() {
  const { branchId, searchQuery } = useContext(TradingContext);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isManagerOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  const { sales, todayTotal, txCount, selectedSale, setSelectedSale, removeSale, editSale } = useCurrentSalesController();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const filteredSales = sales.filter(s => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
         s.id.toLowerCase().includes(q) ||
         s.paymentMethod.toLowerCase().includes(q) ||
         s.employeeName.toLowerCase().includes(q) ||
         s.branchName.toLowerCase().includes(q) ||
         s.items.some(item => item.name.toLowerCase().includes(q))
      );
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-[28px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-800/10">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full -z-0"></div>
         <div className="relative z-10 md:w-2/3">
           <h2 className="text-3xl font-black mb-2">Central de Operações (Trading)</h2>
           <p className="text-slate-300 font-medium mb-8 leading-relaxed max-w-xl">
             Bem-vindo ao núcleo operacional do sistema. Monitoramento ao vivo das caixas e operações.
           </p>
           
           <div className="flex flex-wrap gap-4">
             <Button 
               onClick={() => navigate('/caixa')}
               className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20"
             >
               <ShoppingCart className="w-5 h-5 mr-2" /> Acessar Ponto de Venda (POS)
             </Button>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
         {/* Live Stream Panel */}
         <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
               <div>
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                     <Activity className="w-5 h-5 text-emerald-600" />
                     Stream de Vendas
                  </h2>
                  <p className="text-sm font-bold text-slate-400 mt-1">Atualização em tempo real</p>
               </div>
               <div className="flex items-center gap-2">
                 <span className="flex h-3 w-3 relative">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                 </span>
                 <span className="text-xs font-bold text-slate-500 uppercase">Monitorando</span>
               </div>
            </div>

            <Card className="bg-white rounded-3xl shadow-sm border-slate-200/60 overflow-hidden">
               <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                  {filteredSales.length === 0 && (
                    <div className="p-8 text-center text-slate-500 font-bold">Nenhuma venda encontrada para o filtro atual.</div>
                  )}
                  {filteredSales.map((sale, i) => (
                     <div 
                        key={sale.id}
                        className={`p-5 transition-all cursor-pointer border-l-4 ${selectedSale?.id === sale.id ? 'bg-slate-50 border-l-blue-500' : 'border-l-transparent hover:bg-slate-50'} ${i === 0 ? 'bg-emerald-50/30' : ''}`}
                        onClick={() => setSelectedSale(sale)}
                     >
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="bg-slate-100 text-slate-500 font-bold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5">
                                 <Clock className="w-4 h-4" /> {sale.time}
                              </div>
                              <div>
                                 <span className="font-bold text-slate-800 block">{sale.id}</span>
                                 <span className="text-sm font-bold text-slate-400 truncate max-w-[200px] inline-block">
                                   {sale.items.map(it => `${it.quantity}${it.unit} ${it.name}`).join(', ')}
                                 </span>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="text-right flex flex-col justify-end items-end">
                                 <div className="font-black text-slate-800 text-lg">{sale.total.toLocaleString()} MZN</div>
                                 <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 rounded-full mt-1 mb-0.5">{sale.branchName}</div>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform ${selectedSale?.id === sale.id ? 'translate-x-1 text-blue-500' : ''}`} />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </Card>
         </div>

         {/* Receipt Details Panel */}
         <div>
            <div className="sticky top-6">
               <h2 className="text-xl font-black text-slate-800 mb-6">Fatura / Detalhes</h2>
               
               {selectedSale ? (
                  <Card className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 border-0 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
                     {/* ActionBar Overlay */}
                     {isManagerOrAdmin && (
                       <div className="absolute top-4 right-4 flex items-center gap-2">
                          <button 
                             onClick={() => {
                                const newVal = prompt("Ajustar valor total da venda para:", String(selectedSale.total));
                                if (newVal && !isNaN(Number(newVal))) {
                                    editSale(selectedSale.id, Number(newVal));
                                }
                             }}
                             className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition-colors shadow-sm"
                             title="Editar Venda (Apenas Admin/Gerente)"
                          >
                             <Edit className="w-4 h-4" />
                          </button>
                          <button 
                             onClick={() => setDeleteModalOpen(true)}
                             className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors shadow-sm"
                             title="Estornar/Eliminar (Apenas Admin/Gerente)"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                     )}

                     <div className="border-b border-dashed border-slate-200 pb-6 mb-6 mt-4">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                              <CheckCircle2 className="w-6 h-6" />
                           </div>
                           <div className="text-right pr-2">
                             <div className="text-xs font-bold text-slate-400 uppercase">Recibo</div>
                             <div className="font-bold text-slate-800">{selectedSale.id}</div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                           <div>
                              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Caixa</div>
                              <div className="font-bold text-slate-700 flex items-center gap-2">
                                 <Activity className="w-4 h-4 text-slate-400" /> {selectedSale.posId}
                              </div>
                           </div>
                           <div>
                              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Operador</div>
                              <div className="font-bold text-slate-700 text-sm truncate">{selectedSale.employeeName}</div>
                           </div>
                           <div className="col-span-2">
                              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Loja</div>
                              <div className="font-bold text-slate-700 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" /> {selectedSale.branchName}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4 mb-6">
                        {selectedSale.items.map((item, idx) => (
                           <div key={idx} className="flex justify-between items-start">
                              <div>
                                 <div className="font-bold text-slate-800 text-sm">{item.quantity}{item.unit} x {item.name}</div>
                                 <div className="text-xs font-bold text-slate-400">{item.price.toLocaleString()} MZN / {item.unit}</div>
                              </div>
                              <div className="font-black text-slate-700 text-sm">
                                 {(item.quantity * item.price).toLocaleString()} 
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                           <span className="font-bold text-slate-500 text-sm">Subtotal Items</span>
                           <span className="font-bold text-slate-700">{selectedSale.items.reduce((acc, it) => acc + (it.price * it.quantity), 0).toLocaleString()} MZN</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200/50">
                           <span className="font-bold text-slate-500 text-sm">Desconto / Ajuste</span>
                           <span className="font-bold text-slate-700">{(selectedSale.total - selectedSale.items.reduce((acc, it) => acc + (it.price * it.quantity), 0)).toLocaleString()} MZN</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <div>
                              <span className="font-bold text-slate-400 text-xs block mb-1">Total Pago em {selectedSale.paymentMethod}</span>
                              <span className="text-2xl font-black text-slate-900 leading-none">{selectedSale.total.toLocaleString()} <span className="text-sm text-slate-500 font-bold">MZN</span></span>
                           </div>
                        </div>
                     </div>
                  </Card>
               ) : (
                  <Card className="bg-slate-50 p-12 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center text-slate-400 h-[600px] border-dashed">
                     <ShoppingBag className="w-16 h-16 mb-4 text-slate-300" />
                     <h3 className="text-lg font-bold text-slate-500 mb-2">Nenhuma venda selecionada</h3>
                     <p className="text-sm font-medium">Clique em uma transação na lista à esquerda para ver o recibo detalhado.</p>
                  </Card>
               )}
            </div>
         </div>
      </div>
      
      <ConfirmDialog 
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Estornar Venda"
        description="Tem certeza que deseja aplicar estorno a esta venda selecionada? Esta operação requer permissões de administrador."
        confirmText="Confirmar Estorno"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={() => {
           if (selectedSale) {
              removeSale(selectedSale.id);
           }
           setDeleteModalOpen(false);
        }}
      />
    </div>
  );
}
