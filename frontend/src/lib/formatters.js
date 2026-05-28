const reportStatusLabels = {
  recebida: "Recebida",
  em_analise: "Em análise",
};

export function formatReportStatus(status) {
  if (!status) {
    return "Não informado";
  }

  return (
    reportStatusLabels[status] ||
    status.replaceAll("_", " ").replace(/^./, (character) => character.toUpperCase())
  );
}

export function formatOccurrenceType(type) {
  if (!type) {
    return "Tipo não informado";
  }

  return type.replaceAll("_", " ").replace(/^./, (character) => character.toUpperCase());
}

export function formatDateTime(value) {
  if (!value) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function hasCoordinates(report) {
  const latitude = Number(report?.latitude);
  const longitude = Number(report?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return false;
  }

  return !(latitude === 0 && longitude === 0);
}

export function formatCoordinates(report) {
  if (!hasCoordinates(report)) {
    return "Coordenadas não informadas";
  }

  return `${Number(report.latitude).toFixed(5)}, ${Number(report.longitude).toFixed(5)}`;
}

export function formatAddress(report) {
  if (!report) {
    return "Endereço não informado";
  }

  const parts = [report.address, report.referencePoint].filter(Boolean);
  return parts.length > 0 ? parts.join(" | ") : "Endereço não informado";
}

export function formatReportMode(report) {
  return report?.anonymous ? "Anônima" : "Identificada";
}
