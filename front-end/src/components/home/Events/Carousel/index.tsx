import styles from "./Carousel.module.css";

interface Props {
  currentSlide: number;
  onPrevious: () => void;
  onNext: () => void;
  children: React.ReactNode;
}

export default function Carousel({
  currentSlide,
  onPrevious,
  onNext,
  children,
}: Props) {
  return (
    <div className={styles.carouselWrapper}>
      <button
        className={`${styles.carouselButton} ${styles.prevButton}`}
        onClick={onPrevious}
        aria-label="Anterior"
      >
        ‹
      </button>

      <div className={styles.carouselContent}>
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {children}
        </div>
      </div>

      <button
        className={`${styles.carouselButton} ${styles.nextButton}`}
        onClick={onNext}
        aria-label="Próximo"
      >
        ›
      </button>
    </div>
  );
}