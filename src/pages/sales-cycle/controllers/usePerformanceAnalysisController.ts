import { useState, useMemo } from 'react';
import { getBranchesPerformance, getOperatorsPerformance, BranchPerformance, OperatorPerformance } from '../models/PerformanceAnalysisModel';
import { useSalesCycleContext } from '../SalesCycleContext';

export function usePerformanceAnalysisController() {
  const { branchId, period } = useSalesCycleContext();
  const [comparisonReference, setComparisonReference] = useState('mes');
  
  const branchesPerformance: BranchPerformance[] = useMemo(() => {
     let perf = getBranchesPerformance();
     if (branchId !== 'global') {
        perf = perf.filter(b => b.id === branchId);
        // adjust percentage to 100% relative base
        perf = perf.map(b => ({...b, percentage: 100}));
     }
     return perf;
  }, [branchId]);

  const operatorsPerformance: OperatorPerformance[] = useMemo(() => {
     let ops = getOperatorsPerformance();
     if (branchId !== 'global') {
         // mock finding branch name (already mapped in models but simplified here. Usually we'd map via IDs)
         // we'll just show fewer operators
         ops = ops.slice(0, 3).map((op, i) => ({...op, r: i+1}));
     }
     return ops;
  }, [branchId]);

  return {
    period: comparisonReference,
    setPeriod: setComparisonReference,
    branchesPerformance,
    operatorsPerformance
  };
}
