const homeContent = {
  hero: {
    title: "Observa Vacacaí",
    subtitle: "Participação cidadã e monitoramento socioambiental em São Gabriel/RS",
  },
  institutionalMessage:
    "Canal colaborativo para registrar ocorrências, compartilhar alertas e fortalecer o cuidado com o Rio Vacacaí.",
  alerts: [
    {
      id: 1,
      title: "Nível do rio em observação",
      severity: "info",
    },
    {
      id: 2,
      title: "Mutirão de mata ciliar em preparação",
      severity: "success",
    },
  ],
  quickLinks: [
    { label: "Nova denúncia", href: "/denuncias/nova" },
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
