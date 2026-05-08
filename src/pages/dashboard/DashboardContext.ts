import { createContext, useContext } from 'react';

export interface DashboardContextData {
  branchId: string;
  setBranchId: (id: string) => void;
  branchName: string;
  searchQuery: string;
}

export const DashboardContext = createContext<DashboardContextData>({} as DashboardContextData);

export const useDashboardContext = () => useContext(DashboardContext);
