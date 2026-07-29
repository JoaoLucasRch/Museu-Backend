import {
  LayoutDashboard,
  CalendarDays,
  Image,
  Users,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import styles from "./AdminSidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ""}`
        }
      >
        <LayoutDashboard size={20} />
        Dashboard
      </NavLink>

      <NavLink
        to="/admin/eventos"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ""}`
        }
      >
        <CalendarDays size={20} />
        Eventos
      </NavLink>

      <NavLink
        to="/admin/obras"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ""}`
        }
      >
        <Image size={20} />
        Obras
      </NavLink>

      <NavLink
        to="/admin/usuarios"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ""}`
        }
      >
        <Users size={20} />
        Usuários
      </NavLink>
    </aside>
  );
}