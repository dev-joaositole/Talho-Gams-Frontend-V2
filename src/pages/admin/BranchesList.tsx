import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Plus, Edit, MapPin, Building2, Phone, Briefcase, ShieldAlert } from 'lucide-react';
import { Branch, getBranches, saveBranch, updateBranch, getCurrentUser, User, getUsers } from '@/lib/storage';
import { saveAuditLog } from './models/admin';
import { toast } from 'sonner';

export default function BranchesList() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [managerId, setManagerId] = useState('');
  const [isHQ, setIsHQ] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBranches(getBranches());
    setUsers(getUsers());
    setCurrentUser(getCurrentUser());
  };

  const handleOpenForm = (b?: Branch) => {
    if (b) {
      setEditId(b.id);
      setName(b.name);
      setLocation(b.location || '');
      setContact(b.contact || '');
      setManagerId(b.managerId || '');
      setIsHQ(b.isHeadquarters);
    } else {
      setEditId(null);
      setName('');
      setLocation('');
      setContact('');
      setManagerId('');
      setIsHQ(false);
    }
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!name || !location) {
      toast.error('Nome e localização são obrigatórios.');
      return;
    }

    try {
      if (editId) {
        updateBranch(editId, { name, location, contact, managerId, isHeadquarters: isHQ });
        toast.success('Filial atualizada com sucesso.');
        saveAuditLog({
          userId: currentUser?.id || 'system',
          userName: currentUser?.name || 'System',
          action: 'UPDATE_BRANCH',
          entityType: 'Branch',
          entityId: editId,
          changes: [{ field: 'all', old: null, new: { name, location, contact, managerId, isHeadquarters: isHQ } }],
          severity: 'medium'
        });
      } else {
        const id = saveBranch({ name, location, contact, managerId, isHeadquarters: isHQ });
        toast.success('Filial criada com sucesso.');
        saveAuditLog({
          userId: currentUser?.id || 'system',
          userName: currentUser?.name || 'System',
          action: 'CREATE_BRANCH',
          entityType: 'Branch',
          entityId: id,
          changes: [{ field: 'all', old: null, new: { name, location, contact, managerId, isHeadquarters: isHQ } }],
          severity: 'medium'
        });
      }
      setIsFormOpen(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (currentUser?.role === 'operator') {
    return (
      <div className="p-8 text-center text-slate-500">
         <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-red-400" />
         <h2 className="text-xl font-bold text-slate-700">Acesso Negado</h2>
         <p>Funcionários não têm acesso à gestão de filiais.</p>
      </div>
    );
  }

  const visibleBranches = currentUser?.role === 'manager' 
    ? branches.filter(b => b.id === currentUser.assignedBranchId) 
    : branches;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
         <div>
            <h2 className="text-xl font-black text-slate-800">Estabelecimentos (Filiais)</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Gestão de locais físicos, contactos e responsáveis.</p>
         </div>
         {currentUser?.role === 'admin' && (
           <Button 
             onClick={() => handleOpenForm()}
             className="h-11 w-full sm:w-auto px-5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md"
           >
             <Plus className="w-4 h-4 mr-2" /> Nova Filial
           </Button>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {visibleBranches.map(b => {
           const manager = users.find(u => u.id === b.managerId);
           return (
             <Card key={b.id} className={`border border-slate-100 shadow-sm rounded-[24px] p-6 relative ${b.isHeadquarters ? 'bg-amber-50/30' : 'bg-white'}`}>
               {currentUser?.role === 'admin' && (
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="absolute top-4 right-4 h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 focus:bg-transparent rounded-lg"
                   onClick={() => handleOpenForm(b)}
                 >
                   <Edit className="w-4 h-4" />
                 </Button>
               )}

               <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${b.isHeadquarters ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                     <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{b.name}</h3>
                    {b.isHeadquarters && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Sede Principal</span>}
                  </div>
               </div>

               <div className="space-y-3 mt-6">
                 <div className="flex items-start text-sm">
                   <MapPin className="w-4 h-4 text-slate-400 mr-3 mt-0.5" />
                   <span className="font-medium text-slate-600">{b.location || 'Não definida'}</span>
                 </div>
                 <div className="flex items-center text-sm">
                   <Phone className="w-4 h-4 text-slate-400 mr-3" />
                   <span className="font-medium text-slate-600">{b.contact || 'Não definido'}</span>
                 </div>
                 <div className="flex items-center text-sm pt-3 border-t border-slate-100">
                   <Briefcase className="w-4 h-4 text-slate-400 mr-3" />
                   <span className="font-bold text-slate-700">{manager?.name || 'Sem Gerente Associado'}</span>
                 </div>
               </div>
             </Card>
           );
         })}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <Card className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-0 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="text-xl font-black text-slate-800">{editId ? 'Editar Filial' : 'Nova Filial'}</h2>
                 <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">✕</Button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nome da Filial / Loja</label>
                    <Input value={name} onChange={e=>setName(e.target.value)} className="h-12 bg-slate-50 border-slate-200 rounded-xl" placeholder="Ex: Loja Centro" />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Localização Completa</label>
                    <Input value={location} onChange={e=>setLocation(e.target.value)} className="h-12 bg-slate-50 border-slate-200 rounded-xl" placeholder="Ex: Av. Eduardo Mondlane, nº 100" />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Contacto Principal</label>
                    <Input value={contact} onChange={e=>setContact(e.target.value)} className="h-12 bg-slate-50 border-slate-200 rounded-xl" placeholder="+258 84..." />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Gerente Responsável</label>
                       <select 
                         className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                         value={managerId}
                         onChange={e => setManagerId(e.target.value)}
                       >
                         <option value="">(Nenhum)</option>
                         {users.filter(u => u.role === 'manager').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                       </select>
                    </div>
                    <div className="flex justify-center flex-col">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">É a Sede Principal?</label>
                       <div className="flex items-center h-12">
                         <input 
                           type="checkbox" 
                           checked={isHQ} 
                           onChange={e => setIsHQ(e.target.checked)}
                           className="w-5 h-5 rounded text-amber-500 border-slate-300 focus:ring-amber-500"
                         />
                         <span className="ml-2 text-sm font-bold text-slate-700">Sim, é Sede</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50 rounded-b-[24px]">
                 <Button variant="ghost" className="flex-1 h-12 font-bold" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                 <Button className="flex-[2] h-12 font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-lg" onClick={handleSave}>
                   {editId ? 'Salvar Alterações' : 'Criar Filial'}
                 </Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
