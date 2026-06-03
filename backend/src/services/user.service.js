import mongoose from "mongoose";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import ApiError from "../utils/ApiError.js";

/**
 * Validate MongoDB ID helper
 */
const validateMongoId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid User ID format");
  }
};

/**
 * Get all users with paginated search, filtering, and sorting
 */
export const getAllUsers = async (queryParams) => {
  const query = { isDeleted: { $ne: true } };

  // Search by name/email using case-insensitive regex
  if (queryParams.q && queryParams.q.trim() !== "") {
    const searchRegex = { $regex: queryParams.q.trim(), $options: "i" };
    query.$or = [
      { name: searchRegex },
      { email: searchRegex }
    ];
  }

  // Filter by role
  if (queryParams.role) {
    query.role = queryParams.role;
  }

  // Filter by active/inactive status
  if (queryParams.isActive !== undefined) {
    query.isActive = queryParams.isActive === "true";
  }

  // Pagination options
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.max(1, parseInt(queryParams.limit, 10) || 10);
  const skip = (page - 1) * limit;

  // Sorting
  const allowedSort = ["name", "email", "role", "isActive", "createdAt"];
  const sortBy = allowedSort.includes(queryParams.sortBy) ? queryParams.sortBy : "createdAt";
  const sortOrder = queryParams.sortOrder === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  const total = await User.countDocuments(query);
  const users = await User.find(query).select("-password").sort(sort).skip(skip).limit(limit);
  const totalPages = Math.ceil(total / limit);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages
    }
  };
};

/**
 * Get single user by ID
 */
export const getUserById = async (id) => {
  validateMongoId(id);
  const user = await User.findOne({ _id: id, isDeleted: { $ne: true } }).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

/**
 * Update user role with demotion and last active admin safety checks
 */
export const updateUserRole = async (adminId, targetUserId, role, auditDetails = {}) => {
  validateMongoId(targetUserId);

  if (!["admin", "user"].includes(role)) {
    throw new ApiError(400, "Invalid role. Role must be admin or user");
  }

  const targetUser = await User.findOne({ _id: targetUserId, isDeleted: { $ne: true } });
  if (!targetUser) {
    throw new ApiError(404, "User not found");
  }

  // Prevent demoting the last active admin
  if (role === "user" && targetUser.role === "admin") {
    const activeAdmins = await User.countDocuments({
      role: "admin",
      isActive: true,
      isDeleted: { $ne: true }
    });
    if (activeAdmins <= 1) {
      throw new ApiError(400, "Security validation error: Cannot demote the last active admin in the system");
    }
  }

  targetUser.role = role;
  await targetUser.save();

  // Create Audit Log
  await AuditLog.create({
    adminId,
    action: `UPDATE_ROLE_TO_${role.toUpperCase()}`,
    targetUserId,
    ipAddress: auditDetails.ipAddress || "",
    userAgent: auditDetails.userAgent || ""
  });

  return await User.findById(targetUserId).select("-password");
};

/**
 * Update user status with last active admin protection
 */
export const updateUserStatus = async (adminId, targetUserId, isActive, auditDetails = {}) => {
  validateMongoId(targetUserId);

  const targetUser = await User.findOne({ _id: targetUserId, isDeleted: { $ne: true } });
  if (!targetUser) {
    throw new ApiError(404, "User not found");
  }

  // Prevent deactivating the last active admin
  if (!isActive && targetUser.role === "admin") {
    const activeAdmins = await User.countDocuments({
      role: "admin",
      isActive: true,
      isDeleted: { $ne: true }
    });
    if (activeAdmins <= 1) {
      throw new ApiError(400, "Security validation error: Cannot deactivate the last active admin in the system");
    }
  }

  targetUser.isActive = isActive;
  await targetUser.save();

  // Create Audit Log
  await AuditLog.create({
    adminId,
    action: isActive ? "ACTIVATE_USER" : "DEACTIVATE_USER",
    targetUserId,
    ipAddress: auditDetails.ipAddress || "",
    userAgent: auditDetails.userAgent || ""
  });

  return await User.findById(targetUserId).select("-password");
};

/**
 * Soft delete user with self-deletion and last admin safety checks
 */
export const softDeleteUser = async (adminId, targetUserId, auditDetails = {}) => {
  validateMongoId(targetUserId);

  // Prevent self-deletion
  if (adminId.toString() === targetUserId.toString()) {
    throw new ApiError(400, "Security validation error: Admins are prevented from deleting their own profiles");
  }

  const targetUser = await User.findOne({ _id: targetUserId, isDeleted: { $ne: true } });
  if (!targetUser) {
    throw new ApiError(404, "User not found");
  }

  // Prevent deleting the last active admin
  if (targetUser.role === "admin") {
    const activeAdmins = await User.countDocuments({
      role: "admin",
      isActive: true,
      isDeleted: { $ne: true }
    });
    if (activeAdmins <= 1) {
      throw new ApiError(400, "Security validation error: Cannot delete the last active admin in the system");
    }
  }

  targetUser.isDeleted = true;
  targetUser.isActive = false;
  await targetUser.save();

  // Create Audit Log
  await AuditLog.create({
    adminId,
    action: "SOFT_DELETE_USER",
    targetUserId,
    ipAddress: auditDetails.ipAddress || "",
    userAgent: auditDetails.userAgent || ""
  });

  return targetUser;
};

/**
 * Get overview statistics of users for the admin dashboard
 */
export const getStatsOverview = async () => {
  const totalUsers = await User.countDocuments({ isDeleted: { $ne: true } });
  const activeUsers = await User.countDocuments({ isActive: true, isDeleted: { $ne: true } });
  const inactiveUsers = await User.countDocuments({ isActive: false, isDeleted: { $ne: true } });
  const adminsCount = await User.countDocuments({ role: "admin", isDeleted: { $ne: true } });
  const normalUsersCount = await User.countDocuments({ role: "user", isDeleted: { $ne: true } });
  const latestRegisteredUsers = await User.find({ isDeleted: { $ne: true } })
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    adminsCount,
    normalUsersCount,
    latestRegisteredUsers
  };
};
