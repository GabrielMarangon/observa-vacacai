import { memoryStore } from "../data/memoryStore.js";

function normalizeStatus(value) {
  return value || "recebida";
}

function normalizeBoolean(value) {
  return value === true || value === "true";
}

function validateReportPayload(payload) {
  if (!payload.type?.trim()) {
    throw new Error("Informe o tipo da ocorrencia.");
  }

  if (!payload.description?.trim()) {
    throw new Error("Informe a descricao da denuncia.");
  }

  if (!normalizeBoolean(payload.anonymous)) {
    if (!payload.reporterName?.trim() && !payload.contact?.trim()) {
      throw new Error(
        "Informe nome ou contato do denunciante, ou marque a opcao anonima."
      );
    }
  }

  const latitude = Number(payload.latitude);
  const longitude = Number(payload.longitude);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw new Error("Informe latitude e longitude validas.");
  }
}

export const reportService = {
  async list(filters = {}) {
    return memoryStore.reports.filter((report) => {
      if (filters.type && report.type !== filters.type) {
        return false;
      }
      if (filters.status && report.status !== filters.status) {
        return false;
      }
      return true;
    });
  },

  async create(payload) {
    validateReportPayload(payload);

    // O armazenamento em memoria fica como camada temporaria.
    // A futura persistencia em PostgreSQL deve substituir este push.
    const report = {
      id: memoryStore.reports.length + 1,
      type: payload.type.trim(),
      description: payload.description.trim(),
      reporterName: payload.reporterName?.trim() || null,
      contact: payload.contact?.trim() || null,
      status: normalizeStatus(payload.status),
      anonymous: normalizeBoolean(payload.anonymous),
      createdAt: new Date().toISOString(),
      latitude: Number(payload.latitude),
      longitude: Number(payload.longitude),
    };

    memoryStore.reports.push(report);
    return report;
  },
};
