import styles from "./EventModal.module.css";

import {
    CalendarDays,
    MapPin,
    X,
} from "lucide-react";

import type { Event } from "@/types/Event";

interface Props {
    evento: Event | null;
    onClose: () => void;
    formatarHorario: (
        inicio: string,
        fim: string
    ) => string;
}

export default function EventModal({
    evento,
    onClose,
    formatarHorario,
}: Props) {

    if (!evento) {
        return null;
    }

    return (
        <div
            className={styles.modalOverlay}
            onClick={onClose}
        >

            <div
                className={styles.modalContent}
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <button
                    className={styles.modalClose}
                    onClick={onClose}
                    type="button"
                >
                    <X size={20}/>
                </button>


                <div className={styles.modalImage}>

                    {evento.imagem_evento ? (

                        <img
                            src={evento.imagem_evento}
                            alt={evento.titulo_evento}
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://placehold.co/800x400?text=Sem+Imagem";
                            }}
                        />

                    ) : (

                        <div className={styles.placeholderImage}>
                            <span>
                                🎨
                            </span>
                        </div>

                    )}

                </div>


                <div className={styles.modalInfo}>

                    <h3>
                        {evento.titulo_evento}
                    </h3>


                    <div className={styles.infoCard}>

                        <MapPin size={18}/>

                        <div>

                            <span>
                                Local
                            </span>

                            <strong>
                                {evento.local_evento}
                            </strong>

                        </div>

                    </div>


                    <div className={styles.infoCard}>

                        <CalendarDays size={18}/>

                        <div>

                            <span>
                                Data e horário
                            </span>

                            <strong>
                                {formatarHorario(
                                    evento.data_hora_inicio,
                                    evento.data_hora_fim
                                )}
                            </strong>

                        </div>

                    </div>


                    <div className={styles.modalDescription}>

                        <h4>
                            Sobre o evento
                        </h4>

                        <p>
                            {evento.descricao_evento}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}