export interface Branch {
  id: string;
  name: string;
  location?: string;
  contact?: string;
  managerId?: string;
  status?: string;
  isHeadquarters: boolean;
}

export interface User {
  id: string;
  employeeId?: string;
  username: string; // Used as email or login string
  password?: string;
  name: string;
  role: 'admin' | 'manager' | 'operator';
  assignedBranchId: string;
  status?: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
}

export interface KitComponent {
  productId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  barcode: string;
  type: 'kg' | 'un';
  costPrice: number;
  globalPrice: number;
  expirationDate?: string;
  description?: string;
  isComposite?: boolean;
  components?: KitComponent[];
  minStock?: number;
}

export interface BranchInventory {
  id: string;
  branchId: string;
  productId: string;
  branchPrice?: number;
  stock: number;
}

export interface ProductVariation {
  id: string;
  productId: string;
  name: string;
  costPercentageIncrease: number;
  barcode?: string;
  stock?: number;
}

const STORAGE_KEYS = {
  PRODUCTS: 'talho_gams_products',
  CATEGORIES: 'talho_gams_categories',
  BRANCHES: 'talho_gams_branches',
  USERS: 'talho_gams_users',
  SESSION: 'talho_gams_session',
  INVENTORY: 'talho_gams_inventory',
  VARIATIONS: 'talho_gams_variations',
  SHIFTS: 'talho_gams_shifts',
  EMPLOYEES: 'talho_gams_hr_employees',
  CONTRACTS: 'talho_gams_hr_contracts',
  SCHEDULES: 'talho_gams_hr_schedules',
  SALARIES: 'talho_gams_hr_salaries',
};

export interface Employee {
  id: string;
  name: string;
  document: string; // NUIT or BI
  birthDate: string;
  phone: string;
  email?: string;
  address?: string;
  role: string;
  department: string;
  branchId: string;
  admissionDate: string;
  status: 'active' | 'inactive';
  systemUserId?: string; // Links to User if they have login
}

export interface Contract {
  id: string;
  employeeId: string;
  type: 'temporary' | 'permanent' | 'part-time';
  startDate: string;
  endDate?: string;
  baseSalary: number;
  notes?: string;
  status: 'active' | 'expired' | 'terminated';
}

export interface Schedule {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  breakDurationMinutes: number;
}

export interface SalaryPayment {
  id: string;
  employeeId: string;
  period: string; // e.g., "04-2026"
  baseSalary: number;
  commission: number;
  bonus: number;
  deductions: number;
  totalAmount: number;
  status: 'pending' | 'paid';
  paymentDate?: string;
}

export interface Shift {
  id: string;
  userId: string;
  branchId: string;
  openedAt: string;
  closedAt?: string;
  initialFloat: number;
  expectedCloseAmount?: number;
  actualCloseAmount?: number;
  discrepancy?: number;
  status: 'open' | 'closed';
  movements: Array<{
    id: string;
    type: 'sale' | 'sangria' | 'adjustment_in' | 'adjustment_out' | 'expense_payment';
    amount: number;
    description: string;
    timestamp: string;
    paymentMethod?: 'Dinheiro' | 'Cartão' | 'Transferência/M-Pesa'; // for sales
  }>;
}

