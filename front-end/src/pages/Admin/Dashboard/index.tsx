import styles from "./Dashboard.module.css";

import RegisterAdminModal from "@/components/admin/admins/modals/RegisterAdminModal";

import AdmDashboardCards from "@/components/admin/dashboard/DashboardCards";
import AdmDashboardChart from "@/components/admin/dashboard/DashboardChart";
import AdmDashboardHistory from "@/components/admin/dashboard/DashboardHistory";
import AdmQuickActions from "@/components/admin/dashboard/QuickActions";
import AdmUpcomingEvents from "@/components/admin/dashboard/UpcomingEvents";

import AdminHeader from "@/components/layouts/AdminLayout/AdminHeader";

import useAdminDashboard from "@/hooks/admin/useAdminDashboard";

export default function AdminDashboard() {
  const {
    cards,
    charts,
    history,
    upcomingEvents,

    showNewAdminModal,
    isRegistering,

    openRegisterModal,
    closeRegisterModal,

    openEvents,
    openPendingArtworks,

    handleRegisterAdmin,
  } = useAdminDashboard();

  return (
    <>
      <AdminHeader />

      <div className={styles.main}>
        <AdmDashboardCards {...cards} />

        <div className={styles.dashboardGrid}>
          <div className={styles.charts}>
            <AdmDashboardChart
              title="Obras por Status"
              subtitle="Distribuição atual do acervo"
              data={charts.obrasPorStatus}
            />

            <AdmDashboardChart
              title="Eventos por Tipo"
              subtitle="Eventos cadastrados"
              data={charts.eventosPorTipo}
              type="bar"
            />
          </div>

          <AdmQuickActions
            onRegisterAdmin={openRegisterModal}
            onOpenEvents={openEvents}
            onOpenPendingArtworks={openPendingArtworks}
          />
        </div>

        <div className={styles.bottomGrid}>
          <AdmDashboardHistory items={history} />

          <AdmUpcomingEvents
            events={upcomingEvents}
            onViewAll={openEvents}
          />
        </div>
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