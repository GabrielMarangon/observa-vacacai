const homeContent = {
  hero: {
    title: "Observa Vacacai",
    subtitle: "Participacao cidada e monitoramento socioambiental em Sao Gabriel/RS",
  },
  institutionalMessage:
    "Canal colaborativo para registrar ocorrencias, compartilhar alertas e fortalecer o cuidado com o Rio Vacacai.",
  alerts: [
    {
      id: 1,
      title: "Nivel do rio em observacao",
      severity: "info",
    },
    {
      id: 2,
      title: "Mutirao de mata ciliar em preparacao",
      severity: "success",
    },
  ],
  quickLinks: [
    { label: "Nova denuncia", href: "/denuncias/nova" },
    { label: "Mapa interativo", href: "/mapa" },
    { label: "Alertas", href: "/alertas" },
  ],
};

export function getHomeContent(_req, res) {
  res.json({
    ok: true,
    ...homeContent,
  });
}