const seedData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.BRANCHES)) {
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify([
      { id: '1', name: 'Sede (Montepuez)', isHeadquarters: true },
      { id: '2', name: 'Filial Beira', isHeadquarters: false },
      { id: '3', name: 'Filial Nampula', isHeadquarters: false },
    ]));
  }

  const existingUsersJSON = localStorage.getItem(STORAGE_KEYS.USERS);
  let shouldSeedUsers = !existingUsersJSON;
  if (existingUsersJSON) {
    const parsed = JSON.parse(existingUsersJSON);
    if (parsed.length > 0 && parsed[0].username === 'admin') shouldSeedUsers = true;
  }
  if (shouldSeedUsers) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
      { id: '1', username: 'admin@gmail.com', password: 'admin123', name: 'João Sitolo', role: 'admin', assignedBranchId: '1' },
      { id: '2', username: 'gerente@gmail.com', password: 'gerente123', name: 'Carlos Silva', role: 'manager', assignedBranchId: '2' },
      { id: '3', username: 'caixa@gmail.com', password: 'caixa123', name: 'Maria Fernanda', role: 'operator', assignedBranchId: '1' },
    ]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([
      { id: '1', name: 'Carnes Bovinas' },
      { id: '2', name: 'Frango' },
      { id: '3', name: 'Suínos' },
      { id: '4', name: 'Peixes' },
    ]));
  }

  const seedProducts = !localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (seedProducts) {
    const initialProducts: Product[] = [
      { id: '1', name: 'Carne Bovina 1ª', categoryId: '1', barcode: '2000000000010', type: 'kg', costPrice: 400, globalPrice: 650, isComposite: false },
      { id: '2', name: 'Peito de Frango', categoryId: '2', barcode: '2000000000027', type: 'kg', costPrice: 150, globalPrice: 270, isComposite: false },
      { id: '3', name: 'Picanha', categoryId: '1', barcode: '2000000000055', type: 'kg', costPrice: 700, globalPrice: 1200, isComposite: false },
      { id: '100', name: 'Cabaz Fim de Semana', categoryId: '1', barcode: '200000000100', type: 'un', costPrice: 1500, globalPrice: 2000, isComposite: true },
    ];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }

  if (seedProducts || !localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
    const inv: BranchInventory[] = [
      { id: '1_1', branchId: '1', productId: '1', stock: 145 },
      { id: '1_2', branchId: '1', productId: '2', stock: 89 },
      { id: '1_3', branchId: '1', productId: '3', stock: 12 },
      { id: '2_1', branchId: '2', productId: '1', stock: 50, branchPrice: 680 }, // Override na beira
      { id: '2_3', branchId: '2', productId: '3', stock: 5 },
      { id: '1_100', branchId: '1', productId: '100', stock: 10 },
    ];
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inv));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.VARIATIONS)) {
     localStorage.setItem(STORAGE_KEYS.VARIATIONS, JSON.stringify([
       { id: 'v1', productId: '1', name: 'Moída', costPercentageIncrease: 10 }
     ]));
  }
};

if (typeof window !== 'undefined') {
  seedData();
}

// Auth
// --- Shift Management ---

export const getShifts = (): Shift[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SHIFTS) || '[]');
};

export const getOpenShift = (userId: string): Shift | null => {
  const shifts = getShifts();
  return shifts.find(s => s.userId === userId && s.status === 'open') || null;
};

export const getShiftMovements = (shiftId: string): Shift['movements'] => {
  const shifts = getShifts();
  const shift = shifts.find(s => s.id === shiftId);
  return shift ? shift.movements : [];
};

export const openShift = (userId: string, branchId: string, initialFloat: number): Shift => {
  const shifts = getShifts();
  
  if (getOpenShift(userId)) {
    throw new Error('User already has an open shift');
  }

  const newShift: Shift = {
    id: `shift_${Date.now()}`,
    userId,
    branchId,
    openedAt: new Date().toISOString(),
    initialFloat,
    status: 'open',
    movements: []
  };

  shifts.push(newShift);
  localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
  return newShift;
};

