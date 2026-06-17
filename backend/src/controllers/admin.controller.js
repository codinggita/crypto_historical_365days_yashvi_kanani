import * as userService from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import AuditLog from "../models/AuditLog.js";
import Bookmark from "../models/Bookmark.js";
import Portfolio from "../models/Portfolio.js";
import SearchLog from "../models/SearchLog.js";
import Coin from "../models/Coin.js";
import { getSearchTrends, getSystemHealth } from "../services/analytics.service.js";

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

/**
 * GET /api/v1/admin/logs - Get activity/audit logs
 */
export const getAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, action, q } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const query = {};

  if (action && action !== "ALL") {
    if (action === "AUTH") {
      query.action = { $regex: /^AUTH_/ };
    } else if (action === "USER") {
      query.action = { $regex: /^USER_ACTION_/ };
    } else if (action === "API") {
      query.action = "API_REQUEST";
    } else if (action === "ERROR") {
      query.action = { $regex: /^ERROR_/ };
    } else {
      query.action = action;
    }
  }

  if (q) {
    query.$or = [
      { action: { $regex: q, $options: "i" } },
      { entity: { $regex: q, $options: "i" } },
      { ipAddress: { $regex: q, $options: "i" } }
    ];
  }

  const total = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .populate("user", "name email role")
    .populate("targetUserId", "name email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(200, {
      logs,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, "Audit logs fetched successfully")
  );
});

/**
 * GET /api/v1/admin/analytics/watchlist - Get watchlist analytics
 */
export const getWatchlistAnalytics = asyncHandler(async (req, res) => {
  const mostBookmarked = await Bookmark.aggregate([
    { $group: { _id: "$coinName", symbol: { $first: "$symbol" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const growth = await Bookmark.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        label: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" }
              ]
            }
          ]
        },
        count: 1
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, { mostBookmarked, growth }, "Watchlist analytics fetched successfully")
  );
});

/**
 * GET /api/v1/admin/analytics/portfolio - Get portfolio analytics
 */
export const getPortfolioAnalytics = asyncHandler(async (req, res) => {
  const mostSimulated = await Portfolio.aggregate([
    { $group: { _id: "$coinName", symbol: { $first: "$symbol" }, count: { $sum: 1 }, totalInvested: { $sum: "$investedAmount" } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const investmentTrends = await Portfolio.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 },
        totalInvested: { $sum: "$investedAmount" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        label: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" }
              ]
            }
          ]
        },
        count: 1,
        totalInvested: 1
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, { mostSimulated, investmentTrends }, "Portfolio analytics fetched successfully")
  );
});

/**
 * GET /api/v1/admin/analytics/search - Get search analytics
 */
export const getSearchAnalytics = asyncHandler(async (req, res) => {
  const { days = 30, limit = 10 } = req.query;
  const data = await getSearchTrends({ days, limit });
  return res.status(200).json(
    new ApiResponse(200, data, "Search analytics fetched successfully")
  );
});

/**
 * GET /api/v1/admin/health - Get system health (admin)
 */
export const getAdminHealth = asyncHandler(async (req, res) => {
  const data = await getSystemHealth();
  return res.status(200).json(
    new ApiResponse(200, data, "System health status fetched successfully")
  );
});
