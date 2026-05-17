const { Router } = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../../controllers/auth.controller");
const { verifyJWT } = require("../../middlewares/auth.middleware");
const {
  registerValidator,
  loginValidator,
} = require("../../validators/auth.validator");

const router = Router();

router.route("/register").post(registerValidator(), registerUser);

router.route("/login").post(loginValidator(), loginUser);

router.route("/me").get(verifyJWT, getCurrentUser);

module.exports = router;
