export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString("pt-BR");
}

export function formatInputDate(date: string) {
  return new Date(date).toISOString().slice(0, 16);
}