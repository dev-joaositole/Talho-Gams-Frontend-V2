import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Save, Building, Image as ImageIcon, MapPin, Phone, Hash, Globe, Clock, Banknote, Moon } from 'lucide-react';
import { SystemSettingsData, getSystemSettings, saveSystemSettings } from './models/settings';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettingsData | null>(null);
  const { language, setLanguage, theme, setTheme } = useSettings();

  useEffect(() => {
    setSettings(getSystemSettings());
  }, []);

  const handleChange = (field: keyof SystemSettingsData, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSave = () => {
    if (settings) {
      saveSystemSettings(settings);
      toast.success('Configurações do sistema guardadas com sucesso.');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (settings) {
          handleChange('logoDataUrl', reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
         <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Building className="w-5 h-5 text-blue-600" /> Detalhes da Empresa
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Configurações globais que afetam faturas, relatórios e a marca do sistema.</p>
         </div>
         <Button onClick={handleSave} className="h-11 px-6 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">
           <Save className="w-4 h-4 mr-2" />
           Guardar Alterações
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-slate-100 shadow-sm rounded-[24px] p-6 bg-white space-y-4">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Informação Base</h3>
             
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Building className="w-3.5 h-3.5" /> Nome da Empresa
                  </label>
                  <Input 
                    value={settings.companyName} 
                     onChange={(e) => handleChange('companyName', e.target.value)} 
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium" 
                  />
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5" /> NUIT
                    </label>
                    <Input 
                      value={settings.nuit} 
                      onChange={(e) => handleChange('nuit', e.target.value)} 
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium" 
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Contacto Oficial
                    </label>
                    <Input 
                      value={settings.contact} 
                      onChange={(e) => handleChange('contact', e.target.value)} 
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium" 
                    />
                 </div>
               </div>
               
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Endereço Completo
                  </label>
                  <Input 
                    value={settings.address} 
                    onChange={(e) => handleChange('address', e.target.value)} 
                    className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium" 
                  />
               </div>
             </div>
          </Card>
          
          <Card className="border border-slate-100 shadow-sm rounded-[24px] p-6 bg-white">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Localização & Moeda</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                     <Banknote className="w-3.5 h-3.5" /> Moeda Base
                   </label>
                   <select 
                     className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                     value={settings.currency}
                     onChange={(e) => handleChange('currency', e.target.value)}
                   >
                     <option value="MZN">Metical (MZN)</option>
                     <option value="USD">Dólar (USD)</option>
                     <option value="EUR">Euro (EUR)</option>
                   </select>
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                     <Globe className="w-3.5 h-3.5" /> Idioma / Language
                   </label>
                   <select 
                     className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                     value={language}
                     onChange={(e) => {
                       setLanguage(e.target.value as any);
                       handleChange('language', e.target.value);
                     }}
                   >
                     <option value="pt">Português (MZ)</option>
                     <option value="en">English (US)</option>
                   </select>
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                     <Moon className="w-3.5 h-3.5" /> Tema / Theme
                   </label>
                   <select 
                     className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                     value={theme}
                     onChange={(e) => {
                       setTheme(e.target.value as any);
                     }}
                   >
                     <option value="light">Light (Claro)</option>
                     <option value="dark">Dark (Escuro)</option>
                   </select>
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                     <Clock className="w-3.5 h-3.5" /> Fuso Horário
                   </label>
                   <select 
                     className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                     value={settings.timezone}
                     onChange={(e) => handleChange('timezone', e.target.value)}
                   >
                     <option value="Africa/Maputo">África/Maputo</option>
                     <option value="Europe/Lisbon">Europa/Lisboa</option>
                     <option value="UTC">UTC</option>
                   </select>
                </div>
             </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-slate-100 shadow-sm rounded-[24px] p-6 bg-white text-center">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Logotipo</h3>
             
             <div className="w-full aspect-square max-w-[200px] mx-auto bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden mb-4">
                {settings.logoDataUrl ? (
                   <img src={settings.logoDataUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                ) : (
                   <div className="text-slate-400 flex flex-col items-center">
                      <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs font-bold uppercase tracking-wider">Sem Logo</span>
                   </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="Fazer upload de novo logo"
                />
             </div>
             
             <p className="text-xs font-medium text-slate-500 mb-4">
                Clique na área acima para carregar o logotipo. Recomendamos PNG com fundo transparente.
             </p>
             
             {settings.logoDataUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleChange('logoDataUrl', '')}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 font-bold border-red-200 border"
                >
                  Remover Logo
                </Button>
             )}
          </Card>
        </div>
      </div>
    </div>
  );
}
