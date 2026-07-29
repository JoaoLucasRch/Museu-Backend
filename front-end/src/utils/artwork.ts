export function formatArtworkText(
  text: string,
  maxLength: number = 60
) {
  if (!text) return "";

  return text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text;
}

export function getArtworkStatusColor(
  status: string
) {
  switch (status) {
    case "pendente":
      return "#da9f408d";

    case "aprovada":
      return "#173c30f6";

    case "rejeitada":
      return "#5d1212cf";

    default:
      return "#6B7280";
  }
}