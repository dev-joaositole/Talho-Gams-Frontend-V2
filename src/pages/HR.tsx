import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { getActiveBranch } from '@/lib/storage';
import { Button } from '@/pages/hr/ui/button';
import { UserPlus } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

import Employees from './hr/Employees';
import Contracts from './hr/Contracts';
import Schedules from './hr/Schedules';
import Salaries from './hr/Salaries';
import Performance from './hr/Performance';

export const HRContext = React.createContext<{ branchId: string; setBranchId: (id: string) => void; searchQuery: string }>({
  branchId: 'global',
  setBranchId: () => {},
  searchQuery: ''
});

const tabs = [
  { label: 'Funcionários', path: '/rh' },
  { label: 'Contratos', path: '/rh/contratos' },
  { label: 'Escalas', path: '/rh/escalas' },
  { label: 'Salários', path: '/rh/salarios' },
  { label: 'Performance', path: '/rh/performance' },
];

export default function HR() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { t } = useSettings();
  
  const activeBranch = getActiveBranch();
  const branchId = activeBranch ? activeBranch.id : 'global';

  const isEmployeesTab = location.pathname === '/rh' || location.pathname === '/rh/';

  const actionNode = isEmployeesTab ? (
    <Button 
      onClick={() => window.dispatchEvent(new Event('open-new-employee'))} 
      className="h-11 px-5 rounded-[12px] bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white shadow-md flex items-center gap-2"
    >
      <UserPlus className="w-4 h-4" />
      {t('Novo Funcionário')}
    </Button>
  ) : undefined;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="pt-2 md:pt-4 pb-4 w-full">
        <PageHeader 
          title={t("Recursos Humanos")}
          description={t("Gestão de funcionários, contratos, horários, salários e performance.")}
          tabs={tabs} 
          action={actionNode}
        />
      </div>
      
      <div className="relative">
        <HRContext.Provider value={{ branchId, setBranchId: () => {}, searchQuery }}>
          <Routes>
            <Route index element={<Employees />} />
            <Route path="contratos" element={<Contracts />} />
            <Route path="escalas" element={<Schedules />} />
            <Route path="salarios" element={<Salaries />} />
            <Route path="performance" element={<Performance />} />
          </Routes>
        </HRContext.Provider>
      </div>
    </div>
  );
}
