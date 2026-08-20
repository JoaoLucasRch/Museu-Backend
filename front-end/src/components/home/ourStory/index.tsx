import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import styles from "./OurStory.module.css";

const YOUTUBE_ID = "X7KtOLqz4HU";

const FACTS = [
  {
    label: "Inauguração",
    value: "7 ago 2020",
    detail: "Palacete Augusto Dias, Marabá Pioneira",
  },
  {
    label: "O edifício",
    value: "1939",
    detail: "Tombado; antiga sede dos poderes municipais",
  },
  {
    label: "O nome",
    value: "Francisco Coelho",
    detail: "Fundador da Casa Marabá em 1898",
  },
  {
    label: "Acervo",
    value: "Salas temáticas",
    detail: "História, lendas, mineração e pinacoteca",
  },
];

function OurStory() {
  const [modalOpen, setModalOpen] = useState(false);
  const [wavesVisible, setWavesVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setModalOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  // Ondas aparecem/desaparecem conforme a seção entra na tela
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setWavesVisible(entry.isIntersecting);
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="historia"
      ref={sectionRef}
      className={styles.section}
    >
      <div
        className={`${styles.bgDecor} ${wavesVisible ? styles.bgDecorVisible : ""
          }`}
        aria-hidden
      >
        <svg
          className={styles.waveTop}
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
        >
          <path
            d="M0,90 C180,160 360,20 540,70 C720,120 900,160 1080,80 C1260,10 1350,40 1440,60 L1440,0 L0,0 Z"
            fill="rgb(14, 8, 3)"
          />
        </svg>

        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />

        <svg
          className={styles.waveBottom}
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C200,150 400,30 600,90 C800,150 1000,160 1200,70 C1320,20 1380,50 1440,90 L1440,180 L0,180 Z"
            fill="rgb(120, 100, 83)"
          />
        </svg>
      </div>

      <div className={styles.inner}>
        <div className={styles.heroRow}>
          <div className={styles.intro}>
            <span className={styles.tag}>Memória e Cultura</span>

            <h2>Nossa História</h2>

            <p className={styles.lead}>
              O Museu Municipal Francisco Coelho preserva a memória de Marabá
              em um dos edifícios mais simbólicos da cidade: o Palacete Augusto
              Dias, marco do ciclo da castanha e antiga sede dos poderes
              municipais.
            </p>

            <p>
              Sob gestão da Fundação Casa da Cultura de Marabá (FCCM), o espaço
              reúne história, arqueologia, etnologia, geologia, espeleologia e
              arte em salas temáticas pensadas para aproximar o público da
              identidade amazônica e da trajetória regional.
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.readMore}
                onClick={() => setModalOpen(true)}
              >
                Ler história completa
              </button>
            </div>
          </div>

          <div className={styles.videoWrap}>
            <div className={styles.videoFrame}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0`}
                title="Conheça o Museu Municipal de Marabá Francisco Coelho"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <p className={styles.videoCaption}>
              Conheça o Museu Municipal Francisco Coelho
            </p>
          </div>
        </div>

        {/* Faixa de marcos — substitui os cards */}
        <div className={styles.factsStrip}>
          {FACTS.map((fact, index) => (
            <div key={fact.label} className={styles.factItem}>
              {index > 0 && <span className={styles.factDivider} aria-hidden />}
              <span className={styles.factLabel}>{fact.label}</span>
              <strong className={styles.factValue}>{fact.value}</strong>
              <span className={styles.factDetail}>{fact.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalOpen(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="historia-modal-title"
          >
            <header className={styles.modalHeader}>
              <div>
                <span className={styles.modalEyebrow}>Museu Municipal</span>
                <h3 id="historia-modal-title">
                  A história do Francisco Coelho
                </h3>
              </div>

              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </header>

            <div className={styles.modalBody}>
              <section>
                <h4>O nome e a origem da cidade</h4>
                <p>
                  O museu homenageia Francisco Coelho da Silva, comerciante
                  maranhense natural de Barra do Corda. Em 7 de junho de 1898,
                  ele instalou um estabelecimento comercial, a Casa Marabá, na
                  faixa de terra entre os rios Tocantins e Itacaiúnas. O nome
                  inspirou-se no poema “Marabá”, de Gonçalves Dias, de quem
                  Coelho era admirador.
                </p>
                <p>
                  Esse entreposto, ligado ao comércio de caucho e
                  castanha-do-pará, é tradicionalmente associado ao surgimento
                  do núcleo urbano. O bairro mais antigo da cidade também leva
                  o nome de Francisco Coelho. Marabá seria emancipada em 5 de
                  abril de 1913.
                </p>
              </section>

              <section>
                <h4>O Palacete Augusto Dias</h4>
                <p>
                  O museu ocupa o Palacete Augusto Dias, edifício iniciado em
                  1936 e inaugurado em 1939, na administração de Augusto de
                  Figueiredo Dias. Projetado para sediar prefeitura,
                  secretarias, Câmara e Fórum, é considerado o principal marco
                  arquitetônico do ciclo da castanha ainda preservado em
                  Marabá.
                </p>
                <p>
                  Com a transferência da prefeitura para a Nova Marabá na
                  década de 1970, o prédio continuou ligado ao Legislativo e,
                  por um tempo, ao Judiciário. Em 5 de abril de 1993, foi
                  tombado como patrimônio histórico municipal.
                </p>
              </section>

              <section>
                <h4>Do poder público ao museu</h4>
                <p>
                  Nas discussões sobre a nova sede da Câmara, o vereador Miguel
                  Gomes Filho (Miguelito) propôs transformar o Palacete em
                  museu municipal. Com a inauguração da nova Câmara, o edifício
                  foi destinado à Fundação Casa da Cultura de Marabá (FCCM).
                </p>
                <p>
                  A restauração avançou a partir de 2017, com recursos
                  municipais e contrapartidas, mantendo as linhas
                  arquitetônicas originais e adaptando o espaço com
                  acessibilidade, incluindo elevador e informações em braile.
                  Em 7 de agosto de 2020, o Museu Municipal Francisco Coelho
                  foi inaugurado.
                </p>
              </section>

              <section>
                <h4>O que o visitante encontra</h4>
                <p>
                  Administrado pela FCCM, o museu apresenta a história de
                  Marabá e da região do Sul e Sudeste do Pará por meio de
                  exposições permanentes e temporárias. O acervo, em grande
                  parte reunido pela própria Fundação, percorre história local,
                  etnologia, arqueologia, espeleologia, geologia, botânica,
                  zoologia e pinacoteca.
                </p>
                <p>
                  Há linha do tempo da cidade, salas sobre ciclos econômicos e
                  mineração, experiências sensoriais (como a caverna imersiva)
                  e a Sala das Lendas, com narrativas amazônicas e memórias
                  locais.
                </p>
                <p>
                  Mais do que um depósito de objetos, o museu busca ser um
                  espaço vivo de educação, pesquisa e encontro da comunidade
                  com a própria história.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default OurStory;