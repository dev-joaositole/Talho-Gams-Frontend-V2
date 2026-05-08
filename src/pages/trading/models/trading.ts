export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  rating: number; // 1-5
  totalPurchases: number;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  lot?: string;
  expirationDate?: string;
}

export interface Purchase {
  id: string;
  supplierId: string;
  branchId: string;
  date: string;
  items: PurchaseItem[];
  totalValue: number;
  status: 'Pendente' | 'Concluída' | 'Cancelada';
  userId: string;
}

export interface POSItem {
  productId: string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Sale {
  id: string;
  branchId: string;
  date: string;
  items: POSItem[];
  totalValue: number;
  paymentMethod: 'Dinheiro' | 'Cartão' | 'M-Pesa' | 'Misto';
  userId: string;
  shiftId?: string; // associada a um caixa
}

export interface StockMovement {
  id: string;
  branchId: string;
  productId: string;
  quantity: number;
  type: 'Entrada' | 'Saida' | 'Ajuste';
  reason: 'Compra' | 'Venda' | 'Devolução' | 'Perda' | 'Ajuste de Inventário';
  date: string;
  userId: string;
  referenceId?: string; // id da compra, venda, devolução
}

export interface Return {
  id: string;
  saleId: string;
  branchId: string;
  productId: string;
  quantity: number;
  reason: string;
  refundMethod: 'Reembolso' | 'Crédito' | 'Troca';
  date: string;
  userId: string;
  status: 'Pendente' | 'Finalizada';
}

const getStorage = <T>(key: string): T[] => {
  return JSON.parse(localStorage.getItem(key) || '[]');
};

const setStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const STORAGE_KEYS = {
  SUPPLIERS: 'gams_suppliers',
  PURCHASES: 'gams_purchases',
  SALES: 'gams_sales',
  STOCK_MOVEMENTS: 'gams_stock_movements',
  RETURNS: 'gams_returns'
};

// CRUD FOR SUPPLIERS
export const getSuppliers = () => getStorage<Supplier>(STORAGE_KEYS.SUPPLIERS);
export const saveSupplier = (supplier: Omit<Supplier, 'id'>) => {
  const suppliers = getSuppliers();
  const id = `SUP-${Date.now()}`;
  suppliers.push({ ...supplier, id });
  setStorage(STORAGE_KEYS.SUPPLIERS, suppliers);
  return id;
};

// CRUD FOR PURCHASES
export const getPurchases = () => getStorage<Purchase>(STORAGE_KEYS.PURCHASES);
export const savePurchase = (purchase: Omit<Purchase, 'id'>) => {
  const purchases = getPurchases();
  const id = `PUR-${Date.now()}`;
  purchases.push({ ...purchase, id });
  setStorage(STORAGE_KEYS.PURCHASES, purchases);
  return id;
};

// CRUD FOR SALES
export const getSales = () => getStorage<Sale>(STORAGE_KEYS.SALES);
export const saveSale = (sale: Omit<Sale, 'id'>) => {
  const sales = getSales();
  const id = `SAL-${Date.now()}`;
  sales.push({ ...sale, id });
  setStorage(STORAGE_KEYS.SALES, sales);
  return id;
};

// CRUD FOR STOCK MOVEMENTS
export const getStockMovements = () => getStorage<StockMovement>(STORAGE_KEYS.STOCK_MOVEMENTS);
export const saveStockMovement = (movement: Omit<StockMovement, 'id'>) => {
  const movements = getStockMovements();
  const id = `MOV-${Date.now()}`;
  movements.push({ ...movement, id });
  setStorage(STORAGE_KEYS.STOCK_MOVEMENTS, movements);
  return id;
};

// CRUD FOR RETURNS
export const getReturns = () => getStorage<Return>(STORAGE_KEYS.RETURNS);
export const saveReturn = (ret: Omit<Return, 'id'>) => {
  const returns = getReturns();
  const id = `RET-${Date.now()}`;
  returns.push({ ...ret, id });
  setStorage(STORAGE_KEYS.RETURNS, returns);
  return id;
};
