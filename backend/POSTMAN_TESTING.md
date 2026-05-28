# CryptoVerseX Postman Testing Guide

This document lists every route, its method, Postman URL structure, headers, and request bodies for testing the API.

## Base Configuration
* **Base URL**: `http://localhost:3000/api/v1` (adjust the port if yours is different)
* **Default Headers**:
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>` (for protected routes)

---

## 1. Basic CRUD Routes (`/coins`)

### Get All Coins
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/v1/coins`
* **Query Params** (Optional):
  * `page`: `1`
  * `limit`: `10`
  * `sort`: `price` (or `marketCap`, `volume`, `dailyReturn`)
  * `minPrice`: `100`
  * `maxPrice`: `500`

### Get Coin by ID
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/v1/coins/bitcoin`

### Check Coin Existence
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/v1/coins/exists/bitcoin`

### Create a Coin
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/v1/coins`
* **Headers**: `Authorization: Bearer <token>`
* **Body (JSON)**:
```json
{
  "coinId": "cardano",
  "name": "Cardano",
  "symbol": "ADA",
  "rank": 10,
  "price": 0.45,
  "marketCap": 16000000000,
  "volume": 400000000,
  "dailyReturn": 1.2,
  "volatility": 1.5,
  "month": "May"
}
```

### Replace complete Coin
* **Method**: `PUT`
* **URL**: `http://localhost:3000/api/v1/coins/cardano`
* **Headers**: `Authorization: Bearer <token>`
* **Body (JSON)**:
```json
{
  "coinId": "cardano",
  "name": "Cardano New",
  "symbol": "ADA",
  "rank": 9,
  "price": 0.50,
  "marketCap": 17800000000,
  "volume": 450000000,
  "dailyReturn": 2.1,
  "volatility": 1.2,
  "month": "May"
}
```

### Update specific Coin fields
* **Method**: `PATCH`
* **URL**: `http://localhost:3000/api/v1/coins/cardano`
* **Headers**: `Authorization: Bearer <token>`
* **Body (JSON)**:
```json
{
  "price": 0.55
}
```

### Delete Coin by ID
* **Method**: `DELETE`
* **URL**: `http://localhost:3000/api/v1/coins/cardano`
* **Headers**: `Authorization: Bearer <token>`

### Bulk Create Coins
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/v1/coins/bulk-create`
* **Headers**: `Authorization: Bearer <token>`
* **Body (JSON)**:
```json
[
  {
    "coinId": "polkadot",
    "name": "Polkadot",
    "symbol": "DOT",
    "rank": 14,
    "price": 6.5,
    "marketCap": 8000000000,
    "volume": 180000000,
    "dailyReturn": -0.5,
    "volatility": 1.9,
    "month": "May"
  },
  {
    "coinId": "chainlink",
    "name": "Chainlink",
    "symbol": "LINK",
    "rank": 15,
    "price": 15.2,
    "marketCap": 9000000000,
    "volume": 250000000,
    "dailyReturn": 3.8,
    "volatility": 2.2,
    "month": "May"
  }
]
```

### Bulk Update Coins
* **Method**: `PATCH`
* **URL**: `http://localhost:3000/api/v1/coins/bulk-update`
* **Headers**: `Authorization: Bearer <token>`
* **Body (JSON)**:
```json
{
  "updates": [
    { "id": "polkadot", "price": 6.8 },
    { "id": "chainlink", "price": 15.9 }
  ]
}
```

### Bulk Delete Coins
* **Method**: `DELETE`
* **URL**: `http://localhost:3000/api/v1/coins/bulk-delete`
* **Headers**: `Authorization: Bearer <token>`
* **Body (JSON)**:
```json
{
  "ids": ["polkadot", "chainlink"]
}
```

---

## 2. Coin Info & Details Routes

