import {
  CalendarPlus,
  ImagePlus,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  DashboardHistoryItem,
} from "@/types/Dashboard";

import styles from "./DashboardHistory.module.css";


interface Props {
  items: DashboardHistoryItem[];
}


function formatRelativeDate(
  date: string | Date
) {
  const diff =
    new Date().getTime() -
    new Date(date).getTime();

  const minutes =
    Math.floor(diff / 1000 / 60);

  const hours =
    Math.floor(minutes / 60);

  const days =
    Math.floor(hours / 24);


  if (minutes < 1) {
    return "Agora";
  }

  if (minutes < 60) {
    return `Há ${minutes} min`;
  }

  if (hours < 24) {
    return `Há ${hours}h`;
  }

  if (days < 7) {
    return `Há ${days}d`;
  }

  return new Date(date).toLocaleDateString(
    "pt-BR"
  );
}


function getIcon(
  type: string
) {
  switch (type) {
    case "EVENT":
      return CalendarPlus;

    case "IMAGE":
      return ImagePlus;

    case "USER":
      return UserRound;

    default:
      return UserRound;
  }
}


export default function AdmDashboardHistory({
  items,
}: Props) {

  const [
    showAll,
    setShowAll,
  ] = useState(false);


  const visibleItems =
    showAll
      ? items
      : items.slice(0, 3);


  return (
    <section className={styles.history}>

      <header className={styles.header}>
        <div>
          <h2>
            Atividades Recentes
          </h2>

          <span>
            Últimas ações do sistema
          </span>
        </div>
      </header>


      <div className={styles.timeline}>

        {visibleItems.map(
          activity => {

            const Icon =
              getIcon(activity.icon);


            return (
              <article
                key={activity.id}
                className={styles.item}
              >

                <div
                  className={`${styles.icon} ${activity.icon === "EVENT"
                      ? styles.eventIcon
                      : activity.icon === "IMAGE"
                        ? styles.imageIcon
                        : styles.userIcon
                    }`}
                >
                  <Icon size={14} />
                </div>


                <div className={styles.content}>

                  <strong>
                    {activity.title}
                  </strong>

                  <p>
                    {activity.description}
                  </p>

                  <div className={styles.meta}>
                    <span>
                      {activity.responsible}
                    </span>

                    <small>
                      {formatRelativeDate(activity.date)}
                    </small>
                  </div>

                </div>

              </article>
            );

          }
        )}

      </div>


      {
        items.length > 3 && (
          <button
            className={styles.moreLink}
            onClick={() =>
              setShowAll(!showAll)
            }
          >
            {
              showAll
                ? "Mostrar menos"
                : "Ver todas"
            }
          </button>
        )
      }

    </section>
  );
}