import {
  CalendarDays,
  Image,
  FileText,
  Clock3,
} from "lucide-react";

import styles from "./DashboardCards.module.css";

interface DashboardCardsProps{
  totalEventos:number;
  totalObras:number;
  editaisAtivos:number;
  obrasPendentes:number;
}

export default function AdmDashboardCards({
  totalEventos,
  totalObras,
  editaisAtivos,
  obrasPendentes,
}:DashboardCardsProps){

  const cards=[
    {
      title:"Eventos",
      value:totalEventos,
      info:"Eventos cadastrados",
      icon:CalendarDays,
      className:styles.events,
    },
    {
      title:"Obras",
      value:totalObras,
      info:"Obras cadastradas",
      icon:Image,
      className:styles.artworks,
    },
    {
      title:"Editais Ativos",
      value:editaisAtivos,
      info:"Recebendo submissões",
      icon:FileText,
      className:styles.notices,
    },
    {
      title:"Obras Pendentes",
      value:obrasPendentes,
      info:"Aguardando aprovação",
      icon:Clock3,
      className:styles.pending,
    },
  ];

  return(
    <section className={styles.cards}>

      {cards.map(card=>{

        const Icon=card.icon;

        return(
          <article
            key={card.title}
            className={`${styles.card} ${card.className}`}
          >

            <div className={styles.header}>

              <span>{card.title}</span>

              <div className={styles.icon}>
                <Icon size={19}/>
              </div>

            </div>

            <strong>{card.value}</strong>

            <small>{card.info}</small>

          </article>
        );

      })}

    </section>
  );
}