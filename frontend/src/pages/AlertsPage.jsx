import StatusBadge from "../components/StatusBadge";

const alerts = [
  { title: "Atencao para acumulado de chuva", tone: "warning" },
  { title: "Mutirao de limpeza confirmado", tone: "success" },
  { title: "Monitoramento de margens em andamento", tone: "info" },
];

export default function AlertsPage() {
  return (
    <section className="page">
      <div className="panel">
        <h1>Alertas e avisos</h1>
        <p>Area dedicada a comunicados preventivos e informes operacionais.</p>
        <div className="alert-list">
          {alerts.map((alert) => (
            <div key={alert.title} className="alert-item">
              <StatusBadge tone={alert.tone}>{alert.title}</StatusBadge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
