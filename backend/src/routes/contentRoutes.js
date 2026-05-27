import { Router } from "express";
import { getHomeContent } from "../controllers/contentController.js";

const router = Router();

router.get("/home", getHomeContent);

export default router;
