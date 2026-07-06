import AuditLog from "../models/AuditLog.js";

export const requestLogger = (req, res, next) => {
  const url = req.originalUrl;
  
  // Exclude log viewer itself and stats overview to avoid recursive loops
  if (
    url.includes("/admin/logs") || 
    url.includes("/admin/stats") || 
    url.includes("/analytics/system/health")
  ) {
    return next();
  }

  const start = Date.now();

  res.on("finish", async () => {
    try {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const method = req.method;

      let action = "API_REQUEST";
      let entity = "api";

      if (url.includes("/auth/login")) {
        action = "AUTH_LOGIN";
        entity = "auth";
      } else if (url.includes("/auth/register")) {
        action = "AUTH_REGISTER";
        entity = "auth";
      } else if (url.includes("/auth/logout")) {
        action = "AUTH_LOGOUT";
        entity = "auth";
      } else if (method !== "GET") {
        action = `USER_ACTION_${method}_${url.split("/")[3] || "resource"}`.toUpperCase();
        entity = url.split("/")[3] || "resource";
      }

      // If status code represents an error
      if (status >= 400) {
        action = `ERROR_${status}_${method}`.toUpperCase();
        entity = "error";
      }

      await AuditLog.create({
        user: req.user?._id || null,
        adminId: req.user?.role === "admin" ? req.user._id : null,
        action,
        entity,
        ipAddress: req.ip || req.connection?.remoteAddress || "",
        userAgent: req.headers["user-agent"] || "",
        resource: url,
        details: {
          method,
          status,
          durationMs: duration,
          query: req.query,
          body: method !== "GET" ? req.body : {}
        }
      });
    } catch (err) {
      console.error("Error creating audit log in middleware:", err);
    }
  });

  next();
};
