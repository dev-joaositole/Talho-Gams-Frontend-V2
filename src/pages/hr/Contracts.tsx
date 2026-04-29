import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/hr/ui/select';
import { FileSignature, Plus, Calendar, DollarSign, PenTool, CheckCircle2, Trash2, Edit } from 'lucide-react';
import { getContracts, getEmployees, Contract, Employee, saveContract, updateContract, deleteContract } from '@/lib/storage';
import { toast } from 'sonner';

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractToEdit, setContractToEdit] = useState<Contract | null>(null);

  useEffect(() => {
    setContracts(getContracts());
    setEmployees(getEmployees());
  }, []);

  return (
    <div className="pt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      {!isModalOpen ? (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Contratos & Vínculos Base</h2>
              <p className="text-sm font-bold text-slate-400 mt-1">Gestão do vínculo legal e base de remuneração.</p>
            </div>
            <Button onClick={() => { setContractToEdit(null); setIsModalOpen(true); }} className="h-12 bg-indigo-600 hover:bg-indigo-700 font-bold px-6 rounded-xl shadow-lg shadow-indigo-600/20 text-white">
              <Plus className="w-5 h-5 mr-3" />
              Novo Contrato
            </Button>
          </div>

          <Card className="overflow-hidden p-0 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] bg-white rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-5">Funcionário</th>
                    <th className="px-6 py-5">Tipo</th>
                    <th className="px-6 py-5">Período</th>
                    <th className="px-6 py-5">Salário Base</th>
                    <th className="px-6 py-5 cursor-default text-center">Status</th>
                    <th className="px-6 py-5 cursor-default text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contracts.map(contract => {
                    const emp = employees.find(e => e.id === contract.employeeId);
                    return (
                      <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-800">{emp?.name || 'Desconhecido'}</div>
                           <div className="text-xs font-medium text-slate-400 mt-0.5">{emp?.role}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-700 capitalize text-[13px]">{contract.type === 'temporary' ? 'Temporário' : contract.type === 'permanent' ? 'Efetivo / Permanente' : 'Part-time'}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-600">
                           <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              {contract.startDate} {contract.endDate ? `a ${contract.endDate}` : '(Sem termo)'}
                           </div>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-800">
                           {contract.baseSalary.toLocaleString()} <span className="text-xs text-slate-400">MT</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${contract.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                             {contract.status === 'active' ? 'Vigente' : contract.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg font-bold border-slate-200 hover:bg-blue-50 hover:text-blue-600" title="Editar" onClick={() => { setContractToEdit(contract); setIsModalOpen(true); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg font-bold border-rose-200 text-rose-500 hover:bg-rose-50" title="Eliminar" onClick={() => {
                                if (confirm('Tem certeza que deseja eliminar este contrato?')) {
                                  deleteContract(contract.id);
                                  toast.success('Contrato eliminado.');
                                  setContracts(getContracts());
                                }
                              }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                  {contracts.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold">
                           Nenhum contrato cadastrado.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <CreateContractForm 
          employees={employees} 
          contractToEdit={contractToEdit}
          onClose={() => {
            setIsModalOpen(false);
            setContractToEdit(null);
            setContracts(getContracts());
          }} 
        />
      )}
    </div>
  );
}

function CreateContractForm({ employees, onClose, contractToEdit }: { employees: Employee[], onClose: () => void, contractToEdit: Contract | null }) {
  const [formData, setFormData] = useState({
    employeeId: contractToEdit?.employeeId || '',
    type: contractToEdit?.type || 'temporary',
    startDate: contractToEdit?.startDate || '',
    endDate: contractToEdit?.endDate || '',
    baseSalary: contractToEdit?.baseSalary.toString() || '',
    notes: contractToEdit?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.startDate || !formData.baseSalary) {
      toast.error('Preencha os campos obrigatórios (*).');
      return;
    }
    
    if (contractToEdit) {
      updateContract(contractToEdit.id, {
        employeeId: formData.employeeId,
        type: formData.type as any,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        baseSalary: Number(formData.baseSalary),
        notes: formData.notes,
      });
      toast.success('Contrato atualizado com sucesso.');
    } else {
      saveContract({
        employeeId: formData.employeeId,
        type: formData.type as any,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        baseSalary: Number(formData.baseSalary),
        notes: formData.notes,
        status: 'active'
      });
      toast.success('Contrato criado com sucesso. O salário base está agora ativo para processamento.');
    }
    
    onClose();
  };

  return (
    <Card className="bg-white p-8 rounded-3xl shadow-lg border-0 w-full">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
           <FileSignature className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">{contractToEdit ? 'Editar Contrato' : 'Criação de Contrato legal'}</h2>
          <p className="text-sm font-bold text-slate-400 mt-1">Gere o vínculo e a remuneração base do funcionário.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Funcionário *</label>
               <Select value={formData.employeeId} onValueChange={v => setFormData({...formData, employeeId: v})}>
                 <SelectTrigger className="h-14 bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-bold shadow-sm transition-all">
                   <SelectValue placeholder="Selecione o funcionário..." />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                   {employees.filter(e => e.status === 'active' || e.id === contractToEdit?.employeeId).map(emp => (
                     <SelectItem key={emp.id} value={emp.id} className="font-medium cursor-pointer focus:bg-indigo-50 focus:text-indigo-700">{emp.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tipo de Contrato *</label>
               <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                 <SelectTrigger className="h-14 bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-bold shadow-sm transition-all">
                   <SelectValue placeholder="..." />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                   <SelectItem value="temporary" className="font-medium cursor-pointer focus:bg-indigo-50 focus:text-indigo-700">Temporário (A Termo Certo)</SelectItem>
                   <SelectItem value="permanent" className="font-medium cursor-pointer focus:bg-indigo-50 focus:text-indigo-700">Efetivo (A Termo Incerto / Sem Termo)</SelectItem>
                   <SelectItem value="part-time" className="font-medium cursor-pointer focus:bg-indigo-50 focus:text-indigo-700">Part-time (Meio Tempo)</SelectItem>
                 </SelectContent>
               </Select>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Salário Base (Bruto) *</label>
               <div className="relative">
                 <DollarSign className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <Input 
                   type="number"
                   value={formData.baseSalary} onChange={e => setFormData({...formData, baseSalary: e.target.value})}
                   className="h-14 pl-12 bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-bold shadow-sm transition-all"
                   placeholder="Ex: 25000"
                 />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Data de Início *</label>
               <Input 
                 type="date"
                 value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                 className="h-14 bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-bold shadow-sm transition-all"
               />
            </div>
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Data de Fim (Opcional)</label>
               <Input 
                 type="date"
                 value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                 className="h-14 bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-bold shadow-sm transition-all"
               />
            </div>
            
            <div className="md:col-span-2 space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Observações do Vínculo</label>
               <Input 
                 value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                 className="h-14 bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl font-bold shadow-sm transition-all"
                 placeholder="Benefícios extras, regime de horários acordado..."
               />
            </div>
         </div>

         <div className="flex gap-4 pt-4 mt-8 border-t border-slate-100">
           <Button type="button" variant="outline" onClick={onClose} className="h-14 flex-1 font-bold rounded-xl border-slate-200 hover:bg-slate-50">Cancelar</Button>
           <Button type="submit" className="h-14 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 border-0">
              <CheckCircle2 className="w-5 h-5 mr-2" /> {contractToEdit ? 'Salvar Alterações' : 'Salvar Contrato'}
           </Button>
         </div>
      </form>
    </Card>
  );
}
