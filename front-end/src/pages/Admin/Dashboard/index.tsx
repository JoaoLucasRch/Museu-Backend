import styles from "./Dashboard.module.css";

import RegisterAdminModal from "@/components/admin/admins/modals/RegisterAdminModal";

import AdmDashboardMonthlyActivity from "@/components/admin/dashboard/DashboardMonthlyActivity";
import AdmDashboardTopEvents from "@/components/admin/dashboard/DashboardTopEvents";
import AdmDashboardLast30Days from "@/components/admin/dashboard/DashboardLast30Days";
import AdmDashboardCards from "@/components/admin/dashboard/DashboardCards";
import AdmDashboardHistory from "@/components/admin/dashboard/DashboardHistory";
import AdmUpcomingEvents from "@/components/admin/dashboard/UpcomingEvents";

import AdminHeader from "@/components/layouts/AdminLayout/AdminHeader";

import useAdminDashboard from "@/hooks/admin/useAdminDashboard";


export default function AdminDashboard() {

  const {
    cards,
    activity,
    history,
    upcomingEvents,

    showNewAdminModal,
    isRegistering,

    closeRegisterModal,

    openEvents,

    handleRegisterAdmin,

  } = useAdminDashboard();



  return (

    <>

      <AdminHeader />


      <main className={styles.main}>


        <AdmDashboardCards
          {...cards}
        />



        <section className={styles.monthly}>

          <AdmDashboardMonthlyActivity

            data={
              activity.submissoesPorMes
            }

          />

        </section>




        <section className={styles.analytics}>


          <AdmDashboardTopEvents

            data={
              activity.eventosMaisAtivos
            }

          />


          <AdmDashboardLast30Days

            data={
              activity.resumo30Dias
            }

          />


        </section>




        <section className={styles.bottomGrid}>


          <AdmDashboardHistory

            items={history}

          />



          <AdmUpcomingEvents

            events={upcomingEvents}

            onViewAll={openEvents}

          />


        </section>


      </main>



      <RegisterAdminModal

        isOpen={showNewAdminModal}

        onClose={closeRegisterModal}

        onSubmit={handleRegisterAdmin}

        isLoading={isRegistering}

      />


    </>

  );

}