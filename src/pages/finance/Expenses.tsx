import React, { useState } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { 
  Plus, Search, Calendar, AlertCircle, CheckCircle2, Clock, 
  MoreVertical, CreditCard, RefreshCw, AlertTriangle, X, Trash2, Edit
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/pages/hr/ui/confirm-dialog';

interface Expense {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  status: 'Pendente' | 'Pago' | 'Atrasado';
  isActive: boolean; 
  tipo: 'Única' | 'Recorrente';
  data_faturacao: string;
  data_pagamento?: string;
  metodo_pagamento?: string;
  fonte_pagamento?: string; // Sede ou Filial
  estabelecimentoId: string;
  
  frequencia?: 'Diária' | 'Semanal' | 'Mensal' | 'Anual';
  intervalo?: number;
  data_inicio?: string;
  data_fim?: string;
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    descricao: 'Energia (Mão Principal)',
    valor: 5000,
    categoria: 'Energia',
    status: 'Pendente',
    isActive: true,
    tipo: 'Recorrente',
    frequencia: 'Mensal',
    data_faturacao: '2026-04-25',
    estabelecimentoId: 'all'
  },
  {
    id: '2',
    descricao: 'Fornecedor de Carnes (Bovino)',
    valor: 150000,
    categoria: 'Fornecedores',
    status: 'Atrasado',
    isActive: true,
    tipo: 'Única',
    data_faturacao: '2026-04-20',
    estabelecimentoId: 'all'
  },
  {
    id: '3',
    descricao: 'Manutenção Frigorífico',
    valor: 12000,
    categoria: 'Manutenção',
    status: 'Pago',
    isActive: true,
    tipo: 'Única',
    data_faturacao: '2026-04-10',
    data_pagamento: '2026-04-10',
    metodo_pagamento: 'Dinheiro',
    fonte_pagamento: 'pemba',
    estabelecimentoId: 'all'
  },
  {
    id: '4',
    descricao: 'Salários Equipe Pemba',
    valor: 45000,
    categoria: 'Salários',
    status: 'Pendente',
    isActive: true,
    tipo: 'Recorrente',
    frequencia: 'Mensal',
    data_faturacao: '2026-04-30',
    estabelecimentoId: 'pemba'
  }
];

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [filterStatus, setFilterStatus] = useState<'Todas' | 'Pendentes' | 'Pagas' | 'Atrasadas'>('Todas');
  const [filterFilial, setFilterFilial] = useState<'Todas' | 'all' | 'pemba'>('Todas');
  const [search, setSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<string | null>(null);

  const [categories, setCategories] = useState(['Fornecedores', 'Salários', 'Energia', 'Impostos', 'Manutenção']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [paymentSource, setPaymentSource] = useState('all');

  const pendingTotal = expenses.filter(e => e.status === 'Pendente').reduce((acc, curr) => acc + curr.valor, 0);
  const overdueTotal = expenses.filter(e => e.status === 'Atrasado').reduce((acc, curr) => acc + curr.valor, 0);
  const paidTotal = expenses.filter(e => e.status === 'Pago').reduce((acc, curr) => acc + curr.valor, 0);

  const filteredExpenses = expenses.filter(e => {
    if (filterStatus === 'Pendentes' && e.status !== 'Pendente') return false;
    if (filterStatus === 'Pagas' && e.status !== 'Pago') return false;
    if (filterStatus === 'Atrasadas' && e.status !== 'Atrasado') return false;
    if (filterFilial !== 'Todas' && e.estabelecimentoId !== filterFilial) return false;
    if (search && !e.descricao.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handlePayExpense = (id: string) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status: 'Pago',
          data_pagamento: new Date().toISOString().split('T')[0],
          metodo_pagamento: paymentMethod,
          fonte_pagamento: paymentSource
        };
      }
      return e;
    }));
    setPaymentModalOpen(null);
    toast.success(`[LOG] Pagamento efetuado via ${paymentSource === 'all' ? 'Sede Global' : 'Filial'} com sucesso.`);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    setDeleteModalOpen(null);
    toast.success("[LOG Admin] Despesa removida permanentemente do sistema.");
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {['Todas', 'Pendentes', 'Atrasadas', 'Pagas'].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilterStatus(f as any)}
                 className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                   filterStatus === f 
                     ? 'bg-white text-slate-800 shadow-sm' 
                     : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 {f}
               </button>
            ))}
          </div>
          
          <select 
            className="h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 outline-none w-full md:w-40 appearance-none"
            value={filterFilial}
            onChange={(e) => setFilterFilial(e.target.value as any)}
          >
            <option value="Todas">Toda a Rede</option>
            <option value="all">Sede (Global)</option>
            <option value="pemba">Filial Pemba</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-56">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <Input 
               placeholder="Buscar despesa..." 
               className="pl-9 h-11 bg-slate-50 border-slate-100 rounded-xl"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <Button onClick={() => setIsFormOpen(true)} className="h-11 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold shrink-0">
             <Plus className="w-4 h-4 mr-2 -ml-1" />
             Nova Despesa
           </Button>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white relative overflow-hidden">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
             </div>
             <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">A Pagar (Agendado)</h3>
                <p className="text-2xl font-black text-slate-800">{pendingTotal.toLocaleString()} <span className="text-sm text-slate-400">MT</span></p>
             </div>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-red-500 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -z-0"></div>
          <div className="flex items-center gap-3 relative z-10">
             <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
             </div>
             <div>
                <h3 className="text-xs font-bold uppercase tracking-wider opacity-90">Atrasado</h3>
                <p className="text-2xl font-black">{overdueTotal.toLocaleString()} <span className="text-sm opacity-70">MT</span></p>
             </div>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white relative overflow-hidden">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
             </div>
             <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pago (Este mês)</h3>
                <p className="text-2xl font-black text-slate-800">{paidTotal.toLocaleString()} <span className="text-sm text-slate-400">MT</span></p>
             </div>
          </div>
        </Card>
      </div>

      {/* Lista de Despesas */}
      <Card className="border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                     <th className="px-6 py-4 rounded-tl-3xl">Status</th>
                     <th className="px-6 py-4">Descrição</th>
                     <th className="px-6 py-4">Tipo</th>
                     <th className="px-6 py-4">Faturação / Vence</th>
                     <th className="px-6 py-4 text-right">Valor</th>
                     <th className="px-6 py-4 text-center rounded-tr-3xl">Ações Rápidas</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredExpenses.map(expense => (
                     <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           {expense.status === 'Pago' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3 mr-1"/> Pago</span>}
                           {expense.status === 'Pendente' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700"><Clock className="w-3 h-3 mr-1"/> Pendente</span>}
                           {expense.status === 'Atrasado' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse"><AlertCircle className="w-3 h-3 mr-1"/> Atrasado</span>}
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-800">{expense.descricao}</div>
                           <div className="text-xs text-slate-400 font-medium">{expense.categoria} • {expense.estabelecimentoId === 'all' ? 'Sede Global' : 'Filial Pemba'}</div>
                        </td>
                        <td className="px-6 py-4">
                           {expense.tipo === 'Recorrente' ? (
                             <div className="flex items-center text-indigo-600 font-bold text-[11px] bg-indigo-50 px-2 py-1 rounded-lg w-max uppercase tracking-wider">
                               <RefreshCw className="w-3 h-3 mr-1.5" /> {expense.frequencia}
                             </div>
                           ) : (
                             <div className="text-slate-500 font-bold text-[11px] bg-slate-100 px-2 py-1 rounded-lg w-max uppercase tracking-wider">
                               Única
                             </div>
                           )}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 font-medium text-slate-600">
                             <Calendar className={`w-4 h-4 ${expense.status === 'Atrasado' ? 'text-red-500' : 'text-slate-400'}`} />
                             {expense.data_faturacao}
                           </div>
                           {expense.data_pagamento && (
                             <div className="text-[10px] text-emerald-600 font-bold mt-1">Pago em: {expense.data_pagamento} ({expense.metodo_pagamento})</div>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="font-black text-slate-800 text-[15px]">{expense.valor.toLocaleString()} MT</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-2">
                              {(expense.status === 'Pendente' || expense.status === 'Atrasado') && (
                                <Button 
                                  onClick={() => setPaymentModalOpen(expense.id)}
                                  size="sm" 
                                  className="h-8 bg-emerald-500 hover:bg-emerald-600 font-bold text-white shadow-sm"
                                >
                                  <CreditCard className="w-3.5 h-3.5 mr-1" /> Pagar
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteModalOpen(expense.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredExpenses.length === 0 && (
                     <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                           Nenhuma despesa encontrada.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </Card>

      <ConfirmDialog
        open={!!deleteModalOpen}
        onOpenChange={(open) => !open && setDeleteModalOpen(null)}
        onConfirm={() => deleteModalOpen && handleDeleteExpense(deleteModalOpen)}
        title="Eliminar Despesa"
        description="Tem certeza? Esta ação removerá os registos permanentemente e gravará um LOG de exclusão por parte do Administrador. A despesa deixará de integrar o relatório base."
        confirmText="Eliminar Definitivamente"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* MODAL DE PAGAMENTO AVANÇADO */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
           <Card className="w-full max-w-sm bg-white border-0 shadow-2xl rounded-[24px] overflow-hidden flex flex-col p-0">
             <div className="p-6 pb-4 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-800">Liquidação de Despesa</h3>
                <p className="text-xs font-medium text-slate-500 mt-1">Configurar saída exata de fundos</p>
             </div>
             
             <div className="p-6 space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Fonte de Fundo (Abate)</label>
                   <select 
                     value={paymentSource}
                     onChange={e => setPaymentSource(e.target.value)}
                     className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                   >
                     <option value="all">Fundo Global (Sede)</option>
                     <option value="pemba">Caixa Local (Filial Pemba)</option>
                   </select>
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Método de Pagamento</label>
                   <select 
                     value={paymentMethod}
                     onChange={e => setPaymentMethod(e.target.value)}
                     className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                   >
                     <option value="Dinheiro">Dinheiro Físico</option>
                     <option value="Cartão">Cartão Bancário</option>
                     <option value="Transferência">Transferência / M-Pesa</option>
                   </select>
                </div>
             </div>

             <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 rounded-b-[24px]">
               <Button variant="ghost" onClick={() => setPaymentModalOpen(null)} className="flex-1 h-11 font-bold text-slate-500 bg-white rounded-xl">Cancelar</Button>
               <Button onClick={() => handlePayExpense(paymentModalOpen)} className="flex-1 h-11 font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md">
                 Confirmar Pagamento
               </Button>
             </div>
           </Card>
        </div>
      )}

      {/* MODAL / DRAWER DE NOVA DESPESA */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <Card className="w-full max-w-xl bg-white border-0 shadow-2xl rounded-[24px] overflow-hidden flex flex-col max-h-[90vh]">
             <div className="flex flex-shrink-0 items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
               <div>
                  <h2 className="text-lg font-black text-slate-800">Agendar Despesa</h2>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">O valor não será descontado do caixa até o momento do pagamento.</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setIsFormOpen(false)}>
                 <X className="w-4 h-4 text-slate-500" />
               </div>
             </div>
             
             <div className="p-6 space-y-5 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Descrição da Despesa</label>
                     <Input placeholder="Ex: Energia do Galpão..." className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Estabelecimento (Vinculação)</label>
                     <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none">
                       <option value="all">Global (Sede Corporativa)</option>
                       <option value="pemba">Filial Pemba</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Valor (MT)</label>
                     <Input type="number" placeholder="0.00" className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-lg" />
                  </div>
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Categoria</label>
                   {!isAddingCustomCategory ? (
                     <select 
                       className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                       value={selectedCategory}
                       onChange={(e) => {
                         if (e.target.value === 'novo' || e.target.value === 'outro') {
                           setIsAddingCustomCategory(true);
                           setSelectedCategory(e.target.value);
                         } else {
                           setSelectedCategory(e.target.value);
                         }
                       }}
                     >
                       <option value="" disabled>Selecione uma categoria...</option>
                       {categories.map(c => <option key={c} value={c}>{c}</option>)}
                       <option disabled>──────────</option>
                       <option value="novo">➕ Criar Nova Categoria Permanentemente</option>
                       <option value="outro">Outro (Apenas esta vez)</option>
                     </select>
                   ) : (
                     <div className="flex items-center gap-2">
                       <Input 
                         autoFocus
                         placeholder={selectedCategory === 'novo' ? "Nome da nova categoria..." : "Descreva a categoria..."}
                         value={newCategoryName}
                         onChange={e => setNewCategoryName(e.target.value)}
                         className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold flex-1" 
                       />
                       <Button 
                         onClick={() => {
                           if (newCategoryName && selectedCategory === 'novo') {
                             setCategories([...categories, newCategoryName]);
                             toast.success(`Categoria '${newCategoryName}' salva.`);
                           }
                           setSelectedCategory(newCategoryName);
                           setIsAddingCustomCategory(false);
                         }} 
                         className="h-12 px-4 rounded-xl font-bold bg-slate-800 text-white"
                       >
                         Confirma
                       </Button>
                       <Button variant="ghost" onClick={() => setIsAddingCustomCategory(false)} className="h-12 w-12 p-0 rounded-xl bg-slate-100">
                         <X className="w-4 h-4" />
                       </Button>
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Tipo de Despesa</label>
                     <select className="w-full h-12 px-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm font-bold text-indigo-700 outline-none appearance-none">
                       <option value="unica">Única (Um momento)</option>
                       <option value="recorrente">Recorrente (Repetitiva)</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Data Faturação (Vence)</label>
                     <Input type="date" className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium text-slate-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Frequência</label>
                     <select className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none">
                       <option value="Mensal">Mensal</option>
                       <option value="Semanal">Semanal</option>
                       <option value="Diária">Diária</option>
                       <option value="Anual">Anual</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Periodicidade</label>
                     <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-slate-500">A cada</span>
                       <Input type="number" defaultValue="1" className="h-11 w-16 text-center bg-slate-50 border-slate-200 rounded-xl font-bold" />
                       <span className="text-sm font-bold text-slate-500">intervalo(s)</span>
                     </div>
                   </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100/50 flex gap-3 items-start mt-2">
                   <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                   <p className="text-xs text-amber-700 font-medium leading-relaxed">
                     Ao agendar, a despesa entra para "Contas a Pagar" da filial selecionada (ou Sede). O montante não será retraído do saldo até confirmação explícita de pagamento. Admin Logs ficam ativos.
                   </p>
                </div>
             </div>

             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-[24px] flex-shrink-0">
               <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-11 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl">Cancelar</Button>
               <Button onClick={() => { setIsFormOpen(false); toast.success("[LOG Admin] Despesa reconhecida e logada com sucesso."); }} className="h-11 px-6 font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-md">
                 Gravar Previsão
               </Button>
             </div>
           </Card>
        </div>
      )}

      <div className="h-6"></div> 
    </div>
  );
}
