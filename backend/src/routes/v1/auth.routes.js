import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  changePassword,
  logoutUser,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
} from "../../controllers/auth.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} from "../../validators/auth.validator.js";

const router = Router();

// Public Routes
router.route("/register").post(registerValidator(), registerUser);
router.route("/login").post(loginValidator(), loginUser);

// Protected Routes (Available to any logged-in user)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);
router
  .route("/profile")
  .get(verifyJWT, getCurrentUser)
  .patch(verifyJWT, updateProfileValidator(), updateProfile);

router.route("/change-password").patch(verifyJWT, changePasswordValidator(), changePassword);

// Admin-Only Routes
router.route("/users").get(verifyJWT, authorizeRoles("admin"), getAllUsers);
router.route("/users/:id/role").patch(verifyJWT, authorizeRoles("admin"), updateUserRole);
router.route("/users/:id/status").patch(verifyJWT, authorizeRoles("admin"), updateUserStatus);

export default router;
