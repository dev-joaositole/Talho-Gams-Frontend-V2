import React, { useState, useEffect } from 'react';
import { User, Shift, getGlobalProducts, Product, addShiftMovement, getShiftMovements } from '@/lib/storage';
import { getPrintSettings, PrintSettingsData, getSystemSettings, SystemSettingsData } from '@/pages/settings/models/settings';
import { Search, TerminalSquare, ShoppingCart, Trash2, CreditCard, Banknote, Smartphone, Lock, Activity, Minus, Plus, QrCode, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface TerminalProps {
  user: User;
  shift: Shift;
}

interface CartItem extends Product {
  cartId: string;
  cartQuantity: number;
}

export default function Terminal({ user, shift }: TerminalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Dinheiro' | 'Cartão' | 'Transferência/M-Pesa'>('Dinheiro');
  const [sangriaModalOpen, setSangriaModalOpen] = useState(false);
  const [sangriaAmount, setSangriaAmount] = useState('');
  const [sangriaReason, setSangriaReason] = useState('');
  
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [lastCart, setLastCart] = useState<CartItem[]>([]);
  const [lastPaymentMethod, setLastPaymentMethod] = useState('');
  const [lastTotal, setLastTotal] = useState(0);
  const [printSettings, setPrintSettings] = useState<PrintSettingsData | null>(null);
  const [sysSettings, setSysSettings] = useState<SystemSettingsData | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(getGlobalProducts());
    setPrintSettings(getPrintSettings());
    setSysSettings(getSystemSettings());
  }, []);

  const filteredProducts = search.trim().length === 0 
    ? products 
    : products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        (p.barcode && p.barcode.includes(search))
      );

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, cartId: Math.random().toString(), cartQuantity: 1 }]);
    }
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = Math.max(1, item.cartQuantity + delta);
        return { ...item, cartQuantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(c => c.cartId !== cartId));
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.globalPrice * curr.cartQuantity), 0);
  const itemCount = cart.reduce((acc, curr) => acc + curr.cartQuantity, 0);

  const handleFinalizeSale = () => {
    if (cart.length === 0) return;

    addShiftMovement(shift.id, {
      type: 'sale',
      amount: cartTotal,
      description: `Terminal Sale`,
      paymentMethod
    });

    toast.success(`Transação confirmada (${paymentMethod})`);
    
    setLastCart([...cart]);
    setLastPaymentMethod(paymentMethod);
    setLastTotal(cartTotal);
    setReceiptModalOpen(true);
    
    handlePrintReceipt();
    setCart([]);
  };

  const handlePrintReceipt = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleSangria = () => {
    if (!sangriaAmount || isNaN(Number(sangriaAmount)) || Number(sangriaAmount) <= 0) {
      toast.error('Valor numérico inválido.');
      return;
    }
    if (!sangriaReason) {
      toast.error('Motivo obrigatório.');
      return;
    }

    addShiftMovement(shift.id, {
      type: 'sangria',
      amount: Number(sangriaAmount),
      description: `Sangria: ${sangriaReason}`
    });

    toast.success('Sangria registada com sucesso.');
    setSangriaModalOpen(false);
    setSangriaAmount('');
    setSangriaReason('');
  };
  
  const getDailyStats = () => {
     const movements = getShiftMovements(shift.id);
     const sales = movements.filter(m => m.type === 'sale').reduce((sum, m) => sum + m.amount, 0);
     const currentBalance = shift.initialFloat + sales - movements.filter(m => m.type === 'sangria').reduce((s, m) => s + m.amount, 0);
     return { sales, currentBalance };
  };

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] overflow-hidden text-[#111827] print:bg-white print:text-black font-sans select-none">
      
      {/* TOP NAVIGATION BAR */}
      <div className="h-10 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 shrink-0 print:hidden z-10 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="font-bold text-[12px] bg-[#111827] text-white px-2 py-0.5 rounded-[4px] uppercase tracking-wide flex items-center gap-1.5">
              <TerminalSquare className="w-3.5 h-3.5" />
              Terminal de Venda
            </div>
            <div className="text-[11px] text-[#6B7280] font-semibold flex items-center gap-1.5 uppercase tracking-wide">
               <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
               TURNO: {shift.id.split('-')[0]}
            </div>
         </div>
         <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setStatsModalOpen(true)}
              className="text-[#374151] text-[11px] font-semibold px-2 h-7 rounded-[4px] hover:bg-[#F3F4F6] transition-colors flex items-center gap-1.5 border border-transparent hover:border-[#E5E7EB]"
            >
              <Activity className="w-3.5 h-3.5" /> CAIXA
            </button>
            <button 
              onClick={() => setSangriaModalOpen(true)}
              className="text-[#374151] text-[11px] font-semibold px-2 h-7 rounded-[4px] hover:bg-[#F3F4F6] transition-colors flex items-center gap-1.5 border border-transparent hover:border-[#E5E7EB]"
            >
              <Download className="w-3.5 h-3.5" /> SANGRIA
            </button>
            <div className="w-px h-4 bg-[#E5E7EB] mx-1"></div>
            <div className="text-[11px] font-bold text-[#111827] px-2 uppercase tracking-wide">
               {user.name}
            </div>
            <button 
              onClick={() => navigate('/caixa/fechar')}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white text-[11px] font-bold px-3 h-7 rounded-[4px] transition-colors flex items-center gap-1.5 ml-1 uppercase tracking-wide"
            >
              <Lock className="w-3 h-3" /> Fechar
            </button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden print:hidden p-2 gap-2">
        {/* LEFT PANEL: CART & CHECKOUT */}
        <div className="flex-1 flex flex-col bg-white border border-[#E5E7EB] rounded-[6px] overflow-hidden shadow-sm">
           {/* Cart Header */}
           <div className="h-10 px-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-[#111827]">
                 <ShoppingCart className="w-4 h-4 text-[#4B5563]" />
                 <span className="text-[12px] font-bold uppercase tracking-wide">Itens no Carrinho</span>
              </div>
              <div className="text-[10px] font-bold bg-[#E5E7EB] text-[#374151] px-2 py-0.5 rounded-[4px]">{itemCount} Itens</div>
           </div>

           {/* Cart Items List */}
           <div className="flex-1 overflow-y-auto bg-white">
             {cart.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-[#9CA3AF] px-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-3">
                    <ShoppingCart className="w-5 h-5 text-[#D1D5DB]" />
                  </div>
                  <p className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wide">Carrinho Vazio</p>
                  <p className="text-[11px] mt-1 text-[#9CA3AF]">Adicione produtos usando o painel lateral.</p>
               </div>
             ) : (
               <table className="w-full text-left border-collapse table-fixed">
                 <thead className="bg-[#F9FAFB] text-[#6B7280] text-[10px] uppercase font-bold sticky top-0 shadow-[0_1px_0_rgba(0,0,0,0.05)] border-b border-[#E5E7EB] z-10">
                   <tr>
                     <th className="px-4 py-2 w-10 text-center">#</th>
                     <th className="px-4 py-2">Artigo</th>
                     <th className="px-4 py-2 w-24 text-right">Preço Unit.</th>
                     <th className="px-4 py-2 w-28 text-center">Qtd</th>
                     <th className="px-4 py-2 w-24 text-right">Subtotal</th>
                     <th className="px-4 py-2 w-12 text-center"></th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-[#F3F4F6] text-[11px] text-[#374151]">
                   {cart.map((item, idx) => (
                     <tr key={item.cartId} className="hover:bg-[#F9FAFB] transition-colors group">
                       <td className="px-4 py-1.5 text-center text-[#9CA3AF] font-bold">{idx + 1}</td>
                       <td className="px-4 py-1.5 truncate">
                         <div className="font-bold text-[#111827] truncate">{item.name}</div>
                       </td>
                       <td className="px-4 py-1.5 text-right font-medium text-[#6B7280]">
                         {item.globalPrice.toLocaleString()}
                       </td>
                       <td className="px-4 py-1.5">
                         <div className="flex items-center justify-center gap-px max-w-[80px] mx-auto border border-[#E5E7EB] rounded-[4px] bg-white overflow-hidden text-[11px]">
                           <button onClick={() => updateQuantity(item.cartId, -1)} className="w-[24px] h-[22px] flex items-center justify-center text-[#4B5563] hover:bg-[#F3F4F6]">
                             <Minus className="w-2.5 h-2.5" />
                           </button>
                           <div className="h-[22px] px-1.5 flex-1 flex items-center justify-center font-bold text-[#111827] bg-[#F9FAFB] border-x border-[#E5E7EB]">
                             {item.cartQuantity}
                           </div>
                           <button onClick={() => updateQuantity(item.cartId, 1)} className="w-[24px] h-[22px] flex items-center justify-center text-[#4B5563] hover:bg-[#F3F4F6]">
                             <Plus className="w-2.5 h-2.5" />
                           </button>
                         </div>
                       </td>
                       <td className="px-4 py-1.5 font-bold text-[#111827] text-right">
                         {(item.globalPrice * item.cartQuantity).toLocaleString()}
                       </td>
                       <td className="px-4 py-1.5 text-center">
                         <button onClick={() => removeFromCart(item.cartId)} className="w-6 h-6 flex items-center justify-center text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#EF4444] rounded-[4px] mx-auto hover:bg-[#FEF2F2]">
                           <Trash2 className="w-3.5 h-3.5" />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
           </div>

           {/* Checkout Footer */}
           <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] p-3 flex flex-col shrink-0">
              <div className="flex items-center justify-between gap-4 mb-3">
                 <div className="flex gap-2 w-[340px] shrink-0">
                    <button 
                      onClick={() => setPaymentMethod('Dinheiro')}
                      className={`flex-1 h-8 flex items-center justify-center gap-1.5 rounded-[4px] text-[10px] uppercase font-bold tracking-wide border transition-all ${paymentMethod === 'Dinheiro' ? 'bg-[#111827] border-[#111827] text-white' : 'bg-white border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'}`}
                    >
                      <Banknote className="w-3 h-3" /> Dinheiro
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('Cartão')}
                      className={`flex-1 h-8 flex items-center justify-center gap-1.5 rounded-[4px] text-[10px] uppercase font-bold tracking-wide border transition-all ${paymentMethod === 'Cartão' ? 'bg-[#111827] border-[#111827] text-white' : 'bg-white border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'}`}
                    >
                      <CreditCard className="w-3 h-3" /> Cartão
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('Transferência/M-Pesa')}
                      className={`flex-1 h-8 flex items-center justify-center gap-1.5 rounded-[4px] text-[10px] uppercase font-bold tracking-wide border transition-all ${paymentMethod === 'Transferência/M-Pesa' ? 'bg-[#111827] border-[#111827] text-white' : 'bg-white border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'}`}
                    >
                      <Smartphone className="w-3 h-3" /> M-Pesa
                    </button>
                 </div>
                 
                 <div className="text-right flex-1 flex items-center justify-end gap-3">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">A Pagar:</span>
                    <span className="text-[28px] font-black text-[#111827] leading-none tracking-tight">{cartTotal.toLocaleString()} <span className="text-[14px] text-[#9CA3AF] font-bold">MT</span></span>
                 </div>
              </div>
              
              <div className="flex items-center justify-between gap-2">
                 <button 
                   onClick={() => setCart([])}
                   disabled={cart.length === 0}
                   className="h-10 px-6 rounded-[4px] font-bold text-[11px] uppercase tracking-wide bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#FEF2F2] hover:text-[#EF4444] hover:border-[#FECACA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Cancelar
                 </button>
                 <button 
                   onClick={handleFinalizeSale}
                   disabled={cart.length === 0}
                   className="flex-1 h-10 rounded-[4px] font-black text-[14px] bg-[#10B981] text-white hover:bg-[#059669] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2"
                 >
                   Concluir Venda
                 </button>
              </div>
           </div>
        </div>

        {/* RIGHT PANEL: PRODUCTS (Dense List for >10 items without scroll ideally) */}
        <div className="w-[320px] flex flex-col bg-white border border-[#E5E7EB] rounded-[6px] overflow-hidden shadow-sm shrink-0">
           {/* Search Bar */}
           <div className="p-2 border-b border-[#E5E7EB] bg-[#F9FAFB] shrink-0">
             <div className="relative">
               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
               <input 
                 type="text"
                 placeholder="Pesquisar artigo..."
                 className="w-full h-8 pl-8 pr-8 bg-white border border-[#E5E7EB] outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] rounded-[4px] text-[11px] font-medium transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] placeholder:text-[#9CA3AF]"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 autoFocus
               />
               {search && (
                 <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center bg-[#F3F4F6] text-[#6B7280] rounded-full hover:bg-[#E5E7EB]">
                   <span className="text-[10px] font-bold mt-[-1px]">×</span>
                 </button>
               )}
             </div>
           </div>

           {/* Product Catalog Dense List */}
           <div className="flex-1 overflow-y-auto bg-white p-1">
             {filteredProducts.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-40 text-[#9CA3AF]">
                 <Search className="w-5 h-5 mb-2 opacity-50 text-[#D1D5DB]" />
                 <p className="text-[10px] font-bold uppercase tracking-wide">Sem resultados</p>
               </div>
             ) : (
               <div className="flex flex-col gap-0.5">
                 {filteredProducts.map(p => (
                   <div 
                     key={p.id}
                     onClick={() => addToCart(p)}
                     className="flex items-center justify-between bg-white hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] p-2 cursor-pointer transition-all select-none group rounded-[4px]"
                   >
                     <div className="flex flex-col truncate pr-2">
                        <span className="text-[11px] font-bold text-[#111827] truncate group-hover:text-[#3B82F6]">{p.name}</span>
                        <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wide mt-0.5">{p.type}</span>
                     </div>
                     <div className="text-[12px] font-black text-[#111827] shrink-0 bg-[#F3F4F6] px-1.5 py-0.5 rounded-[4px] group-hover:bg-[#E0E7FF] group-hover:text-[#4F46E5] transition-colors border border-[#E5E7EB] group-hover:border-[#C7D2FE]">
                        {p.globalPrice.toLocaleString()}
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      </div>

      {/* MODALS */}
      {/* SANGRIA MODAL */}
      {sangriaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 backdrop-blur-[2px] p-4">
           <div className="w-[320px] bg-white rounded-[8px] overflow-hidden border border-[#E5E7EB] shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                 <h3 className="font-bold text-[#111827] text-[13px] uppercase tracking-wide">Operação de Sangria</h3>
                 <p className="text-[10px] text-[#6B7280] mt-0.5">Retirada de fundos do caixa</p>
              </div>
              <div className="p-4 space-y-3">
                 <div>
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1 block">Montante (MT)</label>
                    <input 
                      type="number"
                      autoFocus
                      placeholder="0.00"
                      className="w-full h-8 px-2 bg-white border border-[#E5E7EB] rounded-[4px] outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] text-[12px] font-bold transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
                      value={sangriaAmount}
                      onChange={e => setSangriaAmount(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1 block">Motivo</label>
                    <input 
                      placeholder="Ex: Cofre central"
                      className="w-full h-8 px-2 bg-white border border-[#E5E7EB] rounded-[4px] outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] text-[12px] transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
                      value={sangriaReason}
                      onChange={e => setSangriaReason(e.target.value)}
                    />
                 </div>
              </div>
              <div className="p-3 bg-[#F9FAFB] flex gap-2 border-t border-[#E5E7EB]">
                 <button onClick={() => setSangriaModalOpen(false)} className="flex-1 h-8 font-bold text-[11px] text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] rounded-[4px] transition-colors">ABORTAR</button>
                 <button onClick={handleSangria} className="flex-1 h-8 font-bold text-[11px] bg-[#111827] text-white hover:bg-[#1F2937] rounded-[4px] transition-colors shadow-sm">PROCESSAR</button>
              </div>
           </div>
        </div>
      )}
      
      {/* STATS MODAL */}
      {statsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 backdrop-blur-[2px] p-4">
           <div className="w-[280px] bg-white rounded-[8px] overflow-hidden border border-[#E5E7EB] shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center">
                 <div>
                   <h3 className="font-bold text-[#111827] text-[13px] uppercase tracking-wide">Status do Caixa</h3>
                 </div>
                 <Lock className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </div>
              <div className="p-4 space-y-3">
                 <div className="bg-[#F9FAFB] p-3 rounded-[4px] border border-[#E5E7EB]">
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-0.5">Vendas Correntes</p>
                    <p className="font-black text-[16px] text-[#111827]">{getDailyStats().sales.toLocaleString()} <span className="text-[11px] text-[#9CA3AF] font-bold">MT</span></p>
                 </div>
                 <div className="bg-[#F0FDF4] p-3 rounded-[4px] border border-[#BBF7D0]">
                    <p className="text-[10px] font-bold text-[#166534] uppercase tracking-wide mb-0.5">Saldo Dinheiro Físico</p>
                    <p className="font-black text-[16px] text-[#15803D]">{getDailyStats().currentBalance.toLocaleString()} <span className="text-[11px] text-[#22C55E] font-bold">MT</span></p>
                 </div>
              </div>
              <div className="p-3 bg-[#F9FAFB] border-t border-[#E5E7EB]">
                 <button onClick={() => setStatsModalOpen(false)} className="w-full h-8 font-bold text-[11px] bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#F3F4F6] rounded-[4px] transition-colors uppercase tracking-wide">Fechar</button>
              </div>
           </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {receiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/60 backdrop-blur-[2px] p-4 print:bg-white print:p-0">
           <div className="w-[280px] bg-white rounded-[8px] overflow-hidden border border-[#E5E7EB] shadow-xl animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:w-full print:max-w-[80mm] print:border-0 print:rounded-none">
              <div className="p-3 border-b border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center print:hidden">
                 <h3 className="font-bold text-[#111827] text-[11px] uppercase tracking-wide">Recibo</h3>
                 <button onClick={() => setReceiptModalOpen(false)} className="text-[10px] font-bold text-[#6B7280] hover:text-[#111827] uppercase">Fechar</button>
              </div>
              
              <div className="p-4 font-mono text-[10px] leading-[1.4] text-black">
                 <div className="text-center mb-3">
                    {printSettings?.showLogo && sysSettings?.logoDataUrl && (
                      <img src={sysSettings.logoDataUrl} alt="Logo" className="h-8 mx-auto mb-2 grayscale" />
                    )}
                    <h2 className="font-bold text-[12px] uppercase tracking-wider">{sysSettings?.companyName || 'EMPRESA'}</h2>
                    {printSettings?.showAddress && sysSettings?.address && <p className="text-[9px] mt-0.5">{sysSettings.address}</p>}
                    {printSettings?.showNuit && sysSettings?.nuit && <p className="text-[9px] mt-0.5">NUIT: {sysSettings.nuit}</p>}
                 </div>
                 
                 <div className="mb-3 border-b border-dashed border-[#CBD5E1] pb-2">
                    <p>OP: {user.name.toUpperCase()}</p>
                    <p>DATA: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                    <p>DOC: VD-{Math.floor(Math.random()*90000)+10000}</p>
                 </div>
                 
                 <div className="mb-2">
                    <div className="flex justify-between font-bold mb-1 border-b border-[#E5E7EB] pb-1">
                       <span>ARTIGO</span>
                       <span>VALOR</span>
                    </div>
                    {lastCart.map(c => (
                      <div key={c.cartId} className="flex justify-between mb-1">
                         <span className="truncate pr-2">{c.cartQuantity}x {c.name.substring(0, 16).toUpperCase()}</span>
                         <span className="shrink-0">{(c.globalPrice * c.cartQuantity).toLocaleString()}</span>
                      </div>
                    ))}
                 </div>
                 
                 <div className="border-t border-dashed border-[#CBD5E1] pt-2 mb-3">
                    <div className="flex justify-between font-bold text-[12px]">
                       <span>TOTAL</span>
                       <span>{lastTotal.toLocaleString()} MT</span>
                    </div>
                    <div className="flex justify-between mt-1 text-[9px] uppercase">
                       <span>PAGO EM</span>
                       <span>{lastPaymentMethod}</span>
                    </div>
                 </div>
                 
                 {printSettings?.customReceiptMessage && (
                   <div 
                     className="text-center text-[9px] whitespace-pre-wrap mt-3 border-t border-[#E5E7EB] pt-2"
                     dangerouslySetInnerHTML={{__html: printSettings.customReceiptMessage
                        .replace('{{data}}', new Date().toLocaleDateString())
                        .replace('{{hora}}', new Date().toLocaleTimeString())
                        .replace('{{operador}}', user.name)
                        .replace('{{impostos}}', 'IVA INCLUIDO')
                     }}
                   />
                 )}
                 <div className="text-center mt-3 text-[9px]">PROCESSADO POR COMPUTADOR</div>
              </div>
              
              <div className="p-3 bg-[#F9FAFB] border-t border-[#E5E7EB] flex gap-2 print:hidden">
                 <button onClick={() => setReceiptModalOpen(false)} className="flex-1 h-8 font-bold text-[10px] bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6] rounded-[4px] transition-colors uppercase tracking-wide">Ignorar</button>
                 <button onClick={handlePrintReceipt} className="flex-1 h-8 font-bold text-[10px] bg-[#111827] text-white hover:bg-[#1F2937] rounded-[4px] transition-colors shadow-sm uppercase tracking-wide">Imprimir Copia</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
