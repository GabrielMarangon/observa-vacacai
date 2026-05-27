export default function ReportCard({ report }) {
  return (
    <article className="report-card">
      <div className="report-card-header">
        <strong>{report.type}</strong>
        <span className="status-badge status-neutral">{report.status}</span>
      </div>
      <p>{report.description}</p>
      <small>
        Lat {report.latitude} • Long {report.longitude}
      </small>
    </article>
  );
}
