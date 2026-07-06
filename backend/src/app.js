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

// ── CORS ── Allow Vite dev server + production frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow any localhost / 127.0.0.1 port (development)
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    
    // Allow production frontend URL from environment variable
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow all origins in development mode
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Allow all origins in production for Vercel deployment (temporary fix)
    // TODO: Restrict to specific origins once deployment is stable
    if (process.env.NODE_ENV === 'production') {
      console.warn(`CORS: Allowing origin ${origin} in production mode`);
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
