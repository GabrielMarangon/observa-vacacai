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
    title: "Denúncias ambientais",
    description:
      "Registre descarte irregular, esgoto, queimadas, erosão e outras ocorrências com foto e endereço.",
  },
  {
    icon: "M",
    title: "Mapa colaborativo",
    description:
      "Visualize pontos críticos do Rio Vacacaí e acompanhe a distribuição espacial das ocorrências.",
  },
  {
    icon: "A",
    title: "Alertas preventivos",
    description:
      "Receba avisos sobre risco ambiental, enchentes, ações emergenciais e recuperação da mata ciliar.",
  },
  {
    icon: "G",
    title: "Painel para gestores",
    description:
      "Filtre denúncias, acompanhe o status, exporte dados e visualize ocorrências de forma didática.",
  },
];

const quickAccess = [
  {
    to: "/denuncias/nova",
    title: "Nova denúncia",
    description: "Envie uma ocorrência com foto, descrição e endereço do local.",
  },
  {
    to: "/sugestoes",
    title: "Sugestões",
    description: "Compartilhe propostas de melhoria para o rio e seu entorno.",
  },
  {
    to: "/questionario",
    title: "Questionário",
    description: "Responda pesquisas para apoiar o diagnóstico socioambiental.",
  },
  {
    to: "/mapa",
    title: "Mapa interativo",
    description: "Acompanhe ocorrências e alterne entre ruas e satélite em um único painel.",
  },
];

const alerts = [
  "Nível do rio em observação nas proximidades da área urbana.",
  "Mutirão de restauração da mata ciliar previsto para o próximo sábado.",
  "Campanha de descarte regular de resíduos em bairros lindeiros ao Vacacaí.",
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
          <span className="eyebrow">Participação cidadã e monitoramento territorial</span>
          <h1>Observa Vacacaí</h1>
          <p>
            Plataforma web para moradores, pesquisadores e gestores acompanharem
            ocorrências ambientais, alertas preventivos e a recuperação do Rio
            Vacacaí em São Gabriel/RS.
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
            <StatusBadge tone="info">Monitoramento comunitário ativo</StatusBadge>
            <StatusBadge tone="success">Painel do gestor com exportação disponível</StatusBadge>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-river" />
          <div className="hero-card">
            <strong>Painel territorial em evolução</strong>
            <p>
              Base preparada para integrar denúncias com endereço, foto,
              questionários, camadas de APP e dados de risco.
            </p>
          </div>
        </div>
      </section>

      <section className="section-grid">
        <SectionTitle
          eyebrow="Conexão com a API"
          title="Status institucional em tempo real"
          description="A página inicial já consome o backend e exibe a resposta da API."
        />
        <div className="panel api-panel">
          {apiState.loading ? <p>Carregando informações do sistema...</p> : null}
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
          eyebrow="Acessos rápidos"
          title="Entradas principais do sistema"
          description="A navegação foi planejada para funcionar bem em celular e desktop."
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
          description="A estrutura já contempla os módulos centrais para participação cidadã e gestão pública."
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
            description="Transparência, resposta mais rápida e inteligência territorial para o Vacacaí."
          />
          <ul className="bullet-list">
            <li>Facilitar o envio de denúncias com evidência visual e endereço claro.</li>
            <li>Dar visibilidade a situações de risco e áreas vulneráveis.</li>
            <li>Organizar a resposta dos gestores em um painel único.</li>
            <li>Construir histórico para políticas de prevenção e recuperação ambiental.</li>
          </ul>
        </div>
        <div className="panel panel-alerts">
          <SectionTitle
            eyebrow="Alertas e avisos"
            title="Comunicação preventiva"
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
