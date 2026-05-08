import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';

import SystemSettings from './settings/SystemSettings';
import PrintSettings from './settings/PrintSettings';
import Integrations from './settings/Integrations';
import BackupList from './settings/Backup';
import { logoutUser } from '@/lib/storage';

const tabs = [
  { label: 'Sistema', path: '/configuracoes' },
  { label: 'Impressão', path: '/configuracoes/impressao' },
  { label: 'Integrações', path: '/configuracoes/integracoes' },
  { label: 'Backup', path: '/configuracoes/backup' },
];

function LogoutProcess() {
  React.useEffect(() => {
    logoutUser();
    window.location.href = '/login';
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-slate-500">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
      <p className="font-bold">A encerrar sessão com segurança...</p>
    </div>
  );
}

export default function Settings() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="pt-2 md:pt-4 pb-4 w-full">
        <PageHeader 
          title="Configurações" 
          description="Personalização técnica e operacional do sistema." 
          tabs={tabs} 
        />
      </div>
      
      <div className="relative">
        <Routes>
          <Route index element={<SystemSettings />} />
          <Route path="impressao" element={<PrintSettings />} />
          <Route path="integracoes" element={<Integrations />} />
          <Route path="backup" element={<BackupList />} />
          <Route path="sair" element={<LogoutProcess />} />
        </Routes>
      </div>
    </div>
  );
}

