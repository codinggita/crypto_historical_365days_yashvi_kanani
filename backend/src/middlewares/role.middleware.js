const ApiError = require("../utils/ApiError");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Role: ${req.user?.role || "unknown"} is not allowed to access this resource`
        )
      );
    }
    next();
  };
};

module.exports = authorizeRoles;
