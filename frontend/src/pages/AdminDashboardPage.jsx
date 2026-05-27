import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

export default function AdminDashboardPage() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    reports: [],
    filter: "todos",
  });

  useEffect(() => {
    let active = true;

    async function loadReports() {
      try {
        const payload = await apiFetch("/api/reports");
        if (!active) {
          return;
        }
        setState((current) => ({
          ...current,
          loading: false,
          error: "",
          reports: payload.reports,
        }));
      } catch (error) {
        if (!active) {
          return;
        }
        setState((current) => ({
          ...current,
          loading: false,
          error: error.message,
          reports: [],
        }));
      }
    }

    loadReports();

    return () => {
      active = false;
    };
  }, []);

  const filteredReports = useMemo(() => {
    if (state.filter === "todos") {
      return state.reports;
    }
    return state.reports.filter((report) => report.status === state.filter);
  }, [state.filter, state.reports]);

  const metrics = useMemo(() => {
    return {
      total: state.reports.length,
      abertas: state.reports.filter((report) => report.status === "recebida").length,
      analise: state.reports.filter((report) => report.status === "em_analise").length,
    };
  }, [state.reports]);

  return (
    <section className="page">
      <div className="panel">
        <h1>Painel do gestor</h1>
        <p>
          Estrutura inicial para listagem de denuncias, filtros e leitura rapida
          das ocorrencias registradas.
        </p>
        <div className="dashboard-grid">
          <div className="metric-card">
            <strong>{metrics.total}</strong>
            <span>Ocorrencias totais</span>
          </div>
          <div className="metric-card">
            <strong>{metrics.abertas}</strong>
            <span>Recebidas</span>
          </div>
          <div className="metric-card">
            <strong>{metrics.analise}</strong>
            <span>Em analise</span>
          </div>
        </div>
        <div className="toolbar">
          <label>
            Filtrar por status
            <select
              value={state.filter}
              onChange={(event) =>
                setState((current) => ({ ...current, filter: event.target.value }))
              }
            >
              <option value="todos">Todos</option>
              <option value="recebida">Recebida</option>
              <option value="em_analise">Em analise</option>
            </select>
          </label>
        </div>
        {state.loading ? <p>Carregando denuncias...</p> : null}
        {state.error ? <p className="feedback-error">{state.error}</p> : null}
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Status</th>
                <th>Descricao</th>
                <th>Localizacao</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.type}</td>
                  <td>{report.status}</td>
                  <td>{report.description}</td>
                  <td>
                    {report.latitude}, {report.longitude}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
