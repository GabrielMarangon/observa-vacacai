import { getAuthConfig } from "../config/auth.js";
import { issueAuthToken } from "../utils/authToken.js";

function getAdminUser() {
  const authConfig = getAuthConfig();

  return {
    email: authConfig.adminEmail,
    name: authConfig.adminName,
    role: "admin",
  };
}

export function loginAdmin(req, res) {
  const authConfig = getAuthConfig();

  if (!authConfig.isConfigured) {
    return res.status(503).json({
      ok: false,
      message: "A autenticação administrativa ainda não foi configurada no servidor.",
    });
  }

  const email = req.body?.email?.trim().toLowerCase() || "";
  const password = req.body?.password || "";

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "Informe e-mail e senha para continuar.",
    });
  }

  if (
    email !== authConfig.adminEmail.toLowerCase() ||
    password !== authConfig.adminPassword
  ) {
    return res.status(401).json({
      ok: false,
      message: "E-mail ou senha do gestor inválidos.",
    });
  }

  const user = getAdminUser();

  return res.json({
    ok: true,
    token: issueAuthToken(user),
    user,
  });
}

export function getAdminSession(req, res) {
  return res.json({
    ok: true,
    user: {
      email: req.auth.sub,
      name: req.auth.name,
      role: req.auth.role,
    },
  });
}
