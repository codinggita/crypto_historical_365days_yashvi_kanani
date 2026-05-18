import { Router } from "express";
import {
  getOverview,
  getTopGainers,
  getTopLosers,
  getHighestMarketCap,
  getHighestVolume,
  getHighVolatility,
  getMonthlyReport,
  getYearlyReport,
  getMarketSummary,
  getPriceRanges,
} from "../../controllers/analytics.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

const router = Router();

// Apply verifyJWT globally for all analytics routes since they are all protected
router.use(verifyJWT);

// Standard Protected routes (accessible to any logged-in user)
router.get("/overview", getOverview);
router.get("/top-gainers", getTopGainers);
router.get("/top-losers", getTopLosers);
router.get("/highest-marketcap", getHighestMarketCap);
router.get("/highest-volume", getHighestVolume);
router.get("/volatility/high", getHighVolatility);
router.get("/price-ranges", getPriceRanges);

// Admin-Only routes
router.get("/monthly-report", authorizeRoles("admin"), getMonthlyReport);
router.get("/yearly-report", authorizeRoles("admin"), getYearlyReport);
router.get("/market-summary", authorizeRoles("admin"), getMarketSummary);

export default router;
