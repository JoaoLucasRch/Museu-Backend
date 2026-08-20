import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getRoomBySlug } from "@/data/rooms";
import { getWorksByRoom } from "@/data/works";

import styles from "./RoomPage.module.css";

export default function RoomPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  /**
   * =========================================================
   * SALA ATUAL
   * =========================================================
   */
  const room = slug ? getRoomBySlug(slug) : undefined;

  /**
   * =========================================================
   * OBRAS DA SALA
   * =========================================================
   */
  const works = useMemo(
    () => (room ? getWorksByRoom(room.slug) : []),
    [room]
  );

  /**
   * =========================================================
   * ESTADOS
   * =========================================================
   */
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [selectedIndex, setSelectedIndex] = useState(0);

  /**
   * =========================================================
   * CATEGORIAS
   * =========================================================
   */
  const filters = useMemo(() => {
    const categories = works
      .map((work) => work.category)
      .filter(
        (category): category is string =>
          Boolean(category)
      );

    return ["Todas", ...new Set(categories)];
  }, [works]);

  /**
   * =========================================================
   * OBRAS FILTRADAS
   * =========================================================
   */
  const filteredWorks = useMemo(() => {
    if (activeFilter === "Todas") {
      return works;
    }

    return works.filter(
      (work) => work.category === activeFilter
    );
  }, [works, activeFilter]);

  /**
   * =========================================================
   * OBRA SELECIONADA
   * =========================================================
   */
  const selectedWork =
    filteredWorks[selectedIndex] ?? filteredWorks[0];

  /**
   * =========================================================
   * DEMAIS OBRAS
   * =========================================================
   */
  const otherWorks = useMemo(() => {
    if (!selectedWork) {
      return [];
    }

    return filteredWorks.filter(
      (work) => work.id !== selectedWork.id
    );
  }, [filteredWorks, selectedWork]);

  /**
   * =========================================================
   * RESET AO TROCAR DE SALA
   * =========================================================
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    setActiveFilter("Todas");
    setSelectedIndex(0);
  }, [slug]);

  /**
   * =========================================================
   * RESET AO TROCAR FILTRO
   * =========================================================
   */
  useEffect(() => {
    setSelectedIndex(0);
  }, [activeFilter]);

  /**
   * =========================================================
   * PROTEÇÃO DO ÍNDICE
   * =========================================================
   */
  useEffect(() => {
    if (filteredWorks.length === 0) {
      return;
    }

    if (selectedIndex >= filteredWorks.length) {
      setSelectedIndex(0);
    }
  }, [filteredWorks, selectedIndex]);

  /**
   * =========================================================
   * SALA NÃO ENCONTRADA
   * =========================================================
   */
  if (!room) {
    return (
      <main className={styles.notFound}>
        <h1>Sala não encontrada</h1>

        <p>
          Não foi possível encontrar a sala que você
          está procurando.
        </p>

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/#salas")}
        >
          <ArrowLeft
            size={18}
            aria-hidden="true"
          />

          <span>Voltar para as salas</span>
        </button>
      </main>
    );
  }

  /**
   * =========================================================
   * VOLTAR PARA SALAS
   * =========================================================
   */
  function handleBackToRooms() {
    navigate("/#salas");
  }

  /**
   * =========================================================
   * SELECIONAR OBRA
   * =========================================================
   */
  function handleSelectWork(
    workId: string | number
  ) {
    const index = filteredWorks.findIndex(
      (work) => work.id === workId
    );

    if (index !== -1) {
      setSelectedIndex(index);
    }
  }

  /**
   * =========================================================
   * OBRA ANTERIOR
   * =========================================================
   */
  function handlePreviousWork() {
    if (filteredWorks.length <= 1) {
      return;
    }

    setSelectedIndex((currentIndex) => {
      if (currentIndex <= 0) {
        return filteredWorks.length - 1;
      }

      return currentIndex - 1;
    });
  }

  /**
   * =========================================================
   * PRÓXIMA OBRA
   * =========================================================
   */
  function handleNextWork() {
    if (filteredWorks.length <= 1) {
      return;
    }

    setSelectedIndex((currentIndex) => {
      if (
        currentIndex >=
        filteredWorks.length - 1
      ) {
        return 0;
      }

      return currentIndex + 1;
    });
  }

  /**
   * =========================================================
   * TECLADO — SELECIONAR OBRA
   * =========================================================
   */
  function handleWorkKeyDown(
    event: React.KeyboardEvent,
    workId: string | number
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      handleSelectWork(workId);
    }
  }

  return (
    <main className={styles.page}>
      {/* =====================================================
          HEADER DA SALA
      ===================================================== */}

      <header className={styles.roomHeader}>
        <div
          className={styles.roomHeaderBackground}
          style={{
            backgroundImage: `url("${room.image}")`,
          }}
          aria-hidden="true"
        />

        <div
          className={styles.roomHeaderOverlay}
          aria-hidden="true"
        />

        <div className={styles.roomHeaderTop}>
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBackToRooms}
          >
            <ArrowLeft
              size={18}
              aria-hidden="true"
            />

            <span>Voltar para as salas</span>
          </button>
        </div>

        <div className={styles.roomHeaderContent}>
          <span className={styles.roomLabel}>
            Sala do Museu
          </span>

          <h1>{room.title}</h1>

          <p>{room.description}</p>
        </div>
      </header>

      {/* =====================================================
          CONTEÚDO PRINCIPAL
      ===================================================== */}

      <section className={styles.content}>
        {/* ===================================================
            CABEÇALHO DO ACERVO
        =================================================== */}

        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderLeft}>
            <span className={styles.sectionLabel}>
              Acervo
            </span>

            <h2>Obras Selecionadas</h2>
          </div>
        </div>

        {/* ===================================================
            FILTROS
        =================================================== */}

        {filters.length > 1 && (
          <div
            className={styles.filters}
            aria-label="Filtrar obras por categoria"
          >
            {filters.map((filter) => {
              const isActive =
                activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  className={`${styles.filterButton} ${isActive
                      ? styles.filterButtonActive
                      : ""
                    }`}
                  onClick={() =>
                    setActiveFilter(filter)
                  }
                  aria-pressed={isActive}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        )}

        {/* ===================================================
            GALERIA PRINCIPAL
        =================================================== */}

        {selectedWork && (
          <div className={styles.galleryWrapper}>
            {/* =====================================================
        OBRA PRINCIPAL
    ===================================================== */}

            <div className={styles.visualColumn}>
              <article
                className={`${styles.workCard} ${styles.workCardLarge}`}
              >
                <div className={styles.heroImageWrapper}>
                  <div className={styles.workCardImage}>
                    <img
                      src={selectedWork.image}
                      alt={selectedWork.title}
                    />

                    {filteredWorks.length > 1 && (
                      <>
                        <button
                          type="button"
                          className={`${styles.galleryArrow} ${styles.galleryArrowLeft}`}
                          onClick={handlePreviousWork}
                          aria-label="Obra anterior"
                        >
                          <ChevronLeft
                            size={20}
                            aria-hidden="true"
                          />
                        </button>

                        <button
                          type="button"
                          className={`${styles.galleryArrow} ${styles.galleryArrowRight}`}
                          onClick={handleNextWork}
                          aria-label="Próxima obra"
                        >
                          <ChevronRight
                            size={20}
                            aria-hidden="true"
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            </div>

            {/* =====================================================
        DESCRIÇÃO / FICHA DA OBRA
    ===================================================== */}

            <div
              className={styles.heroDescription}
              key={selectedWork.id}
            >
              {selectedWork.category && (
                <span className={styles.heroCategory}>
                  {selectedWork.category}
                </span>
              )}

              <h3>{selectedWork.title}</h3>

              <p className={styles.heroAuthor}>
                {selectedWork.author}
              </p>

              {selectedWork.description && (
                <p className={styles.heroText}>
                  {selectedWork.description}
                </p>
              )}

              <div className={styles.metadata}>
                <div>
                  <span>Autor</span>

                  <strong>
                    {selectedWork.author}
                  </strong>
                </div>

                {selectedWork.year && (
                  <div>
                    <span>Ano</span>

                    <strong>
                      {selectedWork.year}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            {/* =====================================================
        MINIATURAS
    ===================================================== */}

            {otherWorks.length > 0 && (
              <div
                className={styles.smallWorks}
                aria-label="Outras obras da sala"
              >
                {otherWorks.map((work) => (
                  <article
                    key={work.id}
                    className={`${styles.workCard} ${styles.workCardSmall}`}
                    onClick={() => handleSelectWork(work.id)}
                    onKeyDown={(event) =>
                      handleWorkKeyDown(event, work.id)
                    }
                    role="button"
                    tabIndex={0}
                    aria-label={`Selecionar obra ${work.title}`}
                  >
                    <div className={styles.workCardImage}>
                      <img
                        src={work.image}
                        alt={work.title}
                        loading="lazy"
                      />
                    </div>

                    <div className={styles.workCardInfo}>
                      <strong>{work.title}</strong>

                      <span>{work.author}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            ESTADO VAZIO
        =================================================== */}

        {filteredWorks.length === 0 && (
          <div className={styles.emptyState}>
            <p>
              Nenhuma obra encontrada nesta
              categoria.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}