import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getCurrentUser, getOpenShift, User, Shift } from '@/lib/storage';

import OpenRegister from './OpenRegister';
import Terminal from './Terminal';
import CloseRegister from './CloseRegister';

export default function POSLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [shift, setShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      setUser(currentUser);
      
      const currentShift = getOpenShift(currentUser.id);
      setShift(currentShift);
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  if (loading) return null;

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col font-sans">
      <Routes>
        <Route 
          index 
          element={
            !shift ? <OpenRegister user={user!} onOpen={() => window.location.reload()} /> : <Terminal shift={shift} user={user!} />
          } 
        />
        <Route 
          path="fechar" 
          element={
            shift ? <CloseRegister shift={shift} user={user!} onClose={() => window.location.href = '/caixa'} /> : <OpenRegister user={user!} onOpen={() => window.location.reload()} />
          } 
        />
      </Routes>
    </div>
  );
}
