import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import v1Routes from "./routes/v1/index.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── CORS ── Allow Vite dev server + any localhost origin
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any localhost / 127.0.0.1 port
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

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

// Request logger middleware
app.use(requestLogger);

// Root API Endpoint
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to the CryptoVerseX API",
    version: "1.0.0",
  });
});

// Mount Routes
app.use("/api/v1", v1Routes);

// Error Handling Middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
