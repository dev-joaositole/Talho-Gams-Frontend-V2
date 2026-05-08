import React, { useState, useEffect } from 'react';
import { saveProductBase, getCategories, Category, saveCategory } from '@/lib/storage';
import { Card } from '@/pages/hr/ui/card';
import { Input } from '@/pages/hr/ui/input';
import { Button } from '@/pages/hr/ui/button';
import { useNavigate } from 'react-router-dom';
import { Save, Ban, PackagePlus, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductCreate() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    barcode: '',
    type: 'kg',
    costPrice: '',
    globalPrice: '',
    expirationDate: '',
  });

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCategory = () => {
     if(newCatName.trim()) {
        const cat = saveCategory({ name: newCatName.trim() });
        setCategories([...categories, cat]);
        setFormData({ ...formData, categoryId: cat.id });
     }
     setIsAddingCat(false);
     setNewCatName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.costPrice || !formData.globalPrice) {
        alert("Preencha todos os campos obrigatórios");
        return;
    }
    
    saveProductBase({
      name: formData.name,
      categoryId: formData.categoryId,
      barcode: formData.barcode || Math.floor(Math.random() * 1000000000000).toString(),
      type: formData.type as 'kg' | 'un',
      costPrice: Number(formData.costPrice),
      globalPrice: Number(formData.globalPrice),
      expirationDate: formData.expirationDate,
      isComposite: false
    });
    
    // Note: Em produção real, também geraria stock 0 no inventory
    toast.success("Produto base registado com sucesso!");
    navigate('/produtos');
  };

  const cost = Number(formData.costPrice) || 0;
  const price = Number(formData.globalPrice) || 0;
  const marginPercent = cost > 0 ? ((price - cost) / cost) * 100 : 0;
  const marginValue = price - cost;

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <PackagePlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Novo Produto Base</h2>
            <p className="text-sm font-medium text-slate-500">Registo de carnes, peixes ou mercadorias.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECÇÃO 1: INFORMAÇÕES BÁSICAS */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Informação Principal</h3>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nome do Produto <span className="text-red-500">*</span></label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Ex: Picanha Argentina"
                    className="h-12 rounded-[12px]" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Categoria <span className="text-red-500">*</span></label>
                  {isAddingCat ? (
                     <div className="flex gap-2">
                        <Input 
                           value={newCatName}
                           onChange={(e) => setNewCatName(e.target.value)}
                           className="h-12 rounded-[12px]"
                           placeholder="Nova categoria"
                        />
                        <Button type="button" onClick={handleAddCategory} className="h-12 w-12 shrink-0 rounded-[12px]"><Save className="w-4 h-4"/></Button>
                        <Button type="button" variant="outline" onClick={() => setIsAddingCat(false)} className="h-12 w-12 shrink-0 rounded-[12px]"><Ban className="w-4 h-4"/></Button>
                     </div>
                  ) : (
                     <div className="flex gap-2">
                        <select 
                          name="categoryId" 
                          value={formData.categoryId} 
                          onChange={handleChange} 
                          className="flex h-12 w-full rounded-[12px] border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                          required
                        >
                          <option value="" disabled>Selecione uma categoria...</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <Button type="button" variant="outline" onClick={() => setIsAddingCat(true)} className="h-12 w-12 shrink-0 rounded-[12px] bg-slate-50"><Plus className="w-4 h-4 text-slate-600"/></Button>
                     </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Código de Barras</label>
                  <Input 
                    name="barcode" 
                    value={formData.barcode} 
                    onChange={handleChange} 
                    placeholder="Deixe vazio para gerar auto."
                    className="h-12 rounded-[12px] font-mono" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Unidade de Medida <span className="text-red-500">*</span></label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="type" value="kg" checked={formData.type === 'kg'} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-slate-600">Quilograma (Kg)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="type" value="un" checked={formData.type === 'un'} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-slate-600">Unidade (Un)</span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Data de Validade (Opcional)</label>
                  <Input 
                    name="expirationDate" 
                    type="date"
                    value={formData.expirationDate} 
                    onChange={handleChange} 
                    className="h-12 rounded-[12px]" 
                  />
                </div>
             </div>
          </div>

          {/* SECÇÃO 2: PRECIFICAÇÃO */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Precificação</h3>
             <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[20px] border border-slate-100">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Custo de Compra (MT) <span className="text-red-500">*</span></label>
                  <Input 
                    name="costPrice"
                    type="number" 
                    min="0" step="0.01"
                    value={formData.costPrice} 
                    onChange={handleChange} 
                    className="h-12 rounded-[12px] font-bold bg-white" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Preço Venda Base (Sede/Global) <span className="text-red-500">*</span></label>
                  <Input 
                    name="globalPrice"
                    type="number" 
                    min="0" step="0.01"
                    value={formData.globalPrice} 
                    onChange={handleChange} 
                    className="h-12 rounded-[12px] font-bold bg-white" 
                    required 
                  />
                </div>
                
                <div className="md:col-span-2 pt-2 flex items-center justify-between">
                   <span className="text-sm font-bold text-slate-500">Lucro Estimado: <span className="text-slate-800">{marginValue > 0 ? marginValue.toLocaleString() : '0'} MT</span></span>
                   <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${marginPercent > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      Margem: {marginPercent.toFixed(2)}%
                   </div>
                </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-100">
            <Button type="submit" className="h-12 px-8 rounded-[12px] bg-blue-600 hover:bg-blue-700 font-bold w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" /> Salvar Produto
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/produtos')} className="h-12 px-8 rounded-[12px] font-bold text-slate-600 w-full sm:w-auto">
              <Ban className="w-4 h-4 mr-2" /> Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
