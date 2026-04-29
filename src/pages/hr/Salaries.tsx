import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/hr/ui/select';
import { Wallet, Plus, CheckCircle2, Trash2, Edit } from 'lucide-react';
import { getSalaryPayments, getContracts, getEmployees, SalaryPayment, Employee, Contract, saveSalaryPayment, updateSalaryPayment, deleteSalaryPayment } from '@/lib/storage';
import { toast } from 'sonner';

export default function Salaries() {
  const [salaries, setSalaries] = useState<SalaryPayment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salaryToEdit, setSalaryToEdit] = useState<SalaryPayment | null>(null);

  useEffect(() => {
    setSalaries(getSalaryPayments());
    setEmployees(getEmployees());
    setContracts(getContracts());
  }, []);

  const handlePay = (id: string) => {
    updateSalaryPayment(id, { status: 'paid', paymentDate: new Date().toISOString() });
    toast.success('Salário marcado como pago!');
    setSalaries(getSalaryPayments());
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja eliminar este pagamento/processamento?')) {
      deleteSalaryPayment(id);
      toast.success('Pagamento eliminado.');
      setSalaries(getSalaryPayments());
    }
  };

  return (
    <div className="pt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      {!isModalOpen ? (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Processamento de Salários</h2>
              <p className="text-sm font-bold text-slate-400 mt-1">Cálculo de vencimentos, bónus e descontos.</p>
            </div>
            <Button onClick={() => { setSalaryToEdit(null); setIsModalOpen(true); }} className="h-12 bg-emerald-600 hover:bg-emerald-700 font-bold px-6 rounded-xl shadow-lg shadow-emerald-600/20 text-white">
              <Plus className="w-5 h-5 mr-3" />
              Processar Pagamento
            </Button>
          </div>

          <Card className="overflow-hidden p-0 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] bg-white rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-5">Período</th>
                    <th className="px-6 py-5">Funcionário</th>
                    <th className="px-6 py-5 text-right">Base / Bónus / Desc.</th>
                    <th className="px-6 py-5 text-right">T. Final</th>
                    <th className="px-6 py-5 text-center">Status</th>
                    <th className="px-6 py-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salaries.map(salary => {
                    const emp = employees.find(e => e.id === salary.employeeId);
                    return (
                      <tr key={salary.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-black text-slate-700 uppercase tracking-widest text-[13px]">
                           {salary.period}
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-800">{emp?.name || 'Desconhecido'}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="text-xs font-bold text-slate-500">
                             Base: {salary.baseSalary.toLocaleString()}
                           </div>
                           <div className="text-xs font-bold text-emerald-500">
                             + {salary.bonus} (B) / + {salary.commission} (C)
                           </div>
                           <div className="text-xs font-bold text-rose-500">
                             - {salary.deductions}
                           </div>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-800 text-right text-[15px]">
                           {salary.totalAmount.toLocaleString()} <span className="text-[10px] text-slate-400 uppercase">MT</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${salary.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                             {salary.status === 'paid' ? 'Pago' : 'Pendente'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             {salary.status === 'pending' && (
                               <Button onClick={() => handlePay(salary.id)} size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold rounded-lg h-9 shadow-none">
                                 Pagar
                               </Button>
                             )}
                             {salary.status === 'paid' && (
                               <div className="text-xs font-bold text-slate-400 mr-2">
                                 {salary.paymentDate ? new Date(salary.paymentDate).toLocaleDateString() : 'N/A'}
                               </div>
                             )}
                             <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg font-bold border-slate-200 hover:bg-blue-50 hover:text-blue-600" title="Editar" onClick={() => { setSalaryToEdit(salary); setIsModalOpen(true); }}>
                                <Edit className="w-4 h-4" />
                             </Button>
                             <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg font-bold border-rose-200 text-rose-500 hover:bg-rose-50" title="Eliminar" onClick={() => handleDelete(salary.id)}>
                                <Trash2 className="w-4 h-4" />
                             </Button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                  {salaries.length === 0 && (
                     <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">
                           Nenhum salário processado.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <ProcessSalaryForm 
          employees={employees}
          contracts={contracts} 
          salaryToEdit={salaryToEdit}
          onClose={() => {
            setIsModalOpen(false);
            setSalaryToEdit(null);
            setSalaries(getSalaryPayments());
          }} 
        />
      )}
    </div>
  );
}

function ProcessSalaryForm({ employees, contracts, onClose, salaryToEdit }: { employees: Employee[], contracts: Contract[], onClose: () => void, salaryToEdit: SalaryPayment | null }) {
  const [formData, setFormData] = useState({
    employeeId: salaryToEdit?.employeeId || '',
    period: salaryToEdit?.period || '04-2026', // Mock dynamic date
    baseSalary: salaryToEdit?.baseSalary || 0,
    commission: salaryToEdit?.commission.toString() || '',
    bonus: salaryToEdit?.bonus.toString() || '',
    deductions: salaryToEdit?.deductions.toString() || ''
  });

  const handleEmployeeChange = (id: string) => {
    const activeContract = contracts.find(c => c.employeeId === id && c.status === 'active');
    setFormData({
       ...formData,
       employeeId: id,
       baseSalary: activeContract ? activeContract.baseSalary : 0,
       commission: '0',
       bonus: '0',
       deductions: '0'
    });
  };

  const calculateTotal = () => {
    return formData.baseSalary + Number(formData.commission || 0) + Number(formData.bonus || 0) - Number(formData.deductions || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      toast.error('Selecione um funcionário.');
      return;
    }
    if (formData.baseSalary === 0) {
      toast.error('O funcionário precisa ter um contrato ativo com salário base.');
      return;
    }
    
    if (salaryToEdit) {
      updateSalaryPayment(salaryToEdit.id, {
        employeeId: formData.employeeId,
        period: formData.period,
        baseSalary: formData.baseSalary,
        commission: Number(formData.commission || 0),
        bonus: Number(formData.bonus || 0),
        deductions: Number(formData.deductions || 0),
        totalAmount: calculateTotal(),
      });
      toast.success('Salário atualizado com sucesso!');
    } else {
      saveSalaryPayment({
        employeeId: formData.employeeId,
        period: formData.period,
        baseSalary: formData.baseSalary,
        commission: Number(formData.commission || 0),
        bonus: Number(formData.bonus || 0),
        deductions: Number(formData.deductions || 0),
        totalAmount: calculateTotal(),
        status: 'pending'
      });
      toast.success('Salário processado na folha!');
    }
    
    onClose();
  };

  return (
    <Card className="bg-white p-8 rounded-3xl shadow-lg border-0 w-full">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
           <Wallet className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">{salaryToEdit ? 'Editar Salário' : 'Processar Novo Salário'}</h2>
          <p className="text-sm font-bold text-slate-400 mt-1">O salário base é importado automaticamente do contrato vigente.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Funcionário *</label>
               <Select value={formData.employeeId} onValueChange={handleEmployeeChange}>
                 <SelectTrigger className="h-14 bg-white border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl font-bold shadow-sm transition-all">
                   <SelectValue placeholder="Selecione..." />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                   {employees.filter(e => e.status === 'active').map(emp => (
                     <SelectItem key={emp.id} value={emp.id} className="font-medium cursor-pointer focus:bg-emerald-50 focus:text-emerald-700">{emp.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Período (Ex: 04-2026) *</label>
               <Input 
                 value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})}
                 className="h-14 bg-white border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl font-bold shadow-sm transition-all"
               />
            </div>
            
            <div className="md:col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600">Salário Base (do contrato):</span>
                  <span className="text-xl font-black text-slate-800">{formData.baseSalary.toLocaleString()} MT</span>
               </div>
               {!formData.baseSalary && formData.employeeId && (
                  <p className="text-xs font-bold text-rose-500 mt-2">Aviso: Funcionário sem contrato ativo.</p>
               )}
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Comissão (Extra)</label>
               <Input 
                 type="number"
                 value={formData.commission} onChange={e => setFormData({...formData, commission: e.target.value})}
                 className="h-14 bg-white border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl font-bold text-emerald-600 shadow-sm transition-all"
               />
            </div>
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Bónus</label>
               <Input 
                 type="number"
                 value={formData.bonus} onChange={e => setFormData({...formData, bonus: e.target.value})}
                 className="h-14 bg-white border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-xl font-bold text-emerald-600 shadow-sm transition-all"
               />
            </div>
            
            <div className="md:col-span-2 space-y-2">
               <label className="text-xs font-bold text-rose-500 uppercase tracking-wider ml-1">Descontos / Faltas</label>
               <Input 
                 type="number"
                 value={formData.deductions} onChange={e => setFormData({...formData, deductions: e.target.value})}
                 className="h-14 bg-white border-rose-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 rounded-xl font-bold text-rose-600 shadow-sm transition-all"
               />
            </div>
            
            <div className="md:col-span-2 p-6 bg-slate-800 text-white rounded-2xl flex items-center justify-between shadow-lg">
                <span className="text-sm font-bold uppercase tracking-wider opacity-80">Total a Pagar</span>
                <span className="text-3xl font-black">{calculateTotal().toLocaleString()} MT</span>
             </div>
         </div>

         <div className="flex gap-4 pt-4 mt-8">
           <Button type="button" variant="outline" onClick={onClose} className="h-14 flex-1 font-bold rounded-xl border-slate-200 hover:bg-slate-50">Cancelar</Button>
           <Button type="submit" className="h-14 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 border-0">
             <CheckCircle2 className="w-5 h-5 mr-2" /> Salvar Lançamento
           </Button>
         </div>
      </form>
    </Card>
  );
}
