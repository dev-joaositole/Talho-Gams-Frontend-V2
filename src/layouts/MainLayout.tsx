import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  Users as UsersIcon, 
  TrendingUp, 
  ShoppingCart, 
  Shield, 
  Settings as SettingsIcon, 
  LogOut,
  Menu,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/pages/hr/ui/button';
import { getCurrentUser, getBranches, getActiveBranch, setActiveBranch, logoutUser, User, Branch } from '@/lib/storage';
import { useSettings } from '@/contexts/SettingsContext';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [branches, setAllBranches] = useState<Branch[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { t } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
       navigate('/login');
       return;
    }
    
    // Redirect operator directly to their POS screen
    if (currentUser.role === 'operator' && !location.pathname.startsWith('/caixa')) {
       navigate('/caixa');
       return;
    }
    
    setUser(currentUser);
    setCurrentBranch(getActiveBranch());
    if (currentUser.role === 'admin') {
      setAllBranches(getBranches());
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handeBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveBranch(e.target.value);
    // Reload to re-fetch mock data completely easily for visual context changes in UI
    window.location.reload();
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const h = currentTime.getHours().toString().padStart(2, '0');
  const m = currentTime.getMinutes().toString().padStart(2, '0');
  const d = currentTime.getDate().toString().padStart(2, '0');
  const mo = (currentTime.getMonth() + 1).toString().padStart(2, '0');
  const y = currentTime.getFullYear();
  const formattedDateTime = `${h}:${m} - ${d}/${mo}/${y}`;

  const sidebarItems = [
    { icon: LayoutDashboard, label: t('Dashboard'), path: '/dashboard' },
    { icon: Package, label: t('Produtos'), path: '/produtos' },
    { icon: DollarSign, label: t('Finanças'), path: '/financeiro' },
    { icon: UsersIcon, label: t('R. Humanos'), path: '/rh' },
    { icon: TrendingUp, label: t('Ciclos'), path: '/ciclo-vendas' },
    { icon: ShoppingCart, label: t('Operações'), path: '/compras-vendas' },
    ...(isAdmin ? [{ icon: Shield, label: t('Administração'), path: '/admin' }] : []),
    ...(isAdmin ? [{ icon: SettingsIcon, label: t('Configurações'), path: '/configuracoes' }] : []),
  ];

  return (
    <div className="flex h-screen w-full bg-[#f4f7f9] dark:bg-slate-950 overflow-hidden text-slate-800 dark:text-slate-100 font-sans">
      {/* Sidebar - Clean and Borderless integration */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white dark:bg-slate-900 transition-transform duration-300 md:relative md:translate-x-0 shrink-0",
        isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        {/* BRANDING SECTION */}
        <div className="flex flex-col p-[18px] shrink-0 gap-3">
          <div className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider text-center bg-slate-50 dark:bg-slate-800 py-1 rounded-md">
            {formattedDateTime}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-600 rounded-[10px] flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
              TG
            </div>
            <div className="flex flex-col min-w-0 flex-1 justify-center">
              <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide truncate" title="Talho Gams EI">Talho Gams EI</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-[2px]" title="Rua Principal, Montepuez">Rua Principal, Montepuez</p>
              <p className="text-[10px] text-slate-400 truncate" title="Cel: +258 84 123 4567 | NUIT: 123456789">Cel: +258 84 123 4567 • NUIT: 123456789</p>
            </div>
          </div>
          
          {/* Filial / Branch selector */}
          <div className="mt-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800/80 rounded-lg p-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            {isAdmin ? (
               <select 
                 className="flex-1 text-xs text-slate-700 dark:text-slate-200 font-bold bg-transparent border-0 outline-none cursor-pointer truncate"
                 value={activeBranch?.id || ''}
                 onChange={handeBranchChange}
               >
                 {branches.map(b => (
                   <option key={b.id} value={b.id}>{b.name}</option>
                 ))}
               </select>
            ) : (
               <span className="flex-1 text-xs text-slate-700 dark:text-slate-200 font-bold truncate">
                 {activeBranch?.name || 'Localização Restrita'}
               </span>
            )}
          </div>
        </div>

        {/* Separador Suave (linha sútil) e removendo o "Menu Principal" escrito */}
        <div className="w-full flex justify-center pb-2">
           <div className="w-10/12 border-t border-slate-100 dark:border-slate-800/80"></div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 scrollbar-hide">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                isActive 
                  ? "text-blue-600 font-bold bg-blue-50/70" 
                  : "text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:bg-slate-800 hover:text-slate-800 dark:text-slate-100"
              )}
            >
              <item.icon className={cn("h-5 w-5", "transition-colors")} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-50 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="h-5 w-5" />
            {t('Sair')}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 shrink-0 shadow-sm z-30">
           <div className="font-bold text-lg text-slate-800 dark:text-slate-100">Talho GAMS</div>
           <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             <Menu className="h-5 w-5" />
           </Button>
        </div>
        
        {/* Container flex para que as páginas gerenciem seus headers fixos e scrolls isolados */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Outlet />
        </div>

        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </main>
    </div>
  );
}
