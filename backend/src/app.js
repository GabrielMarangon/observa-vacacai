import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import contentRoutes from "./routes/contentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();
const defaultOrigins = ["http://localhost:5173"];
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origem nao permitida pelo servidor."));
    },
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "observa-vacacai-api" });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "observa-vacacai-api" });
});

app.use("/api/content", contentRoutes);
app.use("/api/reports", reportRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(400).json({
    ok: false,
    message: err.message || "Erro interno no servidor.",
  });
});

export default app;
