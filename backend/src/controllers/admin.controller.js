import * as userService from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * GET /api/v1/admin/users - Get all users (paginated, searchable, filterable)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { users, meta } = await userService.getAllUsers(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully", meta));
});

/**
 * GET /api/v1/admin/users/:id - Get a single user by ID
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

/**
 * PATCH /api/v1/admin/users/:id/role - Update user role (admin | user)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const auditDetails = {
    ipAddress: req.ip || req.connection?.remoteAddress || "",
    userAgent: req.headers["user-agent"] || "",
  };

  const user = await userService.updateUserRole(
    req.user._id,
    req.params.id,
    role,
    auditDetails
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"));
});

/**
 * PATCH /api/v1/admin/users/:id/status - Activate or deactivate a user
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const auditDetails = {
    ipAddress: req.ip || req.connection?.remoteAddress || "",
    userAgent: req.headers["user-agent"] || "",
  };

  const user = await userService.updateUserStatus(
    req.user._id,
    req.params.id,
    isActive,
    auditDetails
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User status updated successfully"));
});

/**
 * DELETE /api/v1/admin/users/:id - Soft-delete a user account
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const auditDetails = {
    ipAddress: req.ip || req.connection?.remoteAddress || "",
    userAgent: req.headers["user-agent"] || "",
  };

  await userService.softDeleteUser(req.user._id, req.params.id, auditDetails);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

/**
 * GET /api/v1/admin/stats - Get platform-wide admin dashboard statistics
 */
export const getStatsOverview = asyncHandler(async (req, res) => {
  const stats = await userService.getStatsOverview();
  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Admin dashboard statistics fetched successfully")
    );
});
