import React, { useState, useEffect } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Printer, LayoutTemplate, Settings2, FileText, CheckCircle2, Ticket } from 'lucide-react';
import { PrintSettingsData, getPrintSettings, savePrintSettings } from './models/settings';
import { toast } from 'sonner';

export default function PrintSettings() {
  const [settings, setSettings] = useState<PrintSettingsData | null>(null);

  useEffect(() => {
    setSettings(getPrintSettings());
  }, []);

  const handleChange = (field: keyof PrintSettingsData, value: any) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSave = () => {
    if (settings) {
      savePrintSettings(settings);
      toast.success('Configurações de impressão guardadas.');
    }
  };

  const handleTestPrint = () => {
    toast.info('A emular impressão de teste...');
    setTimeout(() => {
      toast.success('Impressão de teste concluída com sucesso!');
    }, 1500);
  };

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
         <div className="w-full md:w-auto">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Printer className="w-5 h-5 text-indigo-600 shrink-0" /> Recibos e Faturas
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Configure o formato e impressoras padrão do sistema (POS e Backoffice).</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-slate-100 shadow-sm rounded-[24px] p-6 bg-white shrink-0">
             <div className="flex items-center gap-2 mb-6">
               <Settings2 className="w-4 h-4 text-slate-400" />
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Dispositivo Principal</h3>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                     Tipo de Impressora
                   </label>
                   <select 
                     className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                     value={settings.printerType}
                     onChange={(e) => handleChange('printerType', e.target.value)}
                   >
                     <option value="system">Gerenciador do Sistema (Padrão)</option>
                     <option value="thermal">Térmica / Pos58 Direta</option>
                     <option value="network">Impressora de Rede (IP)</option>
                   </select>
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                     Tamanho do Papel (Térmico)
                   </label>
                   <select 
                     className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none"
                     value={settings.thermalSize}
                     onChange={(e) => handleChange('thermalSize', e.target.value)}
                   >
                     <option value="58mm">Rolo 58mm (Pequeno)</option>
                     <option value="80mm">Rolo 80mm (Padrão)</option>
                   </select>
                </div>
             </div>
             
             <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
                <Button onClick={handleTestPrint} variant="outline" className="h-10 font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  <FileText className="w-4 h-4 mr-2" />
                  Página de Teste
                </Button>
             </div>
          </Card>

          <Card className="border border-slate-100 shadow-sm rounded-[24px] p-6 bg-white shrink-0">
             <div className="flex items-center gap-2 mb-6">
               <LayoutTemplate className="w-4 h-4 text-slate-400" />
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Layout do Recibo (Ticket)</h3>
             </div>
             
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                    Formato de Apresentação
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {['compact', 'standard', 'detailed'].map(layout => (
                      <Button
                        key={layout}
                        variant={settings.receiptLayout === layout ? 'default' : 'outline'}
                        onClick={() => handleChange('receiptLayout', layout)}
                        className={`flex-1 h-10 w-full sm:w-auto font-bold capitalize ${settings.receiptLayout === layout ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-slate-600'}`}
                      >
                        {layout === 'compact' ? 'Compacto' : layout === 'standard' ? 'Padrão' : 'Detalhado'}
                      </Button>
                    ))}
                  </div>
               </div>

                 <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {[
                   { key: 'showLogo', label: 'Imprimir Logo' },
                   { key: 'showNuit', label: 'Imprimir NUIT' },
                   { key: 'showAddress', label: 'Imprimir Morada' },
                 ].map(item => (
                   <label key={item.key} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                     <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${settings[item.key as keyof PrintSettingsData] ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                        {settings[item.key as keyof PrintSettingsData] && <CheckCircle2 className="w-3.5 h-3.5" />}
                     </div>
                     <span className="text-sm font-bold text-slate-700">{item.label}</span>
                     <input 
                       type="checkbox" 
                       className="hidden" 
                       checked={settings[item.key as keyof PrintSettingsData] as boolean} 
                       onChange={(e) => handleChange(item.key as keyof PrintSettingsData, e.target.checked)} 
                     />
                   </label>
                 ))}
               </div>

               <div className="mt-4 border-t border-slate-100 pt-4">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex justify-between">
                   <span>Design / Layout Adicional (HTML/Texto)</span>
                   <span className="text-indigo-500 lowercase cursor-pointer">Arraste os elementos no seu próprio editor</span>
                 </label>
                 <textarea 
                   rows={6}
                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 outline-none resize-y"
                   placeholder="Adicione texto personalizado, HTML (pode exportar do Canva, Dreamweaver, etc) ou rodapé (ex:. Obrigado pela sua visita!). Variáveis suportadas: {{data}}, {{hora}}, {{operador}}, {{impostos}}"
                   value={settings.customReceiptMessage || ''}
                   onChange={(e) => handleChange('customReceiptMessage', e.target.value)}
                 ></textarea>
               </div>
             </div>
          </Card>
        </div>

        <div className="space-y-4">
           {/* Preview Card */}
           <Card className="border border-slate-100 shadow-xl rounded-[24px] bg-white overflow-hidden p-0 w-full shrink-0 flex flex-col h-full bg-gradient-to-b from-slate-50 to-slate-200/50">
             <div className="p-4 border-b border-dashed border-slate-300 bg-white m-4 rounded-xl shadow-sm text-center relative font-mono text-sm space-y-2">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                  Pré-visualização
                </div>
                
                <div className="pt-2">
                  {settings.showLogo && <div className="text-2xl font-black text-slate-800 tracking-tighter mb-2">TALHO GAMS</div>}
                  {settings.showAddress && <p className="text-[10px] text-slate-500">Rua Principal, Montepuez</p>}
                  {settings.showNuit && <p className="text-[10px] text-slate-500">NUIT: 123456789</p>}
                </div>
                
                <div className="border-t border-dashed border-slate-300 my-2 pt-2 text-left">
                  <div className="flex justify-between font-bold text-xs"><span>Bife de Vaca</span> <span>1,200 MT</span></div>
                  {settings.receiptLayout !== 'compact' && <div className="text-[10px] text-slate-400">1.2 kg x 1000 MT</div>}
                </div>
                
                <div className="border-t border-dashed border-slate-300 my-2 pt-2 text-left flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>1,200 MT</span>
                </div>
                
                {settings.receiptLayout === 'detailed' && (
                  <div className="text-[9px] text-slate-400 mt-4 text-center">
                    Operador: João Silva<br />
                    Data: 10-05-2024 14:30
                  </div>
                )}
             </div>
             
             <div className="p-6 mt-auto">
                <Button onClick={handleSave} className="w-full h-12 font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg">
                  Guardar Configurações
                </Button>
             </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
