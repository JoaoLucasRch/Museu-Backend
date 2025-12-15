// src/pages/dashboard/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1. Importe o componente visual do Card
import UserProfileCard from "../../components/Profile/UserProfileCard";

// 2. Importe o NOVO Modal de Edição (ajuste o caminho se necessário)
import EditProfileModal from "../../components/Profile/EditProfileModal";

// Importe o Serviço e o Tipo
import { UserService } from "../../components/Profile/types/UserService";
import type { UserProfile } from "../../components/Profile/types/User";

import ArtworksList from "../../components/Profile/ArtworksList";

export default function Dashboard() {
  const navigate = useNavigate();

  // Estados
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Novo estado para controlar se o Modal está aberto ou fechado
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

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
    navigate("/login");
  }

  // 4. Função que atualiza a tela instantaneamente quando o modal salvar
  function handleProfileUpdate(updatedUser: UserProfile) {
    setUser(updatedUser);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Sair
        </button>
      </div>

      {/* 5. Passamos a função que abre o modal para o botão "Editar" */}
      <UserProfileCard
        user={user}
        isLoading={isLoading}
        onEdit={() => setIsEditModalOpen(true)}
      />

      {/* 6. O Modal fica aqui (invisível até isEditModalOpen virar true) */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={user}
        onSuccess={handleProfileUpdate}
      />
      <ArtworksList />
    </div>
  );
}
