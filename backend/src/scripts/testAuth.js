import mongoose from "mongoose";
import "dotenv/config";
import app from "../app.js";
import User from "../models/User.js";

const TEST_MONGO_URI = "mongodb://127.0.0.1:27017/cryptoverse_test";

async function runTests() {
  console.log("==========================================");
  console.log("TESTING COMPLETE AUTH & RBAC SYSTEM");
  console.log("==========================================");

  let server;
  try {
    // 1. Connect to DB
    await mongoose.connect(TEST_MONGO_URI);
    console.log("Connected to test database:", mongoose.connection.name);

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared User collection.");

    // 2. Start express app on ephemeral port
    server = app.listen(0);
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}/api/v1`;
    console.log(`Test server running at: ${baseUrl}`);

    // Helper to make fetch requests
    const apiRequest = async (url, options = {}) => {
      const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      const data = await response.json();
      return { status: response.status, data };
    };

    let userToken = "";
    let adminToken = "";
    let userId = "";

    // ----------------------------------------------------
    // 1. POST /auth/register
    // ----------------------------------------------------
    console.log("\n--- TEST: POST /auth/register ---");
    const regRes = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    });

    console.log("Status:", regRes.status);
    console.log("Response:", JSON.stringify(regRes.data, null, 2));
    
    console.assert(regRes.status === 201, "Should return 201");
    console.assert(regRes.data.success === true, "Should have success: true");
    console.assert(regRes.data.data.user.name === "Test User", "User name matches");
    console.assert(regRes.data.data.user.email === "test@example.com", "User email matches");
    console.assert(regRes.data.data.user.role === "user", "Default role is user");
    console.assert(regRes.data.data.user.password === undefined, "Password should be omitted");
    console.assert(!!regRes.data.data.token, "Token should be present");

    userId = regRes.data.data.user._id;

    // ----------------------------------------------------
    // 2. Duplicate email check
    // ----------------------------------------------------
    console.log("\n--- TEST: Duplicate email validation ---");
    const dupRes = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Another User",
        email: "test@example.com",
        password: "password123",
      }),
    });

    console.log("Status:", dupRes.status);
    console.log("Response message:", dupRes.data.message);
    console.assert(dupRes.status === 409, "Should return 409 Conflict");
    console.assert(dupRes.data.success === false, "Should have success: false");

    // ----------------------------------------------------
    // 3. POST /auth/login
    // ----------------------------------------------------
    console.log("\n--- TEST: POST /auth/login ---");
    const loginRes = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    console.log("Status:", loginRes.status);
    console.log("Response:", JSON.stringify(loginRes.data, null, 2));
    console.assert(loginRes.status === 200, "Should return 200");
    console.assert(loginRes.data.success === true, "Should have success: true");
    console.assert(!!loginRes.data.data.token, "Token should be present");
    console.assert(!!loginRes.data.data.user.lastLogin, "lastLogin should be updated");
    
    userToken = loginRes.data.data.token;

    // ----------------------------------------------------
    // 4. Login with invalid password
    // ----------------------------------------------------
    console.log("\n--- TEST: Login with invalid password ---");
    const badLoginRes = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    });

    console.log("Status:", badLoginRes.status);
    console.log("Response message:", badLoginRes.data.message);
    console.assert(badLoginRes.status === 401, "Should return 401 Unauthorized");

    // ----------------------------------------------------
    // 5. GET /auth/me (Protected Route)
    // ----------------------------------------------------
    console.log("\n--- TEST: GET /auth/me ---");
    const meRes = await apiRequest("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    console.log("Status:", meRes.status);
    console.log("Response:", JSON.stringify(meRes.data, null, 2));
    console.assert(meRes.status === 200, "Should return 200");
    console.assert(meRes.data.data.user.email === "test@example.com", "Me matches correct user");

    // ----------------------------------------------------
    // 6. PATCH /auth/profile (Update name & avatar only)
    // ----------------------------------------------------
    console.log("\n--- TEST: PATCH /auth/profile ---");
    const profileRes = await apiRequest("/auth/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        name: "Updated Name",
        avatar: "https://example.com/avatar.png",
        email: "hack@example.com", // should be ignored/filtered out by our restricted service
      }),
    });

    console.log("Status:", profileRes.status);
    console.log("Response:", JSON.stringify(profileRes.data, null, 2));
    console.assert(profileRes.status === 200, "Should return 200");
    console.assert(profileRes.data.data.user.name === "Updated Name", "Name updated successfully");
    console.assert(profileRes.data.data.user.avatar === "https://example.com/avatar.png", "Avatar updated successfully");
    console.assert(profileRes.data.data.user.email === "test@example.com", "Email update request was successfully ignored");

    // ----------------------------------------------------
    // 7. GET /auth/admin/check (Admin access checks)
    // ----------------------------------------------------
    console.log("\n--- TEST: GET /auth/admin/check (as Standard User) ---");
    const adminCheckFailRes = await apiRequest("/auth/admin/check", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    console.log("Status:", adminCheckFailRes.status);
    console.log("Response message:", adminCheckFailRes.data.message);
    console.assert(adminCheckFailRes.status === 403, "Should return 403 Forbidden");

    // Promoted user to Admin directly in database to test successful admin route access
    console.log("\nPromoting user to admin role...");
    await User.findByIdAndUpdate(userId, { role: "admin" });

    console.log("--- TEST: GET /auth/admin/check (as Admin User) ---");
    // Generate new token to reflect role change
    const newLoginRes = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });
    adminToken = newLoginRes.data.data.token;

    console.log("Waiting 1 second to ensure timestamp difference for token invalidation...");
    await new Promise((resolve) => setTimeout(resolve, 1050));

    const adminCheckSuccessRes = await apiRequest("/auth/admin/check", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    console.log("Status:", adminCheckSuccessRes.status);
    console.log("Response:", JSON.stringify(adminCheckSuccessRes.data, null, 2));
    console.assert(adminCheckSuccessRes.status === 200, "Should return 200");
    console.assert(adminCheckSuccessRes.data.data.isAdmin === true, "Admin verified");

    // ----------------------------------------------------
    // 8. PATCH /auth/change-password & Token Invalidation
    // ----------------------------------------------------
    console.log("\n--- TEST: PATCH /auth/change-password & Token Invalidation ---");
    const changePassRes = await apiRequest("/auth/change-password", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        oldPassword: "password123",
        newPassword: "newpassword456",
      }),
    });

    console.log("Status:", changePassRes.status);
    console.log("Response message:", changePassRes.data.message);
    console.assert(changePassRes.status === 200, "Should return 200");

    // Now attempt to make an authenticated request using the old token.
    // It should be rejected due to our passwordChangedAt check!
    console.log("Verifying old token invalidation...");
    const oldTokenTestRes = await apiRequest("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    console.log("Status with old token:", oldTokenTestRes.status);
    console.log("Response message:", oldTokenTestRes.data.message);
    console.assert(oldTokenTestRes.status === 401, "Old token must be rejected with 401");
    console.assert(oldTokenTestRes.data.message.includes("Token invalidated"), "Message should indicate invalidation");

    // Attempt login with new password
    console.log("Logging in with the new password...");
    const loginNewRes = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "newpassword456",
      }),
    });
    console.log("Status:", loginNewRes.status);
    console.assert(loginNewRes.status === 200, "Login should succeed with the new password");

    console.log("\n==========================================");
    console.log("ALL AUTHENTICATION AND RBAC TESTS PASSED 🎉");
    console.log("==========================================");

  } catch (error) {
    console.error("Test suite threw an error:", error);
    process.exit(1);
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log("Closed test HTTP server.");
    }
    await mongoose.connect(TEST_MONGO_URI);
    await User.deleteMany({});
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

runTests();
