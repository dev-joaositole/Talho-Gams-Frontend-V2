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
      default: return <Wallet className="w-4 h-4 text-slate-600" />;
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
    toast.success("[LOG Admin] Receita manual reconhecida no sistema.");
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)]">
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            {['Todas', 'Vendas', 'Manuais'].map((f) => (
               <button
                 key={f}
                 onClick={() => setFilterOrigem(f as any)}
                 className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                   filterOrigem === f 
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
            <option value="all">Sede Central</option>
            <option value="sede">Filial Sede (Loja)</option>
            <option value="pemba">Filial Pemba</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-56">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <Input 
               placeholder="Buscar receita..." 
               className="pl-9 h-11 bg-slate-50 border-slate-100 rounded-xl"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <Button onClick={() => setIsFormOpen(true)} className="h-11 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold shrink-0">
             <Plus className="w-4 h-4 mr-2 -ml-1" />
             Receita Manual
           </Button>
        </div>
      </div>

      {/* Indicadores - Separação Físico vs Digital */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-blue-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -z-0"></div>
          <div className="flex items-center gap-3 relative z-10">
             <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
             </div>
             <div>
                <h3 className="text-xs font-bold uppercase tracking-wider opacity-90">Receita Total</h3>
                <p className="text-2xl font-black">{totalRevenue.toLocaleString()} <span className="text-sm opacity-70">MT</span></p>
             </div>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white relative overflow-hidden">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-emerald-500" />
             </div>
             <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Caixa Físico (Dinheiro)</h3>
                <p className="text-2xl font-black text-slate-800">{totalPhysical.toLocaleString()} <span className="text-sm text-slate-400">MT</span></p>
                <p className="text-xs font-bold text-emerald-600 mt-0.5">Impacta caixa central na hora</p>
             </div>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white relative overflow-hidden">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-indigo-500" />
             </div>
             <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Fluxo Digital (Banco/Cartão)</h3>
                <p className="text-2xl font-black text-slate-800">{totalDigital.toLocaleString()} <span className="text-sm text-slate-400">MT</span></p>
                <p className="text-xs font-bold text-indigo-600 mt-0.5">Dinheiro em contas bancárias</p>
             </div>
          </div>
        </Card>
      </div>

      {/* Lista de Receitas */}
      <Card className="border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                     <th className="px-6 py-4 rounded-tl-3xl">Origem</th>
                     <th className="px-6 py-4">Descrição</th>
                     <th className="px-6 py-4">Método Pagamento</th>
                     <th className="px-6 py-4">Data Automação/Entrada</th>
                     <th className="px-6 py-4 text-right">Valor</th>
                     <th className="px-6 py-4 text-center rounded-tr-3xl">Ações Rápidas</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredRevenues.map(revenue => (
                     <tr key={revenue.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           {revenue.origem === 'Venda Automática' ? (
                             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                               <ArrowDownToLine className="w-3 h-3 mr-1"/> Auto. (Sistema)
                             </span>
                           ) : (
                             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                               <Plus className="w-3 h-3 mr-1"/> Manual
                             </span>
                           )}
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-800">{revenue.descricao}</div>
                           <div className="text-xs text-slate-400 font-medium">
                             {revenue.categoria} • {
                               revenue.estabelecimentoId === 'all' ? 'Sede Geral' : 
                               revenue.estabelecimentoId === 'sede' ? 'Loja Principal' : 'Filial Pemba'
                             } 
                             {revenue.caixaRef && ` • (Caixa: ${revenue.caixaRef})`}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 font-bold text-slate-700 text-xs">
                             {getMethodIcon(revenue.metodo_pagamento)}
                             {revenue.metodo_pagamento}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 font-medium text-slate-600">
                             <Calendar className={`w-4 h-4 text-slate-400`} />
                             {revenue.data_entrada}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="font-black text-emerald-600 text-[15px]">+ {revenue.valor.toLocaleString()} MT</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-2">
                              {revenue.origem === 'Venda Automática' ? (
                                <Button 
                                  onClick={() => setDetailsModalOpen(revenue)}
                                  size="sm" 
                                  className="h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold shadow-sm rounded-lg"
                                >
                                  <Eye className="w-3.5 h-3.5 mr-1" /> Ver Vendas Diárias
                                </Button>
                              ) : (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => setDeleteModalOpen(revenue.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                           Nenhuma receita encontrada neste contexto.
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
        onConfirm={() => deleteModalOpen && handleDeleteManualRevenue(deleteModalOpen)}
        title="Estornar Receita Manual"
        description="Tem certeza que deseja estornar e excluir esta entrada inserida manualmente? O log constará o Admin que realizou o estorno. Os valores serão deduzidos do painel."
        confirmText="Estornar e Excluir"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* DRAWER DETALHES DE VENDAS DA FILIAL/DIA */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <Card className="w-full max-w-2xl bg-white border-0 shadow-2xl rounded-[24px] overflow-hidden flex flex-col p-0 max-h-[85vh]">
             <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h3 className="text-lg font-black text-slate-800">Detalhamento de Caixa ({detailsModalOpen.data_entrada})</h3>
                   <p className="text-xs font-medium text-slate-500 mt-1">Fecho reportado da <span className="font-bold text-slate-700">{detailsModalOpen.estabelecimentoId.toUpperCase()}</span> via Caixa: <span className="font-bold text-indigo-600">{detailsModalOpen.caixaRef}</span></p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200" onClick={() => setDetailsModalOpen(null)}>
                  <X className="w-4 h-4 text-slate-500" />
                </div>
             </div>
             
             <div className="p-6 bg-slate-50/50 flex-1 overflow-y-auto">
                <div className="space-y-3">
                   {/* Simulação Drill-down Vendas */}
                   {[1, 2, 3].map(v => (
                     <div key={v} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors cursor-default">
                        <div>
                           <p className="text-sm font-bold text-slate-800">Cumpom Fiscal #{2048 + v + (detailsModalOpen.caixaRef === 'Mario' ? 100 : 0)}</p>
                           <p className="text-xs font-medium text-slate-400 mt-0.5">Operador: {detailsModalOpen.caixaRef} • 14:{10 + v}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600">{detailsModalOpen.metodo_pagamento}</span>
                           <span className="font-black text-slate-700">{(detailsModalOpen.valor / 3).toFixed(2)} MT</span>
                           <Button variant="ghost" className="h-8 text-blue-600 font-bold px-3">Recibo</Button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center rounded-b-[24px]">
               <span className="text-sm text-slate-500 font-medium">Subtotal Consolidado:</span>
               <span className="text-xl font-black text-emerald-600">{detailsModalOpen.valor.toLocaleString()} MT</span>
             </div>
           </Card>
        </div>
      )}

      {/* MODAL / DRAWER DE NOVA RECEITA MANUAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <Card className="w-full max-w-xl bg-white border-0 shadow-2xl rounded-[24px] overflow-hidden flex flex-col p-0">
             <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
               <div>
                  <h2 className="text-lg font-black text-slate-800">Inserir Receita Manual</h2>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Recurso para capitais e entradas fora do fluxo de vendas.</p>
               </div>
               <div className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setIsFormOpen(false)}>
                 <X className="w-4 h-4 text-slate-500" />
               </div>
             </div>
             
             <div className="p-6 space-y-5">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Descrição / Motivo</label>
                   <Input placeholder="Ex: Aporte de Sócio, Empréstimo..." className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Filial Destino</label>
                     <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none">
                       <option value="all">Fundo Sede Geral</option>
                       <option value="sede">Caixa Sede Local</option>
                       <option value="pemba">Caixa FilIAL Pemba</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Valor (MT)</label>
                     <Input type="number" placeholder="0.00" className="h-12 bg-emerald-50/30 border-emerald-100 text-emerald-800 rounded-xl font-bold text-lg" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                         <option value="novo">➕ Criar Nova Categoria</option>
                         <option value="outro">Outro...</option>
                       </select>
                     ) : (
                       <div className="flex items-center gap-2">
                         <Input 
                           autoFocus
                           placeholder={selectedCategory === 'novo' ? "Nova categoria..." : "Descreva..."}
                           value={newCategoryName}
                           onChange={e => setNewCategoryName(e.target.value)}
                           className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold flex-1" 
                         />
                         <Button 
                           onClick={() => {
                             if (newCategoryName && selectedCategory === 'novo') {
                               setCategories([...categories, newCategoryName]);
                             }
                             setSelectedCategory(newCategoryName);
                             setIsAddingCustomCategory(false);
                           }} 
                           className="h-12 px-3 rounded-xl font-bold bg-slate-800 text-white"
                         >
                           Gravar
                         </Button>
                         <Button variant="ghost" onClick={() => setIsAddingCustomCategory(false)} className="h-12 w-10 p-0 rounded-xl bg-slate-100"><X className="w-4 h-4" /></Button>
                       </div>
                     )}
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Método</label>
                     <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none">
                       <option value="Dinheiro">Dinheiro (Caixa Físico)</option>
                       <option value="Cartão">Cartão (Banco)</option>
                       <option value="Transferência">Transferência</option>
                     </select>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100/50 flex gap-3 items-start mt-2">
                   <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                   <p className="text-xs text-blue-800 font-medium leading-relaxed">
                     Esta ação será registada com o seu perfil de Admin ("João Sitolo"). A receita entrará imediatamente para a somatória analítica da filial escolhida.
                   </p>
                </div>
             </div>

             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-[24px]">
               <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-11 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl">Cancelar</Button>
               <Button onClick={handleAddManualRevenue} className="h-11 px-6 font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-md">
                 Registrar Receita Manual
               </Button>
             </div>
           </Card>
        </div>
      )}

      <div className="h-6"></div>
    </div>
  );
}
