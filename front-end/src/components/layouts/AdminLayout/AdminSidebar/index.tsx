import {
  LayoutDashboard,
  CalendarDays,
  Image,
  Users,
  User,
  LogOut,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import type { UserProfile } from "@/types/User";

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
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
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
            <CalendarDays size={20} />
            <span>Eventos</span>
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
            <Image size={20} />
            <span>Obras</span>
          </NavLink>

          <NavLink
            to="/admin/usuarios"
            title="Usuários"
            className={({ isActive }) =>
              `${styles.link} ${
                isActive ? styles.active : ""
              }`
            }
          >
            <Users size={20} />
            <span>Usuários</span>
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
          <User size={20} />
          <span>Perfil</span>
        </NavLink>

        <div className={styles.account}>
          <strong>
            {user?.nome ?? "Administrador"}
          </strong>

          <span>
            {user?.email ?? "Sem e-mail"}
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