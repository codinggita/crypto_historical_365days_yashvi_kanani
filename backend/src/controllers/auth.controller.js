import * as authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  return res.status(201).json(
    new ApiResponse(201, result, "User registered successfully")
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  return res.status(200).json(
    new ApiResponse(200, result, "User logged in successfully")
  );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { user: req.user }, "Current user fetched successfully")
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  return res.status(200).json(
    new ApiResponse(200, { user }, "Profile updated successfully")
  );
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, oldPassword, newPassword);
  return res.status(200).json(
    new ApiResponse(200, null, "Password changed successfully")
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  return res.status(200).json(
    new ApiResponse(200, null, "User logged out successfully")
  );
});

export const checkAdmin = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, { isAdmin: true }, "Admin access verified successfully")
  );
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { users, meta } = await authService.getAllUsers(req.query);
  return res.status(200).json(
    new ApiResponse(200, users, "Users fetched successfully", meta)
  );
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await authService.updateUserRole(req.params.id, req.body.role);
  return res.status(200).json(
    new ApiResponse(200, { user }, "User role updated successfully")
  );
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await authService.updateUserStatus(req.params.id, req.body.isActive);
  return res.status(200).json(
    new ApiResponse(200, { user }, "User active status updated successfully")
  );
});
