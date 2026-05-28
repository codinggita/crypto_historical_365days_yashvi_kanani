import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import v1Routes from "./routes/v1/index.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

// Limit requests from same API
app.use("/api", apiLimiter);

// Body parser, reading data from body into req.body
app.use(express.json());

// Enable CORS
app.use(cors());

// Interactive API Documentation Sandbox
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "docs.html"));
});

// Redirect root to docs
app.get("/", (req, res) => {
  res.redirect("/docs");
});

// Mount Routes
app.use("/api/v1", v1Routes);

// Error Handling Middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
