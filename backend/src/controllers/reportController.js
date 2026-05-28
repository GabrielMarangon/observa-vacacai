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

export async function deleteAdminReport(req, res, next) {
  try {
    const report = await reportService.removeById(req.params.reportId);
    res.json({
      ok: true,
      message: "Denúncia excluída com sucesso.",
      deletedId: report.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdminReports(req, res, next) {
  try {
    const removedReports = await reportService.removeMany(req.query);
    res.json({
      ok: true,
      message:
        removedReports.length > 0
          ? `${removedReports.length} denúncia(s) excluída(s) com sucesso.`
          : "Nenhuma denúncia encontrada para exclusão.",
      deletedCount: removedReports.length,
      deletedIds: removedReports.map((report) => report.id),
    });
  } catch (error) {
    next(error);
  }
}
