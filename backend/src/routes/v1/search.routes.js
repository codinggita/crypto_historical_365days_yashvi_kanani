import { Router } from "express";
import {
  searchCoins,
  getRecentSearches,
  clearRecentSearches,
  getTrendingSearches,
} from "../../controllers/search.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

// All search history and query operations require authentication context
router.use(verifyJWT);

// Specific history and aggregate analytical endpoints first to avoid parameter collision
router
  .route("/recent")
  .get(getRecentSearches)
  .delete(clearRecentSearches);

router.route("/trending").get(getTrendingSearches);

// Main search execution route
router.route("/").get(searchCoins);

export default router;
