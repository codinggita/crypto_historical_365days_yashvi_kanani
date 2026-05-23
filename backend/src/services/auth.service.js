import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
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

  const token = generateToken(user);
  return { user: createdUser, token };
};

/**
 * Login user and update lastLogin timestamp
 */
export const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (!user.isActive) {
    throw new ApiError(403, "User account is deactivated");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Update lastLogin
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user);
  const loggedInUser = await User.findById(user._id).select("-password");

  return { user: loggedInUser, token };
};

/**
 * Update current user profile details
 */
export const updateProfile = async (userId, updateData) => {
  const { name, email, avatar } = updateData;

  if (email) {
    const existedUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existedUser) {
      throw new ApiError(409, "User with this email already exists");
    }
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  return await User.findById(userId).select("-password");
};

/**
 * Change current user password with old password verification
 */
export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid old password");
  }

  user.password = newPassword;
  await user.save();

  return await User.findById(userId).select("-password");
};

/**
 * Get all users with pagination (Admin-only)
 */
export const getAllUsers = async (queryParams) => {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.max(1, parseInt(queryParams.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const total = await User.countDocuments({});
  const users = await User.find({}).skip(skip).limit(limit);
  const totalPages = Math.ceil(total / limit);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

/**
 * Update user role (Admin-only)
 */
export const updateUserRole = async (id, role) => {
  if (!["admin", "user"].includes(role)) {
    throw new ApiError(400, "Invalid role parameter");
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

/**
 * Update user status active/inactive (Admin-only)
 */
export const updateUserStatus = async (id, isActive) => {
  if (typeof isActive !== "boolean") {
    throw new ApiError(400, "Invalid status parameter");
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isActive },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
