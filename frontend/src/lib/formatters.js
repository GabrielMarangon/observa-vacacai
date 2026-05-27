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
