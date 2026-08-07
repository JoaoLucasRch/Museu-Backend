import { prisma } from "@/prisma";
import { Role, StatusObra } from "@prisma/client";

interface DashboardHistoryItem {
  id: string;
  icon: string;
  title: string;
  date: Date;
}

export class DashboardService {
  static async getDashboard() {
    const agora = new Date();

    const trintaDias = new Date();
    trintaDias.setDate(trintaDias.getDate() - 30);

    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];


    const [
      totalEventos,
      totalObras,
      editaisAtivos,
      obrasPendentes,

      obrasPorStatusRaw,

      eventosRecentes,
      obrasRecentes,
      usuariosRecentes,
      proximosEventos,

      submissoesPorMesRaw,
      eventosMaisSubmissoes,

      obrasEnviadas,
      aprovadas,
      rejeitadas,
      expostas,
      eventosCriados,

    ] = await Promise.all([


      prisma.evento.count(),


      prisma.obra.count(),


      prisma.evento.count({
        where:{
          eh_edital:true,
          inicio_submissao:{
            lte:agora,
          },
          fim_submissao:{
            gte:agora,
          },
        },
      }),


      prisma.obra.count({
        where:{
          status:StatusObra.pendente,
        },
      }),



      prisma.obra.groupBy({
        by:["status"],
        _count:{
          status:true,
        },
      }),



      prisma.evento.findMany({
        take:10,

        orderBy:{
          criado_em:"desc",
        },

        select:{
          id_evento:true,
          titulo_evento:true,
          criado_em:true,
        },
      }),



      prisma.obra.findMany({
        take:10,

        orderBy:{
          data_envio:"desc",
        },

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



      prisma.usuario.findMany({
        take:10,

        orderBy:{
          created_at:"desc",
        },

        select:{
          id:true,
          nome:true,
          role:true,
          created_at:true,
        },
      }),



      prisma.evento.findMany({

        take:5,

        where:{
          data_hora_inicio:{
            gte:agora,
          },
        },

        orderBy:{
          data_hora_inicio:"asc",
        },

        select:{
          id_evento:true,
          titulo_evento:true,
          data_hora_inicio:true,
        },

      }),



      prisma.$queryRaw<
        {
          mes:number;
          total:bigint;
        }[]
      >`

        SELECT

          MONTH(data_envio) AS mes,

          COUNT(*) AS total

        FROM obras

        WHERE YEAR(data_envio) = YEAR(CURRENT_DATE())

        GROUP BY MONTH(data_envio)

        ORDER BY mes;

      `,



      prisma.evento.findMany({

        take:5,

        orderBy:{
          obras_editais:{
            _count:"desc",
          },
        },

        select:{
          id_evento:true,

          titulo_evento:true,

          _count:{
            select:{
              obras_editais:true,
            },
          },
        },

      }),



      prisma.obra.count({
        where:{
          data_envio:{
            gte:trintaDias,
          },
        },
      }),



      prisma.obra.count({
        where:{
          status:StatusObra.aprovada,

          data_envio:{
            gte:trintaDias,
          },
        },
      }),



      prisma.obra.count({
        where:{
          status:StatusObra.rejeitada,

          data_envio:{
            gte:trintaDias,
          },
        },
      }),



      prisma.obra.count({
        where:{
          status:StatusObra.exposta,

          data_envio:{
            gte:trintaDias,
          },
        },
      }),



      prisma.evento.count({
        where:{
          criado_em:{
            gte:trintaDias,
          },
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




    const history:DashboardHistoryItem[]=[


      ...eventosRecentes.map(evento=>({

        id:`evento-${evento.id_evento}`,

        icon:"EVENT",

        title:
          `Evento "${evento.titulo_evento}" criado`,

        date:evento.criado_em,

      })),



      ...obrasRecentes.map(obra=>({

        id:`obra-${obra.id_obra}`,

        icon:"IMAGE",

        title:
          `${obra.artista.nome} submeteu "${obra.titulo_obra}"`,

        date:obra.data_envio,

      })),



      ...usuariosRecentes.map(usuario=>({

        id:`usuario-${usuario.id}`,

        icon:
          usuario.role === Role.ADMIN
          ? "ADMIN"
          : "USER",


        title:
          usuario.role === Role.ADMIN

          ? `Novo administrador "${usuario.nome}" cadastrado`

          : `Novo artista "${usuario.nome}" cadastrado`,


        date:usuario.created_at,

      })),



    ]

    .sort(
      (a,b)=>
        b.date.getTime() -
        a.date.getTime()
    )

    .slice(0,6);




    const submissoesPorMes =
      meses.map((mes,index)=>{


        const registro =
          submissoesPorMesRaw.find(
            item =>
              Number(item.mes) === index + 1
          );


        return {

          label:mes,

          value:
            Number(
              registro?.total ?? 0
            ),

        };

      });




    const eventosMaisAtivos =
      eventosMaisSubmissoes.map(evento=>({

        id:evento.id_evento,

        titulo:evento.titulo_evento,

        total:
          evento._count.obras_editais,

      }));




    const resumo30Dias={

      obrasEnviadas,

      aprovadas,

      rejeitadas,

      expostas,

      eventosCriados,

    };




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

      },


      activity:{

        submissoesPorMes,

        eventosMaisAtivos,

        resumo30Dias,

      },


      history,


      upcomingEvents,

    };

  }
}