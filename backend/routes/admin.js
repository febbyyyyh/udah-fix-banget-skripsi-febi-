import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import { getDashboardStats } from "../controllers/adminDashboardController.js";

const router = express.Router();

router.get(
  "/dashboard",
  verifyToken,
  adminOnly,
  (req, res) => {
    res.json({
      message: "Selamat datang Admin",
      admin: req.user
    });
  }
);

router.get(
  "/dashboard-stats",
  verifyToken,
  getDashboardStats
);

export default router;