import { useEffect, useMemo, useState } from "react";

import styles from "./Events.module.css";

import Carousel from "./Carousel";
import EventModal from "./EventModal";
import Loading from "./Loading";
import EventsHeader from "./Header";
import ErrorMessage from "./ErrorMessage";
import EventList from "./EventList";

import {
  useHomeEvents,
  useEventUI,
} from "@/hooks/events";

import {
  formatarData,
  formatarHorarioCompleto,
} from "@/utils/event";

const ITEMS_PER_PAGE = 4;

export default function Events() {
  const {
    loading,
    error,
    eventosEmExibicao,
    eventosEmBreve,
    editais,
    fetchEventos,
  } = useHomeEvents();

  const {
    activeTooltipId,
    selectedEvento,
    handleMouseEnter,
    handleMouseLeave,
    handleCardClick,
    closeModal,
  } = useEventUI();

  /* =====================================================
     TODOS OS EVENTOS
  ===================================================== */

  const todosEventos = useMemo(
    () => [
      ...eventosEmExibicao,
      ...eventosEmBreve,
      ...editais,
    ],
    [
      eventosEmExibicao,
      eventosEmBreve,
      editais,
    ]
  );

  /* =====================================================
     CAROUSEL
  ===================================================== */

  const totalSlides = Math.ceil(
    todosEventos.length / ITEMS_PER_PAGE
  );

  const [currentSlide, setCurrentSlide] =
    useState(0);

  /* =====================================================
     EVENTOS DO SLIDE ATUAL
  ===================================================== */

  const visibleEvents = useMemo(() => {
    const startIndex =
      currentSlide * ITEMS_PER_PAGE;

    return todosEventos.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [todosEventos, currentSlide]);

  /* =====================================================
     NAVEGAÇÃO
  ===================================================== */

  function nextSlide() {
    if (totalSlides <= 1) return;

    setCurrentSlide((current) =>
      current < totalSlides - 1
        ? current + 1
        : 0
    );
  }

  function prevSlide() {
    if (totalSlides <= 1) return;

    setCurrentSlide((current) =>
      current > 0
        ? current - 1
        : totalSlides - 1
    );
  }

  /* =====================================================
     SELECIONAR SLIDE
  ===================================================== */

  function handleSelectSlide(index: number) {
    setCurrentSlide(index);
  }

  /* =====================================================
     CORRIGE O SLIDE CASO A QUANTIDADE DE EVENTOS MUDE
  ===================================================== */

  useEffect(() => {
    if (
      totalSlides > 0 &&
      currentSlide >= totalSlides
    ) {
      setCurrentSlide(totalSlides - 1);
    }
  }, [totalSlides, currentSlide]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return <Loading />;
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section
      id="eventos"
      className={styles.eventosSection}
    >
      <div className={styles.container}>
        <EventsHeader />

      {todosEventos.length > 0 ? (
  <Carousel
    currentSlide={currentSlide}
    totalSlides={totalSlides}
    onPrevious={prevSlide}
    onNext={nextSlide}
    onSelectSlide={handleSelectSlide}
  >
    <EventList
      eventos={todosEventos}
      visibleEvents={visibleEvents}
      eventosEmExibicao={eventosEmExibicao}
      editais={editais}
      activeTooltipId={activeTooltipId}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      formatarData={formatarData}
      formatarHorario={formatarHorarioCompleto}
    />
  </Carousel>
) : (
  <div className={styles.noEvents}>
    <div className={styles.noEventsMain}>
      <span className={styles.noEventsEyebrow}>
        Programação do museu
      </span>

      <h2>
        Cultura, memória e encontros
      </h2>

      <p>
        Acompanhe nesta seção as próximas atividades,
        exposições e experiências realizadas pelo
        Museu Municipal Francisco Coelho.
      </p>
    </div>

    <div className={styles.noEventsTypes}>
      <div className={styles.noEventsType}>
        <span>01</span>
        <strong>Exposições</strong>
        <p>Acervo, arte e memória</p>
      </div>

      <div className={styles.noEventsType}>
        <span>02</span>
        <strong>Oficinas</strong>
        <p>Aprendizado e criação</p>
      </div>

      <div className={styles.noEventsType}>
        <span>03</span>
        <strong>Encontros</strong>
        <p>Palestras e atividades</p>
      </div>
    </div>

    <div className={styles.noEventsFooter}>
      <span className={styles.noEventsLine} />
      <span>Novas atividades serão divulgadas aqui</span>
    </div>
  </div>
)}

        <EventModal
          evento={selectedEvento}
          onClose={closeModal}
          formatarHorario={
            formatarHorarioCompleto
          }
        />

        {error && (
          <ErrorMessage
            error={error}
            onRetry={fetchEventos}
          />
        )}
      </div>
    </section>
  );
}