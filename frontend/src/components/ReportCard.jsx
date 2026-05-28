import {
  formatAddress,
  formatCoordinates,
  formatDateTime,
  formatOccurrenceType,
  formatReportStatus,
  hasCoordinates,
} from "../lib/formatters";

export default function ReportCard({ report }) {
  return (
    <article className="report-card">
      {report.imageDataUrl ? (
        <img
          className="report-card-image"
          src={report.imageDataUrl}
          alt={report.imageName || "Imagem da denúncia"}
        />
      ) : null}
      <div className="report-card-header">
        <strong>{formatOccurrenceType(report.type)}</strong>
        <span className="status-badge status-neutral">{formatReportStatus(report.status)}</span>
      </div>
      <p className="report-address">{formatAddress(report)}</p>
      <p>{report.description}</p>
      <div className="report-card-meta">
        <small>{formatDateTime(report.createdAt)}</small>
        <small>
          {hasCoordinates(report)
            ? `Coordenadas: ${formatCoordinates(report)}`
            : "Mapa disponível quando houver coordenadas."}
        </small>
      </div>
    </article>
  );
}
