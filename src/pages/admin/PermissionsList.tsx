import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Shield, CheckCircle2, XCircle, Edit, Plus, Trash2 } from 'lucide-react';
import { RolePermission, getPermissions, savePermission, updatePermission, deletePermission, saveAuditLog } from './models/admin';
import { getCurrentUser } from '@/lib/storage';
import { toast } from 'sonner';

export default function PermissionsList() {
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [moduleName, setModuleName] = useState('');
  const [adminPerms, setAdminPerms] = useState<string[]>([]);
  const [managerPerms, setManagerPerms] = useState<string[]>([]);
  const [operatorPerms, setOperatorPerms] = useState<string[]>([]);

  const availableOptions = ['Ler', 'Criar', 'Editar', 'Apagar', 'Nenhum'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPermissions(getPermissions());
  };

  const handleOpenForm = (perm?: RolePermission) => {
    if (perm) {
      setEditId(perm.id);
      setModuleName(perm.module);
      setAdminPerms(perm.admin);
      setManagerPerms(perm.manager);
      setOperatorPerms(perm.operator);
    } else {
      setEditId(null);
      setModuleName('');
      setAdminPerms(['Ler', 'Criar', 'Editar', 'Apagar']);
      setManagerPerms(['Nenhum']);
      setOperatorPerms(['Nenhum']);
    }
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!moduleName) {
      toast.error('O nome do módulo é obrigatório.');
      return;
    }

    const currentUser = getCurrentUser();

    try {
      if (editId) {
        updatePermission(editId, { 
          module: moduleName, 
          admin: adminPerms, 
          manager: managerPerms, 
          operator: operatorPerms 
        });
        toast.success('Permissão atualizada com sucesso.');

        saveAuditLog({
          userId: currentUser?.id || 'system',
          userName: currentUser?.name || 'System',
          action: 'UPDATE_PERMISSION',
          entityType: 'Permission',
          entityId: editId,
          changes: [{ field: 'all', old: null, new: { moduleName, adminPerms, managerPerms, operatorPerms } }],
          severity: 'medium'
        });
      } else {
        const id = savePermission({
          module: moduleName, 
          admin: adminPerms, 
          manager: managerPerms, 
          operator: operatorPerms 
        });
        toast.success('Novo módulo de permissão criado.');

        saveAuditLog({
          userId: currentUser?.id || 'system',
          userName: currentUser?.name || 'System',
          action: 'CREATE_PERMISSION',
          entityType: 'Permission',
          entityId: id,
          changes: [{ field: 'all', old: null, new: { moduleName, adminPerms, managerPerms, operatorPerms } }],
          severity: 'medium'
        });
      }
      setIsFormOpen(false);
      loadData();
    } catch (e: any) {
      toast.error('Erro ao guardar permissão.');
    }
  };

  const handleDelete = (id: string, moduleName: string) => {
    if (confirm(`Tem a certeza que deseja remover o módulo "${moduleName}"?`)) {
      deletePermission(id);
      toast.success('Módulo removido das permissões.');
      const currentUser = getCurrentUser();
      saveAuditLog({
        userId: currentUser?.id || 'system',
        userName: currentUser?.name || 'System',
        action: 'DELETE_PERMISSION',
        entityType: 'Permission',
        entityId: id,
        changes: [{ field: 'all', old: moduleName, new: null }],
        severity: 'high'
      });
      loadData();
    }
  };

  const renderBadge = (perms: string[]) => {
    if (!perms || perms.length === 0 || perms.includes('Nenhum')) {
      return <span className="flex items-center text-red-500 font-bold text-xs"><XCircle className="w-3.5 h-3.5 mr-1" /> Bloqueado</span>;
    }
    if (perms.length === 4 && perms.includes('Ler') && perms.includes('Criar') && perms.includes('Editar') && perms.includes('Apagar')) {
      return <span className="flex items-center text-emerald-600 font-bold text-xs"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Acesso Total</span>;
    }
    
    return (
      <div className="flex gap-1 flex-wrap">
        {perms.map(p => (
          <span key={p} className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 font-bold uppercase">{p}</span>
        ))}
      </div>
    );
  };

  const toggleOption = (current: string[], option: string, setFn: (val: string[]) => void) => {
    if (option === 'Nenhum') {
      setFn(['Nenhum']);
      return;
    }
    
    let next = current.filter(c => c !== 'Nenhum');
    if (next.includes(option)) {
      next = next.filter(c => c !== option);
    } else {
      next = [...next, option];
    }
    
    if (next.length === 0) next = ['Nenhum'];
    setFn(next);
  };

  const renderCheckboxes = (label: string, current: string[], setFn: (val: string[]) => void) => (
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {availableOptions.map(opt => (
          <Button 
            key={opt}
            variant="outline"
            size="sm"
            onClick={() => toggleOption(current, opt, setFn)}
            className={`h-8 text-xs font-bold ${current.includes(opt) ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' : 'text-slate-500'}`}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
         <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Shield className="w-5 h-5 text-indigo-500" /> Matriz de Permissões (RBAC)
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Configuração de acessos estruturada por perfil.</p>
         </div>
         <Button 
           onClick={() => handleOpenForm()}
           className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
         >
           <Plus className="w-4 h-4 mr-2" /> Adicionar Módulo
         </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 w-1/4">Módulo do Sistema</th>
                <th className="px-6 py-4 w-1/5">Admin</th>
                <th className="px-6 py-4 w-1/5">Gerente</th>
                <th className="px-6 py-4 w-1/5">Funcionário</th>
                <th className="px-6 py-4 w-12text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {permissions.map((row: RolePermission) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-black text-slate-800">{row.module}</td>
                  <td className="px-6 py-4">{renderBadge(row.admin)}</td>
                  <td className="px-6 py-4">{renderBadge(row.manager)}</td>
                  <td className="px-6 py-4">{renderBadge(row.operator)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenForm(row)}
                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(row.id, row.module)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL PERMISSÕES */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <Card className="w-full max-w-lg bg-white rounded-[24px] shadow-2xl p-0 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="text-xl font-black text-slate-800">{editId ? 'Editar Permissão' : 'Novo Módulo'}</h2>
                 <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">✕</Button>
              </div>
              <div className="p-6 space-y-6">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nome do Módulo do Sistema</label>
                    <Input value={moduleName} onChange={e=>setModuleName(e.target.value)} className="h-12 bg-slate-50 border-slate-200 rounded-xl" placeholder="Ex: Financeiro, Relatórios..." />
                 </div>
                 
                 <div className="space-y-4 pt-4 border-t border-slate-100">
                   {renderCheckboxes('Administrador (Global)', adminPerms, setAdminPerms)}
                   {renderCheckboxes('Gerente (Filial)', managerPerms, setManagerPerms)}
                   {renderCheckboxes('Funcionário (Operacional)', operatorPerms, setOperatorPerms)}
                 </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50 rounded-b-[24px]">
                 <Button variant="ghost" className="flex-1 h-12 font-bold" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                 <Button className="flex-[2] h-12 font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg" onClick={handleSave}>
                   {editId ? 'Salvar Alterações' : 'Criar Permissão'}
                 </Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
