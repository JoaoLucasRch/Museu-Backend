import {
  CalendarPlus,
  CheckCircle2,
  UserPlus,
  ArrowUpRight,
} from "lucide-react";

import styles from "./QuickActions.module.css";

interface Props {
  onRegisterAdmin: () => void;
  onOpenEvents: () => void;
  onOpenPendingArtworks: () => void;
}

export default function AdmQuickActions({
  onRegisterAdmin,
  onOpenEvents,
  onOpenPendingArtworks,
}: Props) {
  const actions = [
    {
      label: "Novo Evento",
      icon: CalendarPlus,
      action: onOpenEvents,
    },
    {
      label: "Obras Pendentes",
      icon: CheckCircle2,
      action: onOpenPendingArtworks,
    },
    {
      label: "Cadastrar Admin",
      icon: UserPlus,
      action: onRegisterAdmin,
    },
  ];

  return (
    <section className={styles.actionsSection}>
      <header className={styles.header}>
        <h2>AÇÕES RÁPIDAS</h2>

        <p>
          Acesse rapidamente as principais áreas administrativas.
        </p>
      </header>


      <div className={styles.actions}>
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={item.action}
              className={styles.actionButton}
            >
              <div className={styles.left}>
                <Icon size={18} />

                <span>
                  {item.label}
                </span>
              </div>


              <ArrowUpRight
                size={18}
                className={styles.arrow}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}