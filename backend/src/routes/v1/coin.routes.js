const { Router } = require("express");
const {
  getAllCoins,
  getCoinById,
  createCoin,
  updateCoin,
  deleteCoin,
  searchCoins,
  getTrendingCoins,
} = require("../../controllers/coin.controller");
const { verifyJWT } = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");
const {
  createCoinValidator,
  updateCoinValidator,
  queryCoinValidator,
  searchCoinValidator,
} = require("../../validators/coin.validator");

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

module.exports = router;
