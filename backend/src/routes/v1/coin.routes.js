import { Router } from "express";
import {
  getAllCoins,
  getCoinById,
  createCoin,
  updateCoin,
  deleteCoin,
  searchCoins,
  getTrendingCoins,
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

router.route("/search").get(searchCoinValidator(), searchCoins);

router.route("/trending").get(getTrendingCoins);

router
  .route("/")
  .get(queryCoinValidator(), getAllCoins)
  .post(verifyJWT, authorizeRoles("admin"), createCoinValidator(), createCoin);

router
  .route("/:id")
  .get(getCoinById)
  .patch(verifyJWT, authorizeRoles("admin"), updateCoinValidator(), updateCoin)
  .delete(verifyJWT, authorizeRoles("admin"), deleteCoin);

export default router;
