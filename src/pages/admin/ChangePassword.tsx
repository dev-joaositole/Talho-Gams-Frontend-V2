import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { KeyRound, Search, CheckCircle2 } from 'lucide-react';
import { User, getUsers, updateUser, getCurrentUser } from '@/lib/storage';
import { saveAuditLog } from './models/admin';
import { toast } from 'sonner';

export default function ChangePassword() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setUsers(getUsers());
    setCurrentUser(getCurrentUser());
  }, []);

  const handleSave = () => {
    if (!selectedUser) return;
    if (!newPassword || newPassword.length < 4) {
      toast.error('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    try {
      updateUser(selectedUser.id, { password: newPassword });
      toast.success(`Senha de ${selectedUser.name} alterada com sucesso!`);
      
      saveAuditLog({
        userId: currentUser?.id || 'system',
        userName: currentUser?.name || 'System',
        action: 'UPDATE_PASSWORD',
        entityType: 'User',
        entityId: selectedUser.id,
        changes: [{ field: 'password', old: '***', new: '***' }],
        severity: 'high'
      });

      setNewPassword('');
      setSelectedUser(null);
      setSearchTerm('');
    } catch (e: any) {
      toast.error('Erro ao alterar senha.');
    }
  };

  const filteredUsers = searchTerm.length > 1 ? users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (currentUser?.role === 'operator') {
    return (
      <div className="p-8 text-center text-slate-500">
         <h2 className="text-xl font-bold text-slate-700">Acesso Negado</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
         <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-500" /> Alterar Senha
         </h2>
         <p className="text-sm font-medium text-slate-500 mt-1">Pesquise por um utilizador e atualize a palavra-passe associada.</p>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-[24px] p-6 bg-white space-y-6">
         {!selectedUser ? (
           <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pesquisar Utilizador</label>
              <div className="relative">
                 <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                 <Input 
                   autoFocus
                   placeholder="Digite o nome ou login..." 
                   className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-xl font-medium"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>

              {filteredUsers.length > 0 && (
                <div className="mt-4 border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-50">
                  {filteredUsers.map(u => (
                    <div 
                      key={u.id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedUser(u)}
                    >
                       <div>
                         <div className="font-bold text-slate-800">{u.name}</div>
                         <div className="text-xs font-medium text-slate-500">{u.username}</div>
                       </div>
                       <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold px-4">Selecionar</Button>
                    </div>
                  ))}
                </div>
              )}
              {searchTerm.length > 1 && filteredUsers.length === 0 && (
                <div className="p-4 text-center text-sm font-medium text-slate-500">Nenhum utilizador encontrado.</div>
              )}
           </div>
         ) : (
           <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                 <div>
                   <span className="block text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Selecionado</span>
                   <div className="font-black text-blue-900 text-lg">{selectedUser.name}</div>
                   <div className="text-sm font-medium text-blue-700">{selectedUser.username}</div>
                 </div>
                 <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)} className="text-blue-600 hover:bg-blue-100 h-8">
                   Trocar
                 </Button>
              </div>

              <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nova Palavra-passe</label>
                 <Input 
                   type="password"
                   value={newPassword}
                   onChange={e => setNewPassword(e.target.value)}
                   className="h-14 bg-slate-50 border-slate-200 rounded-xl"
                   placeholder="******"
                 />
              </div>

              <div className="pt-4 flex gap-4">
                 <Button 
                   className="h-12 w-full font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg"
                   onClick={handleSave}
                 >
                   <CheckCircle2 className="w-4 h-4 mr-2" />
                   Confirmar e Atualizar Senha
                 </Button>
              </div>
           </div>
         )}
      </Card>
    </div>
  );
}
