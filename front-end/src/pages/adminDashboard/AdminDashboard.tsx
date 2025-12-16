import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardAdmin.module.css";

// Componentes existentes
import AdmUserProfileCard from "../../components/Adm/AdmUserProfileCard";
import AdmEditProfileModal from "../../components/Adm/AdmEditProfileModal";
import AdmRegisterForm from "../../components/Adm/AdmRegisterForm"; // Importar o novo componente
import { UserService } from "../../components/Profile/types/UserService";
import type { UserProfile } from "../../components/Profile/types/User";

// Importando o novo componente de gerenciamento de obras
import AdmObras from "../../components/Adm/AdmObras";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showNewAdminModal, setShowNewAdminModal] = useState(false); // Mudado para modal
  const [isRegistering, setIsRegistering] = useState(false);

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

  // Função para abrir o modal de novo admin
  function handleNewAdmin() {
    setShowNewAdminModal(true);
  }

  // Função para fechar o modal de novo admin
  function handleCloseNewAdminModal() {
    setShowNewAdminModal(false);
  }

  // Função para enviar o formulário de novo admin
  async function handleRegisterAdmin(formData: any) {
    setIsRegistering(true);
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:3333/auth/register-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Administrador ${data.nome} cadastrado com sucesso!`);
        handleCloseNewAdminModal(); // Fecha o modal após sucesso
      } else {
        const error = await response.json();
        alert(`Erro: ${error.message}`);
      }
    } catch (error) {
      console.error("Erro ao registrar admin:", error);
      alert("Erro ao conectar com o servidor");
    } finally {
      setIsRegistering(false);
    }
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
          <AdmUserProfileCard
            user={user}
            isLoading={isLoading}
            onEdit={() => setIsEditModalOpen(true)}
            onNewAdmin={handleNewAdmin} // Passa a função para abrir modal
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

      {/* Modal de Cadastro de Novo Administrador */}
      {showNewAdminModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.newAdminModal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Cadastrar Novo Administrador</h2>
              <button 
                onClick={handleCloseNewAdminModal}
                className={styles.closeButton}
                disabled={isRegistering}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <AdmRegisterForm
                onSubmit={handleRegisterAdmin}
                isLoading={isRegistering}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}