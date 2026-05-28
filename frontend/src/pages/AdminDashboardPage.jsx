import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { apiFetch } from "../lib/api";
import { formatOccurrenceType, formatReportStatus } from "../lib/formatters";
import { createAuthHeaders } from "../lib/api";

export default function AdminDashboardPage() {
  const auth = useAuth();
  const [state, setState] = useState({
    loading: true,
    error: "",
    reports: [],
    filter: "todos",
  });

  useEffect(() => {
    if (!auth.token) {
      return undefined;
    }

    let active = true;

    async function loadReports() {
      try {
        const payload = await apiFetch("/api/admin/reports", {
          headers: createAuthHeaders(auth.token),
        });
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
  }, [auth.token]);

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
      identificadas: state.reports.filter((report) => !report.anonymous).length,
    };
  }, [state.reports]);

  return (
    <section className="page">
      <div className="panel">
        <h1>Painel do gestor</h1>
        <p>
          Estrutura inicial para listagem de denúncias, filtros e leitura rápida
          das ocorrências registradas.
        </p>
        <p className="panel-caption">
          Sessão ativa de {auth.user?.name} ({auth.user?.email}).
        </p>
        <div className="dashboard-grid">
          <div className="metric-card">
            <strong>{metrics.total}</strong>
            <span>Ocorrências totais</span>
          </div>
          <div className="metric-card">
            <strong>{metrics.abertas}</strong>
            <span>Recebidas</span>
          </div>
          <div className="metric-card">
            <strong>{metrics.analise}</strong>
            <span>Em análise</span>
          </div>
          <div className="metric-card">
            <strong>{metrics.identificadas}</strong>
            <span>Identificadas</span>
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
              <option value="em_analise">Em análise</option>
            </select>
          </label>
        </div>
        {state.loading ? <p>Carregando denúncias...</p> : null}
        {state.error ? <p className="feedback-error">{state.error}</p> : null}
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Status</th>
                <th>Descrição</th>
                <th>Modalidade</th>
                <th>Denunciante</th>
                <th>Contato</th>
                <th>Localização</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{formatOccurrenceType(report.type)}</td>
                  <td>{formatReportStatus(report.status)}</td>
                  <td>{report.description}</td>
                  <td>{report.anonymous ? "Anônima" : "Identificada"}</td>
                  <td>{report.reporterName || "Não informado"}</td>
                  <td>{report.contact || "Não informado"}</td>
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
