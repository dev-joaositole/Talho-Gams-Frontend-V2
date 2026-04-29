import React, { useState, useEffect, useRef } from 'react';
import { User, Shift, getGlobalProducts, Product, addShiftMovement, logoutUser, getShiftMovements } from '@/lib/storage';
import { getPrintSettings, PrintSettingsData, getSystemSettings, SystemSettingsData, STORAGE_KEYS } from '@/pages/settings/models/settings';
import { Card } from '@/pages/hr/ui/card';
import { Button } from '@/pages/hr/ui/button';
import { Input } from '@/pages/hr/ui/input';
import { 
  Search, Scan, ShoppingCart, Trash2, 
  CreditCard, Wallet, Smartphone, Archive, LogOut, Lock, Download,
  Plus, Minus, Eye
} from 'lucide-react';
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
    ? [] 
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

  const handleFinalizeSale = () => {
    if (cart.length === 0) return;

    addShiftMovement(shift.id, {
      type: 'sale',
      amount: cartTotal,
      description: `Venda #${Math.floor(Math.random() * 9000) + 1000}`,
      paymentMethod
    });

    toast.success(`Venda registrada com sucesso! Forma: ${paymentMethod}`);
    
    // Save for receipt
    setLastCart([...cart]);
    setLastPaymentMethod(paymentMethod);
    setLastTotal(cartTotal);
    setReceiptModalOpen(true);
    
    // Auto print based on the request "deve processar nesse caso a fatura... e enviar na impressora" 
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
      toast.error('Informe um valor válido para retirar.');
      return;
    }
    if (!sangriaReason) {
      toast.error('Informe o motivo (Ex: Depósito, Remessa...).');
      return;
    }

    addShiftMovement(shift.id, {
      type: 'sangria',
      amount: Number(sangriaAmount),
      description: `Sangria: ${sangriaReason}`
    });

    toast.success(`Sangria de ${Number(sangriaAmount)} MT realizada e reportada.`);
    setSangriaModalOpen(false);
    setSangriaAmount('');
    setSangriaReason('');
  };
  
  const getDailyStats = () => {
     const movements = getShiftMovements(shift.id);
     const sales = movements.filter(m => m.type === 'sale').reduce((sum, m) => sum + m.amount, 0);
     const currentBalance = shift.startingBalance + sales - movements.filter(m => m.type === 'sangria').reduce((s, m) => s + m.amount, 0);
     return { sales, currentBalance };
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-800 print:bg-white print:overflow-visible">
      
      {/* Esquerda: Carrinho (Maior Campo de Visão) */}
      <div className="flex-1 flex flex-col z-10 shrink-0 bg-white shadow-[10px_0_30px_rgba(0,0,0,0.03)] border-r border-slate-100 print:hidden">
        
        {/* Header Carrinho */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer" onDoubleClick={() => setStatsModalOpen(true)}>TG</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-800 leading-tight">Carrinho Atual</h2>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-slate-400 hover:text-slate-600 bg-transparent hover:bg-slate-100" onClick={() => setStatsModalOpen(true)}>
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span className="text-xs font-bold">Resumo Diário</span>
                  </Button>
                </div>
                <p className="text-xs font-bold text-slate-500">Operador: {user.name}</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              {cart.length > 0 && (
                <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
                  {cart.length} itens adicionados
                </span>
              )}
           </div>
        </div>

        {/* Itens do Carrinho */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/30">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
               <ShoppingCart className="w-16 h-16 opacity-20" />
               <p className="font-bold text-sm text-center px-8 text-slate-400">Nenhum produto no carrinho.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-xl shadow-sm hover:border-slate-200 transition-colors">
                <div className="flex-1 pr-3">
                  <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.name}</h4>
                  <div className="flex items-center gap-1 mt-1 text-xs font-bold">
                    <span className="text-slate-400">Preço:</span>
                    <span className="text-slate-700">{item.globalPrice.toLocaleString()} MT</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100/50">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.cartId, -1)} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100">
                       <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-black text-sm w-6 text-center">{item.cartQuantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, 1)} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100">
                       <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="w-px h-6 bg-slate-200"></div>
                  
                  <div className="text-right flex flex-col items-end min-w-[80px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Subt.</span>
                    <span className="font-black text-sm text-blue-600">{(item.globalPrice * item.cartQuantity).toLocaleString()}</span>
                  </div>
                  
                  <button onClick={() => removeFromCart(item.cartId)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Zona de Checkout */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-200 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
           <div className="flex items-end justify-between mb-4">
              <div className="space-y-3 flex-1 max-w-[280px] mr-6">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Método</label>
                 <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={paymentMethod === 'Dinheiro' ? 'default' : 'outline'} 
                      className={`h-10 px-2 text-xs font-bold shadow-sm ${paymentMethod === 'Dinheiro' ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-0' : 'text-slate-600 bg-white hover:bg-slate-50 border-slate-200'}`}
                      onClick={() => setPaymentMethod('Dinheiro')}
                    >
                      <Wallet className="w-3.5 h-3.5 mr-1.5 hidden md:block"/> TPA
                    </Button>
                    <Button 
                      variant={paymentMethod === 'Cartão' ? 'default' : 'outline'} 
                      className={`h-10 px-2 text-xs font-bold shadow-sm ${paymentMethod === 'Cartão' ? 'bg-blue-600 hover:bg-blue-700 text-white border-0' : 'text-slate-600 bg-white hover:bg-slate-50 border-slate-200'}`}
                      onClick={() => setPaymentMethod('Cartão')}
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-1.5 hidden md:block"/> POS
                    </Button>
                    <Button 
                      variant={paymentMethod === 'Transferência/M-Pesa' ? 'default' : 'outline'} 
                      className={`h-10 px-2 text-xs font-bold shadow-sm ${paymentMethod === 'Transferência/M-Pesa' ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-0' : 'text-slate-600 bg-white hover:bg-slate-50 border-slate-200'}`}
                      onClick={() => setPaymentMethod('Transferência/M-Pesa')}
                    >
                      <Smartphone className="w-3.5 h-3.5 mr-1.5 hidden md:block"/> M-Pesa
                    </Button>
                 </div>
              </div>
              
              <div className="text-right">
                 <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block mb-1">Total a Pagar</span>
                 <span className="text-3xl font-black text-slate-800 leading-none">{cartTotal.toLocaleString()} <span className="text-xl text-slate-400">MT</span></span>
              </div>
           </div>

           <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="h-12 px-5 font-bold text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 rounded-xl"
                onClick={() => setCart([])}
                disabled={cart.length === 0}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              
              <Button 
                className="flex-1 h-12 text-sm font-black bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-xl shadow-slate-800/20"
                disabled={cart.length === 0}
                onClick={handleFinalizeSale}
              >
                Confirmar Pagamento
              </Button>
           </div>
        </div>
      </div>
      
      {/* Direita: Pesquisa e Ações */}
      <div className="w-[480px] flex flex-col p-6 gap-6 bg-slate-100 overflow-hidden shrink-0 print:hidden">
        
        {/* Top bar (Ações da conta e Turno) */}
        <div className="flex items-center justify-between gap-3 shrink-0">
           <Button variant="outline" className="flex-1 h-12 bg-white text-red-600 border-red-200 hover:bg-red-50 font-bold rounded-xl shadow-sm" onClick={() => setSangriaModalOpen(true)}>
             <Download className="w-4 h-4 mr-2" /> Sangria
           </Button>
           
           <Button 
             variant="outline" 
             className="flex-1 h-12 bg-white text-slate-600 border-slate-200 hover:bg-slate-100 font-bold rounded-xl shadow-sm"
             onClick={() => navigate('/caixa/fechar')}
           >
             <Lock className="w-4 h-4 mr-2" /> Fechar Caixa
           </Button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative shrink-0">
           <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
           <Input 
             placeholder="Introduza código ou nome do produto..." 
             className="pl-12 pr-12 h-16 bg-white border-transparent shadow-sm rounded-2xl text-lg font-bold"
             value={search}
             onChange={e => setSearch(e.target.value)}
             autoFocus
           />
           <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-100 p-2 text-slate-500 rounded-lg">
             <Scan className="w-5 h-5" />
           </div>
        </div>

        {/* Lista de Produtos Encontrados */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
           {search.trim().length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <Search className="w-16 h-16 mb-4" />
                <p className="font-bold text-center">Para ver produtos,<br/>digite acima ou use o scanner.</p>
             </div>
           ) : filteredProducts.length === 0 ? (
             <div className="text-center p-8 bg-white/50 rounded-2xl border border-slate-200 border-dashed">
                <p className="font-bold text-slate-500">Nenhum produto encontrado na pesquisa.</p>
             </div>
           ) : (
             <div className="grid grid-cols-2 gap-2">
               {filteredProducts.map(p => (
                 <Card 
                   key={p.id} 
                   className="p-3 border-0 shadow-sm rounded-xl cursor-pointer hover:shadow-md transition-all active:scale-95 bg-white select-none flex flex-col h-full ring-2 ring-transparent hover:ring-blue-100"
                   onClick={() => addToCart(p)}
                 >
                   <div className="flex-1 mb-3">
                     <h3 className="font-bold text-slate-800 text-xs leading-snug">{p.name}</h3>
                     <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{p.type === 'kg' ? 'Por KG' : 'Unidade'}</p>
                   </div>
                   <div className="pt-3 border-t border-slate-50 mt-auto">
                      <span className="font-black text-blue-600 block text-xs">{p.globalPrice.toLocaleString()} MT</span>
                   </div>
                 </Card>
               ))}
             </div>
           )}
        </div>
      </div>

      {/* MODAL: SANGRIA */}
      {sangriaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
           <Card className="w-full max-w-sm bg-white border-0 shadow-2xl rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                 <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                    <Download className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-black text-slate-800 text-lg">Sangria do Caixa</h3>
                    <p className="text-xs font-bold text-slate-400">Retirada protegida de fundos</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Montante (MT)</label>
                    <Input 
                      type="number"
                      placeholder="0.00"
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl font-black text-xl"
                      value={sangriaAmount}
                      onChange={e => setSangriaAmount(e.target.value)}
                      autoFocus
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Motivo / Destino</label>
                    <Input 
                      placeholder="Ex: Depósito bancário, Envio carro forte..."
                      className="h-12 bg-slate-50 border-slate-200 rounded-xl font-medium"
                      value={sangriaReason}
                      onChange={e => setSangriaReason(e.target.value)}
                    />
                 </div>
              </div>

              <div className="flex gap-3 mt-6">
                 <Button variant="ghost" onClick={() => setSangriaModalOpen(false)} className="flex-1 font-bold">Cancelar</Button>
                 <Button onClick={handleSangria} className="flex-1 bg-red-600 hover:bg-red-700 font-bold">Confirmar Sangria</Button>
              </div>
           </Card>
        </div>
      )}
      
      {/* MODAL: SIGILO/ESTATÍSTICAS */}
      {statsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
           <Card className="w-full max-w-sm bg-white border-0 shadow-2xl rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-black text-slate-800 text-lg">Estatísticas do Turno</h3>
                 <Lock className="w-5 h-5 text-slate-300" />
              </div>

              <div className="space-y-4">
                 <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total de Vendas (Hoje)</p>
                    <p className="font-black text-2xl text-blue-600">{getDailyStats().sales.toLocaleString()} MT</p>
                 </div>
                 <div className="bg-emerald-50 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Saldo Atual em Caixa</p>
                    <p className="font-black text-2xl text-emerald-700">{getDailyStats().currentBalance.toLocaleString()} MT</p>
                 </div>
              </div>

              <div className="mt-6">
                 <Button onClick={() => setStatsModalOpen(false)} className="w-full bg-slate-800 hover:bg-slate-900 font-bold h-12 rounded-xl">Fechar Visualização</Button>
              </div>
           </Card>
        </div>
      )}

      {/* MODAL: RECIBO IMPRESSÃO */}
      {receiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print:bg-white print:p-0">
           <Card className="w-full max-w-sm bg-white border-0 shadow-2xl rounded-2xl p-6 print:shadow-none print:w-[300px] print:max-w-none print:p-0 print:m-0">
              <div className="print:hidden flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                 <h3 className="font-black text-slate-800">Recibo Emitido</h3>
                 <Button variant="ghost" size="sm" onClick={() => setReceiptModalOpen(false)} className="h-8">Fechar</Button>
              </div>
              
              {/* O RECIBO EM SI */}
              <div className="font-mono text-sm print:text-xs">
                 <div className="text-center mb-4 border-b border-dashed border-slate-300 pb-4">
                    {printSettings?.showLogo && sysSettings?.logoDataUrl && (
                      <img src={sysSettings.logoDataUrl} alt="Logo" className="h-10 mx-auto mb-2 grayscale" />
                    )}
                    <h2 className="font-bold text-lg leading-tight uppercase">{sysSettings?.companyName || 'EMPRESA'}</h2>
                    {printSettings?.showAddress && sysSettings?.address && <p className="text-xs mt-1">{sysSettings.address}</p>}
                    {printSettings?.showNuit && sysSettings?.nuit && <p className="text-xs mt-1">NUIT: {sysSettings.nuit}</p>}
                 </div>
                 
                 <div className="mb-4">
                    <p className="text-xs mb-1">Data: {new Date().toLocaleString()}</p>
                    <p className="text-xs mb-1">Operador: {user.name}</p>
                    <p className="text-xs mb-1">Método: {lastPaymentMethod}</p>
                 </div>
                 
                 <div className="border-b border-dashed border-slate-300 pb-2 mb-2">
                    <div className="flex justify-between font-bold text-xs mb-2">
                       <span>Qtd x Item</span>
                       <span>Subt.</span>
                    </div>
                    {lastCart.map(c => (
                      <div key={c.cartId} className="flex justify-between text-xs mb-1">
                         <span>{c.cartQuantity}x {c.name.substring(0, 15)}</span>
                         <span>{(c.globalPrice * c.cartQuantity).toLocaleString()}</span>
                      </div>
                    ))}
                 </div>
                 <div className="flex justify-between font-bold text-base mt-2">
                    <span>TOTAL:</span>
                    <span>{lastTotal.toLocaleString()} MT</span>
                 </div>
                 
                 {printSettings?.customReceiptMessage && (
                   <div 
                     className="mt-4 text-xs whitespace-pre-wrap"
                     dangerouslySetInnerHTML={{__html: printSettings.customReceiptMessage
                        .replace('{{data}}', new Date().toLocaleDateString())
                        .replace('{{hora}}', new Date().toLocaleTimeString())
                        .replace('{{operador}}', user.name)
                        .replace('{{impostos}}', 'IVA Incluído à taxa legal em vigor')
                     }}
                   />
                 )}
                 
                 <div className="text-center mt-6 text-xs text-slate-500">
                    Obrigado pela preferência!
                 </div>
              </div>
              
              <div className="mt-6 print:hidden flex gap-3">
                 <Button onClick={() => setReceiptModalOpen(false)} variant="outline" className="flex-1 font-bold h-11 rounded-xl border-slate-200 text-slate-600">Fechar</Button>
                 <Button onClick={handlePrintReceipt} className="flex-1 bg-slate-800 hover:bg-slate-900 font-bold h-11 rounded-xl">Imprimir</Button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
