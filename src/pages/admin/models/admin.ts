import { User, Branch } from '@/lib/storage';

export interface SystemLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  timestamp: string;
  details?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  changes: { field: string; old: any; new: any }[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RolePermission {
  id: string;
  module: string;
  admin: string[];
  manager: string[];
  operator: string[];
}

const getStorage = <T>(key: string): T[] => {
  return JSON.parse(localStorage.getItem(key) || '[]');
};

const setStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const STORAGE_KEYS = {
  SYSTEM_LOGS: 'gams_system_logs',
  AUDIT_LOGS: 'gams_audit_logs',
  PERMISSIONS: 'gams_permissions',
};

// System Logs
export const getSystemLogs = () => getStorage<SystemLog>(STORAGE_KEYS.SYSTEM_LOGS);
export const saveSystemLog = (log: Omit<SystemLog, 'id' | 'timestamp'>) => {
  const logs = getSystemLogs();
  const id = `LOG-${Date.now()}`;
  logs.push({ ...log, id, timestamp: new Date().toISOString() });
  setStorage(STORAGE_KEYS.SYSTEM_LOGS, logs);
  return id;
};

// Audit Logs
export const getAuditLogs = () => getStorage<AuditLog>(STORAGE_KEYS.AUDIT_LOGS);
export const saveAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
  const logs = getAuditLogs();
  const id = `AUD-${Date.now()}`;
  logs.push({ ...log, id, timestamp: new Date().toISOString() });
  setStorage(STORAGE_KEYS.AUDIT_LOGS, logs);
  return id;
};

// Permissions
const defaultPermissions: RolePermission[] = [
  { id: '1', module: 'Vendas (POS)', admin: ['Ler', 'Criar', 'Editar', 'Apagar'], manager: ['Ler', 'Criar'], operator: ['Ler', 'Criar'] },
  { id: '2', module: 'Compras & Estoque', admin: ['Ler', 'Criar', 'Editar', 'Apagar'], manager: ['Ler', 'Criar', 'Editar'], operator: ['Nenhum'] },
  { id: '3', module: 'Fornecedores', admin: ['Ler', 'Criar', 'Editar', 'Apagar'], manager: ['Ler', 'Criar', 'Editar'], operator: ['Nenhum'] },
  { id: '4', module: 'Gestão de RH', admin: ['Ler', 'Criar', 'Editar', 'Apagar'], manager: ['Ler', 'Criar', 'Editar'], operator: ['Nenhum'] },
  { id: '5', module: 'Financeiro', admin: ['Ler', 'Criar', 'Editar', 'Apagar'], manager: ['Ler'], operator: ['Nenhum'] },
  { id: '6', module: 'Ciclo de Vendas', admin: ['Ler', 'Criar', 'Editar', 'Apagar'], manager: ['Ler'], operator: ['Nenhum'] },
  { id: '7', module: 'Produtos (Catálogo)', admin: ['Ler', 'Criar', 'Editar', 'Apagar'], manager: ['Ler', 'Criar'], operator: ['Ler'] },
  { id: '8', module: 'Administração Geral', admin: ['Ler', 'Criar', 'Editar', 'Apagar'], manager: ['Ler (própria filial)'], operator: ['Nenhum'] },
];

export const getPermissions = (): RolePermission[] => {
  const stored = getStorage<RolePermission>(STORAGE_KEYS.PERMISSIONS);
  if (stored.length === 0) {
    setStorage(STORAGE_KEYS.PERMISSIONS, defaultPermissions);
    return defaultPermissions;
  }
  return stored;
};

export const savePermission = (perm: Omit<RolePermission, 'id'>) => {
  const perms = getPermissions();
  const id = `PERM-${Date.now()}`;
  perms.push({ ...perm, id });
  setStorage(STORAGE_KEYS.PERMISSIONS, perms);
  return id;
};

export const updatePermission = (id: string, updates: Partial<RolePermission>) => {
  const perms = getPermissions();
  const index = perms.findIndex(p => p.id === id);
  if (index !== -1) {
    perms[index] = { ...perms[index], ...updates };
    setStorage(STORAGE_KEYS.PERMISSIONS, perms);
  }
};

export const deletePermission = (id: string) => {
  let perms = getPermissions();
  perms = perms.filter(p => p.id !== id);
  setStorage(STORAGE_KEYS.PERMISSIONS, perms);
};