import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useSalesCycleContext } from './SalesCycleContext';

export interface ProductRanking {
  id: string;
  name: string;
  category: string;
  qty: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'fast_selling' | 'slow';
  unit?: string;
  share: number;
}

export const getTopProducts = (): ProductRanking[] => [
  { id: 'p1', name: 'Carne Bovina 1ª', category: 'Talho', qty: 1540, revenue: 616000, trend: 'up', status: 'fast_selling', unit: 'kg', share: 31 },
  { id: 'p2', name: 'Frango Inteiro (Caixa)', category: 'Congelados', qty: 890, revenue: 445000, trend: 'stable', status: 'normal', unit: 'cx', share: 22 },
  { id: 'p3', name: 'Massa Esparguete 500g', category: 'Mercearia', qty: 3200, revenue: 160000, trend: 'up', status: 'normal', unit: 'un', share: 8 },
  { id: 'p4', name: 'Óleo Alimentar 5L', category: 'Mercearia', qty: 450, revenue: 315000, trend: 'down', status: 'slow', unit: 'un', share: 15 },
  { id: 'p5', name: 'Salsichão (Kg)', category: 'Talho', qty: 780, revenue: 195000, trend: 'up', status: 'normal', unit: 'kg', share: 9 },
  { id: 'p6', name: 'Arroz 25kg', category: 'Mercearia', qty: 300, revenue: 450000, trend: 'stable', status: 'normal', unit: 'sc', share: 18 },
  { id: 'p7', name: 'Leite Gordo 1L', category: 'Lacticínios', qty: 1200, revenue: 90000, trend: 'up', status: 'fast_selling', unit: 'cx', share: 5 },
  { id: 'p8', name: 'Fiambre (Kg)', category: 'Charcutaria', qty: 150, revenue: 60000, trend: 'down', status: 'slow', unit: 'kg', share: 2 },
  { id: 'p9', name: 'Açúcar Kg', category: 'Mercearia', qty: 2500, revenue: 150000, trend: 'up', status: 'normal', unit: 'kg', share: 6 },
  { id: 'p10', name: 'Batata (Saco)', category: 'Hortifruti', qty: 600, revenue: 120000, trend: 'stable', status: 'normal', unit: 'sc', share: 4 },
  { id: 'p11', name: 'Cebola (Saco)', category: 'Hortifruti', qty: 450, revenue: 90000, trend: 'stable', status: 'normal', unit: 'sc', share: 3 },
  { id: 'p12', name: 'Peixe Carapau', category: 'Congelados', qty: 3400, revenue: 510000, trend: 'up', status: 'fast_selling', unit: 'kg', share: 12 },
];

