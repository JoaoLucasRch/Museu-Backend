export interface UpcomingEventItem {
  id: number;
  title: string;
  date: string;
}

export interface DashboardCardsData {
  totalEventos: number;
  totalObras: number;
  editaisAtivos: number;
  obrasPendentes: number;
}


export interface DashboardChartData {
  label: string;
  value: number;
}


export interface DashboardChartsData {
  obrasPorStatus: DashboardChartData[];

  eventosPorTipo: DashboardChartData[];

  obrasPorMes: DashboardChartData[];
}


export interface DashboardHistoryItem {
  id: number;

  icon: string;

  title: string;

  description: string;

  responsible: string;

  date: string;
}


export interface DashboardData {
  cards: DashboardCardsData;

  charts: DashboardChartsData;

  history: DashboardHistoryItem[];

  upcomingEvents: UpcomingEventItem[];

}