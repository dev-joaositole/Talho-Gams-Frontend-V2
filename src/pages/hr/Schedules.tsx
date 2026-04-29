import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/hr/ui/select';
import { CalendarDays, Clock, Plus, Trash2, Edit } from 'lucide-react';
import { getSchedules, getEmployees, Schedule, Employee, saveSchedule, updateSchedule, deleteSchedule } from '@/lib/storage';
import { toast } from 'sonner';

export default function Schedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<Schedule | null>(null);

  useEffect(() => {
    setSchedules(getSchedules());
    setEmployees(getEmployees());
  }, []);

  return (
    <div className="pt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      {!isModalOpen ? (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Escalas & Horários</h2>
              <p className="text-sm font-bold text-slate-400 mt-1">Planeamento operacional da equipa.</p>
            </div>
            <Button onClick={() => { setScheduleToEdit(null); setIsModalOpen(true); }} className="h-12 bg-orange-500 hover:bg-orange-600 font-bold px-6 rounded-xl shadow-lg shadow-orange-500/20 text-white">
              <Plus className="w-5 h-5 mr-3" />
              Adicionar Turno
            </Button>
          </div>

          <Card className="overflow-hidden p-0 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] bg-white rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-5">Data da Escala</th>
                    <th className="px-6 py-5">Funcionário</th>
                    <th className="px-6 py-5">Das (Entrada)</th>
                    <th className="px-6 py-5">Até (Saída)</th>
                    <th className="px-6 py-5">Pausa (Min)</th>
                    <th className="px-6 py-5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map(schedule => {
                    const emp = employees.find(e => e.id === schedule.employeeId);
                    return (
                      <tr key={schedule.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-black text-slate-700">
                           {schedule.date}
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-800">{emp?.name || 'Desconhecido'}</div>
                           <div className="text-xs font-medium text-slate-400 mt-0.5">{emp?.role}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600">
                           <Clock className="w-4 h-4 inline mr-1" />
                           {schedule.startTime}
                        </td>
                        <td className="px-6 py-4 font-bold text-rose-600">
                           <Clock className="w-4 h-4 inline mr-1" />
                           {schedule.endTime}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-500">
                           {schedule.breakDurationMinutes}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg font-bold border-slate-200 hover:bg-blue-50 hover:text-blue-600" title="Editar" onClick={() => { setScheduleToEdit(schedule); setIsModalOpen(true); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="h-9 px-3 rounded-lg font-bold border-rose-200 text-rose-500 hover:bg-rose-50" title="Eliminar" onClick={() => {
                                if (confirm('Tem certeza que deseja eliminar esta escala?')) {
                                  deleteSchedule(schedule.id);
                                  toast.success('Escala eliminada.');
                                  setSchedules(getSchedules());
                                }
                              }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                  {schedules.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold">
                           Nenhuma escala registada.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <CreateScheduleForm 
          employees={employees} 
          scheduleToEdit={scheduleToEdit}
          onClose={() => {
            setIsModalOpen(false);
            setScheduleToEdit(null);
            setSchedules(getSchedules());
          }} 
        />
      )}
    </div>
  );
}

function CreateScheduleForm({ employees, onClose, scheduleToEdit }: { employees: Employee[], onClose: () => void, scheduleToEdit: Schedule | null }) {
  const [formData, setFormData] = useState({
    employeeId: scheduleToEdit?.employeeId || '',
    date: scheduleToEdit?.date || '',
    startTime: scheduleToEdit?.startTime || '',
    endTime: scheduleToEdit?.endTime || '',
    breakDurationMinutes: scheduleToEdit?.breakDurationMinutes.toString() || '60'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.date || !formData.startTime || !formData.endTime) {
      toast.error('Preencha os campos obrigatórios (*).');
      return;
    }
    
    if (scheduleToEdit) {
      updateSchedule(scheduleToEdit.id, {
        employeeId: formData.employeeId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        breakDurationMinutes: Number(formData.breakDurationMinutes)
      });
      toast.success('Escala atualizada com sucesso!');
    } else {
      saveSchedule({
        employeeId: formData.employeeId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        breakDurationMinutes: Number(formData.breakDurationMinutes)
      });
      toast.success('Escala agendada com sucesso!');
    }
    
    onClose();
  };

  return (
    <Card className="bg-white p-8 rounded-3xl shadow-lg border-0 w-full">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
           <CalendarDays className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">{scheduleToEdit ? 'Editar Turno' : 'Agendar Turno'}</h2>
          <p className="text-sm font-bold text-slate-400 mt-1">Defina o dia e as horas.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Funcionário *</label>
               <Select value={formData.employeeId} onValueChange={v => setFormData({...formData, employeeId: v})}>
                 <SelectTrigger className="h-14 bg-white border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl font-bold shadow-sm transition-all">
                   <SelectValue placeholder="Selecione o funcionário..." />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                   {employees.filter(e => e.status === 'active' || e.id === scheduleToEdit?.employeeId).map(emp => (
                     <SelectItem key={emp.id} value={emp.id} className="font-medium cursor-pointer focus:bg-orange-50 focus:text-orange-600">{emp.name}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
            
            <div className="md:col-span-2 space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Data *</label>
               <Input 
                 type="date"
                 value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                 className="h-14 bg-white border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl font-bold shadow-sm transition-all"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Hora de Entrada *</label>
               <Input 
                 type="time"
                 value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})}
                 className="h-14 bg-white border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl font-bold shadow-sm transition-all"
               />
            </div>
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Hora de Saída *</label>
               <Input 
                 type="time"
                 value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})}
                 className="h-14 bg-white border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl font-bold shadow-sm transition-all"
               />
            </div>
            
            <div className="md:col-span-2 space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pausa (Minutos)</label>
               <Input 
                 type="number"
                 value={formData.breakDurationMinutes} onChange={e => setFormData({...formData, breakDurationMinutes: e.target.value})}
                 className="h-14 bg-white border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl font-bold shadow-sm transition-all"
                 placeholder="Ex: 60"
               />
            </div>
         </div>

         <div className="flex gap-4 pt-4 mt-8 border-t border-slate-100">
           <Button type="button" variant="outline" onClick={onClose} className="h-14 flex-1 font-bold rounded-xl border-slate-200 hover:bg-slate-50">Cancelar</Button>
           <Button type="submit" className="h-14 flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 border-0">
             {scheduleToEdit ? 'Salvar Alterações' : 'Salvar Turno'}
           </Button>
         </div>
      </form>
    </Card>
  );
}