export default function TopProducts() {
  const { branchName, searchQuery, branchId, period } = useSalesCycleContext();
  
  const products: ProductRanking[] = useMemo(() => {
    let allProducts = getTopProducts();
    if (branchId !== 'global') {
       allProducts = allProducts.map(p => ({
           ...p,
           qty: Math.floor(p.qty * (Math.random() * 0.8 + 0.2)),
           revenue: Math.floor(p.revenue * (Math.random() * 0.8 + 0.2)),
           trend: Math.random() > 0.5 ? 'up' : (Math.random() > 0.5 ? 'down' : 'stable') as 'up'|'down'|'stable',
           status: Math.random() > 0.8 ? 'fast_selling' : 'normal' as 'normal'|'fast_selling'|'slow'
       })).sort((a, b) => b.revenue - a.revenue);
    } else {
       allProducts = allProducts.sort((a, b) => b.revenue - a.revenue);
    }
    return allProducts;
  }, [branchId, period]);
  
  const filteredProducts = products.filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const topProduct = filteredProducts && filteredProducts.length > 0 ? filteredProducts[0] : null;

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex justify-between items-end shrink-0">
         <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#111827]">Ranking de Produtos</span>
            <span className="text-[12px] text-[#6B7280]">Top vendas e receitas em {branchName}</span>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-160px)]">
         <div className="flex-1 flex flex-col bg-white border border-[#E5E7EB] rounded-[8px] overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-[#F9FAFB] text-[#6B7280] text-[11px] uppercase sticky top-0 border-b border-[#E5E7EB] shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                 <tr>
                   <th className="px-4 py-2 w-10 text-center font-semibold">#</th>
                   <th className="px-4 py-2 font-semibold">Artigo</th>
                   <th className="px-4 py-2 text-right font-semibold">Qtd Vendida</th>
                   <th className="px-4 py-2 text-right font-semibold">Volume (MT)</th>
                   <th className="px-4 py-2 w-32 border-l border-[#E5E7EB] font-semibold text-center">Fatia (%)</th>
                 </tr>
               </thead>
               <tbody className="text-[12px] text-[#374151] divide-y divide-[#F3F4F6]">
                 {filteredProducts.map((prod, idx) => (
                   <tr key={prod.id} className="hover:bg-[#F9FAFB] transition-colors">
                     <td className="px-4 py-3 text-center">
                        <span className={`text-[11px] font-bold ${idx < 3 ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>
                          {idx + 1}
                        </span>
                     </td>
                     <td className="px-4 py-3">
                        <div className="font-semibold text-[#111827]">{prod.name}</div>
                        <div className="text-[10px] text-[#6B7280]">{prod.category}</div>
                     </td>
                     <td className="px-4 py-3 text-right">
                        <div className="font-semibold text-[#111827]">{prod.qty} <span className="text-[10px] font-normal text-[#9CA3AF] uppercase">{prod.unit}</span></div>
                        {prod.trend === 'up' && <div className="text-[9px] font-bold text-[#10B981] flex items-center justify-end gap-1 mt-0.5"><TrendingUp className="w-2.5 h-2.5" /> Alta</div>}
                        {prod.trend === 'down' && <div className="text-[9px] font-bold text-[#EF4444] flex items-center justify-end gap-1 mt-0.5"><TrendingDown className="w-2.5 h-2.5" /> Queda</div>}
                     </td>
                     <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-[#111827]">{prod.revenue.toLocaleString()}</span>
                     </td>
                     <td className="px-4 py-3 border-l border-[#E5E7EB]">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                            <div className="h-full bg-[#111827] rounded-full" style={{ width: `${prod.share}%` }} />
                          </div>
                          <span className="text-[10px] font-semibold text-[#6B7280] w-8 text-right">{prod.share}%</span>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
            </div>
         </div>

         <div className="w-[300px] flex flex-col gap-4 shrink-0 overflow-y-auto">
            {topProduct && (
              <div className="bg-white border border-[#E5E7EB] p-4 rounded-[8px]">
                 <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1.5">Artigo Líder</h3>
                 <div className="text-[13px] font-semibold text-[#111827] mb-1 leading-tight">{topProduct.name}</div>
                 <div className="text-[#6B7280] text-[11px] mb-3">Representa {topProduct.share}% da receita total.</div>
                 
                 <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[6px] p-2.5">
                    <div className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wide mb-1">Recomendação</div>
                    <div className="text-[11px] text-[#374151] leading-relaxed">Manter stock mínimo de 500{topProduct.unit} para mitigar riscos de ruptura.</div>
                 </div>
              </div>
            )}

            <div className="bg-white border border-[#E5E7EB] p-4 rounded-[8px]">
               <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-[6px] bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0">
                     <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                     <div className="text-[11px] font-bold text-[#111827] mt-1 uppercase tracking-wide">Alerta de Saída</div>
                     <div className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">3 artigos registam saída acelerada (esgotam em ~2 dias).</div>
                     <button className="mt-2 text-[10px] font-bold text-[#2563EB] uppercase tracking-wide hover:underline cursor-pointer">
                        Ver Analítico
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
