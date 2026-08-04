import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  UserService,
  type RegisterAdminData,
} from "@/services/users/userService";

import { DashboardService } from "@/services/dashboard/dashboardService";

import type { UserProfile } from "@/types/User";

import type {
  DashboardCardsData,
  DashboardChartsData,
  DashboardHistoryItem,
  UpcomingEventItem,
} from "@/types/Dashboard";

export default function useAdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [cards, setCards] =
    useState<DashboardCardsData>({
      totalEventos: 0,
      totalObras: 0,
      editaisAtivos: 0,
      obrasPendentes: 0,
    });

  const [charts, setCharts] =
    useState<DashboardChartsData>({
      obrasPorStatus: [],
      eventosPorTipo: [],
      obrasPorMes: [],
    });

  const [history, setHistory] =
    useState<DashboardHistoryItem[]>([]);

  const [upcomingEvents, setUpcomingEvents] =
    useState<UpcomingEventItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [showNewAdminModal, setShowNewAdminModal] =
    useState(false);

  const [isRegistering, setIsRegistering] =
    useState(false);

  const fetchUserData =
    useCallback(async () => {
      try {
        const profile =
          await UserService.getProfile();

        setUser(profile);
      } catch (error) {
        console.error(error);
      }
    }, []);

  const fetchDashboard =
    useCallback(async () => {
      try {
        const dashboard =
          await DashboardService.getDashboard();

        setCards(dashboard.cards);
        setCharts(dashboard.charts);
        setHistory(dashboard.history);
        setUpcomingEvents(
          dashboard.upcomingEvents
        );
      } catch (error) {
        console.error(error);
      }
    }, []);

  const initialize =
    useCallback(async () => {
      setIsLoading(true);

      try {
        await Promise.all([
          fetchUserData(),
          fetchDashboard(),
        ]);
      } finally {
        setIsLoading(false);
      }
    }, [
      fetchUserData,
      fetchDashboard,
    ]);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const role =
      localStorage.getItem("userRole");

    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }

    initialize();
  }, [initialize, navigate]);

  function openRegisterModal() {
    setShowNewAdminModal(true);
  }

  function closeRegisterModal() {
    setShowNewAdminModal(false);
  }

  function updateUser(
    updated: UserProfile
  ) {
    setUser(updated);
  }

  function openEvents() {
    navigate("/admin/eventos");
  }

  function openPendingArtworks() {
    navigate(
      "/admin/obras?status=pendente"
    );
  }

  async function handleRegisterAdmin(
    formData: RegisterAdminData
  ) {
    setIsRegistering(true);

    try {
      const admin =
        await UserService.registerAdmin(
          formData
        );

      alert(
        `Administrador ${admin.nome} cadastrado com sucesso!`
      );

      closeRegisterModal();

      await Promise.all([
        fetchUserData(),
        fetchDashboard(),
      ]);
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Erro ao cadastrar administrador."
      );
    } finally {
      setIsRegistering(false);
    }
  }

  return {
    user,

    cards,
    charts,
    history,
    upcomingEvents,

    isLoading,
    isRegistering,

    showNewAdminModal,

    openRegisterModal,
    closeRegisterModal,

    openEvents,
    openPendingArtworks,

    updateUser,

    fetchUserData,
    fetchDashboard,

    handleRegisterAdmin,
  };
}