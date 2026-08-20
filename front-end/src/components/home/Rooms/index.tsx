import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { roomsData } from "@/data/rooms";

import styles from "./Rooms.module.css";

export default function Rooms() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  /*
   * =========================================================
   * RESPONSIVIDADE
   * =========================================================
   */

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(max-width: 600px)"
    );

    const handleMediaChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleMediaChange();

    mediaQuery.addEventListener(
      "change",
      handleMediaChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleMediaChange
      );
    };
  }, []);

  /*
   * =========================================================
   * NAVEGAÇÃO PARA A SALA
   * =========================================================
   */

  const handleRoomClick = useCallback(
    (slug: string) => {
      navigate(`/salas/${slug}`);
    },
    [navigate]
  );

  /*
   * =========================================================
   * PRÓXIMA SALA
   * =========================================================
   */

  const nextRoom = useCallback(() => {
    setCurrentIndex((current) =>
      current === roomsData.length - 1
        ? 0
        : current + 1
    );
  }, []);

  /*
   * =========================================================
   * SALA ANTERIOR
   * =========================================================
   */

  const previousRoom = useCallback(() => {
    setCurrentIndex((current) =>
      current === 0
        ? roomsData.length - 1
        : current - 1
    );
  }, []);

  /*
   * =========================================================
   * TECLADO
   * =========================================================
   */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        previousRoom();
      }

      if (event.key === "ArrowRight") {
        nextRoom();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [nextRoom, previousRoom]);

  /*
   * =========================================================
   * POSIÇÃO RELATIVA DO CARD
   * =========================================================
   */

  const getRelativePosition = (index: number) => {
    const total = roomsData.length;

    let position =
      (index - currentIndex + total) % total;

    if (position > total / 2) {
      position -= total;
    }

    return position;
  };

  /*
   * =========================================================
   * ESTILO DINÂMICO DOS CARDS
   * =========================================================
   *
   * Desktop:
   * - 1 card central
   * - 2 cards laterais próximos
   * - 2 cards mais afastados
   *
   * Mobile:
   * - card central maior
   * - cards laterais aparecem parcialmente
   * - menor profundidade para não sair da tela
   */

  const getCardStyle = (position: number) => {
    /**
     * =======================================================
     * CARD CENTRAL
     * =======================================================
     */

    if (position === 0) {
      return {
        transform:
          "translate(-50%, -50%) translateZ(80px) rotateZ(0deg) scale(1)",
        zIndex: 20,
        opacity: 1,
        filter: "none",
      };
    }

    /**
     * =======================================================
     * PRIMEIRO CARD À DIREITA
     * =======================================================
     */

    if (position === 1) {
      if (isMobile) {
        return {
          transform:
            "translate(-50%, -50%) translateX(82px) translateY(20px) translateZ(0) rotateZ(7deg) scale(.84)",
          zIndex: 15,
          opacity: 0.9,
          filter: "brightness(.92)",
        };
      }

      return {
        transform:
          "translate(-50%, -50%) translateX(280px) translateY(28px) translateZ(0) rotateZ(7deg) scale(.88)",
        zIndex: 15,
        opacity: 0.9,
        filter: "brightness(.92)",
      };
    }

    /**
     * =======================================================
     * PRIMEIRO CARD À ESQUERDA
     * =======================================================
     */

    if (position === -1) {
      if (isMobile) {
        return {
          transform:
            "translate(-50%, -50%) translateX(-82px) translateY(20px) translateZ(0) rotateZ(-7deg) scale(.84)",
          zIndex: 15,
          opacity: 0.9,
          filter: "brightness(.92)",
        };
      }

      return {
        transform:
          "translate(-50%, -50%) translateX(-280px) translateY(28px) translateZ(0) rotateZ(-7deg) scale(.88)",
        zIndex: 15,
        opacity: 0.9,
        filter: "brightness(.92)",
      };
    }

    /**
     * =======================================================
     * SEGUNDO CARD À DIREITA
     * =======================================================
     */

    if (position === 2) {
      if (isMobile) {
        return {
          transform:
            "translate(-50%, -50%) translateX(142px) translateY(62px) translateZ(-100px) rotateZ(13deg) scale(.70)",
          zIndex: 10,
          opacity: 0.62,
          filter: "brightness(.8)",
        };
      }

      return {
        transform:
          "translate(-50%, -50%) translateX(475px) translateY(90px) translateZ(-100px) rotateZ(13deg) scale(.72)",
        zIndex: 10,
        opacity: 0.62,
        filter: "brightness(.8)",
      };
    }

    /**
     * =======================================================
     * SEGUNDO CARD À ESQUERDA
     * =======================================================
     */

    if (position === -2) {
      if (isMobile) {
        return {
          transform:
            "translate(-50%, -50%) translateX(-142px) translateY(62px) translateZ(-100px) rotateZ(-13deg) scale(.70)",
          zIndex: 10,
          opacity: 0.62,
          filter: "brightness(.8)",
        };
      }

      return {
        transform:
          "translate(-50%, -50%) translateX(-475px) translateY(90px) translateZ(-100px) rotateZ(-13deg) scale(.72)",
        zIndex: 10,
        opacity: 0.62,
        filter: "brightness(.8)",
      };
    }

    /**
     * =======================================================
     * TERCEIRO CARD À DIREITA
     * =======================================================
     */

    if (position === 3) {
      if (isMobile) {
        return {
          transform:
            "translate(-50%, -50%) translateX(190px) translateY(105px) translateZ(-200px) rotateZ(19deg) scale(.56)",
          zIndex: 5,
          opacity: 0.35,
          filter: "brightness(.7) blur(1px)",
        };
      }

      return {
        transform:
          "translate(-50%, -50%) translateX(650px) translateY(165px) translateZ(-200px) rotateZ(19deg) scale(.58)",
        zIndex: 5,
        opacity: 0.35,
        filter: "brightness(.7) blur(1px)",
      };
    }

    /**
     * =======================================================
     * TERCEIRO CARD À ESQUERDA
     * =======================================================
     */

    if (position === -3) {
      if (isMobile) {
        return {
          transform:
            "translate(-50%, -50%) translateX(-190px) translateY(105px) translateZ(-200px) rotateZ(-19deg) scale(.56)",
          zIndex: 5,
          opacity: 0.35,
          filter: "brightness(.7) blur(1px)",
        };
      }

      return {
        transform:
          "translate(-50%, -50%) translateX(-650px) translateY(165px) translateZ(-200px) rotateZ(-19deg) scale(.58)",
        zIndex: 5,
        opacity: 0.35,
        filter: "brightness(.7) blur(1px)",
      };
    }

    /**
     * =======================================================
     * CARDS DISTANTES
     * =======================================================
     */

    return {
      transform:
        "translate(-50%, -50%) translateY(220px) translateZ(-300px) scale(.45)",
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none" as const,
    };
  };

  return (
    <section
      id="salas"
      className={styles.roomsContainer}
      aria-label="Salas em destaque"
    >
      <div className={styles.textHeader}>
        <span className={styles.sectionLabel}>
          Explore o museu
        </span>

        <h2>Salas em Destaque</h2>

        <p>
          Conheça alguns dos espaços e coleções
          presentes no Museu de Marabá.
        </p>
      </div>

      <div className={styles.carouselWrapper}>
        <button
          type="button"
          className={`${styles.carouselButton} ${styles.previousButton}`}
          onClick={previousRoom}
          aria-label="Sala anterior"
        >
          <ChevronLeft size={22} />
        </button>

        <div
          className={styles.carousel}
          aria-live="polite"
          aria-label={`Sala ${currentIndex + 1
            } de ${roomsData.length}`}
        >
          {roomsData.map((room, index) => {
            const position =
              getRelativePosition(index);

            const style =
              getCardStyle(position);

            const isActive = position === 0;

            return (
              <article
                key={room.id}
                className={`${styles.roomCard} ${isActive
                    ? styles.activeCard
                    : styles.inactiveCard
                  }`}
                style={style}
                tabIndex={isActive ? 0 : -1}
                aria-hidden={!isActive}
                role="link"
                onClick={() => {
                  if (isActive) {
                    handleRoomClick(room.slug);
                  }
                }}
                onKeyDown={(event) => {
                  if (!isActive) {
                    return;
                  }

                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    handleRoomClick(room.slug);
                  }
                }}
                aria-label={`Conhecer a sala ${room.title}`}
              >
                <img
                  src={room.image}
                  alt=""
                  className={styles.roomImage}
                />

                <div className={styles.overlay} />

                <div className={styles.roomContent}>
                  <span className={styles.roomLabel}>
                    Sala do Museu
                  </span>

                  <h3>{room.title}</h3>

                  <span className={styles.explore}>
                    Conhecer sala →
                  </span>
                </div>

                <div className={styles.description}>
                  <p>{room.description}</p>
                </div>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          className={`${styles.carouselButton} ${styles.nextButton}`}
          onClick={nextRoom}
          aria-label="Próxima sala"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div
        className={styles.carouselIndicators}
        aria-label="Selecionar sala"
      >
        {roomsData.map((room, index) => (
          <button
            key={room.id}
            type="button"
            className={`${styles.indicator} ${index === currentIndex
                ? styles.activeIndicator
                : ""
              }`}
            onClick={() =>
              setCurrentIndex(index)
            }
            aria-label={`Ir para ${room.title}`}
            aria-current={
              index === currentIndex
                ? "true"
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}