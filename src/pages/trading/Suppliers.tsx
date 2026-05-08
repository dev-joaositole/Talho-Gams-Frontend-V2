import React, { useState, useEffect, useContext } from 'react';
import { Plus, Building2, Search, Edit, Trash2, Mail, Phone, MapPin, Star, X } from 'lucide-react';
import { TradingContext } from '../Trading';
import { Supplier, getSuppliers, saveSupplier } from './models/trading';
import { toast } from 'sonner';

export default function Suppliers() {
  const { searchQuery } = useContext(TradingContext);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    setSuppliers(getSuppliers());
  }, []);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contact.includes(searchQuery)
  );

  const handleSave = () => {
    if (!name || !contact) {
      toast.error('Nome e contacto obrigatórios.');
      return;
    }
    saveSupplier({
      name, contact, email, address, rating, totalPurchases: 0
    });
    toast.success('Fornecedor adicionado.');
    setIsFormOpen(false);
    setName('');
    setContact('');
    setEmail('');
    setAddress('');
    setRating(5);
    setSuppliers(getSuppliers());
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-140px)]">
      {/* HEADER ACTIONS / METRICS */}
      <div className="flex justify-between items-end shrink-0">
         <div className="flex gap-4">
            <div className="border border-[#E5E7EB] rounded-[6px] px-4 py-2 bg-white flex flex-col justify-center min-w-[140px]">
               <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide">Fornecedores</span>
               <span className="text-[18px] font-bold text-[#111827]">{filteredSuppliers.length}</span>
            </div>
         </div>
         <button 
           onClick={() => setIsFormOpen(true)}
           className="h-10 px-4 bg-[#111827] hover:bg-[#1F2937] text-white text-[12px] font-medium rounded-[6px] shadow-sm transition-colors flex items-center gap-2"
         >
           <Building2 className="w-3.5 h-3.5" /> Adicionar / Registar
         </button>
      </div>

      {/* TABLE */}
      <div className="flex-1 flex flex-col bg-white border border-[#E5E7EB] rounded-[8px] overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {filteredSuppliers.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF]">
               <Search className="w-6 h-6 mb-2 opacity-50" />
               <span className="text-[12px] font-medium">Nenhum registo</span>
             </div>
          ) : (
             <table className="w-full text-left border-collapse">
               <thead className="bg-[#F9FAFB] text-[#6B7280] text-[11px] uppercase sticky top-0 border-b border-[#E5E7EB] shadow-[0_1px_0_rgba(0,0,0,0.05)]">
                 <tr>
                   <th className="px-4 py-2 font-semibold">Parceiro</th>
                   <th className="px-4 py-2 font-semibold">Contacto</th>
                   <th className="px-4 py-2 font-semibold hidden md:table-cell">Email</th>
                   <th className="px-4 py-2 font-semibold text-center">Classificação</th>
                   <th className="px-4 py-2 font-semibold text-right">Compras T.</th>
                   <th className="px-4 py-2 font-semibold text-center w-10"></th>
                 </tr>
               </thead>
               <tbody className="text-[12px] text-[#374151] divide-y divide-[#F3F4F6]">
                 {filteredSuppliers.map(sup => (
                   <tr key={sup.id} className="hover:bg-[#F9FAFB] transition-colors group">
                     <td className="px-4 py-3 font-medium text-[#111827]">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 bg-[#F3F4F6] text-[#4B5563] rounded-[4px] flex items-center justify-center border border-[#E5E7EB]">
                              <Building2 className="w-3.5 h-3.5" />
                           </div>
                           {sup.name}
                        </div>
                     </td>
                     <td className="px-4 py-3 text-[#6B7280]">{sup.contact}</td>
                     <td className="px-4 py-3 hidden md:table-cell text-[#6B7280]">{sup.email || '-'}</td>
                     <td className="px-4 py-3 text-center">
                        <div className="flex justify-center text-[#F59E0B]">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`w-3.5 h-3.5 ${i < sup.rating ? 'fill-current' : 'text-[#E5E7EB] fill-[#E5E7EB]'}`} />
                           ))}
                        </div>
                     </td>
                     <td className="px-4 py-3 font-semibold text-right">
                        {sup.totalPurchases} Reg.
                     </td>
                     <td className="px-4 py-3 text-center text-[#9CA3AF]">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="hover:text-[#3B82F6] transition-colors"><Edit className="w-4 h-4" /></button>
                           <button className="hover:text-[#EF4444] transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="w-full max-w-sm bg-white rounded-[8px] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
              <div className="h-12 border-b border-[#E5E7EB] flex items-center justify-between px-5 shrink-0 bg-[#F9FAFB]">
                 <h2 className="text-[13px] font-semibold text-[#111827]">Registo de Fornecedor</h2>
                 <button onClick={() => setIsFormOpen(false)} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
                    <X className="w-4 h-4" />
                 </button>
              </div>

              <div className="p-5 space-y-4">
                 <div>
                    <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Fornecedor / Entidade</label>
                    <input 
                      type="text"
                      value={name} 
                      onChange={e=>setName(e.target.value)} 
                      className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" 
                      placeholder="Nome da empresa" 
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Contacto</label>
                       <input 
                         type="text"
                         value={contact} 
                         onChange={e=>setContact(e.target.value)} 
                         className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" 
                         placeholder="Ex: 84..." 
                       />
                    </div>
                    <div>
                       <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Email</label>
                       <input 
                         type="email"
                         value={email} 
                         onChange={e=>setEmail(e.target.value)} 
                         className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" 
                         placeholder="opcional" 
                       />
                    </div>
                 </div>

                 <div>
                    <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Morada / Sede</label>
                    <input 
                      type="text"
                      value={address} 
                      onChange={e=>setAddress(e.target.value)} 
                      className="w-full h-9 px-3 text-[12px] border border-[#E5E7EB] rounded-[6px] outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" 
                      placeholder="Localização física" 
                    />
                 </div>

                 <div>
                    <label className="text-[11px] font-medium text-[#4B5563] uppercase tracking-wide block mb-1.5">Nível de Confiança</label>
                    <div className="flex gap-2">
                       {[1,2,3,4,5].map(r => (
                         <button 
                           key={r}
                           onClick={() => setRating(r)}
                           className="w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors border border-[#E5E7EB] hover:bg-[#F3F4F6] bg-white"
                         >
                           <Star className={`w-4 h-4 ${r <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-[#E5E7EB] text-[#E5E7EB]'}`} />
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="h-14 px-5 border-t border-[#E5E7EB] flex items-center gap-3 shrink-0 bg-[#F9FAFB]">
                 <button 
                   onClick={() => setIsFormOpen(false)}
                   className="flex-1 h-9 bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#374151] font-medium text-[12px] rounded-[6px] transition-colors"
                 >
                   Cancelar
                 </button>
                 <button 
                   onClick={handleSave}
                   className="flex-1 h-9 bg-[#111827] hover:bg-[#1F2937] text-white font-medium text-[12px] rounded-[6px] shadow-sm transition-colors"
                 >
                   Gravar
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
