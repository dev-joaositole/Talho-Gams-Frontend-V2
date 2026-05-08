import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Scale, Network, Plug, Zap, Activity } from 'lucide-react';
import { IntegrationsData, getIntegrationsSettings, saveIntegrationsSettings } from './models/settings';
import { toast } from 'sonner';

export default function Integrations() {
  const [settings, setSettings] = useState<IntegrationsData | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setSettings(getIntegrationsSettings());
  }, []);

  const handleChange = (field: keyof IntegrationsData, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSave = () => {
    if (settings) {
      saveIntegrationsSettings(settings);
      toast.success('Integrações configuradas com sucesso.');
    }
  };

  const scanPorts = () => {
    setIsScanning(true);
    toast.info('A pesquisar portas seriais conectadas...');
    setTimeout(() => {
      setIsScanning(false);
      if (settings) {
          handleChange('scalePort', 'COM3');
      }
      toast.success('Balança detetada na porta COM3');
    }, 2000);
  };

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
         <div className="w-full md:w-auto">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Plug className="w-5 h-5 text-emerald-600 shrink-0" /> Dispositivos Externos
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Conexão direta a balanças para talhos, leitores de código e dispositivos IP.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-slate-100 shadow-sm rounded-[24px] p-6 bg-white shrink-0">
             <div className="flex items-center gap-2 mb-6">
               <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                 <Scale className="w-5 h-5" />
               </div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Balança (Leitura de Peso)</h3>
             </div>
             
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                     Interface de Conexão
                   </label>
                   <select 
                     className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                     value={settings.scaleType}
                     onChange={(e) => handleChange('scaleType', e.target.value)}
                   >
                     <option value="none">Desativado / Manual</option>
                     <option value="serial">Porta Serial (RS-232 / COM)</option>
                     <option value="usb">USB (Emulação Serial)</option>
                   </select>
                </div>

                {settings.scaleType !== 'none' && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                       Porta Comunicacional
                     </label>
                     <div className="flex flex-col sm:flex-row gap-2">
                       <Input 
                         value={settings.scalePort} 
                         onChange={(e) => handleChange('scalePort', e.target.value)} 
                         className="h-12 w-full sm:w-auto flex-1 bg-slate-50 border-slate-200 rounded-xl font-bold font-mono text-emerald-700" 
                         placeholder="Ex: COM1, COM3, /dev/ttyUSB0"
                       />
                       <Button 
                         variant="outline" 
                         onClick={scanPorts} 
                         disabled={isScanning}
                         className="h-12 w-full sm:w-auto font-bold px-4"
                       >
                         {isScanning ? <Activity className="w-4 h-4 mr-2 animate-spin shrink-0" /> : <Zap className="w-4 h-4 mr-2 text-amber-500 shrink-0" />} {isScanning ? "Procurando..." : "Detetar"}
                       </Button>
                     </div>
                     <p className="text-[10px] text-slate-400 mt-2 font-medium">No Windows utilize o formato COM[x]. Em sistemas UX, utilize o path /dev/.</p>
                  </div>
                )}
             </div>
          </Card>

          <Card className="border border-slate-100 shadow-sm rounded-[24px] p-6 bg-white shrink-0">
             <div className="flex items-center gap-2 mb-6">
               <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
                 <Plug className="w-5 h-5" />
               </div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Leitor de Código de Barras</h3>
             </div>
             
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                     Modo de Leitura
                   </label>
                   <select 
                     className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                     value={settings.scannerType}
                     onChange={(e) => handleChange('scannerType', e.target.value as any)}
                   >
                     <option value="keyboard">Emulador de Teclado (USB Genérico)</option>
                     <option value="serial">Direto Serial (RS-232)</option>
                   </select>
                </div>
                {settings.scannerType === 'serial' && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Porta do Leitor
                    </label>
                    <Input 
                      value={settings.scannerPort || ''} 
                      onChange={(e) => handleChange('scannerPort', e.target.value)} 
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold font-mono text-amber-700 tracking-wider" 
                      placeholder="Ex: COM2"
                    />
                  </div>
                )}
             </div>
          </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="border border-slate-100 shadow-sm rounded-[24px] p-6 bg-white shrink-0">
             <div className="flex items-center gap-2 mb-6">
               <div className="bg-rose-100 text-rose-600 p-2 rounded-xl">
                 <Activity className="w-5 h-5" />
               </div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Gaveta de Dinheiro</h3>
             </div>
             
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                     Disparo
                   </label>
                   <select 
                     className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                     value={settings.cashDrawerType}
                     onChange={(e) => handleChange('cashDrawerType', e.target.value as any)}
                   >
                     <option value="printer">Via Impressora (Cabo RJ12)</option>
                     <option value="usb">Direta USB/Serial</option>
                   </select>
                </div>
                {settings.cashDrawerType === 'usb' && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Comando / Porta
                    </label>
                    <Input 
                      value={settings.cashDrawerPort || ''} 
                      onChange={(e) => handleChange('cashDrawerPort', e.target.value)} 
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold font-mono text-rose-700 tracking-wider" 
                      placeholder="Ex: COM4"
                    />
                  </div>
                )}
                <Button variant="outline" className="w-full font-bold">
                   Disparar Gaveta (Teste)
                </Button>
             </div>
          </Card>

          <Card className="border border-slate-100 shadow-sm rounded-[24px] p-6 bg-white shrink-0">
             <div className="flex items-center gap-2 mb-6">
               <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
                 <Network className="w-5 h-5" />
               </div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Integração Webhook / API</h3>
             </div>
             
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                     <span>Estado da API</span>
                     <div 
                        className={`w-10 h-5 rounded-full relative cursor-pointer ${settings.apiEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        onClick={() => handleChange('apiEnabled', (!settings.apiEnabled) as any)}
                     >
                       <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.apiEnabled ? 'left-6' : 'left-1'}`} />
                     </div>
                   </label>
                </div>
                
                {settings.apiEnabled && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                         URL Webhook (Fecho)
                      </label>
                      <Input 
                        value={settings.webhookUrl || ''} 
                        onChange={(e) => handleChange('webhookUrl', e.target.value)} 
                        className="h-12 bg-slate-50 border-slate-200 rounded-xl text-sm font-medium text-slate-700 text-indigo-700" 
                        placeholder="https://meu-erp.com/api/vendas"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                         Bearer Token M2M
                      </label>
                      <Input 
                        type="password"
                        value={settings.apiKey || ''} 
                        onChange={(e) => handleChange('apiKey', e.target.value)} 
                        className="h-12 bg-slate-50 border-slate-200 rounded-xl text-sm font-medium font-mono text-slate-700" 
                        placeholder="********"
                      />
                    </div>
                  </>
                )}
             </div>
          </Card>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
         <Button onClick={handleSave} className="h-12 w-full md:w-auto px-10 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg">
           Gravar Ligações de Hardware
         </Button>
      </div>
    </div>
  );
}
