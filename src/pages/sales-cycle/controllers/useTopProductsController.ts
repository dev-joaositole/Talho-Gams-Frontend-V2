import { useState, useMemo } from 'react';
import { getTopProducts, ProductRanking } from '../models/TopProductsModel';
import { useSalesCycleContext } from '../SalesCycleContext';

export function useTopProductsController() {
  const { period, setPeriod, branchId } = useSalesCycleContext();
  
  // Simulated dependency on branch/period
  const products: ProductRanking[] = useMemo(() => {
    let allProducts = getTopProducts();
    
    // Simulate branch localized data differences
    if (branchId !== 'global') {
       // Shake up the rankings completely for demonstration
       allProducts = allProducts.map(p => ({
           ...p,
           qty: Math.floor(p.qty * (Math.random() * 0.8 + 0.2)),
           revenue: Math.floor(p.revenue * (Math.random() * 0.8 + 0.2)),
           trend: Math.random() > 0.5 ? 'up' : (Math.random() > 0.5 ? 'down' : 'stable') as 'up'|'down'|'stable',
           status: Math.random() > 0.8 ? 'fast_selling' : 'normal' as 'normal'|'fast_selling'|'slow'
       })).sort((a, b) => b.revenue - a.revenue);
    }
    
    return allProducts;
  }, [branchId, period]);

  return {
    period,
    setPeriod, // optionally still allow local override, but better to use global context
    products
  };
}
