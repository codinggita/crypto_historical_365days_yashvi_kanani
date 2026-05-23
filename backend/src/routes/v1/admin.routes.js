import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getStatsOverview,
} from "../../controllers/admin.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import {
  updateRoleValidator,
  updateStatusValidator,
  deleteUserValidator,
} from "../../validators/user.validator.js";

const router = Router();

// All admin routes require authenticated admin
router.use(verifyJWT);
router.use(authorizeRoles("admin"));

// Dashboard stats — defined before /:id to avoid collision
router.route("/stats").get(getStatsOverview);

// User listing and creation
router.route("/users").get(getAllUsers);

// Single user operations
router
  .route("/users/:id")
  .get(getUserById)
  .delete(deleteUserValidator(), deleteUser);

// Role and status management
router.route("/users/:id/role").patch(updateRoleValidator(), updateUserRole);
router.route("/users/:id/status").patch(updateStatusValidator(), updateUserStatus);

export default router;
