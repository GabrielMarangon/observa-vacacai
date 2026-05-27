import { mockReports } from "./mockReports.js";

// Este armazenamento em memoria permite testar o fluxo localmente
// antes da conexao definitiva com PostgreSQL/Supabase.
export const memoryStore = {
  reports: [...mockReports],
};
