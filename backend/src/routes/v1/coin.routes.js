import { Router } from "express";
import {
  getAllCoins,
  getCoinById,
  createCoin,
  updateCoin,
  replaceCoin,
  deleteCoin,
  getTrendingCoins,
  getTopGainers,
  getTopLosers,
  getMarketSummary,
  getGlobalSearch,
} from "../../controllers/coin.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import {
  createCoinValidator,
  updateCoinValidator,
  queryCoinValidator,
  searchCoinValidator,
} from "../../validators/coin.validator.js";

const router = Router();

// Secure all endpoints with authentication middleware
router.use(verifyJWT);

// Register specific routes first to avoid route parameter collision with /:id
router.route("/trending").get(getTrendingCoins);
router.route("/top-gainers").get(getTopGainers);
router.route("/top-losers").get(getTopLosers);
router.route("/market/summary").get(getMarketSummary);
router.route("/search/global").get(searchCoinValidator(), getGlobalSearch);

// Generic collection route paths
router
  .route("/")
  .get(queryCoinValidator(), getAllCoins)
  .post(authorizeRoles("admin"), createCoinValidator(), createCoin);

// Resource route paths with dynamic id parameter
router
  .route("/:id")
  .get(getCoinById)
  .patch(authorizeRoles("admin"), updateCoinValidator(), updateCoin)
  .put(authorizeRoles("admin"), createCoinValidator(), replaceCoin)
  .delete(authorizeRoles("admin"), deleteCoin);

export default router;
