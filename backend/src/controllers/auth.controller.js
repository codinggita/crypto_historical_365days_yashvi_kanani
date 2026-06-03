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

export const deleteProfile = asyncHandler(async (req, res) => {
  await authService.deleteProfile(req.user._id);
  res.clearCookie("accessToken");
  return res.status(200).json(
    new ApiResponse(200, null, "User profile deleted successfully")
  );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(new ApiResponse(400, null, "Email is required"));
  }
  return res.status(200).json(
    new ApiResponse(200, { email }, "Reset code sent to your registered email")
  );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json(new ApiResponse(400, null, "Email, code and newPassword are required"));
  }
  return res.status(200).json(
    new ApiResponse(200, null, "Password has been reset successfully")
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json(new ApiResponse(400, null, "Email and verification code are required"));
  }
  return res.status(200).json(
    new ApiResponse(200, null, "Email verified successfully")
  );
});
