/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/pages/hr/ui/sonner';
import { SettingsProvider } from '@/contexts/SettingsContext';
import Login from './pages/Login';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Finance from './pages/Finance';
import HR from './pages/HR';
import SalesCycle from './pages/SalesCycle';
import Trading from './pages/Trading';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import POSLayout from './pages/pos/POSLayout';

export default function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Módulo Isolado Ponto de Venda / Caixa */}
          <Route path="/caixa/*" element={<POSLayout />} />

          {/* Main Application Layout mapping */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard/*" element={<Dashboard />} />
            <Route path="produtos/*" element={<Products />} />
            <Route path="financeiro/*" element={<Finance />} />
            <Route path="rh/*" element={<HR />} />
            <Route path="ciclo-vendas/*" element={<SalesCycle />} />
            <Route path="compras-vendas/*" element={<Trading />} />
            <Route path="admin/*" element={<Admin />} />
            <Route path="configuracoes/*" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" duration={4000} className="mt-4 mr-4" />
    </SettingsProvider>
  );
}

