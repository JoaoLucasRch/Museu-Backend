import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./ArtistDashboard.module.css";

import UserProfileCard from "@/components/artist/profile";
import EditProfileModal from "@/components/artist/modals/EditProfileModal";
import ArtworksList from "@/components/artist/artworks/ArtworkList";

import { UserService } from "@/services/users/userService";
import type { UserProfile } from "@/types/User";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  async function fetchUserData() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const profileData = await UserService.getProfile();

      // Caso um administrador tente acessar esta tela
      if (profileData.role === "ADMIN") {
        localStorage.setItem("userRole", profileData.role);
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // Usuário válido
      localStorage.setItem("userRole", profileData.role);
      setUser(profileData);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);

      // Token inválido ou expirado
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");

      navigate("/login", { replace: true });
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    navigate("/login", { replace: true });
  }

  function handleProfileUpdate(updatedUser: UserProfile) {
    setUser(updatedUser);
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <UserProfileCard
          user={user}
          isLoading={isLoading}
          onEdit={() => setIsEditModalOpen(true)}
          onLogout={handleLogout}
        />

        {!isLoading && user && (
          <ArtworksList />
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={user}
        onSuccess={handleProfileUpdate}
      />
    </div>
  );
}