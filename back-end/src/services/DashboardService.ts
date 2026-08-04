import { prisma } from "@/prisma";
import { StatusObra } from "@prisma/client";

interface DashboardChartItem {
  label: string;
  value: number;
}

interface DashboardHistoryItem {
  id: number;
  icon: string;
  title: string;
  date: Date;
}

interface UpcomingEventItem {
  id: number;
  title: string;
  date: Date;
}

export class DashboardService {
  static async getDashboard() {
    const agora = new Date();

    const [
      totalEventos,
      totalObras,
      editaisAtivos,
      obrasPendentes,
      obrasPorStatusRaw,
      eventosRecentes,
      obrasRecentes,
      proximosEventos,
    ] = await Promise.all([
      prisma.evento.count(),

      prisma.obra.count(),

      prisma.evento.count({
        where: {
          eh_edital: true,
          inicio_submissao: {
            lte: agora,
          },
          fim_submissao: {
            gte: agora,
          },
        },
      }),

      prisma.obra.count({
        where: {
          status: StatusObra.pendente,
        },
      }),

      prisma.obra.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),

      prisma.evento.findMany({
        orderBy:{
          criado_em:"desc",
        },
        take:10,
        select:{
          id_evento:true,
          titulo_evento:true,
          criado_em:true,
        },
      }),

      prisma.obra.findMany({
        orderBy:{
          data_envio:"desc",
        },
        take:10,
        select:{
          id_obra:true,
          titulo_obra:true,
          data_envio:true,
          artista:{
            select:{
              nome:true,
            },
          },
        },
      }),

      prisma.evento.findMany({
        where:{
          data_hora_inicio:{
            gte:agora,
          },
        },
        orderBy:{
          data_hora_inicio:"asc",
        },
        take:5,
        select:{
          id_evento:true,
          titulo_evento:true,
          data_hora_inicio:true,
        },
      }),
    ]);


    const obrasPorStatus =
      obrasPorStatusRaw.map(item=>({
        label:
          item.status.charAt(0).toUpperCase() +
          item.status.slice(1),

        value:item._count.status,
      }));


    const eventosPorTipoRaw =
      await prisma.evento.groupBy({
        by:["tipo_evento"],
        _count:{
          tipo_evento:true,
        },
      });


    const eventosPorTipo =
      eventosPorTipoRaw.map(item=>({
        label:item.tipo_evento,
        value:item._count.tipo_evento,
      }));


    const history:DashboardHistoryItem[]=[
      ...eventosRecentes.map(evento=>({
        id:evento.id_evento,
        icon:"EVENT",

        title:
          `Evento "${evento.titulo_evento}" criado`,

        date:evento.criado_em,
      })),

      ...obrasRecentes.map(obra=>({
        id:obra.id_obra,
        icon:"IMAGE",

        title:
          `${obra.artista.nome} submeteu "${obra.titulo_obra}"`,

        date:obra.data_envio,
      })),
    ]
    .sort(
      (a,b)=>
        b.date.getTime() -
        a.date.getTime()
    )
    .slice(0,6);


    const upcomingEvents =
      proximosEventos.map(evento=>({
        id:evento.id_evento,
        title:evento.titulo_evento,
        date:evento.data_hora_inicio,
      }));


    return {
      cards:{
        totalEventos,
        totalObras,
        editaisAtivos,
        obrasPendentes,
      },

      charts:{
        obrasPorStatus,
        eventosPorTipo,
        obrasPorMes:[],
      },

      history,

      upcomingEvents,
    };
  }
}