export const addShiftMovement = (shiftId: string, movement: Omit<Shift['movements'][0], 'id' | 'timestamp'>) => {
  const shifts = getShifts();
  const shiftIndex = shifts.findIndex(s => s.id === shiftId);
  
  if (shiftIndex > -1) {
    if (shifts[shiftIndex].status !== 'open') {
      throw new Error('Cannot add movement to a closed shift');
    }
    
    shifts[shiftIndex].movements.push({
      ...movement,
      id: `mov_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
  }
};

export const closeShift = (shiftId: string, actualCloseAmount: number): Shift => {
  const shifts = getShifts();
  const shiftIndex = shifts.findIndex(s => s.id === shiftId);
  
  if (shiftIndex > -1) {
    const shift = shifts[shiftIndex];
    if (shift.status !== 'open') {
      throw new Error('Shift is already closed');
    }
    
    // Calculate expected amount (Cash only for drawer)
    const expectedCloseAmount = shift.initialFloat + shift.movements
      .filter(m => (m.type === 'sale' && m.paymentMethod === 'Dinheiro') || m.type === 'adjustment_in')
      .reduce((acc, curr) => acc + curr.amount, 0)
    - shift.movements
      .filter(m => m.type === 'sangria' || m.type === 'expense_payment' || m.type === 'adjustment_out')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const discrepancy = actualCloseAmount - expectedCloseAmount;

    shifts[shiftIndex] = {
      ...shift,
      status: 'closed',
      closedAt: new Date().toISOString(),
      expectedCloseAmount,
      actualCloseAmount,
      discrepancy
    };
    
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
    return shifts[shiftIndex];
  }
  throw new Error('Shift not found');
};

export const loginUser = (username: string, password?: string): boolean => {
  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (user && user.password === password) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ userId: user.id, activeBranchId: user.assignedBranchId }));
    return true;
  }
  return false;
};
export const registerUser = (username: string, password?: string, role: string = 'operator', assignedBranchId?: string, forceName?: string): User => {
  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
     throw new Error('Usuário já existe.');
  }
  const newUser: User = {
    id: Date.now().toString(),
    name: forceName || username,
    username,
    password,
    role: role as any,
    assignedBranchId
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const logoutUser = () => localStorage.removeItem(STORAGE_KEYS.SESSION);
export const getCurrentSession = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
export const getUsers = (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
export const updateUser = (id: string, updates: Partial<User>) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};
export const getCurrentUser = (): User | null => {
  const sess = getCurrentSession();
  if (!sess) return null;
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]').find((u: User) => u.id === sess.userId) || null;
};

// Branches
export const getBranches = (): Branch[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.BRANCHES) || '[]');
export const saveBranch = (branch: Omit<Branch, 'id'>) => {
  const branches = getBranches();
  const id = `BR-${Date.now()}`;
  branches.push({ ...branch, id });
  localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
  return id;
};
export const updateBranch = (id: string, updates: Partial<Branch>) => {
  const branches = getBranches();
  const index = branches.findIndex(b => b.id === id);
  if (index !== -1) {
    branches[index] = { ...branches[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
  }
};
export const getActiveBranch = (): Branch | null => {
  const sess = getCurrentSession();
  if (!sess) return null;
  return getBranches().find(b => b.id === sess.activeBranchId) || null;
};
export const setActiveBranch = (branchId: string) => {
  const sess = getCurrentSession();
  if (sess) { sess.activeBranchId = branchId; localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sess)); }
};

// Categories
export const getCategories = (): Category[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
export const saveCategory = (category: Omit<Category, 'id'>) => {
  const cats = getCategories();
  const newCat = { ...category, id: Date.now().toString() };
  cats.push(newCat);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
  return newCat;
};

// Products & Inventory
export const getGlobalProducts = (): Product[] => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  // Migrate old products if needed
  return data.map((p: any) => ({
    ...p,
    globalPrice: p.globalPrice !== undefined ? p.globalPrice : (p.price || 0),
    costPrice: p.costPrice !== undefined ? p.costPrice : 0,
    isComposite: p.isComposite || false,
  }));
};

export const saveProductBase = (product: Omit<Product, 'id'>) => {
  const products = getGlobalProducts();
  const id = Date.now().toString();
  products.push({ 
    ...product, 
    id,
    isComposite: product.isComposite || false,
    components: product.components || []
  });
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return id;
};

export const updateProduct = (productId: string, updates: Partial<Product>) => {
  const products = getGlobalProducts();
  const idx = products.findIndex(p => p.id === productId);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
};

export const getInventory = (): BranchInventory[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.INVENTORY) || '[]');

export const updateBranchInventory = (branchId: string, productId: string, updates: Partial<BranchInventory>) => {
  const inv = getInventory();
  const idx = inv.findIndex(i => i.branchId === branchId && i.productId === productId);
  if (idx !== -1) {
    inv[idx] = { ...inv[idx], ...updates };
  } else {
    inv.push({ id: `${branchId}_${productId}`, branchId, productId, stock: 0, ...updates });
  }
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inv));
};

export const updateGlobalStock = (productId: string, newStock: number) => {
  const inv = getInventory();
  const branches = getBranches();
  branches.forEach(b => {
    const idx = inv.findIndex(i => i.branchId === b.id && i.productId === productId);
    if (idx !== -1) inv[idx].stock = newStock;
    else inv.push({ id: `${b.id}_${productId}`, branchId: b.id, productId, stock: newStock });
  });
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inv));
};

export const updateGlobalProductPrice = (productId: string, newPrice: number) => {
   const products = getGlobalProducts();
   const idx = products.findIndex(p => p.id === productId);
   if(idx !== -1) {
      products[idx].globalPrice = newPrice;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
   }
};

export const getVariations = (): ProductVariation[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.VARIATIONS) || '[]');
export const saveVariation = (vars: Omit<ProductVariation, 'id'>) => {
  const list = getVariations();
  list.push({ ...vars, id: Date.now().toString() });
  localStorage.setItem(STORAGE_KEYS.VARIATIONS, JSON.stringify(list));
};

export const deleteProduct = (id: string) => {
  const products = getGlobalProducts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const editProduct = (id: string, updates: Partial<Product>) => {
  const products = getGlobalProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
};

export const deleteVariation = (id: string) => {
  const list = getVariations().filter(v => v.id !== id);
  localStorage.setItem(STORAGE_KEYS.VARIATIONS, JSON.stringify(list));
};

export const editVariation = (id: string, updates: Partial<ProductVariation>) => {
  const list = getVariations();
  const idx = list.findIndex(v => v.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.VARIATIONS, JSON.stringify(list));
  }
};

// HR
export const getEmployees = (): Employee[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES) || '[]');
export const saveEmployee = (employee: Omit<Employee, 'id'>) => {
  const list = getEmployees();
  const newEmp = { ...employee, id: Date.now().toString() };
  list.push(newEmp);
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
  return newEmp.id;
};
export const updateEmployee = (id: string, updates: Partial<Employee>) => {
  const list = getEmployees();
  const idx = list.findIndex(e => e.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
  }
};

export const deleteEmployee = (id: string) => {
  const list = getEmployees().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
};

export const getContracts = (): Contract[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTRACTS) || '[]');
export const saveContract = (contract: Omit<Contract, 'id'>) => {
  const list = getContracts();
  list.push({ ...contract, id: Date.now().toString() });
  localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(list));
};
export const updateContract = (id: string, updates: Partial<Contract>) => {
  const list = getContracts();
  const idx = list.findIndex(c => c.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(list));
  }
};
export const deleteContract = (id: string) => {
  const list = getContracts().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CONTRACTS, JSON.stringify(list));
};

export const getSchedules = (): Schedule[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHEDULES) || '[]');
export const saveSchedule = (schedule: Omit<Schedule, 'id'>) => {
  const list = getSchedules();
  list.push({ ...schedule, id: Date.now().toString() });
  localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(list));
};
export const updateSchedule = (id: string, updates: Partial<Schedule>) => {
  const list = getSchedules();
  const idx = list.findIndex(s => s.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(list));
  }
};
export const deleteSchedule = (id: string) => {
  const list = getSchedules().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(list));
};

export const getSalaryPayments = (): SalaryPayment[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.SALARIES) || '[]');
export const saveSalaryPayment = (payment: Omit<SalaryPayment, 'id'>) => {
  const list = getSalaryPayments();
  list.push({ ...payment, id: Date.now().toString() });
  localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(list));
};
export const updateSalaryPayment = (id: string, updates: Partial<SalaryPayment>) => {
  const list = getSalaryPayments();
  const idx = list.findIndex(p => p.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(list));
  }
};
export const deleteSalaryPayment = (id: string) => {
  const list = getSalaryPayments().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.SALARIES, JSON.stringify(list));
};
