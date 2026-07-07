# 🚀 CryptoVerseX

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-🍃-13aa52?style=flat-square&logo=mongodb)](https://mongodb.com/)

</div>

---

CryptoVerseX is a modern MERN Stack cryptocurrency analytics platform that provides historical market insights, real-time market statistics, advanced filtering, portfolio tracking, watchlists, and interactive dashboards through a responsive web interface.

---

## 🌐 Live Links

| Platform / Service | URL / Link |
| :--- | :--- |
| **Frontend Web App** | [Live Link](https://crypto-historical-365days-yashvi-ka.vercel.app/) |
| **Live Production** | [Live Link](https://crypto-historical-365days-yashvi-ka.vercel.app/) |
| **Backend API** | [API Link](https://cryptoversex-backend.vercel.app/) |
| **Frontend Repository** | [GitHub Repo](https://github.com/kananiyashvi180-svg/crypto_historical_365days_yashvi_kanani/tree/main/frontend) |
| **Backend Repository** | [GitHub Repo](https://github.com/kananiyashvi180-svg/crypto_historical_365days_yashvi_kanani/tree/main/backend) |

---

## 🎯 Problem Statement

Crypto market information is scattered across multiple platforms, making it difficult for users to analyze historical trends, compare cryptocurrencies, and track their investments efficiently.

## 💡 Solution

CryptoVerseX solves this by combining cryptocurrency analytics, historical data, advanced search, portfolio management, watchlists, and market insights into a single modern dashboard powered by the MERN Stack.

---

## ✨ Features

- **Authentication**: Secure user registration and login functionality.
- **JWT Authorization**: Role-based access control for protected user routes and admin pages.
- **Crypto Dashboard**: Modern grid showing global metrics with dynamic sparkline charts.
- **Historical Market Data**: Year-round analytics tracking of popular tokens.
- **Coin Details**: Comprehensive stats and trend analysis for individual tokens.
- **Search & Filtering**: Search by name/symbol and filter dynamically by multiple criteria.
- **Sorting & Pagination**: Tabular listings with adjustable density and paging.
- **Analytics**: Neon-cyan TradingView-style charts mapping returns and volatility.
- **Portfolio**: Personal portfolio tracker showing asset counts and simulated worth.
- **Watchlist**: Custom watchlist to monitor price fluctuations of preferred coins.
- **Responsive Design**: Responsive layout designed to look premium on all viewports.
- **REST API**: Robust API routing structure to access historical and aggregated analytical data.
- **Secure Backend**: Input validation, password hashing, and secured HTTP headers.

---

## ⚙️ Tech Stack

### Frontend
- **React 18** - UI development library
- **Redux Toolkit** - Global state management
- **Vite** - Development build runner
- **Tailwind CSS** - UI design token styling
- **Axios** - HTTP client integrations
- **React Router** - Frontend client-side routing

### Backend
- **Node.js** - Server runtime environment
- **Express.js** - Server routing and middleware framework
- **MongoDB** - Database storage engine
- **Mongoose** - Object Data Modeling schema validation
- **JWT** - Secure stateless user session validation
- **Bcrypt** - Strong password hashing functions
- **Express Validator** - Robust input sanitization middleware

### Tools
- **Postman** - Automated API documentation and routing test suite
- **Git & GitHub** - Collaborative source code version control
- **Vercel** - Hosting serverless deployment infrastructure

---

## 📁 Project Structure

```
crypto_historical_365days_yashvi_kanani/
├── backend/
├── frontend/
└── README.md
```

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/kananiyashvi180-svg/crypto_historical_365days_yashvi_kanani.git
cd crypto_historical_365days_yashvi_kanani
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

**Production API Base URL**: `https://cryptoversex-backend.vercel.app/api/v1`

---

## 📸 Application Screenshots

### Login
![Login](frontend/public/images/login.png)

### Register
![Register](frontend/public/images/register.png)

### Dashboard
![Dashboard](frontend/public/images/dashboard.png)

### Coins
![Coins](frontend/public/images/coins.png)

### Analytics
![Analytics](frontend/public/images/analytics.png)

### Portfolio
![Portfolio](frontend/public/images/portfolio.png)

### Watchlist
![Watchlist](frontend/public/images/watchlist.png)

### Profile
![Profile](frontend/public/images/profile.png)

---

## 👥 Author

Developed by **Yashvi Kanani**

---

## 📄 License

This project is licensed under the **MIT License**.
