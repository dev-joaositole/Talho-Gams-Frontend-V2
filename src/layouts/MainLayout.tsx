import React, { useEffect, useState, useRef } from 'react';
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
  Building2,
  User as UserIconModal,
  Key,
  X,
  Camera,
  CheckCircle,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/pages/hr/ui/button';
import { getCurrentUser, getBranches, getActiveBranch, setActiveBranch, logoutUser, User, Branch, updateUser } from '@/lib/storage';
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

  // Profile Modal states
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Profile Form
  const [pName, setPName] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pAvatar, setPAvatar] = useState('');

  // Password Form
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    
    if (currentUser.role === 'operator' && !location.pathname.startsWith('/caixa')) {
       navigate('/caixa');
       return;
    }
    
    setUser(currentUser);
    setPName(currentUser.name);
    setPEmail(currentUser.username);
    setPAvatar((currentUser as any).avatarUrl || 'https://i.pravatar.cc/150?u=' + currentUser.id);

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
    window.location.reload();
  };

  const handleSaveProfile = () => {
    if (user?.id) {
      updateUser(user.id, {
        name: pName,
        ...(user.role === 'admin' ? { username: pEmail, avatarUrl: pAvatar } : {})
      });
      setIsEditProfileOpen(false);
      window.location.reload();
    }
  };

  const handleSavePassword = () => {
    setPassError('');
    setPassSuccess('');
    if (user?.password && user.password !== currPass) {
      setPassError(t('Senha atual incorreta'));
      return;
    }
    if (newPass.length < 4) {
      setPassError(t('A senha deve ter pelo menos 4 caracteres'));
      return;
    }
    if (newPass !== confPass) {
      setPassError(t('As senhas não coincidem'));
      return;
    }

    if (user?.id) {
      updateUser(user.id, { password: newPass });
      setPassSuccess(t('Senha alterada com sucesso!'));
      setTimeout(() => {
        setIsPasswordOpen(false);
        setPassSuccess('');
        setCurrPass(''); setNewPass(''); setConfPass('');
      }, 1500);
    }
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const menuItems = [
    { icon: LayoutDashboard, label: t('Dashboard'), path: '/dashboard' },
    { icon: Package, label: t('Produtos'), path: '/produtos' },
    { icon: TrendingUp, label: t('Ciclo de Vendas'), path: '/ciclo-vendas' },
    { icon: ShoppingCart, label: t('Operações'), path: '/compras-vendas' },
    { icon: DollarSign, label: t('Finanças'), path: '/financeiro' },
    { icon: UsersIcon, label: t('R. Humanos'), path: '/rh' },
  ];

  const otherItems = [
    ...(isAdmin ? [{ icon: Shield, label: t('Administração'), path: '/admin' }] : []),
    ...(isAdmin ? [{ icon: SettingsIcon, label: t('Configurações'), path: '/configuracoes' }] : []),
  ];

  return (
    <div className="flex h-screen w-full bg-[#f9fafb] dark:bg-slate-950 overflow-hidden text-slate-700 dark:text-slate-200 font-sans">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#f9fafb] dark:bg-slate-900 transition-transform duration-300 md:relative md:translate-x-0 shrink-0 border-r border-[#f3f4f6] dark:border-slate-800",
        isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        {/* BRANDING SECTION */}
        <div className="flex flex-col px-6 py-8 shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#4f46e5] rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
              TG
            </div>
            <div className="flex flex-col min-w-0 flex-1 justify-center">
              <h2 className="text-[13px] font-bold text-[#1e1b4b] dark:text-white uppercase tracking-wide truncate" title="Talho Gams EI">Talho Gams EI</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-[2px]" title="Rua Principal, Montepuez">Rua Principal, Montepuez</p>
              <p className="text-[10px] text-slate-400 truncate" title="Cel: +258 84 123 4567 | NUIT: 123456789">Cel: +258 84 123 4567 • NUIT: 123456789</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-[#f1f5f9] dark:bg-slate-800 rounded-lg p-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isAdmin ? (
               <select 
                 className="flex-1 text-[11px] text-slate-700 dark:text-slate-200 font-bold bg-transparent border-0 outline-none cursor-pointer truncate"
                 value={activeBranch?.id || ''}
                 onChange={handeBranchChange}
               >
                 {branches.map(b => (
                   <option key={b.id} value={b.id}>{b.name}</option>
                 ))}
               </select>
            ) : (
               <span className="flex-1 text-[11px] text-slate-700 dark:text-slate-200 font-bold truncate">
                 {activeBranch?.name || 'Localização Restrita'}
               </span>
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide space-y-6">
          
          <div>
             <h3 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">MENU DE NAVEGAÇÃO</h3>
             <nav className="space-y-1">
               {menuItems.map((item) => (
                 <NavLink
                   key={item.path}
                   to={item.path}
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={({ isActive }) => cn(
                     "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all group",
                     isActive 
                       ? "bg-[#e0e7ff] text-[#4f46e5]" 
                       : "text-[#6b7280] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                   )}
                 >
                   <item.icon className={cn(
                       "h-[18px] w-[18px]",
                       "transition-colors"
                   )} />
                   {item.label}
                 </NavLink>
               ))}
             </nav>
          </div>

          <div>
             <h3 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">OUTROS</h3>
             <nav className="space-y-1">
               {otherItems.map((item) => (
                 <NavLink
                   key={item.path}
                   to={item.path}
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={({ isActive }) => cn(
                     "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all group",
                     isActive 
                       ? "bg-[#e0e7ff] text-[#4f46e5]" 
                       : "text-[#6b7280] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                   )}
                 >
                   <item.icon className={cn(
                       "h-[18px] w-[18px]",
                       "transition-colors"
                   )} />
                   {item.label}
                 </NavLink>
               ))}
             </nav>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-medium text-[#6b7280] dark:text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="h-[18px] w-[18px]" />
            {t('Terminar Sessão')}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-white dark:bg-slate-950 rounded-tl-[32px] border-l border-t border-[#f3f4f6] dark:border-slate-800 md:my-2 md:mr-2 shadow-sm">
        <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-950 shrink-0 z-30">
           <div className="md:hidden font-bold text-lg text-slate-800 dark:text-slate-100">TALHO GAMS</div>
           <div className="hidden md:flex flex-1 max-w-xl bg-[#f9fafb] dark:bg-slate-900 items-center px-4 py-2.5 rounded-2xl">
              <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Pesquisar..." className="bg-transparent border-none outline-none text-[13px] text-slate-600 w-full" />
           </div>
           
           <div className="flex items-center gap-6 ml-auto">
               <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                 <div 
                   onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                   className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[12px] text-slate-600 dark:text-slate-300 font-bold shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer overflow-hidden transition-transform hover:scale-105 active:scale-95"
                 >
                    {pAvatar ? (
                       <img src={pAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                       user?.name?.charAt(0) || 'U'
                    )}
                 </div>
                 <div 
                   onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                   className="hidden md:flex flex-col cursor-pointer select-none"
                 >
                   <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200 leading-tight">{user?.name} ▾</span>
                   <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">{user?.role}</span>
                 </div>

                 {/* Profile Dropdown */}
                 {isProfileDropdownOpen && (
                   <div className="absolute top-14 right-0 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                     <button 
                       onClick={() => { setIsProfileDropdownOpen(false); setIsEditProfileOpen(true); }}
                       className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                     >
                       <UserIconModal className="w-4 h-4" /> {t('Editar Perfil')}
                     </button>
                     <button 
                       onClick={() => { setIsProfileDropdownOpen(false); setIsPasswordOpen(true); }}
                       className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                     >
                       <Key className="w-4 h-4" /> {t('Alterar Senha')}
                     </button>
                     <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                     <button 
                       onClick={handleLogout}
                       className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                     >
                       <LogOut className="w-4 h-4" /> {t('Terminar Sessão')}
                     </button>
                   </div>
                 )}
               </div>
               <button className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
               </button>
           </div>
           
           <Button variant="ghost" size="icon" className="md:hidden ml-4" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             <Menu className="h-5 w-5" />
           </Button>
        </div>
        
        {/* Container flex para que as páginas gerenciem seus headers fixos e scrolls isolados */}
        <div className="flex-1 overflow-y-auto relative bg-white px-6 md:px-8 pb-8">
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

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('Editar Perfil')}</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                 <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('Nome')}</label>
                <input 
                  type="text" 
                  value={pName}
                  onChange={e => setPName(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('Email')} {isAdmin ? '' : '(Apenas Admin)'}</label>
                <input 
                  type="email" 
                  value={pEmail}
                  onChange={e => setPEmail(e.target.value)}
                  disabled={!isAdmin}
                  className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4" /> {t('Fotografia de Perfil')} {isAdmin ? '' : '(Apenas Admin)'}
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-[12px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0">
                    <img src={pAvatar} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPAvatar(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    disabled={!isAdmin}
                    className="w-full text-sm font-medium text-slate-700 dark:text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/40 dark:file:text-blue-400 dark:hover:file:bg-blue-900/60 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              {!isAdmin && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium whitespace-pre-wrap">
                   {t('Apenas administradores podem alterar o email ou fotografia.')}
                </p>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
               <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>Cancelar</Button>
               <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveProfile}>{t('Salvar')}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isPasswordOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('Alterar Senha')}</h3>
              <button onClick={() => setIsPasswordOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                 <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {passError && <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-100 dark:border-red-800/50">{passError}</div>}
              {passSuccess && <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium rounded-xl border border-green-100 dark:border-green-800/50 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> {passSuccess}</div>}
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('Senha Atual')}</label>
                <input 
                  type="password" 
                  value={currPass}
                  onChange={e => setCurrPass(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('Nova Senha')}</label>
                <input 
                  type="password" 
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('Confirmar Nova Senha')}</label>
                <input 
                  type="password" 
                  value={confPass}
                  onChange={e => setConfPass(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
               <Button variant="outline" onClick={() => setIsPasswordOpen(false)}>Cancelar</Button>
               <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSavePassword}>{t('Salvar')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
