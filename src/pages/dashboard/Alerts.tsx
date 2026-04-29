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
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-slate-700 dark:text-slate-200 flex items-center justify-center">
          <BellRing className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Centro de Alertas</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Acompanhe situações que precisam da sua atenção.</p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 && <div className="text-slate-500 dark:text-slate-400 font-bold p-6 text-center">Nenhum alerta encontrado.</div>}
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className={cn("p-6 flex items-start sm:items-center gap-5 transition-colors", getBgColor(alert.type))}>
            <div className="flex-shrink-0 mt-1 sm:mt-0 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm">
              {getAlertIcon(alert.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                <h4 className="text-[16px] font-bold text-slate-800 dark:text-slate-100 truncate">{alert.title}</h4>
                <VotingBadge type={alert.type} />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{alert.message}</p>
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">{alert.time}</span>
            </div>
          </Card>
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
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold", badge.color)}>
      {badge.label}
    </span>
  );
}
