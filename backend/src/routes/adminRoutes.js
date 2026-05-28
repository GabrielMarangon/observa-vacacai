import { Router } from "express";
import {
  deleteAdminReport,
  deleteAdminReports,
  listAdminReports,
} from "../controllers/reportController.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/reports", requireAdminAuth, listAdminReports);
router.delete("/reports/:reportId", requireAdminAuth, deleteAdminReport);
router.delete("/reports", requireAdminAuth, deleteAdminReports);

export default router;
