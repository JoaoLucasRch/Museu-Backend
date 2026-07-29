export function formatarData(
  dataString: string
): string {

  const data = new Date(dataString);

  if (isNaN(data.getTime())) {
    return "Data inválida";
  }

  const dia = data.getDate();

  const mes = data.toLocaleDateString(
    "pt-BR",
    {
      month: "short",
    }
  );

  return `${dia} ${
    mes.charAt(0).toUpperCase() +
    mes.slice(1, 3)
  }`;
}

export function formatarHorarioCompleto(
  inicio: string,
  fim: string
): string {

  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);

  if (
    isNaN(dataInicio.getTime()) ||
    isNaN(dataFim.getTime())
  ) {
    return "Horário indisponível";
  }

  const formatoHora: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const formatoData: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };

  const dataInicioTexto =
    dataInicio
      .toLocaleDateString(
        "pt-BR",
        formatoData
      )
      .replace(".", "");

  const dataFimTexto =
    dataFim
      .toLocaleDateString(
        "pt-BR",
        formatoData
      )
      .replace(".", "");

  const horaInicio =
    dataInicio.toLocaleTimeString(
      "pt-BR",
      formatoHora
    );

  const horaFim =
    dataFim.toLocaleTimeString(
      "pt-BR",
      formatoHora
    );

  if (
    dataInicio.toDateString() ===
    dataFim.toDateString()
  ) {
    return `${dataInicioTexto} ${horaInicio} - ${horaFim}`;
  }

  return `${dataInicioTexto} ${horaInicio} - ${dataFimTexto} ${horaFim}`;
}

/**
 * Utilitário para datas de submissão dos editais.
 */
export function formatarPeriodo(
  inicio: string,
  fim: string
): string {

  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);

  if (
    isNaN(dataInicio.getTime()) ||
    isNaN(dataFim.getTime())
  ) {
    return "Período indisponível";
  }

  return `${dataInicio.toLocaleDateString("pt-BR")} até ${dataFim.toLocaleDateString("pt-BR")}`;
}