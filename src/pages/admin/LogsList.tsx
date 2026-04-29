import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Input } from '@/pages/hr/ui/input';
import { Search, ListChecks } from 'lucide-react';
import { SystemLog, getSystemLogs } from './models/admin';

export default function LogsList() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLogs(getSystemLogs().reverse()); // newest first
  }, []);

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
         <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <ListChecks className="w-5 h-5 text-blue-500" /> Logs do Sistema
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Registo de atividades de rotina.</p>
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <Input 
                 placeholder="Pesquisar por erro, ação..." 
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
                <th className="px-6 py-4">Módulo</th>
                <th className="px-6 py-4">Ação</th>
                <th className="px-6 py-4">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <p className="font-medium">Nenhum log registado.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-500 w-48">
                      {new Date(l.timestamp).toLocaleString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {l.userName}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-500">
                      {l.module}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {l.action}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-sm truncate">
                      {l.details || '-'}
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
