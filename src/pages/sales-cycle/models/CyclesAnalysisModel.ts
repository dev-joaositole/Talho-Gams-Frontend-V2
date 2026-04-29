export type CycleViewType = 'diario' | 'semanal' | 'mensal';

export interface CycleDailyData {
  h: string;
  v: number;
  label: string;
}

export interface CycleWeeklyData {
  d: string;
  v: number;
}

export const getDailyData = (): CycleDailyData[] => [
  {h: '08h', v: 10, label: 'Baixo'}, {h: '09h', v: 25, label: ''}, {h: '10h', v: 45, label: ''}, 
  {h: '11h', v: 65, label: ''}, {h: '12h', v: 85, label: 'Pico'}, {h: '13h', v: 75, label: ''}, 
  {h: '14h', v: 30, label: 'Morto'}, {h: '15h', v: 35, label: ''}, {h: '16h', v: 60, label: ''}, 
  {h: '17h', v: 90, label: 'Pico'}, {h: '18h', v: 100, label: 'Máx'}, {h: '19h', v: 50, label: ''}
];

export const getWeeklyData = (): CycleWeeklyData[] => [
  {d: 'Seg', v: 40}, {d: 'Ter', v: 35}, {d: 'Qua', v: 45}, 
  {d: 'Qui', v: 60}, {d: 'Sex', v: 85}, {d: 'Sáb', v: 100}, {d: 'Dom', v: 90}
];
