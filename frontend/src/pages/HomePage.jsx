import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { apiFetch } from "../lib/api";

const fallbackWeatherPanel = {
  title: "Previsão de chuva e risco de inundação",
  location: "São Gabriel/RS",
  summary:
    "Não foi possível atualizar a previsão automática agora. Tente novamente em instantes.",
  riskLabel: "Sem atualização",
  riskTone: "neutral",
  metrics: [
    { label: "Chuva em 24h", value: "-- mm" },
    { label: "Chuva em 48h", value: "-- mm" },
    { label: "Chance máxima", value: "-- %" },
  ],
  meta: "Fonte meteorológica: Open-Meteo",
};

const fallbackDailyNotice = {
  label: "Aviso em atualização",
  tone: "neutral",
  title: "A previsão automática está sendo atualizada",
  message:
    "Em caso de chuva forte ou situação de risco, acompanhe os avisos oficiais e use os contatos de emergência abaixo.",
  note: "Aviso automático do app.",
};

const fallbackAlerts = [
  {
    id: 1,
    title: "Os dados automáticos de chuva estão indisponíveis no momento.",
    severity: "warning",
  },
  {
    id: 2,
    title: "Em caso de alerta local, acompanhe os avisos oficiais da Defesa Civil.",
    severity: "info",
  },
];

const fallbackEmergencyContacts = [
  {
    id: "defesa-civil",
    label: "Defesa Civil",
    phone: "(55) 99933-5455",
    href: "tel:+5555999335455",
    emphasis: "primary",
  },
  {
    id: "prefeitura",
    label: "Prefeitura",
    phone: "0800 055 7064",
    href: "tel:08000557064",
    emphasis: "secondary",
  },
  {
    id: "bombeiros",
    label: "Bombeiros",
    phone: "193",
    href: "tel:193",
    emphasis: "secondary",
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
  const dailyNotice = apiState.data?.dailyNotice || fallbackDailyNotice;
  const alerts = apiState.data?.alerts || fallbackAlerts;
  const emergencyContacts = apiState.data?.emergencyContacts || fallbackEmergencyContacts;
  const primaryEmergencyContact =
    emergencyContacts.find((contact) => contact.emphasis === "primary") || emergencyContacts[0];
  const secondaryEmergencyContacts = emergencyContacts.filter(
    (contact) => contact.id !== primaryEmergencyContact?.id
  );

  const hasWeatherData = useMemo(
    () => weatherPanel.metrics.some((item) => !String(item.value).startsWith("--")),
    [weatherPanel]
  );

  return (
    <div className="page">
      <section className={`daily-alert daily-alert-${dailyNotice.tone}`}>
        <div className="daily-alert-copy">
          <span className="eyebrow">Aviso do dia</span>
          <h2>{dailyNotice.title}</h2>
          <p>{dailyNotice.message}</p>
          {dailyNotice.note ? <small>{dailyNotice.note}</small> : null}
        </div>
        <StatusBadge tone={dailyNotice.tone}>{dailyNotice.label}</StatusBadge>
      </section>

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

          <div className="weather-actions">
            {primaryEmergencyContact ? (
              <a className="button button-danger" href={primaryEmergencyContact.href}>
                Emergência: {primaryEmergencyContact.label}
              </a>
            ) : null}
            {secondaryEmergencyContacts.map((contact) => (
              <a key={contact.id} className="button button-secondary" href={contact.href}>
                {contact.label} {contact.phone}
              </a>
            ))}
          </div>

          <p className="weather-contact-note">
            Telefones úteis: {emergencyContacts.map((contact) => `${contact.label} ${contact.phone}`).join(" • ")}
          </p>

          {weatherPanel.meta ? <p className="weather-meta">{weatherPanel.meta}</p> : null}
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
