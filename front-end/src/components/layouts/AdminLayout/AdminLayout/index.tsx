import { Outlet, useNavigate } from "react-router-dom";

import Header from "@/components/layouts/AdminLayout/AdminHeader";
import Sidebar from "@/components/layouts/AdminLayout/AdminSidebar";

import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    navigate("/login");
  }

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.content}>
        <Header onLogout={handleLogout} />

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}