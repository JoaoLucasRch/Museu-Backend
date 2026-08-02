import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Image,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import styles from "./AdminSidebar.module.css";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  function toggleSidebar() {
    setIsCollapsed((prev) => !prev);
  }

  return (
    <aside
      className={`${styles.sidebar} ${
        isCollapsed ? styles.collapsed : ""
      }`}
    >
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={toggleSidebar}
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
      </div>

      <nav className={styles.nav}>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
          title="Dashboard"
        >
          <LayoutDashboard size={20} />
          <span className={styles.label}>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/eventos"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
          title="Eventos"
        >
          <CalendarDays size={20} />
          <span className={styles.label}>Eventos</span>
        </NavLink>

        <NavLink
          to="/admin/obras"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
          title="Obras"
        >
          <Image size={20} />
          <span className={styles.label}>Obras</span>
        </NavLink>

        <NavLink
          to="/admin/usuarios"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
          title="Usuários"
        >
          <Users size={20} />
          <span className={styles.label}>Usuários</span>
        </NavLink>
      </nav>
    </aside>
  );
}