import { DateTime } from "luxon";

// Exibe data + hora no padrão brasileiro (25/07/2025 14:30)
export function formatarDataHoraBRT(isoString) {
  if (!isoString) return "";
  return DateTime.fromISO(isoString)
    .setZone('America/Sao_Paulo')
    .toFormat("dd/MM/yyyy HH:mm");
}

// Exibe só a data (25/07/2025)
export function formatarDataBRT(isoString) {
  if (!isoString) return "";
  return DateTime.fromISO(isoString)
    .setZone('America/Sao_Paulo')
    .toFormat("dd/MM/yyyy");
}
