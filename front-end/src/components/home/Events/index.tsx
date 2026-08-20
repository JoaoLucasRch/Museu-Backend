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
              eventosEmExibicao={
                eventosEmExibicao
              }
              editais={editais}
              activeTooltipId={
                activeTooltipId
              }
              onClick={handleCardClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              formatarData={formatarData}
              formatarHorario={
                formatarHorarioCompleto
              }
            />
          </Carousel>
        ) : (
          <div className={styles.noEvents}>
            <p>
              Nenhum evento disponível no
              momento.
            </p>
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