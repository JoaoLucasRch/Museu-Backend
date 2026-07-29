import styles from "./UserCard.module.css";

import type { UserProfile } from "@/types/User";


interface Props {

  user: UserProfile;

  onClick: (
    user: UserProfile
  ) => void;

}


export default function UserCard({
  user,
  onClick,
}: Props) {


  return (

    <div
      className={styles.card}
      onClick={() => onClick(user)}
    >

      <div className={styles.header}>

        <h3>
          {user.nome}
        </h3>


        <span
          className={
            user.role === "ADMIN"
              ? styles.admin
              : styles.artist
          }
        >
          {user.role}
        </span>

      </div>


      <p>
        {user.email}
      </p>


      <span className={styles.status}>
        Ativo
      </span>


    </div>

  );
}