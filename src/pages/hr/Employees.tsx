import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/hr/ui/select';
import { UserPlus, UserCog, Check, MapPin, Eye, Building2, UserX, UserCheck, Trash2, Edit } from 'lucide-react';
import { getEmployees, getBranches, Employee, Branch, saveEmployee, updateEmployee, deleteEmployee, registerUser } from '@/lib/storage';
import { toast } from 'sonner';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  useEffect(() => {
    setEmployees(getEmployees());
    setBranches(getBranches());
  }, []);

  useEffect(() => {
    const handleOpenWizard = () => {
      setEmployeeToEdit(null);
      setIsWizardOpen(true);
    };
    window.addEventListener('open-new-employee', handleOpenWizard);
    return () => window.removeEventListener('open-new-employee', handleOpenWizard);
  }, []);

  const handleToggleStatus = (emp: Employee) => {
    updateEmployee(emp.id, { status: emp.status === 'active' ? 'inactive' : 'active' });
    toast.success(`Funcionário ${emp.status === 'active' ? 'desativado' : 'ativado'} com sucesso.`);
    setEmployees(getEmployees());
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja eliminar este funcionário?')) {
      deleteEmployee(id);
      toast.success('Funcionário eliminado.');
      setEmployees(getEmployees());
    }
  };

  const handleEdit = (emp: Employee) => {
    setEmployeeToEdit(emp);
    setIsWizardOpen(true);
  };

  return (
    <div className="pt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      {!isWizardOpen ? (
        <>
          <Card className="overflow-hidden p-0 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] bg-white rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-5">Nome</th>
                    <th className="px-6 py-5">Cargo / Departamento</th>
                    <th className="px-6 py-5">Estabelecimento</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-6 py-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map(emp => {
                    const branch = branches.find(b => b.id === emp.branchId);
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-800">{emp.name}</div>
                           <div className="text-xs font-medium text-slate-400 mt-0.5">{emp.email || emp.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-700">{emp.role}</div>
                           <div className="text-xs font-medium text-slate-500 mt-0.5">{emp.department}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-600 flex items-center gap-2">
                           <Building2 className="w-4 h-4 text-slate-400" />
                           {branch?.name || '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${emp.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                             {emp.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg font-bold border-slate-200 hover:bg-slate-50" title="Ver Perfil">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg font-bold border-slate-200 hover:bg-blue-50 hover:text-blue-600" title="Editar" onClick={() => handleEdit(emp)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant={emp.status === 'active' ? 'outline' : 'default'} 
                                size="sm" 
                                className={`h-9 px-3 rounded-lg font-bold ${emp.status === 'active' ? 'text-slate-600 border-slate-200 hover:bg-slate-50' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-none'}`} 
                                onClick={() => handleToggleStatus(emp)}
                                title={emp.status === 'active' ? 'Desativar' : 'Ativar'}
                              >
                                {emp.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </Button>
                              <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg font-bold border-rose-200 text-rose-500 hover:bg-rose-50" title="Eliminar" onClick={() => handleDelete(emp.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                  {employees.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold">
                           Nenhum funcionário cadastrado.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <EmployeeWizard 
          onClose={() => {
            setIsWizardOpen(false);
            setEmployeeToEdit(null);
            setEmployees(getEmployees());
          }} 
          branches={branches}
          employeeToEdit={employeeToEdit}
        />
      )}
    </div>
  );
}

function EmployeeWizard({ onClose, branches, employeeToEdit }: { onClose: () => void, branches: Branch[], employeeToEdit: Employee | null }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    name: employeeToEdit?.name || '', document: employeeToEdit?.document || '', birthDate: employeeToEdit?.birthDate || '', phone: employeeToEdit?.phone || '', email: employeeToEdit?.email || '', address: employeeToEdit?.address || '',
    // Step 2
    role: employeeToEdit?.role || '', department: employeeToEdit?.department || '', branchId: employeeToEdit?.branchId || '', admissionDate: employeeToEdit?.admissionDate || '',
    // Step 3
    createLogin: false, username: '', password: '', userRole: 'operator',
    // Step 4
    canOpenCloseShift: false, canRefund: false, canEditSales: false
  });

  const updateForm = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.document || !formData.birthDate || !formData.phone)) {
      toast.error('Preencha os campos obrigatórios da Etapa 1.'); return;
    }
    if (step === 2 && (!formData.role || !formData.department || !formData.branchId || !formData.admissionDate)) {
       toast.error('Preencha os campos obrigatórios da Etapa 2.'); return;
    }
    if (step === 3 && formData.createLogin && (!formData.username || !formData.password)) {
       toast.error('Informe username e password para criar o login.'); return;
    }
    if (step < 4) setStep(step + 1);
  };

  const handleFinish = () => {
    try {
      if (employeeToEdit) {
        updateEmployee(employeeToEdit.id, {
          name: formData.name,
          document: formData.document,
          birthDate: formData.birthDate,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          role: formData.role,
          department: formData.department,
          branchId: formData.branchId,
          admissionDate: formData.admissionDate,
        });
        toast.success('Funcionário atualizado com sucesso!');
      } else {
        let systemUserId = undefined;
        
        if (formData.createLogin) {
           // Create the login user
           const user = registerUser(formData.username, formData.password, formData.userRole as any, formData.branchId, formData.name);
           systemUserId = user.id;
        }

        saveEmployee({
          name: formData.name,
          document: formData.document,
          birthDate: formData.birthDate,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          role: formData.role,
          department: formData.department,
          branchId: formData.branchId,
          admissionDate: formData.admissionDate,
          status: 'active',
          systemUserId
        });

        toast.success('Funcionário cadastrado com sucesso!');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao guardar funcionário.');
    }
  };

  return (
    <Card className="bg-white p-8 rounded-3xl shadow-lg border-0 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800">{employeeToEdit ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
          <p className="text-sm font-bold text-slate-400 mt-1">Siga as etapas para criar ou editar o registo.</p>
        </div>
        <Button variant="ghost" onClick={onClose} className="font-bold text-slate-500 hover:bg-slate-100 self-start sm:self-auto">Cancelar</Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
           {[1, 2, 3, 4].map(s => (
             <div key={s} className={`flex flex-col items-center flex-1 ${s !== 4 ? 'relative' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm z-10 transition-colors ${step >= s ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-100 text-slate-400'}`}>
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s !== 4 && <div className={`absolute top-5 left-1/2 w-full h-[3px] -translate-y-1/2 ${step > s ? 'bg-blue-600' : 'bg-slate-100'}`} />}
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 text-center absolute top-12 whitespace-nowrap ${step >= s ? 'text-blue-600' : 'text-slate-400'}`}>
                   {s === 1 ? 'Pessoais' : s === 2 ? 'Profissionais' : s === 3 ? 'Acesso' : 'Permissões'}
                </span>
             </div>
           ))}
        </div>
      </div>

      <div className="mt-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nome Completo *</label>
                   <Input 
                      value={formData.name} onChange={e => updateForm('name', e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">BI / NUIT *</label>
                   <Input 
                      value={formData.document} onChange={e => updateForm('document', e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Data de Nascimento *</label>
                   <Input 
                      type="date"
                      value={formData.birthDate} onChange={e => updateForm('birthDate', e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Telefone *</label>
                   <Input 
                      value={formData.phone} onChange={e => updateForm('phone', e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all"
                   />
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">E-mail</label>
                   <Input 
                      type="email"
                      value={formData.email} onChange={e => updateForm('email', e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Endereço Completo</label>
                   <Input 
                      value={formData.address} onChange={e => updateForm('address', e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all"
                   />
                </div>
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Cargo *</label>
                   <Input 
                      placeholder="Ex: Operador de Caixa"
                      value={formData.role} onChange={e => updateForm('role', e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Departamento *</label>
                   <Input 
                      placeholder="Ex: Vendas"
                      value={formData.department} onChange={e => updateForm('department', e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Estabelecimento / Filial *</label>
                   <Select value={formData.branchId} onValueChange={v => updateForm('branchId', v)}>
                     <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all">
                       <SelectValue placeholder="Selecione..." />
                     </SelectTrigger>
                     <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                       {branches.map(b => (
                         <SelectItem key={b.id} value={b.id} className="font-medium cursor-pointer focus:bg-slate-50 focus:text-blue-600">{b.name}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Data de Admissão *</label>
                   <Input 
                      type="date"
                      value={formData.admissionDate} onChange={e => updateForm('admissionDate', e.target.value)}
                      className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all"
                   />
                </div>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
             {employeeToEdit ? (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="font-bold text-slate-500 mb-2">Edição de acessos não disponível por aqui.</p>
                  <p className="text-sm text-slate-400">Edite acessos e senhas diretamente na gestão de perfis de usuário.</p>
                </div>
             ) : (
             <>
             <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors" onClick={() => updateForm('createLogin', !formData.createLogin)}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${formData.createLogin ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-100'}`}>
                   {formData.createLogin && <Check className="w-4 h-4" />}
                </div>
                <div>
                   <div className="font-bold text-slate-800">Criar Usuário de Acesso ao Sistema</div>
                   <div className="text-xs text-slate-500 font-medium mt-0.5">Permite que o funcionário faça login no POS ou Dashboard.</div>
                </div>
             </div>

             {formData.createLogin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 pt-2">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nome de Usuário (Username) *</label>
                      <Input 
                         value={formData.username} onChange={e => updateForm('username', e.target.value)}
                         className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Senha (Password) *</label>
                      <Input 
                         type="password"
                         value={formData.password} onChange={e => updateForm('password', e.target.value)}
                         className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all"
                      />
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nível de Acesso *</label>
                      <Select value={formData.userRole} onValueChange={v => updateForm('userRole', v)}>
                        <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl font-bold shadow-sm transition-all w-full md:w-1/2">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                          <SelectItem value="operator" className="font-medium cursor-pointer focus:bg-slate-50 focus:text-blue-600">Operador de Caixa</SelectItem>
                          <SelectItem value="manager" className="font-medium cursor-pointer focus:bg-slate-50 focus:text-blue-600">Gerente de Loja</SelectItem>
                          <SelectItem value="admin" className="font-medium cursor-pointer focus:bg-slate-50 focus:text-blue-600">Administrador Global</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                </div>
             )}
             </>
             )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
             <h3 className="font-black text-slate-800 text-lg mb-4">Permissões Operacionais (Opcional)</h3>
             <div className="space-y-3">
                 <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => updateForm('canOpenCloseShift', !formData.canOpenCloseShift)}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${formData.canOpenCloseShift ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-100'}`}>
                       {formData.canOpenCloseShift && <Check className="w-4 h-4" />}
                    </div>
                    <div>
                       <div className="font-bold text-slate-800">Abrir & Fechar Caixa</div>
                       <div className="text-xs text-slate-500 font-medium mt-0.5">Tem permissão explícita para forçar fecho de caixa.</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => updateForm('canRefund', !formData.canRefund)}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${formData.canRefund ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-100'}`}>
                       {formData.canRefund && <Check className="w-4 h-4" />}
                    </div>
                    <div>
                       <div className="font-bold text-slate-800">Processar Devoluções</div>
                       <div className="text-xs text-slate-500 font-medium mt-0.5">Permite extornar pagamentos e devolver stock.</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => updateForm('canEditSales', !formData.canEditSales)}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${formData.canEditSales ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-100'}`}>
                       {formData.canEditSales && <Check className="w-4 h-4" />}
                    </div>
                    <div>
                       <div className="font-bold text-slate-800">Cancelamento / Edição de Vendas</div>
                       <div className="text-xs text-slate-500 font-medium mt-0.5">Permite modificar recibos após finalizados.</div>
                    </div>
                 </div>
             </div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between mt-8 pt-6 border-t border-slate-100 gap-4">
         <div>
            {step > 1 && (
               <Button variant="outline" onClick={() => setStep(step - 1)} className="h-12 w-full sm:w-auto px-6 font-bold rounded-xl border-slate-200">
                  Voltar
               </Button>
            )}
         </div>
         <Button 
            onClick={step === 4 ? handleFinish : handleNext} 
            className="h-12 w-full sm:w-auto px-8 font-black bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-xl shadow-slate-800/20"
         >
            {step === 4 ? 'Finalizar Cadastro' : 'Próxima Etapa'}
         </Button>
      </div>
    </Card>
  );
}
