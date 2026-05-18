import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getStatsOverview,
} from "../../controllers/user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

const router = Router();

// Secure all user management endpoints to authenticated administrators globally
router.use(verifyJWT);
router.use(authorizeRoles("admin"));

// Map dashboard stats overview before parameter id routing to avoid collisions
router.route("/stats/overview").get(getStatsOverview);

router.route("/").get(getAllUsers);

router
  .route("/:id")
  .get(getUserById)
  .delete(deleteUser);

router.route("/:id/role").patch(updateUserRole);
router.route("/:id/status").patch(updateUserStatus);

export default router;
