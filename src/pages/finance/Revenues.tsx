import React, { useState } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { 
  Plus, Search, Calendar, CheckCircle2, 
  ArrowDownToLine, Wallet, CreditCard, Building2, Smartphone, TrendingUp, X, Edit, Trash2, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/pages/hr/ui/confirm-dialog';

interface Revenue {
  id: string;
  descricao: string;
  valor: number;
  origem: 'Venda Automática' | 'Manual';
  categoria: string;
  data_entrada: string;
  metodo_pagamento: 'Dinheiro' | 'Cartão' | 'Transferência/M-Pesa';
  estabelecimentoId: string;
  vendaId?: string;
  caixaRef?: string;
}

const mockRevenues: Revenue[] = [
  {
    id: 'R1',
    descricao: 'Fecho de Venda Automático',
    valor: 4500,
    origem: 'Venda Automática',
    categoria: 'Venda de Produtos',
    data_entrada: '2026-04-23',
    metodo_pagamento: 'Dinheiro',
    estabelecimentoId: 'sede',
    caixaRef: 'João'
  },
  {
    id: 'R2',
    descricao: 'Fecho de Venda Automático',
    valor: 12500,
    origem: 'Venda Automática',
    categoria: 'Venda de Produtos',
    data_entrada: '2026-04-23',
    metodo_pagamento: 'Transferência/M-Pesa',
    estabelecimentoId: 'pemba',
    caixaRef: 'Mario'
  },
  {
    id: 'R3',
    descricao: 'Aporte de Capital (Sócio)',
    valor: 250000,
    origem: 'Manual',
    categoria: 'Investimento',
    data_entrada: '2026-04-20',
    metodo_pagamento: 'Transferência/M-Pesa',
    estabelecimentoId: 'all'
  },
  {
    id: 'R4',
    descricao: 'Fecho de Venda Automático',
    valor: 3200,
    origem: 'Venda Automática',
    categoria: 'Venda de Produtos',
    data_entrada: '2026-04-23',
    metodo_pagamento: 'Cartão',
    estabelecimentoId: 'sede',
    caixaRef: 'Maria'
  }
];

export default function Revenues() {
  const [revenues, setRevenues] = useState<Revenue[]>(mockRevenues);
  const [filterOrigem, setFilterOrigem] = useState<'Todas' | 'Vendas' | 'Manuais'>('Todas');
  const [filterFilial, setFilterFilial] = useState<'Todas' | 'all' | 'sede' | 'pemba'>('Todas');
  const [search, setSearch] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState<Revenue | null>(null);

  const [categories, setCategories] = useState(['Investimento', 'Correção de Caixa', 'Serviços', 'Reembolso']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);

  // Calcula subtotais filtrando estabelecimentos (se estiver em visualização específica)
  const baseRevenues = revenues.filter(r => filterFilial === 'Todas' || r.estabelecimentoId === filterFilial);

  const totalRevenue = baseRevenues.reduce((acc, curr) => acc + curr.valor, 0);
  const totalPhysical = baseRevenues.filter(e => e.metodo_pagamento === 'Dinheiro').reduce((acc, curr) => acc + curr.valor, 0);
  const totalDigital = baseRevenues.filter(e => e.metodo_pagamento !== 'Dinheiro').reduce((acc, curr) => acc + curr.valor, 0);

  const filteredRevenues = baseRevenues.filter(e => {
    if (filterOrigem === 'Vendas' && e.origem !== 'Venda Automática') return false;
    if (filterOrigem === 'Manuais' && e.origem !== 'Manual') return false;
    if (search && !e.descricao.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getMethodIcon = (method: string) => {
    switch(method) {
      case 'Dinheiro': return <Wallet className="w-4 h-4 text-emerald-600" />;
      case 'Cartão': return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'Transferência/M-Pesa': return <Smartphone className="w-4 h-4 text-indigo-600" />;
      default: return <Wallet className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleDeleteManualRevenue = (id: string) => {
    setRevenues(prev => prev.filter(r => r.id !== id));
    setDeleteModalOpen(null);
    toast.success("[LOG Admin] Receita manual extornada e excluída dos registos.");
  };

  const handleAddManualRevenue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormOpen(false);
    toast.success("Receita manual reconhecida no sistema.");
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-transparent">
        
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto overflow-hidden">
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-sm w-full md:w-auto overflow-x-auto scrollbar-hide">
            {['Todas', 'Vendas', 'Manuais'].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilterOrigem(f as any)}
                 className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                   filterOrigem === f 
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
            <option value="all">Sede Central</option>
            <option value="sede">Filial Sede (Loja)</option>
            <option value="pemba">Filial Pemba</option>
          </select>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
           <div className="relative w-full sm:w-64">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <Input 
               placeholder="Buscar receita..." 
               className="pl-9 h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-lg text-sm w-full"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <Button onClick={() => setIsFormOpen(true)} className="h-9 w-full sm:w-auto px-4 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-medium shrink-0">
             <Plus className="w-4 h-4 mr-2 -ml-1" />
             Receita Manual
           </Button>
        </div>
      </div>

      {/* Indicadores - Separação Físico vs Digital */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border border-blue-200 dark:border-blue-900/50 rounded-xl bg-blue-50 dark:bg-blue-950/20 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex flex-shrink-0 items-center justify-center border border-blue-200 dark:border-blue-800/50">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
             </div>
             <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Receita Total</h3>
          </div>
          <div>
            <p className="text-3xl font-semibold tracking-tight text-blue-600 dark:text-blue-400">{totalRevenue.toLocaleString()} <span className="text-sm font-normal opacity-70">MT</span></p>
          </div>
        </div>

        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex flex-shrink-0 items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
                <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
             </div>
             <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Caixa Físico (Dinheiro)</h3>
             </div>
          </div>
          <div>
             <p className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{totalPhysical.toLocaleString()} <span className="text-sm font-normal text-slate-500">MT</span></p>
             <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">Impacta caixa central na hora</p>
          </div>
        </div>

        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex flex-shrink-0 items-center justify-center border border-indigo-100 dark:border-indigo-800/50">
                <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
             </div>
             <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Fluxo Digital (Banco)</h3>
             </div>
          </div>
          <div>
             <p className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{totalDigital.toLocaleString()} <span className="text-sm font-normal text-slate-500">MT</span></p>
             <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1">Dinheiro em contas bancárias</p>
          </div>
        </div>
      </div>

      {/* Lista de Receitas */}
      <div className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-medium border-b border-slate-200 dark:border-slate-800">
                  <tr>
                     <th className="px-6 py-3 font-medium">Origem</th>
                     <th className="px-6 py-3 font-medium">Descrição</th>
                     <th className="px-6 py-3 font-medium">Método Pagamento</th>
                     <th className="px-6 py-3 font-medium">Data / Entrada</th>
                     <th className="px-6 py-3 font-medium text-right">Valor</th>
                     <th className="px-6 py-3 font-medium text-center">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRevenues.map(revenue => (
                     <tr key={revenue.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4">
                           {revenue.origem === 'Venda Automática' ? (
                             <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                               <ArrowDownToLine className="w-3 h-3 mr-1"/> Auto. (Sistema)
                             </span>
                           ) : (
                             <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                               <Plus className="w-3 h-3 mr-1"/> Manual
                             </span>
                           )}
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-medium text-slate-900 dark:text-slate-100">{revenue.descricao}</div>
                           <div className="text-xs text-slate-500 mt-0.5">
                             {revenue.categoria} • {
                               revenue.estabelecimentoId === 'all' ? 'Sede Geral' : 
                               revenue.estabelecimentoId === 'sede' ? 'Loja Principal' : 'Filial Pemba'
                             } 
                             {revenue.caixaRef && ` • (Caixa: ${revenue.caixaRef})`}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 text-xs">
                             <div className="p-1 rounded bg-slate-100 dark:bg-slate-800">{getMethodIcon(revenue.metodo_pagamento)}</div>
                             {revenue.metodo_pagamento}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                             <Calendar className={`w-3.5 h-3.5 text-slate-400`} />
                             {revenue.data_entrada}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[15px]">+ {revenue.valor.toLocaleString()} MT</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {revenue.origem === 'Venda Automática' ? (
                                <Button 
                                  onClick={() => setDetailsModalOpen(revenue)}
                                  size="sm" 
                                  className="h-8 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 shadow-sm rounded-md font-medium text-xs px-3"
                                >
                                  <Eye className="w-3.5 h-3.5 mr-1.5" /> Detalhes
                                </Button>
                              ) : (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-100 rounded-md">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => setDeleteModalOpen(revenue.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredRevenues.length === 0 && (
                     <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                           Nenhuma receita encontrada neste contexto.
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
        onConfirm={() => deleteModalOpen && handleDeleteManualRevenue(deleteModalOpen)}
        title="Estornar Receita Manual"
        description="Tem certeza que deseja estornar e excluir esta entrada inserida manualmente? O log constará o Admin que realizou o estorno."
        confirmText="Estornar Entrada"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* DRAWER DETALHES DE VENDAS DA FILIAL/DIA */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl overflow-hidden flex flex-col p-0 max-h-[85vh]">
             <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                   <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Detalhamento de Caixa ({detailsModalOpen.data_entrada})</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Fecho reportado de <span className="font-semibold">{detailsModalOpen.estabelecimentoId.toUpperCase()}</span> (Caixa <span className="font-semibold text-slate-700 dark:text-slate-300">{detailsModalOpen.caixaRef}</span>)</p>
                </div>
                <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onClick={() => setDetailsModalOpen(null)}>
                  <X className="w-4 h-4 text-slate-500" />
                </div>
             </div>
             
             <div className="p-5 bg-slate-50/50 dark:bg-slate-900/50 flex-1 overflow-y-auto">
                <div className="space-y-3">
                   {/* Simulação Drill-down Vendas */}
                   {[1, 2, 3].map(v => (
                     <div key={v} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-default">
                        <div>
                           <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Cupom Fiscal #{2048 + v + (detailsModalOpen.caixaRef === 'Mario' ? 100 : 0)}</p>
                           <p className="text-xs text-slate-500 mt-0.5">Operador: {detailsModalOpen.caixaRef} • 14:{10 + v}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded uppercase tracking-wider text-slate-600 dark:text-slate-400">{detailsModalOpen.metodo_pagamento}</span>
                           <span className="font-semibold text-slate-900 dark:text-slate-100">{(detailsModalOpen.valor / 3).toFixed(2)} MT</span>
                           <Button variant="ghost" className="h-8 text-slate-700 dark:text-slate-300 font-medium px-3 text-xs">Acessar</Button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
               <span className="text-sm text-slate-500 font-medium">Subtotal Consolidado:</span>
               <span className="text-xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">{detailsModalOpen.valor.toLocaleString()} MT</span>
             </div>
           </div>
        </div>
      )}

      {/* MODAL / DRAWER DE NOVA RECEITA MANUAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl overflow-hidden flex flex-col p-0">
             <div className="flex flex-shrink-0 items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
               <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Inserir Receita Manual</h2>
               </div>
               <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onClick={() => setIsFormOpen(false)}>
                 <X className="w-4 h-4 text-slate-500" />
               </div>
             </div>
             
             <div className="p-6 space-y-5">
                <div>
                   <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Descrição / Motivo</label>
                   <Input placeholder="Ex: Aporte de Sócio, Empréstimo..." className="h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-md font-medium text-sm" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Destino (Conta de Fundo)</label>
                     <select className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 outline-none appearance-none">
                       <option value="all">Sede Geral</option>
                       <option value="sede">Caixa Loja Principal</option>
                       <option value="pemba">Caixa Filial Pemba</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Valor (MT)</label>
                     <Input type="number" placeholder="0.00" className="h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-md font-medium text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                           placeholder={selectedCategory === 'novo' ? "Nova..." : "Descreva..."}
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
                         <Button variant="ghost" onClick={() => setIsAddingCustomCategory(false)} className="h-9 w-9 p-0 rounded-md bg-slate-100 dark:bg-slate-800"><X className="w-4 h-4" /></Button>
                       </div>
                     )}
                  </div>
                  <div>
                     <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">Método</label>
                     <select className="w-full h-9 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 outline-none appearance-none">
                       <option value="Dinheiro">Dinheiro Físico</option>
                       <option value="Cartão">Cartão/Banco</option>
                       <option value="Transferência">Transferência</option>
                     </select>
                  </div>
                </div>
             </div>

             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 flex-shrink-0">
               <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-9 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-md">Cancelar</Button>
               <Button onClick={handleAddManualRevenue} className="h-9 px-5 font-medium bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white rounded-md shadow-sm">
                 Registrar Receita
               </Button>
             </div>
           </div>
        </div>
      )}

      <div className="h-6"></div>
    </div>
  );
}
