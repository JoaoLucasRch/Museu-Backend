import React from "react";
import styles from "./SaibaMais.module.css";

export default function SaibaMais() {
  const steps = [
    {
      num: "01",
      title: "Inscrição da Proposta",
      desc: "Envie sua biografia, conceito da coleção e fotografias em alta resolução das obras diretamente pelo nosso portal.",
    },
    {
      num: "02",
      title: "Curadoria & Avaliação",
      desc: "Nossa comissão avalia a originalidade, viabilidade técnica e a conexão conceitual com o espaço do museu.",
    },
    {
      num: "03",
      title: "Agendamento da Mostra",
      desc: "Propostas selecionadas integram o calendário oficial de exposições temporárias, com duração de 15 a 45 dias.",
    },
    {
      num: "04",
      title: "Montagem & Abertura",
      desc: "Apoio técnico na montagem cenográfica, divulgação nos canais oficiais e abertura gratuita ao público.",
    },
  ];

  const guidelines = [
    {
      title: "Quem pode participar?",
      text: "Artistas visuais individuais ou coletivos independentes residentes em Marabá, região e convidados de todo o Brasil.",
    },
    {
      title: "Linguagens aceitas",
      text: "Pinturas (óleo, acrílica, aquarela), esculturas, gravuras, instalações, fotografias e ilustrações contemporâneas.",
    },
    {
      title: "Venda de Obras",
      text: "O museu não cobra comissões sobre vendas. Interessados entram em contato direto com o artista responsável.",
    },
  ];

  return (
    <main className={styles.pageContainer}>
      {/* Botão de Retorno */}
      <nav className={styles.topNav}>
        <a href="/" className={styles.backLink}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Voltar ao início</span>
        </a>
      </nav>

      {/* Cabeçalho */}
      <header className={styles.header}>
        <span className={styles.tag}>Edital Permanente</span>
        <h1 className={styles.title}>Como funciona o Exponha sua Arte</h1>
        <p className={styles.lead}>
          Uma ponte cultural para valorizar a produção visual regional, conectar novos talentos à comunidade e democratizar os espaços de exibição do Museu Francisco Coelho.
        </p>
      </header>

      {/* Etapas do Processo */}
      <section className={styles.stepsSection}>
        <h2 className={styles.sectionTitle}>Etapas do Programa</h2>
        <div className={styles.stepsGrid}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.stepCard}>
              <span className={styles.stepNumber}>{step.num}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Diretrizes Gerais */}
      <section className={styles.guidelinesSection}>
        <div className={styles.guidelinesGrid}>
          {guidelines.map((item, idx) => (
            <div key={idx} className={styles.guideCard}>
              <h3 className={styles.guideTitle}>{item.title}</h3>
              <p className={styles.guideText}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <footer className={styles.ctaBanner}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Pronto para apresentar suas criações?</h2>
          <p className={styles.ctaText}>
            Submeta seu portfólio e faça parte da história viva da nossa arte.
          </p>
        </div>
        <button
          className={styles.participateBtn}
          onClick={() => (window.location.href = "/login")}
        >
          <span>Quero Participar</span>
          <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </footer>
    </main>
  );
}