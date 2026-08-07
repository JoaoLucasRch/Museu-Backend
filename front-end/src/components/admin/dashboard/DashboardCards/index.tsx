import {
  CalendarDays,
  Image as ImageIcon,
  FileText,
  Clock3,
} from "lucide-react";

import styles from "./DashboardCards.module.css";

interface DashboardCardsProps {
  totalEventos: number;
  totalObras: number;
  editaisAtivos: number;
  obrasPendentes: number;
}

export default function AdmDashboardCards({
  totalEventos,
  totalObras,
  editaisAtivos,
  obrasPendentes,
}: DashboardCardsProps) {
  const cards = [
    {
      id: "eventos",
      title: "Eventos",
      value: totalEventos,
      info: "Cadastrados no museu",
      icon: CalendarDays,
      variantClass: styles.eventsCard,
    },
    {
      id: "obras",
      title: "Obras",
      value: totalObras,
      info: "No acervo digital",
      icon: ImageIcon,
      variantClass: styles.artworksCard,
    },
    {
      id: "editais",
      title: "Editais Ativos",
      value: editaisAtivos,
      info: "Recebendo inscrições",
      icon: FileText,
      variantClass: styles.noticesCard,
    },
    {
      id: "pendentes",
      title: "Pendentes",
      value: obrasPendentes,
      info: "Aguardando análise",
      icon: Clock3,
      variantClass: styles.pendingCard,
    },
  ];

  return (
    <section className={styles.grid}>
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <article
            key={card.id}
            className={`${styles.card} ${card.variantClass}`}
            style={{
              animationDelay: `${index * 70}ms`,
            }}
          >
            <div className={styles.glow} />

            <div className={styles.header}>
              <div className={styles.titleGroup}>
                <span className={styles.title}>{card.title}</span>
                <span className={styles.statusDot} />
              </div>

              <div className={styles.iconWrapper}>
                <Icon size={19} strokeWidth={2} />
              </div>
            </div>

            <div className={styles.body}>
              <strong className={styles.value}>
                {new Intl.NumberFormat("pt-BR").format(card.value || 0)}
              </strong>

              <p className={styles.info}>{card.info}</p>
            </div>

            <div className={styles.accentBar} />
          </article>
        );
      })}
    </section>
  );
}

