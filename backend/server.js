import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

// Always initiate DB connection at module load so Vercel warm instances
// can reuse an existing connection without going through app.listen().
connectDB().catch((err) => {
  console.error(`Failed to connect to MongoDB: ${err.message}`);
});

// Only bind a TCP port when running outside of Vercel
// (local dev, Render, Railway, etc.)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel's @vercel/node runtime looks for a default-exported request handler.
// Exporting `app` here is what makes every API route work in production.
export default app;
