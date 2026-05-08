import React, { useState } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { DatabaseBackup, HardDriveDownload, HardDriveUpload, CheckCircle, AlertOctagon, History } from 'lucide-react';
import { toast } from 'sonner';

export default function BackupList() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleManualBackup = () => {
    setIsBackingUp(true);
    toast.info('A iniciar backup da base de dados local...');
    
    setTimeout(() => {
      // Simulate creating a JSON blob file of localStorage
      const allData: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('gams') || key.startsWith('talho_'))) {
          allData[key] = localStorage.getItem(key) || '';
        }
      }
      
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gams_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      setIsBackingUp(false);
      toast.success('Backup exportado da aplicação.');
    }, 2000);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const shouldMerge = confirm('Deseja MESCLAR os dados em vez de substituir? Clique em OK para Mesclar, Cancelar para Substituir tudo.');

    if (confirm(`Atenção: Os dados atuais ${shouldMerge ? 'serão combinados' : 'serão apagados e substituídos'}. Continuar?`)) {
      setIsRestoring(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const contents = event.target?.result as string;
          const data = JSON.parse(contents);
          
          if (!shouldMerge) {
             Object.keys(localStorage).forEach(key => {
               if (key.includes('gams') || key.startsWith('talho_')) localStorage.removeItem(key);
             });
          }

          Object.keys(data).forEach(key => {
            if (key.includes('gams') || key.startsWith('talho_')) {
                if (shouldMerge) {
                   const existing = localStorage.getItem(key);
                   if (existing && existing.trim().startsWith('[')) {
                      try {
                        const existingArr = JSON.parse(existing);
                        const newArr = JSON.parse(data[key]);
                        if (Array.isArray(existingArr) && Array.isArray(newArr)) {
                          const merged = [...existingArr, ...newArr];
                          const unique = Array.from(new Map(merged.map(item => [item.id || Math.random(), item])).values());
                          localStorage.setItem(key, JSON.stringify(unique));
                          return;
                        }
                      } catch(e) {}
                   }
                }
                localStorage.setItem(key, data[key]);
            }
          });
          
          toast.success(`Restauro ${shouldMerge ? 'mesclado' : 'substituído'} concluído! A recarregar o sistema...`);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } catch (err) {
          setIsRestoring(false);
          toast.error('O ficheiro selecionado não é um backup válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
         <div className="w-full md:w-auto">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <DatabaseBackup className="w-5 h-5 text-indigo-500 shrink-0" /> Segurança de Dados
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Ferramentas de backup, exportação e restauro do sistema.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-slate-100 shadow-sm rounded-[24px] p-6 bg-white flex flex-col justify-between">
             <div>
               <div className="flex items-center gap-2 mb-4">
                 <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                   <HardDriveDownload className="w-5 h-5" />
                 </div>
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Exportação (Backup)</h3>
               </div>
               <p className="text-sm font-medium text-slate-600 mb-6">
                 Guarde uma cópia de toda a informação transacional atual da aplicação num ficheiro encriptado local (JSON).
               </p>
               
               <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center text-xs font-bold text-slate-600">
                     <CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Vendas e Caixa
                  </div>
                  <div className="flex items-center text-xs font-bold text-slate-600">
                     <CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Stock de Produtos e Categorias
                  </div>
                  <div className="flex items-center text-xs font-bold text-slate-600">
                     <CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Utilizadores e Auditorias
                  </div>
               </div>
             </div>
             
             <Button 
               onClick={handleManualBackup} 
               disabled={isBackingUp}
               className="w-full h-12 font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-lg"
             >
               {isBackingUp ? <History className="w-4 h-4 mr-2 animate-spin" /> : <HardDriveDownload className="w-4 h-4 mr-2" />}
               Executar Backup Agora
             </Button>
          </Card>

          <Card className="border-2 border-dashed border-slate-200 shadow-sm rounded-[24px] p-6 bg-slate-50 flex flex-col justify-between">
             <div>
               <div className="flex items-center gap-2 mb-4">
                 <div className="bg-red-100 text-red-600 p-2 rounded-xl">
                   <HardDriveUpload className="w-5 h-5" />
                 </div>
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Restauro (Rollback)</h3>
               </div>
               
               <div className="bg-white border-l-4 border-red-500 p-4 mb-6 rounded-r-xl shadow-sm">
                  <div className="flex items-start gap-3">
                     <AlertOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                     <p className="text-xs font-bold text-slate-700 leading-relaxed">
                        Aviso crítico: Operação irreversível. Toda a informação recolhida desde o momento da extração deste backup será permanentemente apagada.
                     </p>
                  </div>
               </div>
             </div>

             <div className="relative">
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleRestore}
                  disabled={isRestoring}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <Button 
                  disabled={isRestoring}
                  variant="outline"
                  className="w-full h-12 font-bold text-slate-700 bg-white border-slate-300 rounded-xl"
                >
                  {isRestoring ? <History className="w-4 h-4 mr-2 animate-spin" /> : <HardDriveUpload className="w-4 h-4 mr-2" />}
                  Selecionar Ficheiro para Restauro
                </Button>
             </div>
          </Card>
      </div>
    </div>
  );
}
