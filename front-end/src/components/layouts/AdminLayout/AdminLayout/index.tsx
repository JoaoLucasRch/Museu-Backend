import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "@/components/layouts/AdminLayout/AdminHeader";
import Sidebar from "@/components/layouts/AdminLayout/AdminSidebar";

import type { UserProfile } from "@/types/User";
import { UserService } from "@/services/users/userService";

import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("admin-sidebar-collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem(
      "admin-sidebar-collapsed",
      String(collapsed)
    );
  }, [collapsed]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await UserService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("userRole");

        navigate("/login");
      }
    }

    loadProfile();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    navigate("/login");
  }

  return (
    <div className={styles.layout}>
      <Sidebar
        user={user}
        onLogout={handleLogout}
        collapsed={collapsed}
        onToggleSidebar={() =>
          setCollapsed((value) => !value)
        }
      />

      <div
        className={`${styles.content} ${
          collapsed ? styles.contentCollapsed : ""
        }`}
      >
        <Header />

        <main className={styles.main}>
          <Outlet
            context={{
              user,
              setUser,
            }}
          />
        </main>
      </div>
    </div>
  );
}