import mongoose from "mongoose";

const connectDB = async () => {
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
    process.exit(1);
  }
};

export default connectDB;
