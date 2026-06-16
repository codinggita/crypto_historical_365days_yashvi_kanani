# 🚀 Deployment Guide - CryptoVerseX

This document provides step-by-step instructions to deploy the full-stack CryptoVerseX application to production environments.

---

## 💻 Frontend Deployment (Vercel)

Vercel is the recommended hosting provider for the Vite-React frontend.

### Prerequisites
1. A [Vercel Account](https://vercel.com).
2. The GitHub repository linked to your Vercel account.

### Deployment Steps
1. Navigate to the **Vercel Dashboard** and click **Add New Project**.
2. Select your repository `crypto_historical_365days_yashvi_kanani`.
3. Configure the following project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variables**:
   - `VITE_API_BASE_URL`: The production URL of your deployed backend API (e.g., `https://cryptoversex-backend.onrender.com/api/v1`).
5. Click **Deploy**. Vercel will build the frontend assets and host the SPA.

### SPA Routing Fallback (Vercel Configuration)
To prevent `404 Not Found` errors when refreshing routes in a Single Page Application (SPA), ensure a `vercel.json` file is present in the `frontend` root directory:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## ⚙️ Backend Deployment (Render or Netlify)

Render is the recommended hosting provider for the Express/Node.js API.

### Prerequisites
1. A [Render Account](https://render.com).
2. A hosted MongoDB Atlas cluster.

### Deployment Steps (Render Web Service)
1. Go to the **Render Dashboard** and click **New** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the Web Service settings:
   - **Name**: `cryptoversex-api`
   - **Language**: `Node`
   - **Branch**: `main` (or the branch you want to deploy, e.g. `chore/final-production-polish`)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Expand **Advanced Settings** and add the following **Environment Variables**:
   - `PORT`: `5000` or leave empty (Render assigns a dynamic port)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: The connection string for your MongoDB Atlas production database (e.g. `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/cryptoversex?retryWrites=true&w=majority`).
   - `JWT_SECRET`: A secure cryptographically random string used to sign JWT sessions.
   - `JWT_EXPIRE`: `24h`
5. Click **Create Web Service**. Render will install packages and run the Node daemon server.

---

## 🗄️ Database Setup (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster.
3. Add a database user with read/write access.
4. Allow network connections from `0.0.0.0/24` (or configure Render's outbound IPs) in the IP Access List.
5. Seed the database by executing `npm run seed` locally or configuring an administrative runner script on the hosting provider.