* **Get by Name**: `GET` -> `http://localhost:3000/api/v1/coins/name/Bitcoin`
* **Get by Symbol**: `GET` -> `http://localhost:3000/api/v1/coins/symbol/BTC`
* **Get by Rank**: `GET` -> `http://localhost:3000/api/v1/coins/rank/1`
* **Get by Month**: `GET` -> `http://localhost:3000/api/v1/coins/month/May`
* **Get by Date**: `GET` -> `http://localhost:3000/api/v1/coins/date/2026-05-28`
* **Get Latest Coin**: `GET` -> `http://localhost:3000/api/v1/coins/latest`
* **Get Historical**: `GET` -> `http://localhost:3000/api/v1/coins/history/bitcoin`
* **Top Market Cap**: `GET` -> `http://localhost:3000/api/v1/coins/top-market-cap`
* **Top Volume**: `GET` -> `http://localhost:3000/api/v1/coins/top-volume`
* **Top Gainers**: `GET` -> `http://localhost:3000/api/v1/coins/top-gainers`
* **Top Losers**: `GET` -> `http://localhost:3000/api/v1/coins/top-losers`
* **Oldest Coin**: `GET` -> `http://localhost:3000/api/v1/coins/oldest`
* **Newest Coin**: `GET` -> `http://localhost:3000/api/v1/coins/newest`
* **Trending Coins**: `GET` -> `http://localhost:3000/api/v1/coins/trending`
* **Recent Coins**: `GET` -> `http://localhost:3000/api/v1/coins/recent`
* **Performance Summary**: `GET` -> `http://localhost:3000/api/v1/coins/performance/bitcoin`
* **Volatility Metric**: `GET` -> `http://localhost:3000/api/v1/coins/volatility/bitcoin`
* **Market Cap Details**: `GET` -> `http://localhost:3000/api/v1/coins/market-cap/bitcoin`
* **Volume Details**: `GET` -> `http://localhost:3000/api/v1/coins/volume/bitcoin`
* **Daily Returns**: `GET` -> `http://localhost:3000/api/v1/coins/returns/bitcoin`
* **Current Price**: `GET` -> `http://localhost:3000/api/v1/coins/price/bitcoin`
* **Historical Month**: `GET` -> `http://localhost:3000/api/v1/coins/history/bitcoin/May`
* **Compare 2 Coins**: `GET` -> `http://localhost:3000/api/v1/coins/compare/bitcoin/ethereum`
* **Compare 3 Coins**: `GET` -> `http://localhost:3000/api/v1/coins/compare/bitcoin/ethereum/solana`

---

## 3. Dedicated Sorting & Filtering

### Custom Sorting
* **Price Ascending**: `GET` -> `http://localhost:3000/api/v1/coins/sort/price-asc`
* **Price Descending**: `GET` -> `http://localhost:3000/api/v1/coins/sort/price-desc`
* **Volume Descending**: `GET` -> `http://localhost:3000/api/v1/coins/sort/volume-desc`
* **Rank Ascending**: `GET` -> `http://localhost:3000/api/v1/coins/sort/rank-asc`
* **Return Descending**: `GET` -> `http://localhost:3000/api/v1/coins/sort/return-desc`

### Custom Filters
* **High Price (>$10k)**: `GET` -> `http://localhost:3000/api/v1/coins/filter/high-price`
* **Low Price (<$10)**: `GET` -> `http://localhost:3000/api/v1/coins/filter/low-price`
* **High Volume**: `GET` -> `http://localhost:3000/api/v1/coins/filter/high-volume`
* **Low Volume**: `GET` -> `http://localhost:3000/api/v1/coins/filter/low-volume`
* **High Market Cap**: `GET` -> `http://localhost:3000/api/v1/coins/filter/high-market-cap`
* **Low Market Cap**: `GET` -> `http://localhost:3000/api/v1/coins/filter/low-market-cap`
* **High Volatility**: `GET` -> `http://localhost:3000/api/v1/coins/filter/high-volatility`
* **Low Volatility**: `GET` -> `http://localhost:3000/api/v1/coins/filter/low-volatility`
* **High Daily Return**: `GET` -> `http://localhost:3000/api/v1/coins/filter/high-return`
* **Negative Daily Return**: `GET` -> `http://localhost:3000/api/v1/coins/filter/negative-return`
* **Bullish Trends**: `GET` -> `http://localhost:3000/api/v1/coins/filter/bullish`
* **Bearish Trends**: `GET` -> `http://localhost:3000/api/v1/coins/filter/bearish`
* **Profitable Coins**: `GET` -> `http://localhost:3000/api/v1/coins/filter/profitable`
* **Loss-making Coins**: `GET` -> `http://localhost:3000/api/v1/coins/filter/loss-making`
* **Missing Essential Values**: `GET` -> `http://localhost:3000/api/v1/coins/filter/missing-values`

