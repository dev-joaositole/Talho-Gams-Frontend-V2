export const overviewSalesData = [
  { name: 'Seg', total: 4000 },
  { name: 'Ter', total: 3000 },
  { name: 'Qua', total: 2000 },
  { name: 'Qui', total: 2780 },
  { name: 'Sex', total: 1890 },
  { name: 'Sáb', total: 6000 },
  { name: 'Dom', total: 3490 },
];

export const topProductsData = [
  { name: "Carne Bovina 1ª", info: "Qualidade Extra", value: "85,550 MT", badge: "1" },
  { name: "Peito de Frango", info: "Congelado", value: "24,030 MT", badge: "2" },
  { name: "Costeleta Suína", info: "Fresco", value: "19,600 MT", badge: "3" },
  { name: "Carapau Caixa", info: "Atacado", value: "48,300 MT", badge: "4" },
];

export const statisticsCategoryData = [
  { name: 'Carne Bovina', value: 45 },
  { name: 'Frango', value: 30 },
  { name: 'Suínos', value: 15 },
  { name: 'Peixe', value: 10 },
];

export const statisticsRevenueVsExpense = [
  { month: 'Jan', revenue: 400000, expense: 240000 },
  { month: 'Fev', revenue: 300000, expense: 139800 },
  { month: 'Mar', revenue: 200000, expense: 98000 },
  { month: 'Abr', revenue: 278000, expense: 390800 },
  { month: 'Mai', revenue: 189000, expense: 48000 },
  { month: 'Jun', revenue: 239000, expense: 38000 },
];

export const alertsData = [
  { id: 1, type: 'critical', title: 'Despesa Atrasada', message: 'Fornecedor de Carnes (Bovino) - 150.000 MT está com o pagamento atrasado desde o dia 20/04.', time: 'Financeiro' },
  { id: 2, type: 'critical', title: 'Nível de Stock Crítico', message: 'Peito de Frango Congelado (Abaixo de 10kg)', time: 'Há 10 min' },
  { id: 3, type: 'warning', title: 'Despesa Próxima do Vencimento', message: 'A fatura de Energia (5.000 MT) vence amanhã.', time: 'Financeiro' },
  { id: 4, type: 'warning', title: 'Manutenção Pendente', message: 'Câmara Frigorífica Nº 2 necessita de revisão', time: 'Há 2 horas' },
  { id: 5, type: 'info', title: 'Atualização de Preços', message: 'Carne bovina ajustada no sistema central', time: 'Ontem às 18:30' }
];

export const staffPerformanceData = [
  { id: 1, name: 'João Sitolo', role: 'Gerente', sales: 145, revenue: '145,000 MT', rating: 98 },
  { id: 2, name: 'Marcos Silva', role: 'Operador Caixa', sales: 120, revenue: '89,500 MT', rating: 92 },
  { id: 3, name: 'Ana Lúcia', role: 'Talhante', sales: 85, revenue: '112,000 MT', rating: 88 },
  { id: 4, name: 'Carlos Mendes', role: 'Operador Caixa', sales: 60, revenue: '45,200 MT', rating: 75 },
];
