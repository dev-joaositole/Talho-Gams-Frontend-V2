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
    <div className="pt-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-black text-slate-800">Centro de Relatórios</h2>
          <p className="text-sm font-bold text-slate-400 mt-1">Geração de relatórios financeiros consolidados.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-12 font-bold"><Download className="w-4 h-4 mr-2" /> Exportar (PDF)</Button>
          <Button variant="outline" className="h-12 font-bold"><FileText className="w-4 h-4 mr-2" /> Exportar (Excel)</Button>
        </div>
      </div>

      <Card className="p-6 border-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] rounded-3xl bg-white mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Tipo de Período</label>
            <Select value={reportType} onValueChange={(v:any) => setReportType(v)}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200">
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Modo de Análise</label>
            <Select value={mode} onValueChange={(v:any) => setMode(v)}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200">
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
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Estabelecimento</label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200">
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
          <div className="flex items-end">
            <Button className="h-12 w-full bg-blue-600 hover:bg-blue-700 font-bold rounded-xl"><Filter className="w-4 h-4 mr-2" /> Gerar Relatório</Button>
          </div>
        </div>
      </Card>

      <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-3xl mt-6 border border-slate-100 shadow-sm">
        Selecione os filtros acima para visualizar os dados consolidado de Receitas, Despesas e Caixa.
      </div>
    </div>
  );
}