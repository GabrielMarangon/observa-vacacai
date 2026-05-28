import crypto from "node:crypto";
import { getAuthConfig } from "../config/auth.js";

const header = {
  alg: "HS256",
  typ: "OVJWT",
};

function encodeSegment(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decodeSegment(segment) {
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf8"));
}

function signSegments(encodedHeader, encodedPayload, secret) {
  return crypto.createHmac("sha256", secret).update(`${encodedHeader}.${encodedPayload}`).digest("base64url");
}

export function issueAuthToken(user) {
  const authConfig = getAuthConfig();

  if (!authConfig.tokenSecret) {
    throw new Error("Segredo de autenticação não configurado.");
  }

  const now = Date.now();
  const payload = {
    sub: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + authConfig.tokenTtlHours * 60 * 60 * 1000,
  };

  const encodedHeader = encodeSegment(header);
  const encodedPayload = encodeSegment(payload);
  const signature = signSegments(encodedHeader, encodedPayload, authConfig.tokenSecret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token) {
  const authConfig = getAuthConfig();

  if (!authConfig.tokenSecret) {
    throw new Error("Segredo de autenticação não configurado.");
  }

  const segments = token.split(".");

  if (segments.length !== 3) {
    throw new Error("Token inválido.");
  }

  const [encodedHeader, encodedPayload, providedSignature] = segments;
  const expectedSignature = signSegments(encodedHeader, encodedPayload, authConfig.tokenSecret);

  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    throw new Error("Assinatura do token inválida.");
  }

  const payload = decodeSegment(encodedPayload);

  if (!payload.exp || Date.now() > payload.exp) {
    throw new Error("Sessão expirada.");
  }

  return payload;
}
