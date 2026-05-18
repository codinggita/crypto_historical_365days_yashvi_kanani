import { Router } from "express";
import {
  getAllCoins,
  getCoinById,
  createCoin,
  updateCoin,
  deleteCoin,
  searchCoins,
  getTrendingCoins,
  getTopGainers,
  getTopLosers,
  getRecentCoins,
  getRandomCoin,
  getSuggestions,
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

router.route("/search").get(verifyJWT, searchCoinValidator(), searchCoins);
router.route("/trending").get(verifyJWT, getTrendingCoins);
router.route("/gainers").get(verifyJWT, getTopGainers);
router.route("/losers").get(verifyJWT, getTopLosers);
router.route("/recent").get(verifyJWT, getRecentCoins);
router.route("/random").get(verifyJWT, getRandomCoin);
router.route("/suggestions").get(verifyJWT, getSuggestions);

router
  .route("/")
  .get(verifyJWT, queryCoinValidator(), getAllCoins)
  .post(verifyJWT, authorizeRoles("admin"), createCoinValidator(), createCoin);

router
  .route("/:id")
  .get(verifyJWT, getCoinById)
  .put(verifyJWT, authorizeRoles("admin"), updateCoinValidator(), updateCoin)
  .patch(verifyJWT, authorizeRoles("admin"), updateCoinValidator(), updateCoin)
  .delete(verifyJWT, authorizeRoles("admin"), deleteCoin);

export default router;
