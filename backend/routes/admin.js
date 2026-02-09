import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { adminOnly } from "../middlewares/adminOnly.js";

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

export default router;