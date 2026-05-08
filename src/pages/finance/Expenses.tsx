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
    <div className="space-y-6 pt-2">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-transparent">
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto overflow-hidden">
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-sm w-full md:w-auto overflow-x-auto scrollbar-hide">
            {['Todas', 'Pendentes', 'Atrasadas', 'Pagas'].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilterStatus(f as any)}
                 className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                   filterStatus === f 
                     ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' 
                     : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                 }`}
               >
                 {f}
               </button>
            ))}
          </div>
          
          <select 
            className="h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-slate-200 shadow-sm shrink-0 w-full md:w-40 appearance-none"
            value={filterFilial}
            onChange={(e) => setFilterFilial(e.target.value as any)}
          >
            <option value="Todas">Toda a Rede</option>
            <option value="all">Sede (Global)</option>
            <option value="pemba">Filial Pemba</option>
          </select>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
           <div className="relative w-full sm:w-64">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <Input 
               placeholder="Buscar despesa..." 
               className="pl-9 h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg text-sm w-full"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <Button onClick={() => setIsFormOpen(true)} className="h-9 w-full sm:w-auto px-4 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-medium shrink-0">
             <Plus className="w-4 h-4 mr-2 -ml-1" />
             Nova Despesa
           </Button>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex flex-shrink-0 items-center justify-center border border-amber-100 dark:border-amber-800/50">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
             </div>
             <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">A Pagar (Agendado)</h3>
                <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{pendingTotal.toLocaleString()} <span className="text-sm font-normal text-slate-500">MT</span></p>
             </div>
          </div>
        </div>

        <div className="p-5 border border-red-200 dark:border-red-900/50 rounded-xl bg-red-50 dark:bg-red-950/20 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex flex-shrink-0 items-center justify-center border border-red-200 dark:border-red-800/50">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
             </div>
             <div>
                <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Atrasado</h3>
                <p className="text-2xl font-semibold tracking-tight text-red-600 dark:text-red-400">{overdueTotal.toLocaleString()} <span className="text-sm font-normal opacity-70">MT</span></p>
             </div>
          </div>
        </div>

        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex flex-shrink-0 items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
             </div>
             <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Pago (Este mês)</h3>
                <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{paidTotal.toLocaleString()} <span className="text-sm font-normal text-slate-500">MT</span></p>
             </div>
          </div>
        </div>
      </div>

      {/* Lista de Despesas */}
      <div className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-medium border-b border-slate-200 dark:border-slate-800">
                  <tr>
                     <th className="px-6 py-3 font-medium">Status</th>
                     <th className="px-6 py-3 font-medium">Descrição</th>
                     <th className="px-6 py-3 font-medium">Tipo</th>
                     <th className="px-6 py-3 font-medium">Faturação / Vence</th>
                     <th className="px-6 py-3 font-medium text-right">Valor</th>
                     <th className="px-6 py-3 font-medium text-center">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredExpenses.map(expense => (
                     <tr key={expense.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4">
                           {expense.status === 'Pago' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"><CheckCircle2 className="w-3 h-3 mr-1"/> Pago</span>}
                           {expense.status === 'Pendente' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"><Clock className="w-3 h-3 mr-1"/> Pendente</span>}
                           {expense.status === 'Atrasado' && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 animate-pulse"><AlertCircle className="w-3 h-3 mr-1"/> Atrasado</span>}
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-medium text-slate-900 dark:text-slate-100">{expense.descricao}</div>
                           <div className="text-xs text-slate-500 mt-0.5">{expense.categoria} • {expense.estabelecimentoId === 'all' ? 'Sede Global' : 'Filial Pemba'}</div>
                        </td>
                        <td className="px-6 py-4">
                           {expense.tipo === 'Recorrente' ? (
                             <div className="flex items-center text-slate-600 dark:text-slate-400 font-medium text-xs">
                               <RefreshCw className="w-3 h-3 mr-1" /> {expense.frequencia}
                             </div>
                           ) : (
                             <div className="text-slate-500 dark:text-slate-400 font-medium text-xs">
                               Única
                             </div>
                           )}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                             <Calendar className={`w-3.5 h-3.5 ${expense.status === 'Atrasado' ? 'text-red-500' : 'text-slate-400'}`} />
                             {expense.data_faturacao}
                           </div>
                           {expense.data_pagamento && (
                             <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Pago: {expense.data_pagamento} ({expense.metodo_pagamento})</div>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="font-semibold text-slate-900 dark:text-slate-100 text-[15px]">{expense.valor.toLocaleString()} MT</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {(expense.status === 'Pendente' || expense.status === 'Atrasado') && (
                                <Button 
                                  onClick={() => setPaymentModalOpen(expense.id)}
                                  size="sm" 
                                  className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm mr-1 font-medium text-xs px-3"
                                >
                                  Pagar
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-100 rounded-md">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteModalOpen(expense.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredExpenses.length === 0 && (
                     <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                           Nenhuma despesa encontrada nos filtros atuais.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <ConfirmDialog
        open={!!deleteModalOpen}
        onOpenChange={(open) => !open && setDeleteModalOpen(null)}
        onConfirm={() => deleteModalOpen && handleDeleteExpense(deleteModalOpen)}
        title="Eliminar Despesa"
        description="Tem certeza? Esta ação removerá os registos permanentemente e gravará um LOG para auditoria."
        confirmText="Eliminar Despesa"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* MODAL DE PAGAMENTO AVANÇADO */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl overflow-hidden flex flex-col p-0">
             <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Liquidar Despesa</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configurar saída exata de fundos</p>
             </div>
             
             <div className="p-5 space-y-4">
                <div>
                   <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Fonte de Fundo (Abate)</label>
                   <select 
                     value={paymentSource}
                     onChange={e => setPaymentSource(e.target.value)}
                     className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 outline-none appearance-none focus:ring-2 focus:ring-slate-200"
                   >
                     <option value="all">Fundo Global (Sede)</option>
                     <option value="pemba">Caixa Local (Filial Pemba)</option>
                   </select>
                </div>
                <div>
                   <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Método de Pagamento</label>
                   <select 
                     value={paymentMethod}
                     onChange={e => setPaymentMethod(e.target.value)}
                     className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 outline-none appearance-none focus:ring-2 focus:ring-slate-200"
                   >
                     <option value="Dinheiro">Dinheiro Físico</option>
                     <option value="Cartão">Cartão Bancário</option>
                     <option value="Transferência">Transferência / M-Pesa</option>
                   </select>
                </div>
             </div>

             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
               <Button variant="ghost" onClick={() => setPaymentModalOpen(null)} className="flex-1 h-9 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md">Cancelar</Button>
               <Button onClick={() => handlePayExpense(paymentModalOpen)} className="flex-1 h-9 font-medium bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white rounded-md shadow-sm">
                 Confirmar
               </Button>
             </div>
           </div>
        </div>
      )}

      {/* MODAL / DRAWER DE NOVA DESPESA */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
             <div className="flex flex-shrink-0 items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
               <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Agendar Despesa</h2>
               </div>
               <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onClick={() => setIsFormOpen(false)}>
                 <X className="w-4 h-4 text-slate-500" />
               </div>
             </div>
             
             <div className="p-6 space-y-5 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                     <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Descrição da Despesa</label>
                     <Input placeholder="Ex: Energia do Galpão..." className="h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-md font-medium text-sm" />
                  </div>
                  <div>
                     <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Estabelecimento</label>
                     <select className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 outline-none appearance-none">
                       <option value="all">Sede Corporativa</option>
                       <option value="pemba">Filial Pemba</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Valor (MT)</label>
                     <Input type="number" placeholder="0.00" className="h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-md font-medium text-sm" />
                  </div>
                </div>

                <div>
                   <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Categoria</label>
                   {!isAddingCustomCategory ? (
                     <select 
                       className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 outline-none appearance-none"
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
                       <option value="novo">➕ Criar Nova Categoria</option>
                     </select>
                   ) : (
                     <div className="flex items-center gap-2">
                       <Input 
                         autoFocus
                         placeholder={selectedCategory === 'novo' ? "Nome da nova categoria..." : "Descreva a categoria..."}
                         value={newCategoryName}
                         onChange={e => setNewCategoryName(e.target.value)}
                         className="h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-md text-sm flex-1" 
                       />
                       <Button 
                         onClick={() => {
                           if (newCategoryName && selectedCategory === 'novo') {
                             setCategories([...categories, newCategoryName]);
                           }
                           setSelectedCategory(newCategoryName);
                           setIsAddingCustomCategory(false);
                         }} 
                         className="h-9 px-4 rounded-md font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                       >
                         Adicionar
                       </Button>
                       <Button variant="ghost" onClick={() => setIsAddingCustomCategory(false)} className="h-9 w-9 p-0 rounded-md bg-slate-100 dark:bg-slate-800">
                         <X className="w-4 h-4" />
                       </Button>
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Tipo de Despesa</label>
                     <select className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 outline-none appearance-none">
                       <option value="unica">Única</option>
                       <option value="recorrente">Recorrente</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Data Faturação (Vence)</label>
                     <Input type="date" className="h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-md font-medium text-sm text-slate-600 dark:text-slate-300" />
                  </div>
                </div>
             </div>

             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 flex-shrink-0">
               <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-9 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md">Cancelar</Button>
               <Button onClick={() => { setIsFormOpen(false); toast.success("Despesa logada com sucesso."); }} className="h-9 px-5 font-medium bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white rounded-md shadow-sm">
                 Gravar Despesa
               </Button>
             </div>
           </div>
        </div>
      )}

      <div className="h-6"></div> 
    </div>
  );
}
