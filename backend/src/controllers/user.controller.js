import * as userService from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Get all users with paginated search, filtering, and sorting
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { users, meta } = await userService.getAllUsers(req.query);
  return res.status(200).json(
    new ApiResponse(200, users, "Users fetched successfully", meta)
  );
});

/**
 * Get single user by ID
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return res.status(200).json(
    new ApiResponse(200, user, "User fetched successfully")
  );
});

/**
 * Update user role
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const auditDetails = {
    ipAddress: req.ip || req.connection?.remoteAddress || "",
    userAgent: req.headers["user-agent"] || ""
  };

  const user = await userService.updateUserRole(req.user._id, req.params.id, role, auditDetails);
  return res.status(200).json(
    new ApiResponse(200, user, "User role updated successfully")
  );
});

/**
 * Update user active/inactive status
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const auditDetails = {
    ipAddress: req.ip || req.connection?.remoteAddress || "",
    userAgent: req.headers["user-agent"] || ""
  };

  const user = await userService.updateUserStatus(req.user._id, req.params.id, isActive, auditDetails);
  return res.status(200).json(
    new ApiResponse(200, user, "User status updated successfully")
  );
});

/**
 * Soft delete user profile
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const auditDetails = {
    ipAddress: req.ip || req.connection?.remoteAddress || "",
    userAgent: req.headers["user-agent"] || ""
  };

  await userService.softDeleteUser(req.user._id, req.params.id, auditDetails);
  return res.status(200).json(
    new ApiResponse(200, null, "User soft-deleted successfully")
  );
});

/**
 * Get administrative dashboard stats summary overview
 */
export const getStatsOverview = asyncHandler(async (req, res) => {
  const stats = await userService.getStatsOverview();
  return res.status(200).json(
    new ApiResponse(200, stats, "Dashboard overview statistics fetched successfully")
  );
});
