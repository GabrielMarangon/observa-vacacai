export function getAuthConfig() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const adminName = process.env.ADMIN_NAME?.trim() || "Gestor Observa Vacacaí";
  const tokenSecret = process.env.AUTH_TOKEN_SECRET || "";
  const tokenTtlHours = Number(process.env.AUTH_TOKEN_TTL_HOURS || 12);

  return {
    adminEmail,
    adminPassword,
    adminName,
    tokenSecret,
    tokenTtlHours: Number.isFinite(tokenTtlHours) && tokenTtlHours > 0 ? tokenTtlHours : 12,
    isConfigured: Boolean(adminEmail && adminPassword && tokenSecret),
  };
}
