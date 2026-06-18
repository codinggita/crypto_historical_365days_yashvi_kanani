# Express Routes & Authentication Middleware Audit Report

**Date:** June 17, 2026  
**Auditor:** Cascade AI  
**Project:** Crypto Historical Data API

---

## Executive Summary

Conducted comprehensive audit of all Express routes and authentication middleware. Identified and fixed critical issues where public routes were incorrectly protected by JWT authentication middleware, causing unauthorized access errors on endpoints that should be publicly accessible.

---

## Issues Identified

### Critical Issues

1. **coin.routes.js** - Global `verifyJWT` middleware blocked all coin routes including public endpoints
2. **stats.routes.js** - Global `verifyJWT` middleware blocked all statistics endpoints
3. **analytics.routes.js** - Global `verifyJWT` middleware blocked all analytics endpoints

### Root Cause

All three route files applied `router.use(verifyJWT)` globally, which required authentication for ALL routes in those modules, including endpoints that should be publicly accessible according to API requirements.

---

## Public Routes (Should NOT require authentication)

### Coins Routes
- **GET /api/v1/coins** - Get all coins with pagination
- **GET /api/v1/coins/latest** - Get latest coins
- **GET /api/v1/coins/oldest** - Get oldest coins
- **GET /api/v1/coins/newest** - Get newest coins
- **GET /api/v1/coins/trending** - Get trending coins
- **GET /api/v1/coins/recent** - Get recent coins
- **GET /api/v1/coins/random** - Get random coin
- **GET /api/v1/coins/top-market-cap** - Get top market cap coins
- **GET /api/v1/coins/top-volume** - Get top volume coins
- **GET /api/v1/coins/top-gainers** - Get top gainers
- **GET /api/v1/coins/top-losers** - Get top losers
- **GET /api/v1/coins/recommendations** - Get recommendations
- **GET /api/v1/coins/predictions** - Get predictions
- **GET /api/v1/coins/heatmap** - Get heatmap data
- **GET /api/v1/coins/market-status** - Get market status
- **GET /api/v1/coins/market/summary** - Get market summary
- **GET /api/v1/coins/search/global** - Global search
- **GET /api/v1/coins/performance/top-monthly** - Top monthly performers
- **GET /api/v1/coins/performance/top-yearly** - Top yearly performers
- **GET /api/v1/coins/alerts/high-volatility** - Volatility alerts
- **GET /api/v1/coins/alerts/market-drop** - Market drop alerts
- **GET /api/v1/coins/system/health** - System health
- **GET /api/v1/coins/system/version** - System version
- **GET /api/v1/coins/system/config** - System config
- **GET /api/v1/coins/exists/:id** - Check coin existence
- **GET /api/v1/coins/name/:coinName** - Get coin by name
- **GET /api/v1/coins/symbol/:symbol** - Get coin by symbol
- **GET /api/v1/coins/rank/:rank** - Get coins by rank
- **GET /api/v1/coins/month/:month** - Get coins by month
- **GET /api/v1/coins/date/:date** - Get coins by date
- **GET /api/v1/coins/sort/* - Various sorting endpoints
- **GET /api/v1/coins/filter/* - Various filtering endpoints
- **GET /api/v1/coins/compare/:coin1/:coin2** - Compare 2 coins
- **GET /api/v1/coins/compare/:coin1/:coin2/:coin3** - Compare 3 coins
- **GET /api/v1/coins/performance/:coinId** - Coin performance
- **GET /api/v1/coins/volatility/:coinId** - Coin volatility
- **GET /api/v1/coins/market-cap/:coinId** - Coin market cap details
- **GET /api/v1/coins/volume/:coinId** - Coin volume details
- **GET /api/v1/coins/returns/:coinId** - Coin returns
- **GET /api/v1/coins/price/:coinId** - Coin price only
- **GET /api/v1/coins/portfolio/simulate** - Portfolio simulation
- **GET /api/v1/coins/history/:coinId** - Coin history
- **GET /api/v1/coins/history/:coinId/:month** - Coin history by month
- **GET /api/v1/coins/:id** - Get coin by ID

### Stats Routes (All Public)
- **GET /api/v1/stats/market-cap** - Total market cap
- **GET /api/v1/stats/average-price** - Average price
- **GET /api/v1/stats/average-volume** - Average volume
- **GET /api/v1/stats/highest-market-cap** - Highest market cap
- **GET /api/v1/stats/highest-volume** - Highest volume
- **GET /api/v1/stats/top-gainers** - Top gainers
- **GET /api/v1/stats/top-losers** - Top losers
- **GET /api/v1/stats/monthly-analysis** - Monthly analysis
- **GET /api/v1/stats/coin-count** - Coin count
- **GET /api/v1/stats/rank-distribution** - Rank distribution
- **GET /api/v1/stats/price-distribution** - Price distribution
- **GET /api/v1/stats/volatility-distribution** - Volatility distribution
- **GET /api/v1/stats/market-summary** - Market summary
- **GET /api/v1/stats/daily-analysis** - Daily analysis
- **GET /api/v1/stats/yearly-analysis** - Yearly analysis

### Analytics Routes (Mostly Public)
- **GET /api/v1/analytics/price/highest** - Highest price
- **GET /api/v1/analytics/price/lowest** - Lowest price
- **GET /api/v1/analytics/price/average** - Average price
- **GET /api/v1/analytics/price/history/:coinId** - Price history
- **GET /api/v1/analytics/price/trend** - Price trend
- **GET /api/v1/analytics/price/growth** - Price growth
- **GET /api/v1/analytics/price/drop** - Price drop
- **GET /api/v1/analytics/volume/highest** - Highest volume
- **GET /api/v1/analytics/volume/lowest** - Lowest volume
- **GET /api/v1/analytics/volume/average** - Average volume
- **GET /api/v1/analytics/volume/spike** - Volume spike
- **GET /api/v1/analytics/returns/top** - Top returns
- **GET /api/v1/analytics/returns/negative** - Negative returns
- **GET /api/v1/analytics/returns/cumulative** - Cumulative returns
- **GET /api/v1/analytics/volatility/high** - High volatility coins
- **GET /api/v1/analytics/dashboard** - Master dashboard
- **GET /api/v1/analytics/coins/top-gainers** - Top gainers
- **GET /api/v1/analytics/coins/top-losers** - Top losers
- **GET /api/v1/analytics/coins/trending** - Trending coins
- **GET /api/v1/analytics/search/trends** - Search trends
- **GET /api/v1/analytics/market/summary** - Market summary
- **GET /api/v1/analytics/market/category-distribution** - Category distribution
- **GET /api/v1/analytics/overview-legacy** - Legacy overview
- **GET /api/v1/analytics/top-gainers** - Legacy top gainers
- **GET /api/v1/analytics/top-losers** - Legacy top losers
- **GET /api/v1/analytics/highest-marketcap** - Highest market cap
- **GET /api/v1/analytics/highest-volume** - Highest volume
- **GET /api/v1/analytics/volatility/high-legacy** - Legacy high volatility
- **GET /api/v1/analytics/price-ranges** - Price ranges
- **GET /api/v1/analytics/market-summary** - Legacy market summary

---

## Protected Routes (Require authentication)

### Auth Routes
- **POST /api/v1/auth/logout** - Logout (verifyJWT)
- **GET /api/v1/auth/me** - Get current user (verifyJWT)
- **GET /api/v1/auth/profile** - Get profile (verifyJWT)
- **PATCH /api/v1/auth/profile** - Update profile (verifyJWT)
- **DELETE /api/v1/auth/profile** - Delete profile (verifyJWT)
- **POST /api/v1/auth/change-password** - Change password (verifyJWT)
- **PATCH /api/v1/auth/change-password** - Change password (verifyJWT)
- **GET /api/v1/auth/admin/check** - Admin check (verifyJWT + admin role)
- **GET /api/v1/auth/users** - Get all users (verifyJWT + admin role)
- **PATCH /api/v1/auth/users/:id/role** - Update user role (verifyJWT + admin role)
- **PATCH /api/v1/auth/users/:id/status** - Update user status (verifyJWT + admin role)

### User Routes (Admin Only)
- **All /api/v1/users routes** (verifyJWT + admin role)

### Portfolio Routes
- **All /api/v1/portfolio routes** (verifyJWT)

### Bookmark/Watchlist Routes
- **All /api/v1/bookmarks routes** (verifyJWT)

### Admin Routes
- **All /api/v1/admin routes** (verifyJWT + admin role)

### JWT Routes
- **GET /api/v1/jwt/profile** - JWT protected profile (verifyJWT)
- **GET /api/v1/jwt/dashboard** - JWT protected dashboard (verifyJWT)
- **GET /api/v1/jwt/admin** - Admin protected route (verifyJWT + admin role)
- **GET /api/v1/jwt/private-stats** - Private stats (verifyJWT)

### Search Routes
- **All /api/v1/search routes** (verifyJWT)

### Coin Admin Routes
- **POST /api/v1/coins/** - Create coin (verifyJWT + admin role)
- **PATCH /api/v1/coins/:id** - Update coin (verifyJWT + admin role)
- **PUT /api/v1/coins/:id** - Replace coin (verifyJWT + admin role)
- **DELETE /api/v1/coins/:id** - Delete coin (verifyJWT + admin role)
- **POST /api/v1/coins/bulk-create** - Bulk create coins (verifyJWT + admin role)
- **PATCH /api/v1/coins/bulk-update** - Bulk update coins (verifyJWT + admin role)
- **DELETE /api/v1/coins/bulk-delete** - Bulk delete coins (verifyJWT + admin role)

### Analytics Admin Routes
- **GET /api/v1/analytics/overview** - Platform overview (verifyJWT + admin role)
- **GET /api/v1/analytics/users/growth** - User growth (verifyJWT + admin role)
- **GET /api/v1/analytics/bookmarks/stats** - Bookmark stats (verifyJWT + admin role)
- **GET /api/v1/analytics/system/health** - System health (verifyJWT + admin role)
- **GET /api/v1/analytics/monthly-report** - Monthly report (verifyJWT + admin role)
- **GET /api/v1/analytics/yearly-report** - Yearly report (verifyJWT + admin role)

---

## Fixes Performed

### 1. coin.routes.js
**File:** `backend/src/routes/v1/coin.routes.js`

**Changes:**
- Removed global `router.use(verifyJWT)` middleware (line 98)
- Changed comment from "JWT Authenticated Routes" to "Public Routes (No authentication required)"
- Added `verifyJWT` middleware only to admin-protected routes:
  - POST /coins (create coin)
  - PATCH /coins/:id (update coin)
  - PUT /coins/:id (replace coin)
  - DELETE /coins/:id (delete coin)
  - POST /coins/bulk-create
  - PATCH /coins/bulk-update
  - DELETE /coins/bulk-delete

**Impact:** All GET routes for coins are now publicly accessible. Only admin operations require authentication.

### 2. stats.routes.js
**File:** `backend/src/routes/v1/stats.routes.js`

**Changes:**
- Removed global `router.use(verifyJWT)` middleware (line 24)
- Changed comment from "Protect all stats endpoints with verifyJWT" to "All stats endpoints are public (no authentication required)"

**Impact:** All statistics endpoints are now publicly accessible without authentication.

### 3. analytics.routes.js
**File:** `backend/src/routes/v1/analytics.routes.js`

**Changes:**
- Removed global `router.use(verifyJWT)` middleware (line 42)
- Changed comment from "Apply JWT verification globally — all analytics routes are protected" to "All analytics endpoints are public (no authentication required)"
- Changed comment from "PUBLIC (any authenticated user)" to "PUBLIC ENDPOINTS"
- Changed comment from "ADMIN ONLY — RBAC protected with authorizeRoles('admin')" to "ADMIN ONLY — RBAC protected with verifyJWT + authorizeRoles('admin')"
- Added `verifyJWT` middleware to admin-only routes:
  - GET /analytics/overview
  - GET /analytics/users/growth
  - GET /analytics/bookmarks/stats
  - GET /analytics/system/health
  - GET /analytics/monthly-report
  - GET /analytics/yearly-report

**Impact:** Most analytics endpoints are now publicly accessible. Only admin-specific analytics require authentication.

---

## Middleware Configuration Summary

### Authentication Middleware
- **verifyJWT:** Validates JWT tokens and attaches user to request object
- **authorizeRoles:** Role-based access control (admin, user, etc.)

### Applied Middleware by Route Module

| Route Module | Global verifyJWT | Selective verifyJWT | Admin Role Required |
|--------------|------------------|---------------------|---------------------|
| coin.routes.js | ❌ Removed | ✅ Admin operations only | ✅ Yes |
| stats.routes.js | ❌ Removed | ❌ None | ❌ No |
| analytics.routes.js | ❌ Removed | ✅ Admin endpoints only | ✅ Yes |
| auth.routes.js | ❌ No | ✅ Protected routes only | ✅ Yes (some) |
| user.routes.js | ✅ Yes | N/A | ✅ Yes |
| portfolio.routes.js | ✅ Yes | N/A | ❌ No |
| bookmark.routes.js | ✅ Yes | N/A | ❌ No |
| admin.routes.js | ✅ Yes | N/A | ✅ Yes |
| jwt.routes.js | ❌ No | ✅ Protected routes only | ✅ Yes (some) |
| search.routes.js | ✅ Yes | N/A | ❌ No |
| middleware.routes.js | ❌ No | ✅ Protected routes only | ❌ No |

---

## Verification

### Public Routes Verification
The following public routes should now work without authentication:
- ✅ GET /api/v1/coins
- ✅ GET /api/v1/coins/latest
- ✅ GET /api/v1/stats/*
- ✅ GET /api/v1/analytics/* (except admin endpoints)

### Protected Routes Verification
The following protected routes should still require authentication:
- ✅ POST /api/v1/auth/login (public)
- ✅ POST /api/v1/auth/register (public)
- ✅ GET /api/v1/portfolio/* (protected)
- ✅ GET /api/v1/bookmarks/* (protected)
- ✅ GET /api/v1/admin/* (protected + admin)
- ✅ POST /api/v1/coins (protected + admin)
- ✅ GET /api/v1/analytics/overview (protected + admin)

---

## Recommendations

1. **Route Organization:** Consider splitting public and protected routes into separate router files for better maintainability.
2. **Middleware Documentation:** Add JSDoc comments to each route documenting required authentication and roles.
3. **Testing:** Implement automated tests to verify public routes remain accessible and protected routes require authentication.
4. **API Documentation:** Update API documentation (Swagger/OpenAPI) to reflect authentication requirements.
5. **Rate Limiting:** Consider implementing rate limiting on public routes to prevent abuse.
6. **CORS Configuration:** Ensure CORS is properly configured for public endpoints.

---

## Conclusion

Successfully identified and fixed authentication middleware issues that were blocking public access to coin, stats, and analytics endpoints. The root cause was global application of `verifyJWT` middleware in route modules that contained both public and protected routes. 

**Status:** ✅ **RESOLVED**

All public routes are now accessible without authentication, while protected routes maintain proper security controls. The fix follows the principle of least privilege by applying authentication only where necessary.
