import styles from "./Dashboard.module.css";

import RegisterAdminModal from "@/components/admin/users/modals/RegisterAdminModal";

import AdmDashboardCards from "@/components/admin/dashboard/DashboardCards";
import AdmDashboardChart from "@/components/admin/dashboard/DashboardChart";
import AdmDashboardHistory from "@/components/admin/dashboard/DashboardHistory";
import AdmQuickActions from "@/components/admin/dashboard/QuickActions";

import useAdminDashboard from "@/hooks/admin/useAdminDashboard";

export default function AdminDashboard() {
  const {
    showNewAdminModal,
    isRegistering,
    openRegisterModal,
    closeRegisterModal,
    handleRegisterAdmin,
  } = useAdminDashboard();

  return (
    <>
      <div className={styles.main}>
        <AdmDashboardCards />

        <div className={styles.dashboardGrid}>
          <AdmDashboardChart />

          <AdmQuickActions
            onRegisterAdmin={openRegisterModal}
          />
        </div>

        <AdmDashboardHistory />
      </div>

      <RegisterAdminModal
        isOpen={showNewAdminModal}
        onClose={closeRegisterModal}
        onSubmit={handleRegisterAdmin}
        isLoading={isRegistering}
      />
    </>
  );
}