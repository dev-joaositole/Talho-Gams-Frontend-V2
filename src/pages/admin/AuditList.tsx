import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Search, ShieldAlert, Activity, Filter } from 'lucide-react';
import { AuditLog, getAuditLogs } from './models/admin';
import { Input } from '@/pages/hr/ui/input';

export default function AuditList() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLogs(getAuditLogs().reverse()); // newest first
  }, []);

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityBadge = (sec: string) => {
    switch (sec) {
       case 'critical': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700">Crítico</span>;
       case 'high': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700">Alto</span>;
       case 'medium': return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700">Médio</span>;
       default: return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">Baixo</span>;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <ShieldAlert className="w-5 h-5 text-red-500" /> Auditoria Crítica
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Registos de segurança imutáveis e permanentes.</p>
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <Input 
                 placeholder="Pesquisar..." 
                 className="pl-9 h-10 w-full md:w-64 bg-white border-slate-200 rounded-xl font-medium"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
      </div>

      <Card className="border-0 shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Data/Hora</th>
                <th className="px-6 py-4">Utilizador</th>
                <th className="px-6 py-4">Ação</th>
                <th className="px-6 py-4">Entidade</th>
                <th className="px-6 py-4">Severidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium">Nenhum registo de auditoria encontrado.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {new Date(l.timestamp).toLocaleString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {l.userName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{l.action}</div>
                      {l.changes && l.changes.length > 0 && (
                        <div className="text-[10px] text-slate-400 font-mono mt-1 w-48 truncate">
                           {JSON.stringify(l.changes)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">
                      {l.entityType} ({l.entityId.substring(0, 8)}...)
                    </td>
                    <td className="px-6 py-4">
                      {getSeverityBadge(l.severity)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
