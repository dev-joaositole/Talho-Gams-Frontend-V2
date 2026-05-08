import { createContext, useContext } from 'react';

export interface SalesCycleContextData {
  branchId: string; // 'global' or specific ID
  setBranchId: (id: string) => void;
  period: string; // 'hoje', 'semana', 'mes', 'ano'
  setPeriod: (p: string) => void;
  resetFilters: () => void;
  branchName: string; // resolved branch name for context
  searchQuery: string; // for searching tables
}

export const SalesCycleContext = createContext<SalesCycleContextData>({} as SalesCycleContextData);

export const useSalesCycleContext = () => useContext(SalesCycleContext);
