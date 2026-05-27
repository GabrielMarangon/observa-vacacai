import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import QuickAccessCard from "../components/QuickAccessCard";
import SectionTitle from "../components/SectionTitle";
import StatusBadge from "../components/StatusBadge";
import { apiFetch } from "../lib/api";

const features = [
  {
    icon: "L",
    title: "Denuncias ambientais",
    description:
      "Registre descarte irregular, esgoto, queimadas, erosao e outras ocorrencias com foto e localizacao.",
  },
  {
    icon: "M",
    title: "Mapa colaborativo",
    description:
      "Visualize pontos criticos do Rio Vacacai e acompanhe a distribuicao espacial das ocorrencias.",
  },
  {
    icon: "A",
    title: "Alertas preventivos",
    description:
      "Receba avisos sobre risco ambiental, enchentes, acoes emergenciais e recuperacao da mata ciliar.",
  },
  {
    icon: "G",
    title: "Painel para gestores",
    description:
      "Filtre denuncias, acompanhe status, gere priorizacao e visualize ocorrencias no mapa.",
  },
];

const quickAccess = [
  {
    to: "/denuncias/nova",
    title: "Nova denuncia",
    description: "Envie uma ocorrencia com foto, descricao e localizacao.",
  },
  {
    to: "/sugestoes",
    title: "Sugestoes",
    description: "Compartilhe propostas de melhoria para o rio e seu entorno.",
  },
  {
    to: "/questionario",
    title: "Questionario",
    description: "Responda pesquisas para apoiar o diagnostico socioambiental.",
  },
  {
    to: "/mapa",
    title: "Mapa interativo",
    description: "Acompanhe ocorrencias e areas de atencao em um unico painel.",
  },
];

const alerts = [
  "Nivel do rio em observacao nas proximidades da area urbana.",
  "Mutirao de restauracao da mata ciliar previsto para o proximo sabado.",
  "Campanha de descarte regular de residuos em bairros lindeiros ao Vacacai.",
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

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Participacao cidada e monitoramento territorial</span>
          <h1>Observa Vacacai</h1>
          <p>
            Plataforma web para moradores, pesquisadores e gestores acompanharem
            ocorrencias ambientais, alertas preventivos e a recuperacao do Rio
            Vacacai em Sao Gabriel/RS.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/denuncias/nova">
              Registrar denuncia
            </Link>
            <Link className="button button-secondary" to="/mapa">
              Explorar mapa
            </Link>
          </div>
          <div className="hero-status">
            <StatusBadge tone="info">Monitoramento comunitario ativo</StatusBadge>
            <StatusBadge tone="success">Estrutura pronta para integracao climatica</StatusBadge>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-river" />
          <div className="hero-card">
            <strong>Painel territorial em evolucao</strong>
            <p>
              Base preparada para integrar denuncias georreferenciadas,
              questionarios, camadas de APP e dados de risco.
            </p>
          </div>
        </div>
      </section>

      <section className="section-grid">
        <SectionTitle
          eyebrow="Conexao com a API"
          title="Status institucional em tempo real"
          description="A home ja consome o backend local e exibe resposta da API."
        />
        <div className="panel api-panel">
          {apiState.loading ? <p>Carregando informacoes do sistema...</p> : null}
          {apiState.error ? <p className="feedback-error">{apiState.error}</p> : null}
          {apiState.data ? (
            <>
              <p>{apiState.data.institutionalMessage}</p>
              <div className="hero-status">
                {apiState.data.alerts.map((alert) => (
                  <StatusBadge key={alert.id} tone={alert.severity}>
                    {alert.title}
                  </StatusBadge>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="section-grid">
        <SectionTitle
          eyebrow="Acessos rapidos"
          title="Entradas principais do sistema"
          description="A navegacao foi planejada para funcionar bem em celular e desktop."
        />
        <div className="quick-grid">
          {quickAccess.map((item) => (
            <QuickAccessCard key={item.to} {...item} />
          ))}
        </div>
      </section>

      <section className="section-grid">
        <SectionTitle
          eyebrow="Funcionalidades"
          title="Base inicial do projeto"
          description="A estrutura ja contempla os modulos centrais para participacao cidada e gestao publica."
        />
        <div className="feature-grid">
          {features.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="two-column">
        <div className="panel">
          <SectionTitle
            eyebrow="Objetivos"
            title="O que o sistema pretende resolver"
            description="Transparencia, resposta mais rapida e inteligencia territorial para o Vacacai."
          />
          <ul className="bullet-list">
            <li>Facilitar o envio de denuncias com evidencia visual e espacial.</li>
            <li>Dar visibilidade a situacoes de risco e areas vulneraveis.</li>
            <li>Organizar a resposta dos gestores em um painel unico.</li>
            <li>Construir historico para politicas de prevencao e recuperacao ambiental.</li>
          </ul>
        </div>
        <div className="panel panel-alerts">
          <SectionTitle
            eyebrow="Alertas e avisos"
            title="Comunicacao preventiva"
            description="Exemplo de bloco para alertas ativos do sistema."
          />
          <div className="alert-list">
            {(apiState.data?.alerts?.map((item) => item.title) || alerts).map((alert) => (
              <div key={alert} className="alert-item">
                <span className="alert-dot" />
                <p>{alert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
