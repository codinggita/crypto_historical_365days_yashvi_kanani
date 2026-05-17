const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const token = user.generateAccessToken();
    return token;
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const token = await generateAccessAndRefreshTokens(user._id);

  return { user: createdUser, token };
};

const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const token = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password");

  return { user: loggedInUser, token };
};

module.exports = {
  registerUser,
  loginUser,
};
