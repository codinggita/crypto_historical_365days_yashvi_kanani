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
  getRecentCoins,
  getRandomCoin,
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

// Specific named routes must come before /:id to avoid parameter collision
router.route("/trending").get(getTrendingCoins);
router.route("/top-gainers").get(getTopGainers);
router.route("/top-losers").get(getTopLosers);
router.route("/market/summary").get(getMarketSummary);
router.route("/search/global").get(searchCoinValidator(), getGlobalSearch);
router.route("/recent").get(getRecentCoins);
router.route("/random").get(getRandomCoin);

// Collection routes
router
  .route("/")
  .get(queryCoinValidator(), getAllCoins)
  .post(authorizeRoles("admin"), createCoinValidator(), createCoin);

// Resource routes with dynamic id parameter
router
  .route("/:id")
  .get(getCoinById)
  .patch(authorizeRoles("admin"), updateCoinValidator(), updateCoin)
  .put(authorizeRoles("admin"), createCoinValidator(), replaceCoin)
  .delete(authorizeRoles("admin"), deleteCoin);

export default router;
