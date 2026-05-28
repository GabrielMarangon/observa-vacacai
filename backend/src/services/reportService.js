import { memoryStore } from "../data/memoryStore.js";

function normalizeStatus(value) {
  return value || "recebida";
}

function normalizeBoolean(value) {
  return value === true || value === "true";
}

function normalizeOptionalText(value) {
  return value?.trim() || null;
}

function normalizeCoordinate(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? Number.NaN : numberValue;
}

function normalizeId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Identificador de denúncia inválido.");
  }

  return id;
}

function matchesFilters(report, filters = {}) {
  if (filters.type && report.type !== filters.type) {
    return false;
  }

  if (filters.status && report.status !== filters.status) {
    return false;
  }

  return true;
}

function getNextReportId() {
  const currentMax = memoryStore.reports.reduce(
    (maxId, report) => Math.max(maxId, Number(report.id) || 0),
    0
  );

  return currentMax + 1;
}

function validateReportPayload(payload) {
  if (!payload.type?.trim()) {
    throw new Error("Informe o tipo da ocorrência.");
  }

  if (!payload.description?.trim()) {
    throw new Error("Informe a descrição da denúncia.");
  }

  if (!payload.address?.trim()) {
    throw new Error("Informe o endereço ou ponto de referência da ocorrência.");
  }

  if (!normalizeBoolean(payload.anonymous)) {
    if (!payload.reporterName?.trim() && !payload.contact?.trim()) {
      throw new Error(
        "Informe o nome ou o contato do denunciante, ou marque a opção anônima."
      );
    }
  }

  const latitude = normalizeCoordinate(payload.latitude);
  const longitude = normalizeCoordinate(payload.longitude);
  const informedLatitude = payload.latitude !== "" && payload.latitude !== null && payload.latitude !== undefined;
  const informedLongitude =
    payload.longitude !== "" && payload.longitude !== null && payload.longitude !== undefined;

  if (informedLatitude !== informedLongitude) {
    throw new Error("Informe latitude e longitude juntas, ou deixe ambas em branco.");
  }

  if (
    (informedLatitude || informedLongitude) &&
    (Number.isNaN(latitude) || Number.isNaN(longitude))
  ) {
    throw new Error("Informe latitude e longitude válidas.");
  }

  if ((informedLatitude || informedLongitude) && Math.abs(latitude) > 90) {
    throw new Error("Informe uma latitude válida.");
  }

  if ((informedLatitude || informedLongitude) && Math.abs(longitude) > 180) {
    throw new Error("Informe uma longitude válida.");
  }

  if ((informedLatitude || informedLongitude) && latitude === 0 && longitude === 0) {
    throw new Error("Selecione um ponto real no mapa ou deixe as coordenadas em branco.");
  }

  if (payload.imageDataUrl && !payload.imageDataUrl.startsWith("data:image/")) {
    throw new Error("A imagem enviada não é válida.");
  }
}

export const reportService = {
  async list(filters = {}) {
    return memoryStore.reports.filter((report) => matchesFilters(report, filters));
  },

  async create(payload) {
    validateReportPayload(payload);

    const latitude = normalizeCoordinate(payload.latitude);
    const longitude = normalizeCoordinate(payload.longitude);

    // O armazenamento em memória fica como camada temporária.
    // A futura persistência em PostgreSQL deve substituir este push.
    const report = {
      id: getNextReportId(),
      type: payload.type.trim(),
      description: payload.description.trim(),
      address: payload.address.trim(),
      referencePoint: normalizeOptionalText(payload.referencePoint),
      reporterName: normalizeOptionalText(payload.reporterName),
      contact: normalizeOptionalText(payload.contact),
      imageDataUrl: payload.imageDataUrl || null,
      imageName: normalizeOptionalText(payload.imageName),
      status: normalizeStatus(payload.status),
      anonymous: normalizeBoolean(payload.anonymous),
      createdAt: new Date().toISOString(),
      latitude,
      longitude,
    };

    memoryStore.reports.push(report);
    return report;
  },

  async removeById(reportId) {
    const normalizedId = normalizeId(reportId);
    const reportIndex = memoryStore.reports.findIndex((report) => report.id === normalizedId);

    if (reportIndex === -1) {
      throw new Error("Denúncia não encontrada.");
    }

    const [removedReport] = memoryStore.reports.splice(reportIndex, 1);
    return removedReport;
  },

  async removeMany(filters = {}) {
    const removedReports = [];
    const remainingReports = [];

    for (const report of memoryStore.reports) {
      if (matchesFilters(report, filters)) {
        removedReports.push(report);
      } else {
        remainingReports.push(report);
      }
    }

    memoryStore.reports = remainingReports;
    return removedReports;
  },
};
