import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, CheckCircle, ShieldCheck, PieChart } from 'lucide-react';
import { Input } from '@/pages/hr/ui/input';
import { Button } from '@/pages/hr/ui/button';
import { Card, CardContent } from '@/pages/hr/ui/card';

import { loginUser } from '@/lib/storage';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simulate login checking username and password via our storage mock
    const success = loginUser(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Credenciais inválidas. Verifique seu e-mail e palavra-passe.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative z-10">
          <div className="max-w-sm mx-auto w-full">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full border-4 border-blue-600 bg-blue-50 flex flex-col items-center justify-center text-blue-600 shadow-sm relative overflow-hidden mb-6">
                <svg viewBox="0 0 100 100" className="w-20 h-20 fill-current opacity-20 absolute -bottom-4">
                  <path d="M50 20 L20 60 L80 60 Z"/>
                </svg>
                <div className="font-bold text-3xl tracking-tighter">GAMS</div>
                <div className="text-[10px] font-semibold uppercase tracking-widest mt-1">Talho EI</div>
              </div>
              <h1 className="text-3xl font-bold text-slate-800">Bem-vindo de <span className="text-blue-600">volta!</span></h1>
              <p className="text-slate-500 mt-2 text-sm">Faça login para acessar o sistema.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg font-medium">{error}</div>}
              <Input
                type="text"
                placeholder="Usuário ou e-mail"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User className="h-4 w-4" />}
                className="h-11"
                required
              />
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                className="h-11"
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-slate-600 cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  Lembrar-me
                </label>
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Esqueci minha senha</a>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-medium rounded-lg">
                Entrar
              </Button>
            </form>

            <div className="mt-10 grid grid-cols-3 gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-700">Segurança</span>
                <span className="text-[9px] text-slate-500 leading-tight">Dados protegidos</span>
              </div>
              <div className="flex flex-col items-center border-x border-slate-200">
                <CheckCircle className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-700">Praticidade</span>
                <span className="text-[9px] text-slate-500 leading-tight">Tudo que precisa</span>
              </div>
              <div className="flex flex-col items-center">
                <PieChart className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-[10px] font-bold text-slate-700">Gestão</span>
                <span className="text-[9px] text-slate-500 leading-tight">Controle total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image/Visuals */}
        <div className="w-full md:w-1/2 relative bg-slate-900 hidden md:flex items-center justify-center overflow-hidden shrink-0" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)' }}>
          <div className="absolute inset-0 bg-slate-900 mix-blend-multiply opacity-20 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&q=80&w=1000" 
            alt="Cow in green pasture" 
            className="absolute inset-0 w-full h-full object-cover opacity-100 transition-transform duration-700 hover:scale-105"
          />
          <div className="relative z-20 text-center text-white p-8 max-w-sm mt-auto mb-10 text-left">
             <h2 className="text-2xl font-bold mb-2 text-white">Talho GAMS EI</h2>
             <p className="text-slate-200 text-sm font-medium">O melhor e mais seguro sistema de gerenciamento de açougue.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
