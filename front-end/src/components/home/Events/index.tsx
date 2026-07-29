import styles from "./Events.module.css";

import Carousel from "./Carousel";
import EventModal from "./EventModal";
import Loading from "./Loading";
import EventsHeader from "./Header";
import ErrorMessage from "./ErrorMessage";
import EventList from "./EventList";

import {
  useHomeEvents,
  useCarousel,
  useEventUI,
} from "@/hooks/events";

import {
  formatarData,
  formatarHorarioCompleto,
} from "@/utils/event";

export default function Events() {
  const {
    loading,
    error,
    eventosEmExibicao,
    eventosEmBreve,
    editais,
    fetchEventos,
  } = useHomeEvents();

  const todosEventos = [
    ...eventosEmExibicao,
    ...eventosEmBreve,
    ...editais,
  ];

  const {
    currentSlide,
    nextSlide,
    prevSlide,
  } = useCarousel(todosEventos.length);

  const {
    activeTooltipId,
    selectedEvento,
    handleMouseEnter,
    handleMouseLeave,
    handleCardClick,
    closeModal,
  } = useEventUI();

  if (loading) {
    return <Loading />;
  }

  return (
    <section
      id="eventos"
      className={styles.eventosSection}
    >
      <div className={styles.container}>
        <EventsHeader />

        <Carousel
          currentSlide={currentSlide}
          onPrevious={prevSlide}
          onNext={nextSlide}
        >
          <EventList
            eventos={todosEventos}
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

        <EventModal
          evento={selectedEvento}
          onClose={closeModal}
          formatarHorario={formatarHorarioCompleto}
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