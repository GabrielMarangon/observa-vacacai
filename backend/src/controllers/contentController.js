const homeContent = {
  hero: {
    title: "Observa Vacacaí",
    subtitle: "Denúncias, mapa e alertas para o Rio Vacacaí em São Gabriel/RS",
  },
  alerts: [
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
  ],
  weatherPanel: {
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
  },
};

export function getHomeContent(_req, res) {
  res.json({
    ok: true,
    ...homeContent,
  });
}
