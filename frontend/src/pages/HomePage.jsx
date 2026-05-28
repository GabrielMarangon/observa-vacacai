import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { apiFetch } from "../lib/api";

const fallbackWeatherPanel = {
  title: "Previsão de chuva e risco de inundação",
  location: "São Gabriel/RS",
  summary:
    "Acompanhe aqui a previsão de chuva e os avisos para a área urbana do Rio Vacacaí.",
  riskLabel: "Sem dados automáticos",
  riskTone: "neutral",
  metrics: [
    { label: "Chuva em 24h", value: "-- mm" },
    { label: "Chuva em 48h", value: "-- mm" },
    { label: "Risco de inundação", value: "Em observação" },
  ],
};

const fallbackAlerts = [
  {
    id: 1,
    title: "Em caso de chuva forte, acompanhe os avisos oficiais.",
    severity: "warning",
  },
  {
    id: 2,
    title: "Se houver cheia, siga as orientações da Defesa Civil.",
    severity: "info",
  },
];

export default function HomePage() {
  const [apiState, setApiState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  useEffect(() => {
    let active = true;

    async function loadHomeContent() {
      try {
        const payload = await apiFetch("/api/content/home");
        if (!active) {
          return;
        }
        setApiState({ loading: false, error: "", data: payload });
      } catch (error) {
        if (!active) {
          return;
        }
        setApiState({
          loading: false,
          error: error.message,
          data: null,
        });
      }
    }

    loadHomeContent();

    return () => {
      active = false;
    };
  }, []);

  const weatherPanel = apiState.data?.weatherPanel || fallbackWeatherPanel;
  const alerts = apiState.data?.alerts || fallbackAlerts;

  const hasWeatherData = useMemo(
    () => weatherPanel.metrics.some((item) => !String(item.value).startsWith("--")),
    [weatherPanel]
  );

  return (
    <div className="page">
      <section className="hero hero-home">
        <div className="hero-copy">
          <span className="eyebrow">Rio Vacacaí • São Gabriel/RS</span>
          <h1>Observa Vacacaí</h1>
          <p className="hero-lead">
            Registre uma denúncia, acompanhe o mapa e fique atento às condições de
            chuva e risco de inundação.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/denuncias/nova">
              Registrar denúncia
            </Link>
            <Link className="button button-secondary" to="/mapa">
              Explorar mapa
            </Link>
          </div>
          <div className="hero-status">
            <StatusBadge tone="success">Denúncia sem login</StatusBadge>
            <StatusBadge tone="info">Mapa com satélite</StatusBadge>
            <StatusBadge tone="warning">Atenção para chuva forte</StatusBadge>
          </div>
        </div>

        <div className="weather-panel">
          <div className="weather-panel-header">
            <div>
              <span className="eyebrow">{weatherPanel.location}</span>
              <h2>{weatherPanel.title}</h2>
            </div>
            <StatusBadge tone={weatherPanel.riskTone}>{weatherPanel.riskLabel}</StatusBadge>
          </div>
          <p className="weather-summary">{weatherPanel.summary}</p>
          <div className="weather-metrics">
            {weatherPanel.metrics.map((item) => (
              <div key={item.label} className="weather-metric">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
          <div className="weather-alerts">
            {alerts.map((alert) => (
              <StatusBadge key={alert.id} tone={alert.severity}>
                {alert.title}
              </StatusBadge>
            ))}
          </div>
          {!hasWeatherData ? (
            <p className="weather-footnote">
              Os dados automáticos de chuva ainda não estão disponíveis. Em caso de
              alerta, acompanhe os avisos oficiais.
            </p>
          ) : null}
        </div>
      </section>

      {apiState.error ? (
        <section className="section-grid">
          <div className="panel">
            <p className="feedback-error">
              Não foi possível atualizar as informações de chuva agora.
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
