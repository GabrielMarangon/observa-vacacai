import { verifyAuthToken } from "../utils/authToken.js";

export function requireAdminAuth(req, res, next) {
  const authorization = req.get("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      message: "Faça login como gestor para acessar esta área.",
    });
  }

  const token = authorization.slice("Bearer ".length).trim();

  try {
    const session = verifyAuthToken(token);

    if (session.role !== "admin") {
      return res.status(403).json({
        ok: false,
        message: "Seu perfil não possui permissão para esta operação.",
      });
    }

    req.auth = session;
    return next();
  } catch (_error) {
    return res.status(401).json({
      ok: false,
      message: "Sessão administrativa inválida ou expirada.",
    });
  }
}
