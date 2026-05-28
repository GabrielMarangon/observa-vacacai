import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { apiFetch, createAuthHeaders } from "../lib/api";
import { exportReportsAsCsv, exportReportsAsJson } from "../lib/reportExports";
import {
  formatAddress,
  formatCoordinates,
  formatDateTime,
  formatOccurrenceType,
  formatReportMode,
  formatReportStatus,
  hasCoordinates,
} from "../lib/formatters";

const chartColors = ["#0d5d56", "#2c7f93", "#c6a85a", "#4f7c6c", "#8a5b3f"];

function buildCountSeries(reports, getLabel) {
  const counts = reports.reduce((accumulator, report) => {
    const label = getLabel(report);
    accumulator[label] = (accumulator[label] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value);
}

function BarChart({ title, description, items }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="panel chart-panel">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="chart-list">
        {items.map((item, index) => (
          <div className="chart-row" key={item.label}>
            <div className="chart-label">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
            <div className="chart-track">
              <div
                className="chart-fill"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  background: chartColors[index % chartColors.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const auth = useAuth();
  const [state, setState] = useState({
    loading: true,
    error: "",
    success: "",
    deletingId: null,
    deletingFilter: false,
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
          success: "",
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
          success: "",
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
    const baseReports = [...state.reports].sort(
      (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
    );

    if (state.filter === "todos") {
      return baseReports;
    }

    return baseReports.filter((report) => report.status === state.filter);
  }, [state.filter, state.reports]);

  const metrics = useMemo(() => {
    const total = state.reports.length;
    const abertas = state.reports.filter((report) => report.status === "recebida").length;
    const analise = state.reports.filter((report) => report.status === "em_analise").length;
    const identificadas = state.reports.filter((report) => !report.anonymous).length;
    const anonimas = state.reports.filter((report) => report.anonymous).length;
    const comImagem = state.reports.filter((report) => Boolean(report.imageDataUrl)).length;
    const comCoordenadas = state.reports.filter((report) => hasCoordinates(report)).length;

    return {
      total,
      abertas,
      analise,
      identificadas,
      anonimas,
      comImagem,
      comCoordenadas,
      percentualCoordenadas: total > 0 ? Math.round((comCoordenadas / total) * 100) : 0,
      percentualImagens: total > 0 ? Math.round((comImagem / total) * 100) : 0,
    };
  }, [state.reports]);

  const statusSeries = useMemo(
    () => buildCountSeries(state.reports, (report) => formatReportStatus(report.status)),
    [state.reports]
  );

  const typeSeries = useMemo(
    () => buildCountSeries(state.reports, (report) => formatOccurrenceType(report.type)),
    [state.reports]
  );

  const insights = useMemo(() => {
    const topType = typeSeries[0]?.label || "Sem registros";

    return [
      `${metrics.total} denúncias registradas no total.`,
      `${metrics.identificadas} denúncias identificadas e ${metrics.anonimas} anônimas.`,
      `${metrics.comImagem} denúncias incluem foto do local.`,
      `${metrics.percentualCoordenadas}% dos registros já possuem coordenadas para o mapa.`,
      `O tipo mais frequente no momento é: ${topType}.`,
    ];
  }, [metrics, typeSeries]);

  function handleExportCsv() {
    exportReportsAsCsv(filteredReports);
  }

  function handleExportJson() {
    exportReportsAsJson(filteredReports);
  }

  async function handleDeleteReport(reportId) {
    const confirmed = window.confirm(
      "Deseja excluir esta denúncia? Essa ação remove o registro atual do painel."
    );

    if (!confirmed) {
      return;
    }

    setState((current) => ({
      ...current,
      error: "",
      success: "",
      deletingId: reportId,
    }));

    try {
      const payload = await apiFetch(`/api/admin/reports/${reportId}`, {
        method: "DELETE",
        headers: createAuthHeaders(auth.token),
      });

      setState((current) => ({
        ...current,
        deletingId: null,
        success: payload.message,
        reports: current.reports.filter((report) => report.id !== reportId),
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        deletingId: null,
        error: error.message,
      }));
    }
  }

  async function handleDeleteFilteredReports() {
    if (filteredReports.length === 0) {
      return;
    }

    const scopeLabel =
      state.filter === "todos"
        ? `todas as ${filteredReports.length} denúncias`
        : `${filteredReports.length} denúncia(s) com status ${formatReportStatus(state.filter)}`;

    const confirmed = window.confirm(
      `Deseja excluir ${scopeLabel}? Essa ação remove os registros atuais do painel.`
    );

    if (!confirmed) {
      return;
    }

    setState((current) => ({
      ...current,
      error: "",
      success: "",
      deletingFilter: true,
    }));

    try {
      const query =
        state.filter === "todos"
          ? ""
          : `?status=${encodeURIComponent(state.filter)}`;

      const payload = await apiFetch(`/api/admin/reports${query}`, {
        method: "DELETE",
        headers: createAuthHeaders(auth.token),
      });

      setState((current) => ({
        ...current,
        deletingFilter: false,
        success: payload.message,
        reports: current.reports.filter(
          (report) => !payload.deletedIds.includes(report.id)
        ),
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        deletingFilter: false,
        error: error.message,
      }));
    }
  }

  return (
    <section className="page">
      <div className="panel">
        <h1>Painel do gestor</h1>
        <p>
          Leitura gerencial das denúncias com indicadores, gráficos simples,
          exportação e dados completos para acompanhamento do atendimento.
        </p>
        <p className="panel-caption">
          Sessão ativa do gestor {auth.user?.email}.
        </p>

        <div className="dashboard-grid">
          <div className="metric-card">
            <strong>{metrics.total}</strong>
            <span>Denúncias totais</span>
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
          <div className="metric-card">
            <strong>{metrics.comImagem}</strong>
            <span>Com foto</span>
          </div>
          <div className="metric-card">
            <strong>{metrics.comCoordenadas}</strong>
            <span>Com coordenadas</span>
          </div>
        </div>

        <div className="analytics-grid">
          <BarChart
            title="Distribuição por tipo"
            description="Ajuda a identificar os problemas ambientais mais recorrentes."
            items={typeSeries.length > 0 ? typeSeries : [{ label: "Sem registros", value: 0 }]}
          />
          <BarChart
            title="Distribuição por status"
            description="Mostra como o fluxo de atendimento está se comportando."
            items={statusSeries.length > 0 ? statusSeries : [{ label: "Sem registros", value: 0 }]}
          />
          <div className="panel chart-panel">
            <h2>Leitura rápida para decisão</h2>
            <p>Resumo executivo para a equipe gestora e para o órgão responsável.</p>
            <ul className="summary-list">
              {insights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="toolbar toolbar-wrap">
          <label>
            Filtrar tabela por status
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
          <div className="toolbar-actions">
            <button className="button button-secondary" type="button" onClick={handleExportCsv}>
              Exportar CSV
            </button>
            <button className="button button-secondary" type="button" onClick={handleExportJson}>
              Exportar JSON
            </button>
            <button
              className="button button-danger"
              type="button"
              onClick={handleDeleteFilteredReports}
              disabled={state.deletingFilter || filteredReports.length === 0}
            >
              {state.deletingFilter ? "Excluindo..." : "Excluir filtro atual"}
            </button>
          </div>
        </div>

        <p className="toolbar-note">
          Exclua registros somente após exportar ou confirmar que eles não são mais necessários.
        </p>

        {state.loading ? <p>Carregando denúncias...</p> : null}
        {state.error ? <p className="feedback-error">{state.error}</p> : null}
        {state.success ? <p className="feedback-success">{state.success}</p> : null}

        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Local</th>
                <th>Modalidade</th>
                <th>Denunciante</th>
                <th>Contato</th>
                <th>Foto</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{formatDateTime(report.createdAt)}</td>
                  <td>{formatOccurrenceType(report.type)}</td>
                  <td>{formatReportStatus(report.status)}</td>
                  <td>
                    <strong>{formatAddress(report)}</strong>
                    <div className="cell-note">
                      {hasCoordinates(report)
                        ? `Coordenadas: ${formatCoordinates(report)}`
                        : "Sem coordenadas informadas"}
                    </div>
                  </td>
                  <td>{formatReportMode(report)}</td>
                  <td>{report.reporterName || "Não informado"}</td>
                  <td>{report.contact || "Não informado"}</td>
                  <td>
                    {report.imageDataUrl ? (
                      <a
                        className="table-link"
                        href={report.imageDataUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir foto
                      </a>
                    ) : (
                      <span className="cell-note">Sem foto</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="button button-danger button-small"
                        type="button"
                        onClick={() => handleDeleteReport(report.id)}
                        disabled={state.deletingId === report.id || state.deletingFilter}
                      >
                        {state.deletingId === report.id ? "Excluindo..." : "Excluir"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!state.loading && filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="9">Nenhuma denúncia encontrada para o filtro selecionado.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
