import type { Event } from "@/types/Event";

import EventDetails from "./EventDetails";

interface Props {
  isOpen: boolean;
  evento: Event | null;
  onClose: () => void;
  formatDate: (date: string) => string;
}

export default function EventDetailsModal({
  isOpen,
  evento,
  onClose,
  formatDate,
}: Props) {
  if (!isOpen || !evento) {
    return null;
  }

  return (
    <EventDetails
      evento={evento}
      onClose={onClose}
      formatDate={formatDate}
    />
  );
}