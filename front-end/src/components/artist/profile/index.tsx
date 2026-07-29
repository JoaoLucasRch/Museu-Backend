import { Pencil, LogOut, Mail, Phone } from "lucide-react";

import styles from "./ProfileCard.module.css";

import type { UserProfile } from "@/types/User";

interface UserProfileCardProps {
  user: UserProfile | null;
  isLoading?: boolean;
  onEdit: () => void;
  onLogout: () => void;
}

export default function UserProfileCard({
  user,
  isLoading,
  onEdit,
  onLogout,
}: UserProfileCardProps) {
  if (isLoading || !user) {
    return (
      <div className={styles.loading}>
        Carregando perfil...
      </div>
    );
  }

  return (
    <section className={styles.container}>

      <div className={styles.topBar}>
        <button
          className={styles.logoutButton}
          onClick={onLogout}
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>


      <header className={styles.header}>
        <span className={styles.section}>
          PERFIL
        </span>

        <h1>
          {user.nome}
        </h1>

        <p>
          Gerencie suas informações pessoais.
        </p>
      </header>


      <div className={styles.content}>

        <div className={styles.info}>

          <div className={styles.item}>
            <Mail size={16}/>

            <div>
              <span>
                E-mail
              </span>

              <strong>
                {user.email}
              </strong>
            </div>
          </div>


          <div className={styles.item}>
            <Phone size={16}/>

            <div>
              <span>
                Telefone
              </span>

              <strong>
                {user.contato || "Não informado"}
              </strong>
            </div>
          </div>

        </div>


        <button
          className={styles.editButton}
          onClick={onEdit}
        >
          <Pencil size={16}/>
          Editar perfil
        </button>

      </div>

    </section>
  );
}