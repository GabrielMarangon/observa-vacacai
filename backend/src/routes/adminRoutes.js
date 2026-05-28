import { Router } from "express";
import { listAdminReports } from "../controllers/reportController.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/reports", requireAdminAuth, listAdminReports);

export default router;
