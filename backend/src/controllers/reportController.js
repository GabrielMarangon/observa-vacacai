import { reportService } from "../services/reportService.js";

export async function listReports(req, res, next) {
  try {
    const reports = await reportService.list(req.query);
    res.json({ ok: true, reports });
  } catch (error) {
    next(error);
  }
}

export async function createReport(req, res, next) {
  try {
    const report = await reportService.create(req.body);
    res.status(201).json({
      ok: true,
      message: "Denúncia registrada com sucesso.",
      report,
    });
  } catch (error) {
    next(error);
  }
}
