export interface BranchPerformance {
  id: string;
  name: string;
  revenue: string;
  percentage: number;
  trend: 'up' | 'down';
  trendValue: number;
}

export interface OperatorPerformance {
  name: string;
  f: string;
  v: string;
  t: string;
  r: number;
}

export const getBranchesPerformance = (): BranchPerformance[] => [
  { id: '1', name: 'Sede (Montepuez)', revenue: '4,200,000 MZN', percentage: 100, trend: 'up', trendValue: 8 },
  { id: '3', name: 'Filial Nampula', revenue: '2,850,000 MZN', percentage: 65, trend: 'up', trendValue: 12 },
  { id: '2', name: 'Filial Beira', revenue: '850,000 MZN', percentage: 20, trend: 'down', trendValue: 4 },
];

export const getOperatorsPerformance = (): OperatorPerformance[] => [
  { name: 'Márcio N.', f: 'Sede', v: '1,200,000 MZN', t: '1,450 MZN', r: 1 },
  { name: 'Ana B.', f: 'Sede', v: '980,000 MZN', t: '1,100 MZN', r: 2 },
  { name: 'Carlos D.', f: 'Nampula', v: '950,000 MZN', t: '1,300 MZN', r: 3 },
  { name: 'Joana P.', f: 'Nampula', v: '820,000 MZN', t: '950 MZN', r: 4 },
];
