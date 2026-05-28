import { useEffect, useState } from "react";
import ReportsMap from "../components/ReportsMap";
import ReportCard from "../components/ReportCard";
import { apiFetch } from "../lib/api";

export default function MapPage() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    reports: [],
  });

  useEffect(() => {
    let active = true;

    async function loadReports() {
      try {
        const payload = await apiFetch("/api/reports");
        if (!active) {
          return;
        }
        setState({
          loading: false,
          error: "",
          reports: payload.reports,
        });
      } catch (error) {
        if (!active) {
          return;
        }
        setState({
          loading: false,
          error: error.message,
          reports: [],
        });
      }
    }

    loadReports();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="page">
      <div className="panel">
        <h1>Mapa interativo do Vacacaí</h1>
        <p>
          Esta visão permite alternar entre ruas e satélite. As denúncias aparecem
          no mapa quando houver coordenadas, e todas seguem listadas com endereço
          logo abaixo.
        </p>
        {state.loading ? <p>Carregando mapa e ocorrências...</p> : null}
        {state.error ? <p className="feedback-error">{state.error}</p> : null}
        <ReportsMap reports={state.reports} />
        <div className="report-grid">
          {state.reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </section>
  );
}