---

## 4. Advanced Analytics & Market Stats

### Analytics (`/analytics`)
* **Highest Price**: `GET` -> `http://localhost:3000/api/v1/analytics/price/highest`
* **Lowest Price**: `GET` -> `http://localhost:3000/api/v1/analytics/price/lowest`
* **Average Price**: `GET` -> `http://localhost:3000/api/v1/analytics/price/average`
* **Price History**: `GET` -> `http://localhost:3000/api/v1/analytics/price/history/bitcoin`
* **Trend Analysis**: `GET` -> `http://localhost:3000/api/v1/analytics/price/trend`
* **Growth Records**: `GET` -> `http://localhost:3000/api/v1/analytics/price/growth`
* **Price Drop Records**: `GET` -> `http://localhost:3000/api/v1/analytics/price/drop`
* **Highest Volume**: `GET` -> `http://localhost:3000/api/v1/analytics/volume/highest`
* **Lowest Volume**: `GET` -> `http://localhost:3000/api/v1/analytics/volume/lowest`
* **Average Volume**: `GET` -> `http://localhost:3000/api/v1/analytics/volume/average`
* **Volume Spikes**: `GET` -> `http://localhost:3000/api/v1/analytics/volume/spike`
* **Top Returns**: `GET` -> `http://localhost:3000/api/v1/analytics/returns/top`
* **Negative Returns**: `GET` -> `http://localhost:3000/api/v1/analytics/returns/negative`
* **Cumulative Returns**: `GET` -> `http://localhost:3000/api/v1/analytics/returns/cumulative`
* **High Volatility**: `GET` -> `http://localhost:3000/api/v1/analytics/volatility/high`

### Statistics (`/stats`)
* **Total Market Cap**: `GET` -> `http://localhost:3000/api/v1/stats/market-cap`
* **Average Price**: `GET` -> `http://localhost:3000/api/v1/stats/average-price`
* **Average Volume**: `GET` -> `http://localhost:3000/api/v1/stats/average-volume`
* **Highest Market Cap**: `GET` -> `http://localhost:3000/api/v1/stats/highest-market-cap`
* **Highest Volume**: `GET` -> `http://localhost:3000/api/v1/stats/highest-volume`
* **Top Gainers List**: `GET` -> `http://localhost:3000/api/v1/stats/top-gainers`
* **Top Losers List**: `GET` -> `http://localhost:3000/api/v1/stats/top-losers`
* **Monthly Aggregations**: `GET` -> `http://localhost:3000/api/v1/stats/monthly-analysis`
* **Total Coins Count**: `GET` -> `http://localhost:3000/api/v1/stats/coin-count`
* **Rank Distribution**: `GET` -> `http://localhost:3000/api/v1/stats/rank-distribution`
* **Price Spread**: `GET` -> `http://localhost:3000/api/v1/stats/price-distribution`
* **Volatility Spread**: `GET` -> `http://localhost:3000/api/v1/stats/volatility-distribution`
* **Market Summary**: `GET` -> `http://localhost:3000/api/v1/stats/market-summary`
* **Daily Analysis**: `GET` -> `http://localhost:3000/api/v1/stats/daily-analysis`
* **Yearly Analysis**: `GET` -> `http://localhost:3000/api/v1/stats/yearly-analysis`

---

## 5. Advanced Feature & Prediction Routes

