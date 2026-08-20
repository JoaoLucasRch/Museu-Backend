import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import styles from "./Carousel.module.css";

interface Props {
  currentSlide: number;
  totalSlides: number;

  onPrevious: () => void;
  onNext: () => void;

  onSelectSlide?: (index: number) => void;

  children: React.ReactNode;
}

export default function Carousel({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onSelectSlide,
  children,
}: Props) {
  const hasMultipleSlides = totalSlides > 1;

  return (
    <div className={styles.carouselWrapper}>
      {/* =====================================================
          SETA ANTERIOR
      ===================================================== */}

      {hasMultipleSlides && (
        <button
          type="button"
          className={`${styles.carouselButton} ${styles.prevButton}`}
          onClick={onPrevious}
          aria-label="Eventos anteriores"
        >
          <ChevronLeft
            size={20}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </button>
      )}

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <div className={styles.carouselContent}>
        {children}
      </div>

      {/* =====================================================
          SETA PRÓXIMA
      ===================================================== */}

      {hasMultipleSlides && (
        <button
          type="button"
          className={`${styles.carouselButton} ${styles.nextButton}`}
          onClick={onNext}
          aria-label="Próximos eventos"
        >
          <ChevronRight
            size={20}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </button>
      )}

      {/* =====================================================
          INDICADORES
      ===================================================== */}

      {hasMultipleSlides && (
        <div
          className={styles.pagination}
          aria-label="Navegação entre páginas"
        >
          {Array.from({
            length: totalSlides,
          }).map((_, index) => {
            const isActive =
              index === currentSlide;

            return (
              <button
                key={index}
                type="button"
                className={
                  isActive
                    ? styles.paginationActive
                    : styles.paginationDot
                }
                onClick={() =>
                  onSelectSlide?.(index)
                }
                aria-label={`Ir para página ${
                  index + 1
                }`}
                aria-current={
                  isActive
                    ? "page"
                    : undefined
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}