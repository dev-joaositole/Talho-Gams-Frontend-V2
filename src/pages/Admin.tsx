import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';

import UsersList from './admin/UsersList';
import BranchesList from './admin/BranchesList';
import PermissionsList from './admin/PermissionsList';
import LogsList from './admin/LogsList';
import AuditList from './admin/AuditList';
import ChangePassword from './admin/ChangePassword';
import { getCurrentUser } from '@/lib/storage';

const tabs = [
  { label: 'Utilizadores', path: '/admin' },
  { label: 'Permissões', path: '/admin/permissoes' },
  { label: 'Alterar Senha', path: '/admin/senha' },
  { label: 'Estabelecimentos', path: '/admin/estabelecimentos' },
  { label: 'Logs', path: '/admin/logs' },
  { label: 'Auditoria', path: '/admin/auditoria' },
];

export default function Admin() {
  const currentUser = getCurrentUser();

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="px-6 md:px-10 pt-6 md:pt-10 shrink-0 bg-[#f4f7f9] z-10 w-full mb-4">
        <PageHeader 
          title="Administração" 
          description="Controlo total da segurança, acessos e locais do sistema." 
          tabs={tabs} 
        />
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-6 md:pb-10 scrollbar-hide relative">
        <Routes>
          <Route index element={<UsersList />} />
          <Route path="permissoes" element={<PermissionsList />} />
          <Route path="senha" element={<ChangePassword />} />
          <Route path="estabelecimentos" element={<BranchesList />} />
          <Route path="logs" element={<LogsList />} />
          <Route path="auditoria" element={<AuditList />} />
        </Routes>
      </div>
    </div>
  );
}