* **Purchase/Sell Recs**: `GET` -> `http://localhost:3000/api/v1/coins/recommendations`
* **Price Movement Predictions**: `GET` -> `http://localhost:3000/api/v1/coins/predictions`
* **Portfolio Simulator**: `GET` -> `http://localhost:3000/api/v1/coins/portfolio/simulate`
* **Market Heatmap**: `GET` -> `http://localhost:3000/api/v1/coins/heatmap`
* **Overall Market Status**: `GET` -> `http://localhost:3000/api/v1/coins/market-status`
* **Top Monthly Performer**: `GET` -> `http://localhost:3000/api/v1/coins/performance/top-monthly`
* **Top Yearly Performer**: `GET` -> `http://localhost:3000/api/v1/coins/performance/top-yearly`
* **Volatility Alerts**: `GET` -> `http://localhost:3000/api/v1/coins/alerts/high-volatility`
* **Market Drop Warnings**: `GET` -> `http://localhost:3000/api/v1/coins/alerts/market-drop`
* **Generate Report**: `POST` -> `http://localhost:3000/api/v1/coins/report` (body: `{"format": "json"}`)
* **Clear Cache**: `GET` -> `http://localhost:3000/api/v1/coins/cache/clear`
* **System Health Check**: `GET` -> `http://localhost:3000/api/v1/coins/system/health`
* **App Version Info**: `GET` -> `http://localhost:3000/api/v1/coins/system/version`
* **Configuration Specs**: `GET` -> `http://localhost:3000/api/v1/coins/system/config`

---

## 6. Authentication, Security & Custom Middlewares

### User Auth Profile Updates
* **Forgot Password**: `POST` -> `http://localhost:3000/api/v1/auth/forgot-password` (body: `{"email": "user@cryptoverse.com"}`)
* **Reset Password**: `POST` -> `http://localhost:3000/api/v1/auth/reset-password` (body: `{"email": "user@cryptoverse.com", "token": "reset-token", "newPassword": "NewUser@123"}`)
* **Verify Email**: `POST` -> `http://localhost:3000/api/v1/auth/verify-email` (body: `{"email": "user@cryptoverse.com", "token": "verify-token"}`)
* **Soft Delete Own Profile**: `DELETE` -> `http://localhost:3000/api/v1/auth/profile` (headers: `Authorization: Bearer <token>`)

### JWT Demos (`/jwt`)
* **Generate Token**: `POST` -> `http://localhost:3000/api/v1/jwt/generate-token` (body: `{"email": "user@cryptoverse.com", "role": "user"}`)
* **Verify Token**: `POST` -> `http://localhost:3000/api/v1/jwt/verify-token` (body: `{"token": "<jwt_token>"}`)
* **JWT Profile**: `GET` -> `http://localhost:3000/api/v1/jwt/profile` (headers: `Authorization: Bearer <token>`)
* **JWT Dashboard**: `GET` -> `http://localhost:3000/api/v1/jwt/dashboard` (headers: `Authorization: Bearer <token>`)
* **Private Stats**: `GET` -> `http://localhost:3000/api/v1/jwt/private-stats` (headers: `Authorization: Bearer <token>`)
* **JWT Admin**: `GET` -> `http://localhost:3000/api/v1/jwt/admin` (headers: `Authorization: Bearer <admin_role_token>`)
* **Refresh Token**: `POST` -> `http://localhost:3000/api/v1/jwt/refresh-token` (body: `{"token": "<expired_token>"}`)
* **Revoke Token**: `DELETE` -> `http://localhost:3000/api/v1/jwt/revoke-token`

### Practice Middlewares (`/middleware`)
* **Demonstrate Loggers**: `GET` -> `http://localhost:3000/api/v1/middleware/logger`
* **Demonstrate Auth Block**: `GET` -> `http://localhost:3000/api/v1/middleware/auth` (headers: `Authorization: Bearer <token>`)
* **Demonstrate Rate Limiting**: `GET` -> `http://localhost:3000/api/v1/middleware/rate-limit`
* **Centralized Error Catching**: `GET` -> `http://localhost:3000/api/v1/middleware/error-handler` (forces internal error)
