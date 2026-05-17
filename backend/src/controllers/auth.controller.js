const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const registerUser = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      result,
      "User registered successfully"
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "User logged in successfully"
    )
  );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, "Current user fetched successfully"));
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
