import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardAdmin.module.css";

// Componentes existentes
import AdmUserProfileCard from "../../components/Adm/AdmUserProfileCard";
import AdmEditProfileModal from "../../components/Adm/AdmEditProfileModal";
import AdmRegisterForm from "../../components/Adm/AdmRegisterForm";
import { UserService } from "../../components/Profile/types/UserService";
import type { UserProfile } from "../../components/Profile/types/User";


// Importando o componente de gerenciamento de obras
import AdmObras from "../../components/Adm/AdmObras";
import AdmEventos from "../../components/Adm/AdmEventos";

// Definindo os tipos aceitos pela nossa navegação deslizante
type TabType = "insights" | "obras" | "eventos";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showNewAdminModal, setShowNewAdminModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // NOVO: Estado para controlar qual aba/página está ativa (iniciando em 'obras')
  const [activeTab, setActiveTab] = useState<TabType>("obras");

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

  function handleNewAdmin() {
    setShowNewAdminModal(true);
  }

  function handleCloseNewAdminModal() {
    setShowNewAdminModal(false);
  }

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
        handleCloseNewAdminModal();
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

  // Mapeamento das abas para cálculo do indicador deslizante
  const tabs: { id: TabType; label: string }[] = [
    { id: "insights", label: "insights" },
    { id: "obras", label: "Obras" },
    { id: "eventos", label: "Eventos" },
  ];
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div className={styles.container}>
      {/* Cabeçalho com o botão Sair */}
      <div className={styles.header}>
        <h1 className={styles.title}></h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className={styles.main}>
        {/* Seção do Perfil administrativo fixa */}
        <section className={styles.profileSection}>
          <AdmUserProfileCard
            user={user}
            isLoading={isLoading}
            onEdit={() => setIsEditModalOpen(true)}
            onNewAdmin={handleNewAdmin}
          />
        </section>

        {/* COMPONENTE DE NAVEGAÇÃO INTERNA DESLIZANTE */}
        <div className={styles.navTabsWrapper}>
          <div className={styles.navTabsContainer}>
            <div
              className={styles.slidingIndicator}
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
            />
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeText : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SEÇÕES CONDICIONAIS - Muda de acordo com a aba clicada */}
        {activeTab === "insights" && (
          <section className={styles.viewSection}>
            <div>Conteúdo de Insights (Em breve)</div>
          </section>
        )}

        {activeTab === "obras" && (
          <section className={styles.viewSection}>
            <AdmObras />
          </section>
        )}

        {activeTab === "eventos" && (
          <section className={styles.viewSection}>
            <AdmEventos />
          </section>
        )}
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