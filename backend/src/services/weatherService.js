const DEFAULT_CONFIG = {
  apiUrl: "https://api.open-meteo.com/v1/forecast",
  latitude: -30.33639,
  longitude: -54.32,
  locationLabel: "São Gabriel/RS",
  timezone: "America/Sao_Paulo",
  cacheMinutes: 15,
  attention24hMm: 20,
  attention48hMm: 35,
  warning24hMm: 40,
  warning48hMm: 70,
  danger24hMm: 70,
  danger48hMm: 110,
};

const weatherCache = {
  expiresAt: 0,
  data: null,
};

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getConfig() {
  return {
    apiUrl: process.env.WEATHER_API_URL || DEFAULT_CONFIG.apiUrl,
    latitude: parseNumber(process.env.WEATHER_LATITUDE, DEFAULT_CONFIG.latitude),
    longitude: parseNumber(process.env.WEATHER_LONGITUDE, DEFAULT_CONFIG.longitude),
    locationLabel: process.env.WEATHER_LOCATION_LABEL || DEFAULT_CONFIG.locationLabel,
    timezone: process.env.WEATHER_TIMEZONE || DEFAULT_CONFIG.timezone,
    cacheMinutes: parseNumber(process.env.WEATHER_CACHE_MINUTES, DEFAULT_CONFIG.cacheMinutes),
    attention24hMm: parseNumber(
      process.env.WEATHER_RAIN_ATTENTION_24H_MM,
      DEFAULT_CONFIG.attention24hMm
    ),
    attention48hMm: parseNumber(
      process.env.WEATHER_RAIN_ATTENTION_48H_MM,
      DEFAULT_CONFIG.attention48hMm
    ),
    warning24hMm: parseNumber(
      process.env.WEATHER_RAIN_WARNING_24H_MM,
      DEFAULT_CONFIG.warning24hMm
    ),
    warning48hMm: parseNumber(
      process.env.WEATHER_RAIN_WARNING_48H_MM,
      DEFAULT_CONFIG.warning48hMm
    ),
    danger24hMm: parseNumber(
      process.env.WEATHER_RAIN_DANGER_24H_MM,
      DEFAULT_CONFIG.danger24hMm
    ),
    danger48hMm: parseNumber(
      process.env.WEATHER_RAIN_DANGER_48H_MM,
      DEFAULT_CONFIG.danger48hMm
    ),
  };
}

function sumRain(values, count) {
  return values.slice(0, count).reduce((total, value) => total + (Number(value) || 0), 0);
}

function maxValue(values) {
  return values.reduce((currentMax, value) => Math.max(currentMax, Number(value) || 0), 0);
}

function formatMillimeters(value) {
  const rounded = value >= 10 ? value.toFixed(0) : value.toFixed(1);
  return `${rounded} mm`;
}

function formatProbability(value) {
  return `${Math.round(value)}%`;
}

function formatUpdatedAt(timezone) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: timezone,
  }).format(new Date());
}

function buildRisk({ rain24h, rain48h, maxProbability, config }) {
  if (
    rain24h >= config.danger24hMm ||
    rain48h >= config.danger48hMm ||
    maxProbability >= 90
  ) {
    return {
      level: "high",
      label: "Risco alto",
      tone: "danger",
      summary:
        "Há previsão de chuva forte nas próximas horas. Redobre a atenção em áreas baixas e próximas ao rio.",
    };
  }

  if (
    rain24h >= config.warning24hMm ||
    rain48h >= config.warning48hMm ||
    maxProbability >= 75
  ) {
    return {
      level: "medium",
      label: "Atenção",
      tone: "warning",
      summary:
        "Existe previsão de chuva relevante nas próximas 48 horas. Acompanhe os avisos e monitore áreas suscetíveis a alagamento.",
    };
  }

  if (
    rain24h >= config.attention24hMm ||
    rain48h >= config.attention48hMm ||
    maxProbability >= 55
  ) {
    return {
      level: "watch",
      label: "Em observação",
      tone: "info",
      summary:
        "Há chance de chuva nas próximas 48 horas. Vale acompanhar novas atualizações ao longo do dia.",
    };
  }

  return {
    level: "low",
    label: "Sem alerta forte",
    tone: "success",
    summary:
      "Sem previsão de chuva volumosa no momento para a área observada do Rio Vacacaí.",
  };
}

