import type { Event } from "@/types/Event";

import EventDetails from "./EventDetails";
export { default as DeleteEventModal } from "../DeleteEventModal";
export { default as EventDetailsModal } from "../EventDetailsModal";

interface Props {
  isOpen: boolean;
  evento: Event | null;
  onClose: () => void;
  onEdit?: () => void;  
  onDelete?: () => void;
  formatDate: (date: string) => string;
}

export default function EventDetailsModal({
  isOpen,
  evento,
  onClose,
  onEdit,  
  onDelete,
  formatDate,
}: Props) {
  if (!isOpen || !evento) {
    return null;
  }

  return (
    <EventDetails
      evento={evento}
      onClose={onClose}
      onEdit={onEdit}    
      onDelete={onDelete}
      formatDate={formatDate}
    />
  );
}