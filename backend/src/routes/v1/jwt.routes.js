import { Router } from "express";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import User from "../../models/User.js";
import generateToken from "../../utils/generateToken.js";

const router = Router();

router.options("/profile", (req, res) => {
  res.set("Allow", "GET, OPTIONS");
  res.status(200).end();
});

// POST /jwt/generate-token
router.post("/generate-token", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    // Try finding the user or default to a mock user
    let user = await User.findOne({ email });
    if (!user) {
      // Create a temporary mock user or use request details
      user = {
        _id: "60c72b2f9b1d8b2e88a8d111",
        role: req.body.role || "user",
        email: email,
      };
    }

    const token = generateToken(user);
    res.json(new ApiResponse(200, { token }, "Token generated successfully"));
  } catch (error) {
    next(error);
  }
});

// POST /jwt/verify-token
router.post("/verify-token", (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new ApiError(400, "Token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(new ApiResponse(200, decoded, "Token verified successfully"));
  } catch (error) {
    next(new ApiError(401, error?.message || "Invalid token"));
  }
});

// GET /jwt/profile
router.get("/profile", verifyJWT, (req, res) => {
  res.json(new ApiResponse(200, { user: req.user }, "JWT protected profile accessed successfully"));
});

// GET /jwt/dashboard
router.get("/dashboard", verifyJWT, (req, res) => {
  res.json(new ApiResponse(200, { dashboardData: "Secret stats here" }, "JWT protected dashboard accessed successfully"));
});

// GET /jwt/admin
router.get("/admin", verifyJWT, authorizeRoles("admin"), (req, res) => {
  res.json(new ApiResponse(200, { adminSecret: "System keys" }, "Admin protected route accessed successfully"));
});

// GET /jwt/private-stats
router.get("/private-stats", verifyJWT, (req, res) => {
  res.json(new ApiResponse(200, { privateStats: "Confidential numbers" }, "Private stats accessed successfully"));
});

// POST /jwt/refresh-token
router.post("/refresh-token", (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new ApiError(400, "Token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    // Generate new token with standard expiration
    const newToken = jwt.sign(
      {
        userId: decoded.userId || decoded.id,
        role: decoded.role || "user",
        email: decoded.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    res.json(new ApiResponse(200, { token: newToken }, "Token refreshed successfully"));
  } catch (error) {
    next(error);
  }
});

// DELETE /jwt/revoke-token
router.delete("/revoke-token", (req, res) => {
  // Mocks token revocation
  res.json(new ApiResponse(200, null, "Token revoked successfully"));
});

export default router;
