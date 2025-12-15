
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import styles from "./Dashboard.module.css";

import UserProfileCard from "../../components/Profile/UserProfileCard";
import EditProfileModal from "../../components/Profile/EditProfileModal";
import ArtworksList from "../../components/Profile/ArtworksList";
import { UserService } from "../../components/Profile/types/UserService";
import type { UserProfile } from "../../components/Profile/types/User";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  function handleProfileUpdate(updatedUser: UserProfile) {
    setUser(updatedUser);
  }

  return (
   
    <div className={styles.container}>
      
      <div className={styles.header}>
        <h1>Bem-vindo</h1>
        
 
        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
        >
          Sair
        </button>
      </div>

      <UserProfileCard
        user={user}
        isLoading={isLoading}
        onEdit={() => setIsEditModalOpen(true)}
      />

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