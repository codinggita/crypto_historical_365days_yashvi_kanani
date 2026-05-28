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
  checkAdmin,
  deleteProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
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

router.route("/login")
  .post(loginValidator(), loginUser)
  .options((req, res) => {
    res.set("Allow", "POST, OPTIONS");
    res.status(200).end();
  });

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/verify-email").post(verifyEmail);

// Protected Routes (Available to any logged-in user)
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);

router
  .route("/profile")
  .head(verifyJWT, (req, res) => {
    res.set("X-User-Authenticated", "true");
    res.status(200).end();
  })
  .get(verifyJWT, getCurrentUser)
  .patch(verifyJWT, updateProfileValidator(), updateProfile)
  .delete(verifyJWT, deleteProfile);

router.route("/change-password")
  .post(verifyJWT, changePasswordValidator(), changePassword)
  .patch(verifyJWT, changePasswordValidator(), changePassword);

// Admin-Only Routes
router.route("/admin/check").get(verifyJWT, authorizeRoles("admin"), checkAdmin);
router.route("/users").get(verifyJWT, authorizeRoles("admin"), getAllUsers);
router.route("/users/:id/role").patch(verifyJWT, authorizeRoles("admin"), updateUserRole);
router.route("/users/:id/status").patch(verifyJWT, authorizeRoles("admin"), updateUserStatus);

export default router;
