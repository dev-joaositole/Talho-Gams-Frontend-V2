export interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

export interface RealtimeSale {
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

export const generateMockSales = (): RealtimeSale[] => {
  const methodOptions = ['Dinheiro', 'M-Pesa', 'Cartão', 'Transferência'];
  const nameOptions = ['Carne Bovina 1ª', 'Frango Inteiro', 'Salsichão', 'Massa Esparguete', 'Lombo de Porco', 'Carne Picada', 'Fraldinha'];
  
  return Array.from({ length: 5 }).map((_, i) => {
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = Array.from({ length: itemCount }).map((_, j) => {
      const q = Math.floor(Math.random() * 5) + 1;
      const p = Math.floor(Math.random() * 800) + 200;
      return {
        id: `item-${Date.now()}-${j}`,
        name: nameOptions[Math.floor(Math.random() * nameOptions.length)],
        quantity: q,
        unit: 'kg',
        price: p,
        total: q * p
      };
    });

    const total = items.reduce((acc, item) => acc + item.total, 0);

    const d = new Date();
    d.setMinutes(d.getMinutes() - i * 3); // Spaced by a few minutes

    return {
      id: `VDA-${Math.floor(Math.random() * 90000) + 10000}`,
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items,
      total,
      paymentMethod: methodOptions[Math.floor(Math.random() * methodOptions.length)],
      employeeName: 'João Silva', // fallback
      branchName: 'Sede (Montepuez)',
      posId: `CX-0${Math.floor(Math.random() * 4) + 1}`,
      status: 'completed'
    };
  });
};
