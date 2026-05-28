import { reportService } from "../services/reportService.js";

function toPublicReport(report) {
  return {
    id: report.id,
    type: report.type,
    description: report.description,
    address: report.address,
    referencePoint: report.referencePoint,
    imageDataUrl: report.imageDataUrl,
    imageName: report.imageName,
    status: report.status,
    anonymous: report.anonymous,
    createdAt: report.createdAt,
    latitude: report.latitude,
    longitude: report.longitude,
  };
}

function toAdminReport(report) {
  return {
    ...toPublicReport(report),
    reporterName: report.anonymous ? null : report.reporterName || null,
    contact: report.anonymous ? null : report.contact || null,
  };
}

export async function listPublicReports(req, res, next) {
  try {
    const reports = await reportService.list(req.query);
    res.json({ ok: true, reports: reports.map(toPublicReport) });
  } catch (error) {
    next(error);
  }
}

export async function listAdminReports(req, res, next) {
  try {
    const reports = await reportService.list(req.query);
    res.json({ ok: true, reports: reports.map(toAdminReport) });
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
      report: toPublicReport(report),
    });
  } catch (error) {
    next(error);
  }
}
