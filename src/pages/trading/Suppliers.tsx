import React, { useState, useEffect, useContext } from 'react';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { Plus, Building2, Search, Edit, Trash2, Mail, Phone, MapPin as MapPinIcon, Star } from 'lucide-react';
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
      toast.error('Nome e contacto primário são obrigatórios.');
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
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
         <div>
            <h2 className="text-xl font-black text-slate-800">Parceiros de Negócio</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Gestão de contatos e histórico de fornecedores</p>
         </div>
         <Button 
           onClick={() => setIsFormOpen(true)}
           className="h-11 px-5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md"
         >
           <Plus className="w-4 h-4 mr-2" /> Novo Fornecedor
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100">
             <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-slate-800">Nenhum fornecedor</h3>
             <p className="text-slate-500 mb-4">Cadastre os fornecedores para vincular às compras de mercadorias.</p>
             <Button onClick={() => setIsFormOpen(true)} variant="outline" className="font-bold">Adicionar o primeiro</Button>
          </div>
        ) : (
          filteredSuppliers.map(sup => (
            <Card key={sup.id} className="border-0 shadow-sm rounded-[24px] bg-white p-6 relative group overflow-hidden">
               <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
               
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                     <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h3 className="text-lg font-black text-slate-800 truncate">{sup.name}</h3>
                     <div className="flex items-center text-amber-500 mt-1 gap-1">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-3.5 h-3.5 ${i < sup.rating ? 'fill-current' : 'text-slate-200 fill-slate-200'}`} />
                        ))}
                     </div>
                  </div>
               </div>

               <div className="space-y-2 mt-6">
                  <div className="flex items-center text-sm">
                     <Phone className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                     <span className="font-medium text-slate-600 truncate">{sup.contact}</span>
                  </div>
                  {sup.email && (
                    <div className="flex items-center text-sm">
                       <Mail className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                       <span className="font-medium text-slate-600 truncate">{sup.email}</span>
                    </div>
                  )}
                  {sup.address && (
                    <div className="flex items-center text-sm">
                       <MapPinIcon className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
                       <span className="font-medium text-slate-600 truncate">{sup.address}</span>
                    </div>
                  )}
               </div>

               <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Compras</p>
                    <p className="font-black text-slate-800">{sup.totalPurchases} Registros</p>
                  </div>
                  <Button variant="ghost" className="h-8 text-xs font-bold text-blue-600 hover:bg-blue-50">Histórico</Button>
               </div>
            </Card>
          ))
        )}
      </div>

      {/* MODAL CRIAR FORNECEDOR */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <Card className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-0 animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="text-xl font-black text-slate-800">Novo Fornecedor</h2>
                 <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">✕</Button>
              </div>
              <div className="p-6 space-y-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Nome da Empresa / Parceiro</label>
                    <Input value={name} onChange={e=>setName(e.target.value)} className="h-12 bg-slate-50 border-slate-200 rounded-xl" placeholder="Ex: Matadouro Central" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Contacto Principal</label>
                       <Input value={contact} onChange={e=>setContact(e.target.value)} className="h-12 bg-slate-50 border-slate-200 rounded-xl" placeholder="+258 84..." />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Email Comercial</label>
                       <Input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="h-12 bg-slate-50 border-slate-200 rounded-xl" placeholder="email@exemplo.com" />
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Endereço Completo</label>
                    <Input value={address} onChange={e=>setAddress(e.target.value)} className="h-12 bg-slate-50 border-slate-200 rounded-xl" placeholder="Ex: Rua Direita, nº 10 - Pemba" />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Avaliação Inicial</label>
                    <div className="flex gap-2">
                       {[1,2,3,4,5].map(r => (
                         <button 
                           key={r}
                           onClick={() => setRating(r)}
                           className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors border border-transparent hover:bg-slate-50"
                         >
                           <Star className={`w-5 h-5 ${r <= rating ? 'fill-amber-500 text-amber-500' : 'fill-slate-200 text-slate-200'}`} />
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50 rounded-b-[24px]">
                 <Button variant="ghost" className="flex-1 h-12 font-bold" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                 <Button className="flex-[2] h-12 font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-lg" onClick={handleSave}>
                   Registar Fornecedor
                 </Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
