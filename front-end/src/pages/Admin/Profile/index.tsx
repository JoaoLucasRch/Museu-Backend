import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  UserRound,
  ShieldCheck,
  UserPlus,
  Pencil,
} from "lucide-react";

import EditProfileModal from "@/components/admin/account/EditProfileModal";
import RegisterAdminModal from "@/components/admin/admins/modals/RegisterAdminModal";
import ChangePasswordModal from "@/components/authentication/changePassword";

import { UserService } from "@/services/users/userService";

import type { UserProfile } from "@/types/User";
import type { RegisterAdminData } from "@/services/users/userService";

import styles from "./Profile.module.css";

interface Context {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
}

export default function AdminProfile() {
  const { user, setUser } = useOutletContext<Context>();

  const [editOpen, setEditOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordOpen, setPasswordOpen] =
    useState(false);

  async function handleRegisterAdmin(
    data: RegisterAdminData
  ) {
    try {
      setIsRegistering(true);

      await UserService.registerAdmin(data);

      setRegisterOpen(false);
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <section className={styles.profile}>
      <div className={styles.grid}>
        <article className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <div className={styles.icon}>
              <UserRound size={20} />
            </div>

            <div>
              <h2>Informações pessoais</h2>

              <span>Dados do administrador</span>
            </div>
          </div>

          <div className={styles.info}>
            <label>Nome</label>

            <strong>{user?.nome ?? "-"}</strong>

            <label>E-mail</label>

            <strong>{user?.email ?? "-"}</strong>

            <label>Contato</label>

            <strong>
              {user?.contato?.trim() || "Não informado"}
            </strong>
          </div>

          <button
            className={styles.secondaryButton}
            onClick={() => setEditOpen(true)}
          >
            <Pencil size={16} />
            Editar perfil
          </button>
        </article>

        <div className={styles.sideColumn}>
          <article className={styles.smallCard}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}>
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2>Segurança</h2>

                <span>Controle de acesso</span>
              </div>
            </div>

            <p>
              Altere sua senha para manter sua conta protegida.
            </p>

            <button
              className={styles.secondaryButton}
              onClick={() => setPasswordOpen(true)}
            >
              Alterar senha
            </button>
          </article>

          <article className={styles.smallCard}>
            <div className={styles.cardHeader}>
              <div className={styles.icon}>
                <UserPlus size={20} />
              </div>

              <div>
                <h2>Administração</h2>

                <span>Gerencie administradores</span>
              </div>
            </div>

            <p>
              Cadastre novos administradores para acessar o painel.
            </p>

            <button
              className={styles.primaryButton}
              onClick={() => setRegisterOpen(true)}
            >
              <UserPlus size={17} />
              Novo administrador
            </button>
          </article>
        </div>
      </div>

      <EditProfileModal
        isOpen={editOpen}
        currentUser={user}
        onClose={() => setEditOpen(false)}
        onSuccess={(updatedUser) => {
          setUser(updatedUser);
          setEditOpen(false);
        }}
      />

      <RegisterAdminModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSubmit={handleRegisterAdmin}
        isLoading={isRegistering}
      />

      <ChangePasswordModal
        isOpen={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
    </section>
  );
}