import { useState } from "react";
import {
  CalendarPlus,
  ImagePlus,
  UserRound,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";

import type { DashboardHistoryItem } from "@/types/Dashboard";
import styles from "./DashboardHistory.module.css";

interface Props {
  items: DashboardHistoryItem[];
}

const ICON_MAP = {
  EVENT: {
    component: CalendarPlus,
    className: styles.eventIcon,
  },
  IMAGE: {
    component: ImagePlus,
    className: styles.imageIcon,
  },
  ADMIN: {
    component: ShieldCheck,
    className: styles.adminIcon,
  },
  USER: {
    component: UserRound,
    className: styles.userIcon,
  },
} as const;

function formatRelativeDate(date: string | Date) {
  const diff = new Date().getTime() - new Date(date).getTime();

  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return {
      text: "Agora mesmo",
      isRecent: true,
    };
  }

  if (minutes < 60) {
    return {
      text: `Há ${minutes} min`,
      isRecent: true,
    };
  }

  if (hours < 24) {
    return {
      text: `Há ${hours}h`,
      isRecent: false,
    };
  }

  if (days < 7) {
    return {
      text: `Há ${days}d`,
      isRecent: false,
    };
  }

  return {
    text: new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }),
    isRecent: false,
  };
}

export default function AdmDashboardHistory({
  items = [],
}: Props) {
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, 4);

  return (
    <section className={styles.historyCard}>
      <header className={styles.header}>
        <div className={styles.titleBadge}>
          <div className={styles.historyIconWrapper}>
            <Clock size={16} strokeWidth={2.2} />
          </div>

          <div>
            <h2 className={styles.title}>
              Atividades Recentes
            </h2>

            <p className={styles.subtitle}>
              Últimas ações executadas na plataforma
            </p>
          </div>
        </div>
      </header>

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <Clock size={20} strokeWidth={2} />
          </div>

          <div className={styles.emptyText}>
            <strong>Nenhuma atividade</strong>
            <span>
              As ações recentes aparecerão aqui.
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`${styles.timeline} ${
            showAll ? styles.timelineExpanded : ""
          }`}
        >
          {visibleItems.map((activity, index) => {
            const config =
              ICON_MAP[
                activity.icon as keyof typeof ICON_MAP
              ] || ICON_MAP.USER;

            const Icon = config.component;
            const dateInfo = formatRelativeDate(activity.date);

            return (
              <article
                key={activity.id}
                className={styles.item}
                style={
                  {
                    "--item-delay": `${index * 70}ms`,
                  } as React.CSSProperties
                }
              >
                <div
                  className={`${styles.timelineNode} ${config.className}`}
                >
                  <div className={styles.iconWrapper}>
                    <Icon
                      size={17}
                      strokeWidth={2.25}
                    />
                  </div>
                </div>

                <div className={styles.content}>
                  <p className={styles.activityTitle}>
                    {activity.title}
                  </p>

                  <time
                    className={`${styles.dateBadge} ${
                      dateInfo.isRecent
                        ? styles.recentBadge
                        : ""
                    }`}
                    dateTime={new Date(
                      activity.date
                    ).toISOString()}
                  >
                    {dateInfo.isRecent && (
                      <span className={styles.liveDot} />
                    )}

                    {dateInfo.text}
                  </time>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {items.length > 4 && (
        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowAll((current) => !current)}
            aria-expanded={showAll}
          >
            <span>
              {showAll
                ? "Mostrar menos"
                : `Ver todas as atividades (${items.length})`}
            </span>

            <span className={styles.toggleIcon}>
              {showAll ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </span>
          </button>
        </footer>
      )}
    </section>
  );
}