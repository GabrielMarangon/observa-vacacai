import { mockReports } from "./mockReports.js";

// Este armazenamento em memoria permite testar o fluxo localmente
// antes da conexao definitiva com PostgreSQL/Supabase.
function shouldSeedMockReports() {
  const configuredValue = process.env.SEED_MOCK_REPORTS?.trim().toLowerCase();

  if (configuredValue === "true") {
    return true;
  }

  if (configuredValue === "false") {
    return false;
  }

  return true;
}

export const memoryStore = {
  reports: shouldSeedMockReports() ? [...mockReports] : [],
};
