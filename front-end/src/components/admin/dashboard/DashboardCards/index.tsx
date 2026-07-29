import {
  CalendarDays,
  Image,
  Palette,
  ShieldCheck,
} from "lucide-react";

import styles from "./DashboardCards.module.css";

const cards = [
  {
    title: "Eventos",
    value: 12,
    info: "+2 este mês",
    icon: CalendarDays,
  },
  {
    title: "Obras",
    value: 84,
    info: "15 pendentes",
    icon: Image,
  },
  {
    title: "Artistas",
    value: 31,
    info: "+4 cadastrados",
    icon: Palette,
  },
  {
    title: "Administradores",
    value: 4,
    info: "Todos ativos",
    icon: ShieldCheck,
  },
];

export default function AdmDashboardCards() {
  return (
    <section className={styles.cards}>
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className={styles.card}
          >
            <div className={styles.header}>
              <span>{card.title}</span>

              <div className={styles.icon}>
                <Icon size={20} />
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