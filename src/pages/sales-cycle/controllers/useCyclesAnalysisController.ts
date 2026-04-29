import { useState, useMemo } from 'react';
import { CycleViewType, getDailyData, getWeeklyData } from '../models/CyclesAnalysisModel';
import { useSalesCycleContext } from '../SalesCycleContext';

export function useCyclesAnalysisController() {
  const { branchId, period } = useSalesCycleContext();
  const [view, setView] = useState<CycleViewType>('diario');

  const dailyData = useMemo(() => {
    let data = getDailyData();
    if (branchId !== 'global') {
        // Shift data to simulate different branch behavior
        // Like maputo peaks at 18h, Beira at 12h
        const shift = branchId === '2' ? -6 : (branchId === '3' ? 2 : 0);
        data = data.map((d, i, arr) => {
           let newIndex = (i + shift) % arr.length;
           if (newIndex < 0) newIndex += arr.length;
           return {
              ...d,
              v: arr[newIndex].v, // take value from shifted index
           };
        });
        
        // recompute peak labels
        data.forEach(d => d.label = '');
        const maxVal = Math.max(...data.map(d=>d.v));
        const minVal = Math.min(...data.map(d=>d.v));
        
        data.forEach(d => {
           if (d.v === maxVal) d.label = 'Máx';
           else if (d.v > maxVal * 0.8) d.label = 'Pico';
           else if (d.v === minVal) d.label = 'Morto';
        });
    }
    return data;
  }, [branchId]);

  const weeklyData = useMemo(() => {
    let data = getWeeklyData();
    if (branchId !== 'global') {
       data = data.map(d => ({
           ...d,
           v: Math.floor(d.v * (Math.random() * 0.6 + 0.4))
       }));
    }
    return data;
  }, [branchId, period]);

  return {
    view,
    setView,
    dailyData,
    weeklyData
  };
}
