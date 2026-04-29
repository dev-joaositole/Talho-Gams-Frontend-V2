import { useState, useEffect } from 'react';
import { RealtimeSale, generateMockSales } from '../models/CurrentSalesModel';
import { useSalesCycleContext } from '../SalesCycleContext';
import { toast } from 'sonner';

export function useCurrentSalesController() {
  const { branchId, branchName } = useSalesCycleContext();
  const [sales, setSales] = useState<RealtimeSale[]>([]);
  const [todayTotal, setTodayTotal] = useState(145890);
  const [txCount, setTxCount] = useState(124);
  const [selectedSale, setSelectedSale] = useState<RealtimeSale | null>(null);

  // Filtramos as vendas pelo origin (branch) se o branchId !== 'global'
  useEffect(() => {
    // Numa aplicação real, buscaríamos da API filtrando por branchId
    let mockSales = generateMockSales();
    
    if (branchId !== 'global') {
      // Modificamos os mocks para o ramo selecionado
      mockSales = mockSales.map(s => ({ ...s, branchName }));
    }

    setSales(mockSales);
    setTodayTotal(mockSales.reduce((acc, s) => acc + s.total, 0) + 120000); // base value + mock
    setTxCount(mockSales.length + 95);
    setSelectedSale(null);
  }, [branchId, branchName]);

  // Real-time engine simulation
  useEffect(() => {
    const interval = setInterval(() => {
       if (Math.random() > 0.8) {
          const methodOptions = ['Dinheiro', 'M-Pesa', 'Cartão'];
          const nameOptions = ['Galinha Viva', 'Gado Misto', 'Fígado Bovino', 'Bife da Perna', 'Coca-Cola 2L', 'Carvão 5kg'];
          
          const itemCount = Math.floor(Math.random() * 4) + 1;
          const items = Array.from({ length: itemCount }).map((_, j) => {
            const q = Math.floor(Math.random() * 5) + 1;
            const p = Math.floor(Math.random() * 800) + 200;
            return {
              id: `item-${Date.now()}-${j}`,
              name: nameOptions[Math.floor(Math.random() * nameOptions.length)],
              quantity: q,
              unit: q > 3 ? 'un' : 'kg',
              price: p,
              total: q * p
            };
          });

          const total = items.reduce((acc, item) => acc + item.total, 0);
          
          const newSale: RealtimeSale = {
             id: `VDA-${Math.floor(Math.random() * 90000) + 10000}`,
             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             items,
             total,
             paymentMethod: methodOptions[Math.floor(Math.random() * methodOptions.length)],
             employeeName: 'Operador Automático',
             // Se houver um ramo selecionado, a nova venda simulada pertence a esse ramo, senão aleatório
             branchName: branchId !== 'global' ? branchName : (Math.random() > 0.5 ? 'Sede (Montepuez)' : 'Filial Maputo'),
             posId: `CX-0${Math.floor(Math.random() * 4) + 1}`,
             status: 'completed'
          };

          setSales(prev => [newSale, ...prev].slice(0, 50));
          setTodayTotal(prev => prev + total);
          setTxCount(prev => prev + 1);
       }
    }, 3000);
    return () => clearInterval(interval);
  }, [branchId, branchName]);

  const removeSale = (id: string) => {
    setSales(prev => {
      const filtered = prev.filter(s => s.id !== id);
      return filtered;
    });
    
    if (selectedSale?.id === id) {
      setSelectedSale(null);
    }
    
    // Atualizar kpis simulados (aqui subtraimos para manter consistência)
    const saleToDelete = sales.find(s => s.id === id);
    if (saleToDelete) {
      setTodayTotal(prev => prev - saleToDelete.total);
      setTxCount(prev => prev - 1);
      toast.success(`A venda ${id} foi estornada com sucesso.`);
    }
  };
  
  const editSale = (id: string, updatedTotal: number) => {
      setSales(prev => prev.map(s => {
          if (s.id === id) {
              const diff = updatedTotal - s.total;
              setTodayTotal(curr => curr + diff);
              const updatedSale = { ...s, total: updatedTotal };
              if (selectedSale?.id === id) {
                  setSelectedSale(updatedSale);
              }
              return updatedSale;
          }
          return s;
      }));
      toast.success(`Total da venda ${id} ajustado.`);
  }

  return {
    sales,
    todayTotal,
    txCount,
    selectedSale,
    setSelectedSale,
    removeSale,
    editSale
  };
}
