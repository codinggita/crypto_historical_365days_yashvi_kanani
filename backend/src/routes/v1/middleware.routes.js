import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { apiLimiter } from "../../middlewares/rateLimit.middleware.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

const router = Router();

// GET /middleware/logger
router.get("/logger", (req, res) => {
  console.log(`[Practice Logger] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  res.json(new ApiResponse(200, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    timestamp: new Date()
  }, "Request logger practice successful"));
});

// GET /middleware/auth
router.get("/auth", verifyJWT, (req, res) => {
  res.json(new ApiResponse(200, {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  }, "Authentication middleware practice successful"));
});

// GET /middleware/rate-limit
router.get("/rate-limit", apiLimiter, (req, res) => {
  res.json(new ApiResponse(200, {
    limit: 100,
    windowMs: 15 * 60 * 1000
  }, "Rate limiting middleware practice successful"));
});

// GET /middleware/error-handler
router.get("/error-handler", (req, res) => {
  throw new ApiError(500, "Simulated server error for testing global error handler");
});

export default router;
