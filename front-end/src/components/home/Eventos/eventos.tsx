import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './eventos.module.css';

interface Usuario {
    id: number;
    nome: string;
    email: string;
}

export interface Evento {
    id_evento: number;
    titulo_evento: string;
    descricao_evento: string;
    local_evento: string;
    imagem_evento: string | null;
    data_hora_inicio: string;
    data_hora_fim: string;
    tipo_evento: string;
    criado_por: Usuario;
}

const API_URL = 'http://localhost:3333/eventos';

const Eventos: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [eventosEmExibicao, setEventosEmExibicao] = useState<Evento[]>([]);
    const [eventosEmBreve, setEventosEmBreve] = useState<Evento[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const [activeTooltipId, setActiveTooltipId] = useState<number | null>(null);

    const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

    const fetchEventos = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(API_URL, {
                timeout: 8000,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            classificarEventos(response.data);

        } catch (err) {
            setError('Erro ao carregar eventos do servidor.');
        } finally {
            setLoading(false);
        }
    };

    const classificarEventos = (eventosList: Evento[]) => {
        const agora = new Date();

        const emExibicao = eventosList.filter(evento => {
            const inicio = new Date(evento.data_hora_inicio);
            const fim = new Date(evento.data_hora_fim);
            return inicio <= agora && fim >= agora;
        });

        const emBreve = eventosList.filter(evento => {
            const inicio = new Date(evento.data_hora_inicio);
            return inicio > agora;
        });

        setEventosEmExibicao(emExibicao);
        setEventosEmBreve(emBreve);
    };

    useEffect(() => {
        fetchEventos();
    }, []);

    const formatarData = (dataString: string) => {
        try {
            const data = new Date(dataString);
            const dia = data.getDate();
            const mes = data.toLocaleDateString('pt-BR', { month: 'short' });
            const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1, 3);
            return `${dia} ${mesCapitalizado}`;
        } catch {
            return 'Data inválida';
        }
    };

    const formatarHorarioCompleto = (inicio: string, fim: string) => {
        try {
            const inicioDate = new Date(inicio);
            const fimDate = new Date(fim);
            return `${inicioDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            })} - ${fimDate.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            })}`;
        } catch {
            return 'Horário indisponível';
        }
    };

    const todosEventos = [...eventosEmExibicao, ...eventosEmBreve];
    const cardsVisiveis = 3;
    const totalSlides = Math.max(0, todosEventos.length - cardsVisiveis + 1);

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    // Tooltip NOVO — sem posições e sem viewport
    const handleMouseEnter = (eventoId: number) => {
        setActiveTooltipId(eventoId);
    };

    const handleMouseLeave = () => {
        setActiveTooltipId(null);
    };

    const handleCardClick = (evento: Evento) => {
        setSelectedEvento(evento);
    };

    const closeModal = () => {
        setSelectedEvento(null);
    };

    useEffect(() => {
        setCurrentSlide(0);
    }, [eventosEmExibicao.length, eventosEmBreve.length]);

    if (loading) {
        return (
            <section id="eventos" className={styles.eventosSection}>
                <div className={styles.container}>
                    <div className={styles.loadingContainer}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="eventos" className={styles.eventosSection}>
            <div className={styles.container}>

                <div className={styles.header}>
                    <h2 className={styles.title}>Exposições & Eventos</h2>
                    <p className={styles.subtitle}>
                        Descubra as exposições atuais e próximos eventos em nosso museu
                    </p>
                </div>

                <div className={styles.carouselWrapper}>
                    <button
                        className={`${styles.carouselButton} ${styles.prevButton}`}
                        onClick={prevSlide}
                        aria-label="Anterior"
                    >
                        ‹
                    </button>

                    <div className={styles.carouselContent}>
                        <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                            {[...eventosEmExibicao, ...eventosEmBreve].map(evento => {
                                const isEmExibicao = eventosEmExibicao.some(e => e.id_evento === evento.id_evento);

                                return (
                                    <div
                                        key={evento.id_evento}
                                        className={styles.eventoCardVisual}
                                        onMouseEnter={() => handleMouseEnter(evento.id_evento)}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={() => handleCardClick(evento)}
                                    >
                                        <div className={styles.imageContainer}>
                                            {evento.imagem_evento ? (
                                                <img
                                                    src={evento.imagem_evento}
                                                    alt={evento.titulo_evento}
                                                    className={styles.eventoImage}
                                                />
                                            ) : (
                                                <div className={styles.placeholderImage}>
                                                    <span>🎨</span>
                                                </div>
                                            )}

                                            <span className={`${styles.statusBadgeVisual} ${!isEmExibicao ? styles.breve : ''}`}>
                                                {isEmExibicao ? 'Em Exibição' : 'Em Breve'}
                                            </span>
                                        </div>

                                        <div className={styles.cardInfo}>
                                            <h4 className={styles.cardTitleVisual}>{evento.titulo_evento}</h4>
                                            <p className={styles.cardLocal}>{evento.local_evento}</p>
                                            <p className={styles.cardData}>{formatarData(evento.data_hora_inicio)}</p>
                                        </div>

                                        {/* Tooltip AGORA dentro do card */}
                                        {activeTooltipId === evento.id_evento && (
                                            <div className={styles.tooltipOverlay}>
                                                <div className={styles.tooltipContentCard}>
                                                    <h5>{evento.titulo_evento}</h5>
                                                    <p><strong>📍 {evento.local_evento}</strong></p>
                                                    <p><strong>⏰ {formatarHorarioCompleto(evento.data_hora_inicio, evento.data_hora_fim)}</strong></p>
                                                    <div className={styles.tooltipDesc}>{evento.descricao_evento}</div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        className={`${styles.carouselButton} ${styles.nextButton}`}
                        onClick={nextSlide}
                        aria-label="Próximo"
                    >
                        ›
                    </button>
                </div>

                {selectedEvento && (
                    <div className={styles.modalOverlay} onClick={closeModal}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <button className={styles.modalClose} onClick={closeModal}>×</button>

                            <div className={styles.modalImage}>
                                {selectedEvento.imagem_evento ? (
                                    <img src={selectedEvento.imagem_evento} alt={selectedEvento.titulo_evento} />
                                ) : (
                                    <div className={styles.placeholderImage}>
                                        <span>🎨</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.modalInfo}>
                                <h3>{selectedEvento.titulo_evento}</h3>
                                <p className={styles.modalLocation}><strong>📍 {selectedEvento.local_evento}</strong></p>
                                <p className={styles.modalDate}><strong>⏰ {formatarHorarioCompleto(selectedEvento.data_hora_inicio, selectedEvento.data_hora_fim)}</strong></p>

                                <div className={styles.modalDescription}>
                                    <p>{selectedEvento.descricao_evento}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {eventosEmExibicao.length === 0 && eventosEmBreve.length === 0 && !error && (
                    <div className={styles.noEvents}>
                        <p>Não há eventos programados no momento</p>
                    </div>
                )}

                {error && (
                    <div className={styles.errorContainer}>
                        <div className="alert alert-warning" role="alert">
                            {error}
                            <button
                                className="btn btn-sm btn-outline-primary ms-2"
                                onClick={fetchEventos}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Eventos;
