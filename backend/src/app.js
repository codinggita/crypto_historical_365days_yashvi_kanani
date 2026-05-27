import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import v1Routes from "./routes/v1/index.js";
import notFoundMiddleware from "./middlewares/notFoundMiddleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

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

// Test Route
app.get("/", (req, res) => {
  res.send("CryptoVerseX Backend Running");
});

// Mount Routes
app.use("/api/v1", v1Routes);

// Error Handling Middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
