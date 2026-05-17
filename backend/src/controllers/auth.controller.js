import * as authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      result,
      "User registered successfully"
    )
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "User logged in successfully"
    )
  );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, "Current user fetched successfully"));
});
