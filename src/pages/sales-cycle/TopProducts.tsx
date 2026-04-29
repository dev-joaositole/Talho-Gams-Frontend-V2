import React from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Trophy, TrendingUp, TrendingDown, AlertTriangle, Filter } from 'lucide-react';
import { useTopProductsController } from './controllers/useTopProductsController';
import { useSalesCycleContext } from './SalesCycleContext';

export default function TopProducts() {
  const { products } = useTopProductsController();
  const { branchName, searchQuery } = useSalesCycleContext();
  
  const filteredProducts = products.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const topProduct = filteredProducts && filteredProducts.length > 0 ? filteredProducts[0] : null;

  return (
    <div className="pt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
         <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Trophy className="w-6 h-6 text-yellow-500" />
               Ranking de Produtos - {branchName}
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-1">O que gera mais receita e volume de vendas.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3">
            <Card className="bg-white rounded-3xl shadow-sm border-slate-200/60 overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                      <th className="px-6 py-5 w-16 text-center">#</th>
                      <th className="px-6 py-5">Produto</th>
                      <th className="px-6 py-5 text-right">Volume</th>
                      <th className="px-6 py-5 text-right">Receita (MZN)</th>
                      <th className="px-6 py-5 w-32">% Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((prod, idx) => (
                      <tr key={prod.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 text-center">
                           {idx === 0 && <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-black mx-auto">1</span>}
                           {idx === 1 && <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black mx-auto">2</span>}
                           {idx === 2 && <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black mx-auto">3</span>}
                           {idx > 2 && <span className="w-8 h-8 rounded-full text-slate-400 flex items-center justify-center font-bold mx-auto">{idx + 1}</span>}
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-800">{prod.name}</div>
                           <div className="text-xs font-bold text-slate-400 mt-0.5">{prod.category}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="font-black text-slate-700">{prod.qty} <span className="text-xs text-slate-400">{prod.unit}</span></div>
                           {prod.trend === 'up' && <div className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-1 mt-1"><TrendingUp className="w-3 h-3" /> Alta Demanda</div>}
                           {prod.trend === 'down' && <div className="text-[10px] font-bold text-rose-500 flex items-center justify-end gap-1 mt-1"><TrendingDown className="w-3 h-3" /> Em Queda</div>}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="font-black text-slate-800 text-lg">{prod.revenue.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-600 rounded-full" style={{ width: `${prod.share}%` }} />
                             </div>
                             <span className="text-xs font-bold text-slate-500 w-8 text-right">{prod.share}%</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </Card>
         </div>

         <div className="space-y-6">
            {topProduct && (
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-0 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
                 <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                 <div className="absolute bottom-0 right-0 p-4 opacity-20">
                    <Trophy className="w-24 h-24" />
                 </div>
                 
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 relative z-10">Campeão de Vendas</h3>
                 <div className="text-2xl font-black mb-1 relative z-10">{topProduct.name}</div>
                 <div className="text-slate-300 text-sm font-medium mb-6 relative z-10">Responde por {topProduct.share}% da receita total.</div>
                 
                 <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 relative z-10">
                    <div className="text-xs font-bold text-emerald-400 mb-1">Dica do Sistema</div>
                    <div className="text-sm font-medium text-white/90">Manter stock de segurança de no mínimo 500{topProduct.unit} para evitar ruptura no fim de semana.</div>
                 </div>
              </Card>
            )}

            <h3 className="font-black text-slate-800 text-lg px-2 mt-8">Avisos de Stock Inteligentes</h3>
            
            <Card className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl">
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                     <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                     <div className="font-bold text-slate-800">Alerta de Saída</div>
                     <div className="text-sm text-slate-600 font-medium mt-1">Velocidade de venda muito alta (fast_selling) em alguns produtos do ranking. O stock atual pode acabar em 2 dias.</div>
                     <div className="mt-3 text-xs font-bold text-rose-600 uppercase tracking-wider cursor-pointer hover:underline">Recomenda-se pedido</div>
                  </div>
               </div>
            </Card>

            <Card className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl">
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                     <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                     <div className="font-bold text-slate-800">Baixa Performance</div>
                     <div className="text-sm text-slate-600 font-medium mt-1">Alguns produtos entraram em queda de saída. Possível desperdício em 3 dias.</div>
                     <div className="mt-3 text-xs font-bold text-amber-600 uppercase tracking-wider cursor-pointer hover:underline">Criar Promoção?</div>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
