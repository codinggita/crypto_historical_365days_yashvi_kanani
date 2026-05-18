import express from "express";
import ApiError from "../../utils/ApiError.js";
import httpStatus from "../../constants/httpStatus.js";

import authRoutes from "./auth.routes.js";
import coinRoutes from "./coin.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API working",
  });
});

router.get("/error-test", (req, res) => {
  throw new ApiError(httpStatus.BAD_REQUEST, "This is a test error");
});

router.use("/auth", authRoutes);
router.use("/coins", coinRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/users", userRoutes);

export default router;
