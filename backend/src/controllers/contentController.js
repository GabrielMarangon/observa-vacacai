import { getWeatherContent } from "../services/weatherService.js";

const homeContent = {
  hero: {
    title: "Observa Vacacaí",
    subtitle: "Denúncias, mapa e alertas para o Rio Vacacaí em São Gabriel/RS",
  },
};

export async function getHomeContent(_req, res) {
  const weatherContent = await getWeatherContent();

  res.json({
    ok: true,
    ...homeContent,
    ...weatherContent,
  });
}
