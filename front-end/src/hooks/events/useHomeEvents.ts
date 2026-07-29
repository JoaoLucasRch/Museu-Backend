import { useEffect, useState } from "react";

import api from "@/services/api";

import type { Event } from "@/types/Event";

export default function useHomeEvents() {
  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [eventosEmExibicao, setEventosEmExibicao] =
    useState<Event[]>([]);

  const [eventosEmBreve, setEventosEmBreve] =
    useState<Event[]>([]);

  const [editais, setEditais] =
    useState<Event[]>([]);

  async function fetchEventos() {
    try {

      setLoading(true);
      setError(null);

      const { data } =
        await api.get<Event[]>("/eventos");

      classificarEventos(data);

    } catch (err) {

      console.error(
        "Erro ao carregar eventos:",
        err
      );

      setError(
        "Erro ao carregar eventos."
      );

    } finally {

      setLoading(false);

    }
  }

  function classificarEventos(
    eventos: Event[]
  ) {

    const agora = new Date();

    const eventosOrdenados = [...eventos].sort(
      (a, b) =>
        new Date(a.data_hora_inicio).getTime() -
        new Date(b.data_hora_inicio).getTime()
    );

    // Eventos comuns
    const eventosPublicos =
      eventosOrdenados.filter(
        evento => !evento.eh_edital
      );

    // Editais
    const editaisAbertos =
      eventosOrdenados.filter(
        evento => evento.eh_edital
      );

    setEditais(editaisAbertos);

    setEventosEmExibicao(

      eventosPublicos.filter(evento => {

        const inicio =
          new Date(evento.data_hora_inicio);

        const fim =
          new Date(evento.data_hora_fim);

        return (
          inicio <= agora &&
          fim >= agora
        );

      })

    );

    setEventosEmBreve(

      eventosPublicos.filter(
        evento =>
          new Date(evento.data_hora_inicio) > agora
      )

    );

  }

  useEffect(() => {
    fetchEventos();
  }, []);

  return {
    loading,
    error,

    eventosEmExibicao,
    eventosEmBreve,

    editais,

    fetchEventos,
  };
}