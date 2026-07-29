import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Navbar.module.css";

export default function Navbar() {
  const [fixo, setFixo] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {

    const handleScroll = () => {

      if (window.scrollY > 300) {
        setFixo(true);
      } else {
        setFixo(false);
      }

    };


    window.addEventListener(
      "scroll",
      handleScroll
    );


    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);



  return (

    <nav
      className={`
        ${styles.container}
        ${fixo ? styles.scrolled : ""}
      `}
    >

      <ul className={styles.list}>

        <li className={styles.item}>
          <a href="#">
            Home
          </a>
        </li>

        <li className={styles.item}>
          <a href="#historia">
            História
          </a>
        </li>

        <li className={styles.item}>
          <a href="#salas">
            Salas
          </a>
        </li>

        <li className={styles.item}>
          <a href="#eventos">
            Eventos
          </a>
        </li>

        <li className={styles.item}>
          <a href="#exposicoes">
            Exponha sua Arte
          </a>
        </li>

        <li className={styles.item}>
          <a href="#contato">
            Contatos
          </a>
        </li>

      </ul>


      <button
        className={styles.loginButton}
        onClick={() => navigate("/login")}
      >
        Entrar
      </button>


    </nav>

  );
}