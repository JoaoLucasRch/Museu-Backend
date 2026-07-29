import {
  ChevronRight,
} from "lucide-react";

import styles from "./UserRow.module.css";

import type {
  UserProfile,
} from "@/types/User";

interface Props {
  user: UserProfile;

  onClick: (
    user: UserProfile
  ) => void;
}

export default function UserRow({
  user,
  onClick,
}: Props) {

  return (

    <div
      className={styles.row}
      onClick={() => onClick(user)}
    >

      <div className={styles.name}>
        {user.nome}
      </div>

      <div className={styles.email}>
        {user.email}
      </div>

      <div>

        <span
          className={`${styles.role} ${
            user.role === "ADMIN"
              ? styles.admin
              : styles.artist
          }`}
        >
          {user.role}
        </span>

      </div>

      <div>

        <span className={styles.active}>
          Ativo
        </span>

      </div>

      <div className={styles.icon}>
        <ChevronRight size={18}/>
      </div>

    </div>

  );

}