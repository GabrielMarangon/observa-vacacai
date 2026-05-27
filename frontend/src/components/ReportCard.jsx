import { formatOccurrenceType, formatReportStatus } from "../lib/formatters";

export default function ReportCard({ report }) {
  return (
    <article className="report-card">
      <div className="report-card-header">
        <strong>{formatOccurrenceType(report.type)}</strong>
        <span className="status-badge status-neutral">{formatReportStatus(report.status)}</span>
      </div>
      <p>{report.description}</p>
      <small>
        Lat. {report.latitude} | Long. {report.longitude}
      </small>
    </article>
  );
}
