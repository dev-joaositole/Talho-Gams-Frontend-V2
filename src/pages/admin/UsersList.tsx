import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Plus, Edit, ShieldAlert, UserCheck, UserX } from 'lucide-react';
import { User, getUsers, registerUser, updateUser, getBranches, Branch, getCurrentUser, Employee, getEmployees } from '@/lib/storage';
import { saveAuditLog } from './models/admin';
import { toast } from 'sonner';

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'operator'>('operator');
  const [branchId, setBranchId] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(getUsers());
    setBranches(getBranches());
    setEmployees(getEmployees());
    setCurrentUser(getCurrentUser());
  };

  const handleOpenForm = (user?: User) => {
    if (user) {
      setEditId(user.id);
      setEmployeeId(user.employeeId || '');
      setEmail(user.username);
      setPassword(''); // keep blank unless resetting
      setRole(user.role);
      setBranchId(user.assignedBranchId || '');
      setStatus(user.status || 'active');
    } else {
      setEditId(null);
      setEmployeeId('');
      setEmail('');
      setPassword('');
      setRole('operator');
      setBranchId('');
      setStatus('active');
    }
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!employeeId && !editId) {
      toast.error('Selecione um funcionário.');
      return;
    }
    if (!email) {
      toast.error('Email/Login é obrigatório.');
      return;
    }
    
    // Business rules
    if ((role === 'manager' || role === 'operator') && !branchId) {
      toast.error('Selecione uma filial para Gerentes ou Funcionários.');
      return;
    }

    if (currentUser?.role === 'manager' && role === 'admin') {
      toast.error('Gerentes não podem criar Administradores.');
      return;
    }

    const selectedEmp = employees.find(e => e.id === employeeId);
    const userName = selectedEmp ? selectedEmp.name : 'Utilizador Sistema';

    try {
      if (editId) {
        updateUser(editId, { username: email, name: userName, role, assignedBranchId: branchId, status, employeeId });
        if (password) updateUser(editId, { password }); // update password if provided
        toast.success('Utilizador atualizado.');
        
        saveAuditLog({
          userId: currentUser?.id || 'system',
          userName: currentUser?.name || 'System',
          action: 'UPDATE_USER',
          entityType: 'User',
          entityId: editId,
          changes: [{ field: 'all', old: null, new: { role, status } }],
          severity: 'medium'
        });
      } else {
        if (!password) {
          toast.error('Palavra-passe é obrigatória para novos utilizadores.');
          return;
        }
        
        const existingMap = users.find(u => u.employeeId === employeeId);
        if (existingMap) {
          toast.error('Este funcionário já tem um utilizador associado.');
          return;
        }

        const newUser = registerUser(email, password, role, branchId, userName);
        updateUser(newUser.id, { status, employeeId });
        
        toast.success('Utilizador associado com sucesso.');

        saveAuditLog({
          userId: currentUser?.id || 'system',
          userName: currentUser?.name || 'System',
          action: 'CREATE_USER',
          entityType: 'User',
          entityId: newUser.id,
          changes: [{ field: 'all', old: null, new: { email, role, branchId } }],
          severity: 'medium'
        });
      }
      setIsFormOpen(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const toggleStatus = (user: User) => {
    const newStatus = user.status === 'inactive' ? 'active' : 'inactive';
    updateUser(user.id, { status: newStatus });
    toast.success(`Usuário ${newStatus === 'active' ? 'ativado' : 'desativado'}.`);
    saveAuditLog({
      userId: currentUser?.id || 'system',
      userName: currentUser?.name || 'System',
      action: 'UPDATE_USER_STATUS',
      entityType: 'User',
      entityId: user.id,
      changes: [{ field: 'status', old: user.status, new: newStatus }],
      severity: 'medium'
    });
    loadData();
  };

  if (currentUser?.role === 'operator') {
    return (
      <div className="p-8 text-center text-slate-500">
         <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-red-400" />
         <h2 className="text-xl font-bold text-slate-700">Acesso Negado</h2>
         <p>Funcionários não têm acesso à gestão de utilizadores.</p>
      </div>
    );
  }

  // Se for gerente, vê apenas os da sua filial
  const visibleUsers = currentUser?.role === 'manager' 
    ? users.filter(u => u.assignedBranchId === currentUser.assignedBranchId) 
    : users;

  const roleText = (r: string) => {
    switch(r) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      default: return 'Funcionário';
    }
  };

  const roleColor = (r: string) => {
    switch(r) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
         <div>
            <h2 className="text-xl font-black text-slate-800">Associação de Permissões</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Transformar funcionários registados em utilizadores do sistema.</p>
         </div>
         <Button 
           onClick={() => handleOpenForm()}
           className="h-11 w-full sm:w-auto px-5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md"
         >
           <Plus className="w-4 h-4 mr-2" /> Atribuir Acesso
         </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-[24px] bg-white overflow-hidden p-6 md:p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-l-xl">Status</th>
                <th className="px-6 py-4">Funcionário</th>
                <th className="px-6 py-4">Login</th>
                <th className="px-6 py-4">Nível de Acesso</th>
                <th className="px-6 py-4">Filial</th>
                <th className="px-6 py-4 rounded-r-xl text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {visibleUsers.map(u => {
                const b = branches.find(br => br.id === u.assignedBranchId);
                const isActive = u.status !== 'inactive';
                return (
                  <tr key={u.id} className={`hover:bg-slate-50/50 transition-colors ${!isActive ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      {isActive ? (
                        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      ) : (
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{u.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-slate-500">{u.username}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${roleColor(u.role)}`}>
                        {roleText(u.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {b?.name || (u.role === 'admin' ? 'Acesso Global' : 'Não definida')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          onClick={() => handleOpenForm(u)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {u.id !== currentUser?.id && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 rounded-lg ${isActive ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                            onClick={() => toggleStatus(u)}
                          >
                            {isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL UTILIZADOR */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <Card className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-0 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="text-xl font-black text-slate-800">{editId ? 'Editar Permissões' : 'Atribuir Acesso'}</h2>
                 <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">✕</Button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Funcionário</label>
                    <select 
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none disabled:opacity-50"
                      value={employeeId}
                      onChange={e => setEmployeeId(e.target.value)}
                      disabled={!!editId}
                    >
                      <option value="">Selecione um funcionário...</option>
                      {employees.map(e => <option key={e.id} value={e.id}>{e.name} - {e.role}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Username / Email (Login)</label>
                    <Input value={email} onChange={e=>setEmail(e.target.value)} className="h-12 bg-slate-50 border-slate-200 rounded-xl" placeholder="exemplo@z-core.com" disabled={!!editId && email === 'admin'} />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      {editId ? 'Nova Palavra-passe (opcional)' : 'Palavra-passe'}
                    </label>
                    <Input value={password} type="password" onChange={e=>setPassword(e.target.value)} className="h-12 bg-slate-50 border-slate-200 rounded-xl" placeholder="******" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Tipo (Função)</label>
                       <select 
                         className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none disabled:opacity-50"
                         value={role}
                         onChange={e => setRole(e.target.value as any)}
                         disabled={currentUser?.role !== 'admin' || (editId !== null && role === 'admin')}
                       >
                         {currentUser?.role === 'admin' && <option value="admin">Admin</option>}
                         <option value="manager">Gerente</option>
                         <option value="operator">Funcionário</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Filial Alocada</label>
                       <select 
                         className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                         value={branchId}
                         onChange={e => setBranchId(e.target.value)}
                         disabled={currentUser?.role !== 'admin'}
                       >
                         <option value="">(Global / Nenhuma)</option>
                         {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                       </select>
                    </div>
                 </div>

              </div>
              <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50 rounded-b-[24px]">
                 <Button variant="ghost" className="flex-1 h-12 font-bold" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                 <Button className="flex-[2] h-12 font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-lg" onClick={handleSave}>
                   {editId ? 'Salvar Alterações' : 'Criar Acesso'}
                 </Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}

