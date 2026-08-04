import {
  LayoutDashboard,
  CalendarDays,
  Image,
  User,
  LogOut,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import type { UserProfile } from "@/types/User";

import { useSidebarNotifications } from "@/hooks/admin/useSidebarNotifications";

import styles from "./AdminSidebar.module.css";

interface Props {
  user: UserProfile | null;
  onLogout: () => void;
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Sidebar({
  user,
  onLogout,
  collapsed,
  onToggleSidebar,
}: Props) {
  const notifications =
    useSidebarNotifications();

  return (
    <aside
      className={`${styles.sidebar} ${
        collapsed ? styles.collapsed : ""
      }`}
    >
      <div>
        <button
          type="button"
          className={styles.collapseButton}
          onClick={onToggleSidebar}
          title={
            collapsed
              ? "Expandir menu"
              : "Recolher menu"
          }
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>

        <div className={styles.brand}>
          <h2>Museu de Marabá</h2>
          <span>Francisco Coelho</span>
        </div>

        <nav className={styles.navigation}>
          <NavLink
            to="/admin/dashboard"
            title="Dashboard"
            className={({ isActive }) =>
              `${styles.link} ${
                isActive ? styles.active : ""
              }`
            }
          >
            <div className={styles.linkContent}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </div>
            
          </NavLink>

          <NavLink
            to="/admin/eventos"
            title="Eventos"
            className={({ isActive }) =>
              `${styles.link} ${
                isActive ? styles.active : ""
              }`
            }
          >
            <div className={styles.linkContent}>
              <CalendarDays size={20} />
              <span>Eventos</span>
            </div>

            {notifications.eventos
              .novasSubmissoes > 0 && (
              <span
                className={styles.badge}
              >
                {notifications.eventos
                  .novasSubmissoes > 99
                  ? "99+"
                  : notifications.eventos
                      .novasSubmissoes}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/admin/obras"
            title="Obras"
            className={({ isActive }) =>
              `${styles.link} ${
                isActive ? styles.active : ""
              }`
            }
          >
            <div className={styles.linkContent}>
              <Image size={20} />
              <span>Obras</span>
            </div>

            {notifications.obras
              .pendentes > 0 && (
              <span
                className={styles.badge}
              >
                {notifications.obras
                  .pendentes > 99
                  ? "99+"
                  : notifications.obras
                      .pendentes}
              </span>
            )}
          </NavLink>
        </nav>
      </div>

      <div className={styles.footer}>
        <NavLink
          to="/admin/perfil"
          title="Perfil"
          className={({ isActive }) =>
            `${styles.link} ${
              isActive ? styles.active : ""
            }`
          }
        >
          <div className={styles.linkContent}>
            <User size={20} />
            <span>Perfil</span>
          </div>
        </NavLink>

        <div className={styles.account}>
          <strong>
            {user?.nome ??
              "Administrador"}
          </strong>

          <span>
            {user?.email ??
              "Sem e-mail"}
          </span>
        </div>

        <button
          type="button"
          className={styles.logout}
          onClick={onLogout}
          title="Sair"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}