import express from "express";
import ApiError from "../../utils/ApiError.js";
import httpStatus from "../../constants/httpStatus.js";

import authRoutes from "./auth.routes.js";
import coinRoutes from "./coin.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import userRoutes from "./user.routes.js";
import portfolioRoutes from "./portfolio.routes.js";
import bookmarkRoutes from "./bookmark.routes.js";
import searchRoutes from "./search.routes.js";
import adminRoutes from "./admin.routes.js";
import statsRoutes from "./stats.routes.js";
import jwtRoutes from "./jwt.routes.js";
import middlewareRoutes from "./middleware.routes.js";

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
router.use("/portfolio", portfolioRoutes);
router.use("/bookmarks", bookmarkRoutes);
router.use("/search", searchRoutes);
router.use("/admin", adminRoutes);
router.use("/stats", statsRoutes);
router.use("/jwt", jwtRoutes);
router.use("/middleware", middlewareRoutes);

export default router;
