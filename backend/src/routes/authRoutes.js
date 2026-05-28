import { Router } from "express";
import { getAdminSession, loginAdmin } from "../controllers/authController.js";
import { requireAdminAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.get("/me", requireAdminAuth, getAdminSession);

export default router;
