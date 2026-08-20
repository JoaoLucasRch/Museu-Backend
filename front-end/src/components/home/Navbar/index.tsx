import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import styles from "./Navbar.module.css";

const LINKS = [
  { href: "#", label: "Home" },
  { href: "#historia", label: "História" },
  { href: "#salas", label: "Salas" },
  { href: "#eventos", label: "Eventos" },
  { href: "#exposicoes", label: "Exponha sua Arte" },
  { href: "#contato", label: "Contatos" },
];

export default function Navbar() {
  const [fixo, setFixo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setFixo(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogin() {
    closeMenu();
    navigate("/login");
  }

  return (
    <>
      <header
        className={`${styles.header} ${fixo ? styles.scrolled : ""} ${
          menuOpen ? styles.menuOpen : ""
        }`}
      >
        <div className={styles.bar}>
          <span className={styles.brand}>Francisco Coelho</span>

          {/* Desktop links */}
          <nav className={styles.desktopNav} aria-label="Navegação principal">
            <ul className={styles.list}>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className={styles.loginDesktop}
            onClick={handleLogin}
          >
            Entrar
          </button>

          <button
            type="button"
            className={styles.hamburger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
          </button>
        </div>
      </header>

      {/* Drawer mobile */}
      <div
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.drawerNav} aria-label="Menu mobile">
          <ul className={styles.drawerList}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {menuOpen && (
        <button
          type="button"
          className={styles.backdrop}
          onClick={closeMenu}
          aria-label="Fechar menu"
        />
      )}
    </>
  );
}