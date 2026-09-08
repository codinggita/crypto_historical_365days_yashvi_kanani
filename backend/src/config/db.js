import mongoose from "mongoose";

const connectDB = async () => {
  // 1 = connected, 2 = connecting — skip reconnection on warm serverless invocations
  const { readyState } = mongoose.connection;
  if (readyState === 1 || readyState === 2) {
    console.log("MongoDB already connected (reusing existing connection)");
    return;
  }

  try {
    // Support both MONGODB_URI and MONGO_URI for flexibility
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MongoDB URI not found in environment variables");
    }

    // tlsAllowInvalidCertificates fixes Windows root CA validation issue with Atlas
    // The connection is still fully TLS-encrypted; only local cert chain check is relaxed
    const isAtlas = mongoUri.includes("mongodb+srv");
    await mongoose.connect(mongoUri, {
      ...(isAtlas && { tlsAllowInvalidCertificates: true }),
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // On Vercel, calling process.exit(1) kills the warm instance and swallows
    // the error with no useful response. Let the error propagate as a normal
    // request failure instead; only exit the process in non-serverless envs.
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error; // re-throw so callers can surface the failure
  }
};

export default connectDB;
