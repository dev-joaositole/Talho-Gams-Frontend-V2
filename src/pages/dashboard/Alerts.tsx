import React from 'react';
import { Card } from '@/pages/hr/ui/card';
import { alertsData } from '@/models/dashboardMocks';
import { AlertCircle, AlertTriangle, Info, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardContext } from './DashboardContext';

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'critical':
      return <AlertCircle className="w-6 h-6 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-6 h-6 text-amber-500" />;
    default:
      return <Info className="w-6 h-6 text-blue-500" />;
  }
};

const getBgColor = (type: string) => {
  switch (type) {
    case 'critical':
      return 'bg-red-50/50 dark:bg-red-950/20';
    case 'warning':
      return 'bg-amber-50 dark:bg-amber-950/40/50 dark:bg-amber-950/20';
    default:
      return 'bg-blue-50 dark:bg-blue-950/40/50 dark:bg-blue-950/20';
  }
};

export default function Alerts() {
  const { searchQuery } = useDashboardContext();

  const filteredAlerts = alertsData.filter(alert => {
     if (!searchQuery) return true;
     const q = searchQuery.toLowerCase();
     return alert.title.toLowerCase().includes(q) || alert.message.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Centro de Alertas</h1>
          <p className="text-[12px] text-slate-500 mt-1">Acompanhe situações que precisam da sua atenção.</p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 && <div className="text-slate-500 dark:text-slate-400 font-bold p-6 text-center text-[12px]">Nenhum alerta encontrado.</div>}
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className={cn("p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-[16px] border border-slate-100 shadow-sm transition-colors bg-white", getBgColor(alert.type))}>
            <div className="flex-shrink-0 bg-white border border-slate-100 p-2.5 rounded-full shadow-sm">
              {getAlertIcon(alert.type)}
            </div>
            
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                <h4 className="text-[13px] font-bold text-slate-800 truncate">{alert.title}</h4>
                <VotingBadge type={alert.type} />
              </div>
              <p className="text-[12px] font-medium text-slate-600 mb-2">{alert.message}</p>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VotingBadge({ type }: { type: string }) {
  const map: Record<string, { label: string, color: string }> = {
    critical: { label: 'Crítico', color: 'text-red-700 bg-red-100' },
    warning: { label: 'Aviso', color: 'text-amber-700 bg-amber-100 dark:bg-amber-900/40' },
    info: { label: 'Info', color: 'text-blue-700 bg-blue-100' },
  };

  const badge = map[type];
  if (!badge) return null;

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider", badge.color)}>
      {badge.label}
    </span>
  );
}
