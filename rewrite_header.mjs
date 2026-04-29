import fs from 'fs';

let content = `import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Search, X, User as UserIcon, Key, Camera, CheckCircle } from 'lucide-react';
import { Button } from '@/pages/hr/ui/button';
import { getCurrentUser, updateUser } from '@/lib/storage';
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
  showSearchAndProfile?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export function PageHeader({ title, description, tabs, action, showSearchAndProfile = true }: PageHeaderProps) {
  const { t } = useSettings();
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Profile Form
  const [pName, setPName] = useState(user?.name || '');
  const [pEmail, setPEmail] = useState(user?.username || '');
  const [pAvatar, setPAvatar] = useState((user as any)?.avatarUrl || 'https://i.pravatar.cc/150?u=' + (user?.id || 'a042581f4e29026704d'));

  // Password Form
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveProfile = () => {
    if (user?.id) {
      updateUser(user.id, {
        name: pName,
        ...(isAdmin ? { username: pEmail, avatarUrl: pAvatar } : {})
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

  return (
    <div className="mb-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Georgia, serif' }}>
            {title}
          </h1>
          {description && <p className="text-slate-500 dark:text-slate-400 font-medium mt-1.5 text-sm">{description}</p>}
        </div>
        
        {showSearchAndProfile && (
          <div className="flex items-center gap-4 relative" ref={menuRef}>
            {action}
            
            <div 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-12 w-12 rounded-[12px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 ml-2 overflow-hidden cursor-pointer flex-shrink-0"
            >
               <img src={pAvatar} alt="Profile" className="w-full h-full object-cover" />
            </div>

            {isMenuOpen && (
              <div className="absolute top-14 right-0 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => { setIsMenuOpen(false); setIsEditProfileOpen(true); }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" /> {t('Editar Perfil')}
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); setIsPasswordOpen(true); }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Key className="w-4 h-4" /> {t('Alterar Senha')}
                </button>
              </div>
            )}
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
                  <Camera className="w-4 h-4" /> {t('Fotografia de Perfil')} (URL) {isAdmin ? '' : '(Apenas Admin)'}
                </label>
                <input 
                  type="text" 
                  value={pAvatar}
                  onChange={e => setPAvatar(e.target.value)}
                  disabled={!isAdmin}
                  className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              {!isAdmin && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
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
\`;

fs.writeFileSync('src/components/PageHeader.tsx', content, 'utf8');
console.log('rewritten');
