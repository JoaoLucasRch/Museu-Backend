import { useState, useEffect } from 'react';
import styles from './Navbar.module.css'; // Certifique-se que o arquivo CSS tem esse nome

export default function Navbar() {
  const [fixo, setFixo] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Se a rolagem passar de 300px (ajuste esse valor se quiser que mude antes/depois)
      if (window.scrollY > 300) {
        setFixo(true);
      } else {
        setFixo(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Limpeza de memória (boa prática)
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // AQUI ESTÁ O SEGREDO 👇
    // Se 'fixo' for true, ele adiciona a classe styles.scrolled.
    // Se for false, ele deixa vazio.
    <nav className={`${styles.container} ${fixo ? styles.scrolled : ''}`}>
      
      <ul className={styles.list}>
        <li className={styles.item}><a href="#inicio">Home</a></li>
        <li className={styles.item}><a href="#historia">História</a></li>
        <li className={styles.item}><a href="#salas">Salas</a></li>
        <li className={styles.item}><a href="#eventos">Eventos</a></li>
        <li className={styles.item}><a href="#exposicoes">Exponha sua Arte</a></li>
        <li className={styles.item}><a href="#contato">Contatos</a></li>
      </ul>

    </nav>
  );
}