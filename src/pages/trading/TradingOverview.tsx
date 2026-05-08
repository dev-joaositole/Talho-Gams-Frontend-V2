import React, { useContext, useState, useEffect } from 'react';
import { TradingContext } from '../Trading';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, ShoppingCart, MapPin, CheckCircle2, ChevronRight, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

interface RealtimeSale {
  id: string;
  time: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  employeeName: string;
  branchName: string;
  posId: string;
  status: 'completed' | 'processing';
}

const generateMockSales = (): RealtimeSale[] => {
  const methodOptions = ['Numerário', 'M-Pesa', 'TPA'];
  const nameOptions = ['Produto A', 'Produto B', 'Produto C', 'Artigo D', 'Serviço E'];
  
  return Array.from({ length: 15 }).map((_, i) => {
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = Array.from({ length: itemCount }).map((_, j) => {
      const q = Math.floor(Math.random() * 5) + 1;
      const p = Math.floor(Math.random() * 800) + 200;
      return {
        id: `item-${Date.now()}-${j}`,
        name: nameOptions[Math.floor(Math.random() * nameOptions.length)],
        quantity: q,
        unit: 'un',
        price: p,
        total: q * p
      };
    });
    const total = items.reduce((acc, item) => acc + item.total, 0);
    const d = new Date();
    d.setMinutes(d.getMinutes() - (i * 12));
    return {
      id: `TRX${Math.floor(Math.random() * 900000) + 100000}`,
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items,
      total,
      paymentMethod: methodOptions[Math.floor(Math.random() * methodOptions.length)],
      employeeName: 'Op. PT01',
      branchName: 'Sede Central',
      posId: `T0${Math.floor(Math.random() * 4) + 1}`,
      status: 'completed'
    };
  });
};

