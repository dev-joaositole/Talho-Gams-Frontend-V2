import React, { useState } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/hr/ui/select';
import { Input } from '@/pages/hr/ui/input';
import { FileText, Download, Filter } from 'lucide-react';
import { getBranches } from '@/lib/storage';

export default function Reports() {
  const [reportType, setReportType] = useState<'diario' | 'semanal' | 'mensal'>('diario');
  const [mode, setMode] = useState<'global' | 'filial'>('global');
  const [branchId, setBranchId] = useState<string>('all');
  const branches = getBranches();

  return (
    <div className="pt-2">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-transparent">
        <div className="w-full md:w-auto">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Centro de Relatórios</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Geração de relatórios financeiros consolidados.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-9 w-full sm:w-auto font-medium text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"><Download className="w-4 h-4 mr-2" /> Exportar (PDF)</Button>
          <Button variant="outline" className="h-9 w-full sm:w-auto font-medium text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"><FileText className="w-4 h-4 mr-2" /> Exportar (Excel)</Button>
        </div>
      </div>

      <div className="p-6 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl bg-white dark:bg-slate-900 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">Tipo de Período</label>
            <Select value={reportType} onValueChange={(v:any) => setReportType(v)}>
              <SelectTrigger className="h-9 rounded-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-sm">
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Diário</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">Modo de Análise</label>
            <Select value={mode} onValueChange={(v:any) => setMode(v)}>
              <SelectTrigger className="h-9 rounded-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-sm">
                <SelectValue placeholder="Selecione o modo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="filial">Por Filial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {mode === 'filial' && (
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">Estabelecimento</label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="h-9 rounded-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium text-sm">
                  <SelectValue placeholder="Selecione a filial..." />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-end h-[60px] md:h-auto">
            <Button className="h-9 w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-medium rounded-md shadow-sm mt-auto"><Filter className="w-4 h-4 mr-2" /> Gerar Relatório</Button>
          </div>
        </div>
      </div>

      <div className="p-12 text-center text-slate-500 font-medium bg-slate-50 dark:bg-slate-900/50 rounded-xl mt-6 border border-slate-200 dark:border-slate-800 border-dashed">
        Selecione os filtros acima para visualizar os dados consolidados de Receitas, Despesas e Caixa.
      </div>
    </div>
  );
}