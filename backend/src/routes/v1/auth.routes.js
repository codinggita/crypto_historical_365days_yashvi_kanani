import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../../controllers/auth.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
  registerValidator,
  loginValidator,
} from "../../validators/auth.validator.js";

const router = Router();

router.route("/register").post(registerValidator(), registerUser);

router.route("/login").post(loginValidator(), loginUser);

router.route("/me").get(verifyJWT, getCurrentUser);

export default router;
