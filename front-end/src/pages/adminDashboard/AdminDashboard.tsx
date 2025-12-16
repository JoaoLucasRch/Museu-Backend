import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardAdmin.module.css";

// Componentes existentes
import UserProfileCard from "../../components/Profile/UserProfileCard";
import AdmEditProfileModal from "../../components/Adm/AdmEditProfileModal";
import { UserService } from "../../components/Profile/types/UserService";
import type { UserProfile } from "../../components/Profile/types/User";

// Importando o novo componente de gerenciamento de obras
import AdmObras from "../../components/Adm/AdmObras";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userRole !== "ADMIN") {
      navigate("/dashboard");
      return;
    }

    fetchUserData();
  }, [navigate]);

  async function fetchUserData() {
    try {
      const profileData = await UserService.getProfile();
      setUser(profileData);
    } catch (error) {
      console.error("Erro ao carregar perfil", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  }

  function handleProfileUpdate(updatedUser: UserProfile) {
    setUser(updatedUser);
  }

  return (
    <div className={styles.container}>
      {/* Cabeçalho com título e botão Sair no canto superior direito */}
      <div className={styles.header}>
        <h1 className={styles.title}></h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className={styles.main}>
        {/* Seção do Perfil */}
        <section className={styles.profileSection}>
          <UserProfileCard
            user={user}
            isLoading={isLoading}
            onEdit={() => setIsEditModalOpen(true)}
          />
        </section>

        {/* Seção das Obras */}
        <section className={styles.obrasSection}>
          <AdmObras />
        </section>
      </div>

      {/* Modal de Edição do Perfil */}
      <AdmEditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={user}
        onSuccess={handleProfileUpdate}
      />
    </div>
  );
}