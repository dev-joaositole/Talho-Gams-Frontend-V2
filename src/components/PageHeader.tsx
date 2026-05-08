import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSettings } from '@/contexts/SettingsContext';

interface Tab {
  label: string;
  path: string;
}

interface PageHeaderProps {
  title: string;
  description?: string | React.ReactNode;
  tabs?: Tab[];
  action?: React.ReactNode;
  showSearchAndProfile?: boolean; // kept for compatibility but ignored
  onSearch?: (query: string) => void; // kept for compatibility but ignored
  searchPlaceholder?: string; // kept for compatibility but ignored
}

export function PageHeader({ title, description, tabs, action }: PageHeaderProps) {
  const { t } = useSettings();

  return (
    <div className="mb-2 relative z-10">
      <div className="flex justify-between items-start mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Georgia, serif' }}>
            {title}
          </h1>
          {description && <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-sm">{description}</p>}
        </div>
        
        {action && (
          <div className="flex items-center gap-3 relative shrink-0">
            {action}
          </div>
        )}
      </div>

      {tabs && tabs.length > 0 && (
        <div className="border-b border-transparent">
          <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                end
                className={({ isActive }) => cn(
                  "whitespace-nowrap pb-4 font-bold text-sm transition-colors",
                  isActive 
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" 
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-300 border-b-2 border-transparent"
                )}
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
