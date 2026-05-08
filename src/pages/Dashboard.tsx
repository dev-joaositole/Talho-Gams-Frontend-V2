import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/pages/hr/ui/button';
import { getCurrentUser, getActiveBranch } from '@/lib/storage';
import { DashboardContext } from './dashboard/DashboardContext';
import { useSettings } from '@/contexts/SettingsContext';

import Overview from './dashboard/Overview';
import Statistics from './dashboard/Statistics';
import Alerts from './dashboard/Alerts';
import Performance from './dashboard/Performance';

const tabs = [
  { label: 'Visão geral', path: '/dashboard' },
  { label: 'Estatísticas', path: '/dashboard/estatisticas' },
  { label: 'Alertas', path: '/dashboard/alertas' },
  { label: 'Performance', path: '/dashboard/performance' },
];

export default function Dashboard() {
  const [userName, setUserName] = useState('João Sitolo');
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeBranch = getActiveBranch();
  const branchId = activeBranch ? activeBranch.id : 'global';
  const branchName = activeBranch ? activeBranch.name : 'Visão Global';
  const { t } = useSettings();

  useEffect(() => {
     const u = getCurrentUser();
     if (u) setUserName(u.name);
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="pt-2 md:pt-4 pb-4 w-full">
        <PageHeader 
          title={t('Dashboard')} 
          description={
             <span>{t('Bem-vindo de volta,')} {userName}!</span>
          }
          tabs={tabs} 
          onSearch={setSearchQuery}
          searchPlaceholder={t('Pesquisar métricas ou alertas...')}
        />
      </div>
      
      <div className="relative">
        <DashboardContext.Provider value={{ branchId, setBranchId: () => {}, branchName, searchQuery }}>
           <Routes>
             <Route index element={<Overview />} />
             <Route path="estatisticas" element={<Statistics />} />
             <Route path="alertas" element={<Alerts />} />
             <Route path="performance" element={<Performance />} />
           </Routes>
        </DashboardContext.Provider>
      </div>
    </div>
  );
}
