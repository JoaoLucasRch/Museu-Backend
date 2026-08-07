export interface DashboardChartData {
  label: string;
  value: number;
}


/* ================= CARDS ================= */

export interface DashboardCardsData {
  totalEventos: number;
  totalObras: number;
  editaisAtivos: number;
  obrasPendentes: number;
}



/* ================= ATIVIDADES ================= */

export interface DashboardActivityMonth {
  label: string;
  value: number;
}


export interface DashboardTopEvent {
  id: number;
  titulo: string;
  total: number;
}


export interface DashboardSummary30Days {

  obrasEnviadas: number;

  aprovadas: number;

  rejeitadas: number;

  expostas: number;

  eventosCriados: number;

}



export interface DashboardActivityData {

  submissoesPorMes:
    DashboardActivityMonth[];


  eventosMaisAtivos:
    DashboardTopEvent[];


  resumo30Dias:
    DashboardSummary30Days;

}



/* ================= HISTÓRICO ================= */


export interface DashboardHistoryItem {

  id: string;

  icon: string;

  title: string;

  date: string;

}



/* ================= EVENTOS ================= */


export interface UpcomingEventItem {

  id:number;

  title:string;

  date:string;

}



/* ================= DASHBOARD ================= */


export interface DashboardChartsData {

  obrasPorStatus:
    DashboardChartData[];

}



export interface DashboardData {

  cards:
    DashboardCardsData;


  charts:
    DashboardChartsData;


  activity:
    DashboardActivityData;


  history:
    DashboardHistoryItem[];


  upcomingEvents:
    UpcomingEventItem[];

}