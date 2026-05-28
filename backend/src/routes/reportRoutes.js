import { Router } from "express";
import { createReport, listPublicReports } from "../controllers/reportController.js";

const router = Router();

router.get("/", listPublicReports);
router.post("/", createReport);

export default router;
