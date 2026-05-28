import {
  formatAddress,
  formatCoordinates,
  formatDateTime,
  formatOccurrenceType,
  formatReportMode,
  formatReportStatus,
} from "./formatters";

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function escapeCsvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function exportReportsAsCsv(reports) {
  const headers = [
    "Data",
    "Tipo",
    "Status",
    "Modalidade",
    "Endereço",
    "Coordenadas",
    "Denunciante",
    "Contato",
    "Foto",
    "Descrição",
  ];

  const rows = reports.map((report) => [
    formatDateTime(report.createdAt),
    formatOccurrenceType(report.type),
    formatReportStatus(report.status),
    formatReportMode(report),
    formatAddress(report),
    formatCoordinates(report),
    report.reporterName || "Não informado",
    report.contact || "Não informado",
    report.imageName || "Sem foto",
    report.description,
  ]);

  const content = [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(";"))
    .join("\n");

  downloadTextFile(
    `observa-vacacai-denuncias-${new Date().toISOString().slice(0, 10)}.csv`,
    `\uFEFF${content}`,
    "text/csv;charset=utf-8;"
  );
}

export function exportReportsAsJson(reports) {
  const compactReports = reports.map((report) => ({
    id: report.id,
    data: formatDateTime(report.createdAt),
    type: formatOccurrenceType(report.type),
    status: formatReportStatus(report.status),
    modalidade: formatReportMode(report),
    endereco: formatAddress(report),
    coordenadas: formatCoordinates(report),
    denunciante: report.reporterName || "Não informado",
    contato: report.contact || "Não informado",
    foto: report.imageName || "Sem foto",
    possuiFoto: Boolean(report.imageDataUrl),
    descricao: report.description,
  }));

  downloadTextFile(
    `observa-vacacai-denuncias-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(compactReports, null, 2),
    "application/json;charset=utf-8;"
  );
}
