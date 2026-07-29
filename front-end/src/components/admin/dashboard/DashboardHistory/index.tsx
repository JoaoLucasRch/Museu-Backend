import {
  CalendarPlus,
  ImagePlus,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import styles from "./DashboardHistory.module.css";

const activities = [
  {
    icon: CalendarPlus,
    title: "Novo evento criado",
    description: "Exposição de Arte Contemporânea",
    time: "Há 10 minutos",
  },
  {
    icon: ImagePlus,
    title: "Obra enviada",
    description: "Aguardando aprovação do administrador",
    time: "Há 35 minutos",
  },
  {
    icon: ShieldCheck,
    title: "Administrador cadastrado",
    description: "Novo administrador registrado no sistema",
    time: "Hoje • 09:20",
  },
  {
    icon: UserRound,
    title: "Perfil atualizado",
    description: "Um artista atualizou suas informações",
    time: "Ontem • 16:45",
  },
];

export default function AdmDashboardHistory() {
  return (
    <section className={styles.history}>
      <header className={styles.header}>
        <h2>Atividades Recentes</h2>

        <span>Últimas ações do sistema</span>
      </header>

      <div className={styles.timeline}>
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <article
              key={index}
              className={styles.item}
            >
              <div className={styles.icon}>
                <Icon size={18} />
              </div>

              <div className={styles.content}>
                <strong>{activity.title}</strong>

                <p>{activity.description}</p>

                <small>{activity.time}</small>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}