import { Router } from "express";
import {
  addPortfolioItem,
  getPortfolios,
  getPortfolioItemById,
  updatePortfolioItem,
  deletePortfolioItem,
  getAnalyticsSummary,
  getAnalyticsDistribution,
  getAnalyticsHistory,
  getDashboardOverview,
} from "../../controllers/portfolio.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

// Secure all simulation endpoints using user validation globally
router.use(verifyJWT);

// Map high-performance analytical aggregates prior to dynamic id routes to avoid collisions
router.route("/dashboard/overview").get(getDashboardOverview);
router.route("/analytics/summary").get(getAnalyticsSummary);
router.route("/analytics/distribution").get(getAnalyticsDistribution);
router.route("/analytics/history").get(getAnalyticsHistory);

router
  .route("/")
  .get(getPortfolios)
  .post(addPortfolioItem);

router
  .route("/:id")
  .get(getPortfolioItemById)
  .patch(updatePortfolioItem)
  .delete(deletePortfolioItem);

export default router;
