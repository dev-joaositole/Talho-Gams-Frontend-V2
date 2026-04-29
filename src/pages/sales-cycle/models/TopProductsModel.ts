export interface ProductRanking {
  id: number;
  name: string;
  category: string;
  qty: number;
  unit: string;
  revenue: number;
  share: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'fast_selling' | 'slow';
}

export const getTopProducts = (): ProductRanking[] => [
  { id: 1, name: 'Carne Bovina 1ª (Limpa)', category: 'Carnes Mistas', qty: 145, unit: 'kg', revenue: 65250, share: 44, trend: 'up', status: 'normal' },
  { id: 2, name: 'Frango Inteiro (Duro)', category: 'Aves', qty: 98, unit: 'un', revenue: 34300, share: 23, trend: 'up', status: 'fast_selling' },
  { id: 3, name: 'Salsichão', category: 'Processados', qty: 45, unit: 'kg', revenue: 11250, share: 8, trend: 'stable', status: 'normal' },
  { id: 4, name: 'Carne Picada', category: 'Carnes Mistas', qty: 32, unit: 'kg', revenue: 10560, share: 7, trend: 'up', status: 'normal' },
  { id: 5, name: 'Galinha Viva', category: 'Aves', qty: 25, unit: 'un', revenue: 8750, share: 6, trend: 'down', status: 'slow' },
  { id: 6, name: 'Lombo de Porco', category: 'Suínos', qty: 18, unit: 'kg', revenue: 7200, share: 5, trend: 'down', status: 'normal' },
  { id: 7, name: 'Carvão 5kg', category: 'Diversos', qty: 40, unit: 'un', revenue: 6000, share: 4, trend: 'stable', status: 'normal' },
  { id: 8, name: 'Massa Esparguete 500g', category: 'Mercearia', qty: 55, unit: 'un', revenue: 2750, share: 2, trend: 'stable', status: 'normal' },
  { id: 9, name: 'Tempero Maggi Carga', category: 'Mercearia', qty: 110, unit: 'un', revenue: 1100, share: 1, trend: 'stable', status: 'normal' },
];