function buildAlerts(risk, rain24h, rain48h, maxProbability) {
  const rain24hText = formatMillimeters(rain24h);
  const rain48hText = formatMillimeters(rain48h);
  const probabilityText = formatProbability(maxProbability);

  if (risk.level === "high") {
    return [
      {
        id: 1,
        title: `Previsão de ${rain48hText} nas próximas 48h. Evite áreas com histórico de alagamento.`,
        severity: "danger",
      },
      {
        id: 2,
        title: "Se houver elevação do rio, siga imediatamente os avisos da Defesa Civil.",
        severity: "warning",
      },
    ];
  }

  if (risk.level === "medium") {
    return [
      {
        id: 1,
        title: `Acumulado previsto de ${rain24hText} em 24h e chance de chuva de até ${probabilityText}.`,
        severity: "warning",
      },
      {
        id: 2,
        title: "Monitore pontos baixos, margens do rio e novos avisos ao longo do dia.",
        severity: "info",
      },
    ];
  }

  if (risk.level === "watch") {
    return [
      {
        id: 1,
        title: `Há possibilidade de chuva nas próximas horas, com acumulado de ${rain48hText} em 48h.`,
        severity: "info",
      },
      {
        id: 2,
        title: "Acompanhe atualizações caso o cenário de chuva aumente.",
        severity: "neutral",
      },
    ];
  }

  return [
    {
      id: 1,
      title: `Sem indicativo de chuva forte. Acumulado previsto: ${rain24hText} em 24h.`,
      severity: "success",
    },
    {
      id: 2,
      title: "O painel continuará atualizando automaticamente ao longo do dia.",
      severity: "neutral",
    },
  ];
}

function buildFallbackContent() {
  return {
    alerts: [
      {
        id: 1,
        title: "Os dados automáticos de chuva estão indisponíveis no momento.",
        severity: "warning",
      },
      {
        id: 2,
        title: "Em caso de alerta local, acompanhe os avisos oficiais da Defesa Civil.",
        severity: "info",
      },
    ],
    weatherPanel: {
      title: "Previsão de chuva e risco de inundação",
      location: getConfig().locationLabel,
      summary:
        "Não foi possível atualizar a previsão automática agora. Tente novamente em instantes.",
      riskLabel: "Sem atualização",
      riskTone: "neutral",
      metrics: [
        { label: "Chuva em 24h", value: "-- mm" },
        { label: "Chuva em 48h", value: "-- mm" },
        { label: "Chance máxima", value: "-- %" },
      ],
      meta: "Fonte meteorológica: Open-Meteo",
    },
  };
}

async function fetchWeatherForecast(config) {
  const url = new URL(config.apiUrl);
  url.searchParams.set("latitude", String(config.latitude));
  url.searchParams.set("longitude", String(config.longitude));
  url.searchParams.set("hourly", "precipitation,precipitation_probability");
  url.searchParams.set("forecast_hours", "48");
  url.searchParams.set("timeformat", "unixtime");
  url.searchParams.set("timezone", config.timezone);
  url.searchParams.set("precipitation_unit", "mm");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Previsão meteorológica indisponível (${response.status}).`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildWeatherContentFromApi(payload, config) {
  const precipitation = Array.isArray(payload?.hourly?.precipitation)
    ? payload.hourly.precipitation
    : [];
  const precipitationProbability = Array.isArray(payload?.hourly?.precipitation_probability)
    ? payload.hourly.precipitation_probability
    : [];

  if (precipitation.length === 0) {
    throw new Error("A API meteorológica não retornou dados de precipitação.");
  }

  const rain24h = sumRain(precipitation, 24);
  const rain48h = sumRain(precipitation, 48);
  const maxProbability = maxValue(precipitationProbability.slice(0, 48));
  const risk = buildRisk({ rain24h, rain48h, maxProbability, config });

  return {
    alerts: buildAlerts(risk, rain24h, rain48h, maxProbability),
    weatherPanel: {
      title: "Previsão de chuva e risco de inundação",
      location: config.locationLabel,
      summary: risk.summary,
      riskLabel: risk.label,
      riskTone: risk.tone,
      metrics: [
        { label: "Chuva em 24h", value: formatMillimeters(rain24h) },
        { label: "Chuva em 48h", value: formatMillimeters(rain48h) },
        { label: "Chance máxima", value: formatProbability(maxProbability) },
      ],
      meta: `Fonte meteorológica: Open-Meteo • Atualizado em ${formatUpdatedAt(
        config.timezone
      )}`,
    },
  };
}

export async function getWeatherContent() {
  const now = Date.now();

  if (weatherCache.data && weatherCache.expiresAt > now) {
    return weatherCache.data;
  }

  const config = getConfig();

  try {
    const payload = await fetchWeatherForecast(config);
    const content = buildWeatherContentFromApi(payload, config);

    weatherCache.data = content;
    weatherCache.expiresAt = now + config.cacheMinutes * 60 * 1000;

    return content;
  } catch (error) {
    console.error("Falha ao atualizar previsão meteorológica:", error);

    if (weatherCache.data) {
      return {
        ...weatherCache.data,
        weatherPanel: {
          ...weatherCache.data.weatherPanel,
          meta: `${weatherCache.data.weatherPanel.meta} • exibindo última atualização disponível`,
        },
      };
    }

    return buildFallbackContent();
  }
}