export default function TradingOverview() {
  const { branchId, searchQuery } = useContext(TradingContext);
  const navigate = useNavigate();

  const [sales, setSales] = useState<RealtimeSale[]>([]);
  const [selectedSale, setSelectedSale] = useState<RealtimeSale | null>(null);

  useEffect(() => {
    let mockSales = generateMockSales();
    if (branchId !== 'global') {
      mockSales = mockSales.map(s => ({ ...s, branchName: 'Branch Selected' }));
    }
    setSales(mockSales);
    setSelectedSale(mockSales[0]);
  }, [branchId]);

  const filteredSales = sales.filter(s => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
         s.id.toLowerCase().includes(q) ||
         s.paymentMethod.toLowerCase().includes(q) ||
         s.items.some(item => item.name.toLowerCase().includes(q))
      );
  });

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-140px)]">
      
      {/* LEFT PANEL: Transaction List (Dense) */}
      <div className="flex-1 flex flex-col bg-white border border-[#E5E7EB] rounded-[8px] overflow-hidden">
        <div className="h-12 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between px-4 shrink-0">
           <div className="flex items-center gap-2 text-[#4B5563]">
              <Activity className="w-4 h-4" />
              <span className="text-[13px] font-semibold">Registo Operacional</span>
           </div>
           <button 
             onClick={() => navigate('/caixa')}
             className="h-8 px-3 bg-[#111827] hover:bg-[#1F2937] text-white text-[12px] font-medium rounded-[6px] flex items-center gap-2 transition-colors shadow-sm"
           >
             <ShoppingCart className="w-3.5 h-3.5" /> Aceder POS
           </button>
        </div>

        <div className="flex-1 overflow-y-auto">
           {filteredSales.length === 0 ? (
             <div className="flex flex-col items-center justify-center pt-20 text-[#9CA3AF]">
               <Search className="w-6 h-6 mb-2 opacity-50" />
               <span className="text-[12px] font-medium">Nenhum registo localizado</span>
             </div>
           ) : (
             <table className="w-full text-left border-collapse">
                <thead className="bg-[#F9FAFB] text-[#6B7280] text-[11px] uppercase sticky top-0 border-b border-[#E5E7EB] shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                   <tr>
                      <th className="px-4 py-2 font-semibold">Hora</th>
                      <th className="px-4 py-2 font-semibold">Transação</th>
                      <th className="px-4 py-2 font-semibold hidden md:table-cell">Terminal</th>
                      <th className="px-4 py-2 font-semibold text-right">Valor (MT)</th>
                      <th className="px-4 py-2 font-semibold text-center w-10"></th>
                   </tr>
                </thead>
                <tbody className="text-[12px] text-[#374151] divide-y divide-[#F3F4F6]">
                  {filteredSales.map((sale) => (
                    <tr 
                      key={sale.id}
                      onClick={() => setSelectedSale(sale)}
                      className={`cursor-pointer transition-colors ${selectedSale?.id === sale.id ? 'bg-[#EFF6FF]' : 'hover:bg-[#F9FAFB]'} group`}
                    >
                       <td className="px-4 py-2 whitespace-nowrap text-[#6B7280]">{sale.time}</td>
                       <td className="px-4 py-2 font-medium text-[#111827]">{sale.id}</td>
                       <td className="px-4 py-2 hidden md:table-cell text-[#6B7280]">{sale.posId}</td>
                       <td className="px-4 py-2 font-semibold text-right">{sale.total.toLocaleString()}</td>
                       <td className="px-4 py-2 text-center text-[#9CA3AF]">
                          <ChevronRight className={`w-4 h-4 inline-block transition-transform ${selectedSale?.id === sale.id ? 'text-[#3B82F6]' : 'opacity-0 group-hover:opacity-100'}`} />
                       </td>
                    </tr>
                  ))}
                </tbody>
             </table>
           )}
        </div>
      </div>

      {/* RIGHT PANEL: Transaction Details */}
      <div className="w-full md:w-[380px] flex flex-col bg-white border border-[#E5E7EB] rounded-[8px] overflow-hidden shrink-0">
         <div className="h-12 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between px-4 shrink-0">
           <span className="text-[13px] font-semibold text-[#4B5563]">Detalhe Operacional</span>
           {selectedSale && (
             <span className="text-[11px] font-medium text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-[4px] border border-[#A7F3D0]">
               Completo
             </span>
           )}
         </div>

         <div className="flex-1 overflow-y-auto p-5">
            {selectedSale ? (
              <div className="space-y-6">
                 {/* Header info */}
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-[11px] text-[#6B7280] uppercase">Referência</p>
                       <p className="text-[16px] font-bold text-[#111827]">{selectedSale.id}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[11px] text-[#6B7280] uppercase">Liquidação</p>
                       <p className="text-[13px] font-semibold text-[#374151]">{selectedSale.paymentMethod}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E7EB]">
                    <div>
                       <p className="text-[11px] text-[#6B7280] uppercase mb-0.5">Operador / Terminal</p>
                       <p className="text-[12px] font-medium text-[#374151]">{selectedSale.employeeName} · {selectedSale.posId}</p>
                    </div>
                    <div>
                       <p className="text-[11px] text-[#6B7280] uppercase mb-0.5">Local</p>
                       <p className="text-[12px] font-medium text-[#374151]">{selectedSale.branchName}</p>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-[#E5E7EB]">
                    <p className="text-[11px] text-[#6B7280] uppercase mb-3">Linhas do Registo</p>
                    <div className="space-y-2">
                       {selectedSale.items.map((item, idx) => (
                         <div key={idx} className="flex justify-between text-[12px]">
                            <div className="flex gap-2">
                               <span className="font-medium text-[#6B7280] w-6">{item.quantity}x</span>
                               <span className="text-[#111827] truncate max-w-[150px]">{item.name}</span>
                            </div>
                            <span className="font-medium text-[#111827]">{(item.price * item.quantity).toLocaleString()} MT</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="pt-4 border-t border-[#E5E7EB]">
                    <div className="flex justify-between items-center bg-[#F9FAFB] p-3 rounded-[6px] border border-[#E5E7EB]">
                       <span className="text-[13px] font-semibold text-[#4B5563]">Total Processado</span>
                       <span className="text-[18px] font-bold text-[#111827]">{selectedSale.total.toLocaleString()} <span className="text-[12px] font-medium text-[#6B7280]">MT</span></span>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF]">
                 <CheckCircle2 className="w-8 h-8 mb-3 opacity-20" />
                 <p className="text-[12px] font-medium text-center">Selecione uma transação<br/>para auditar</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}

