import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import { UserService, type RegisterAdminData } from "../../services/users/userService";
import type { UserProfile } from "@/types/User";

export default function useAdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [showNewAdminModal, setShowNewAdminModal] =
    useState(false);

  const [isRegistering, setIsRegistering] =
    useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }

    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const profile =
        await UserService.getProfile();

      setUser(profile);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

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
    isLoading,
    updateUser,
    showNewAdminModal,
    isRegistering,
    openRegisterModal,
    closeRegisterModal,
    handleRegisterAdmin,
    fetchUserData,
  };
}