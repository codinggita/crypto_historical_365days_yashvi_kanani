import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';
const TEST_EMAIL = `tester_${Date.now()}@example.com`;
const TEST_PASSWORD = 'Password123!';
let token = '';
let adminToken = '';
let coinId = 'bitcoin'; // From seeded database

const client = axios.create({
  baseURL: BASE_URL,
  validateStatus: () => true, // Don't throw on error status codes
});

async function runTests() {
  console.log('🚀 Starting API Route Verification...\n');

  // ==========================================
  // 1. AUTH ROUTES
  // ==========================================
  console.log('--- Auth Routes ---');
  
  // Register
  const regRes = await client.post('/auth/register', {
    name: 'Test Tester',
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  console.log(`[POST] /auth/register: Status ${regRes.status}`, regRes.data.success ? '✅ Success' : '❌ Failed', regRes.data.message || '');

  // Login
  const loginRes = await client.post('/auth/login', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  console.log(`[POST] /auth/login: Status ${loginRes.status}`, loginRes.data.success ? '✅ Success' : '❌ Failed');
  if (loginRes.data?.data?.token) {
    token = loginRes.data.data.token;
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Profile
  const profileRes = await client.get('/auth/profile');
  console.log(`[GET] /auth/profile: Status ${profileRes.status}`, profileRes.data.success ? '✅ Success' : '❌ Failed');

  // Change Password
  const changePwRes = await client.post('/auth/change-password', {
    oldPassword: TEST_PASSWORD,
    newPassword: TEST_PASSWORD + 'new',
  });
  console.log(`[POST] /auth/change-password: Status ${changePwRes.status}`, changePwRes.data.success ? '✅ Success' : '❌ Failed');

  // Re-login with new password to update token
  const reloginRes = await client.post('/auth/login', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD + 'new',
  });
  if (reloginRes.data?.data?.token) {
    token = reloginRes.data.data.token;
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Forgot password mock endpoint check
  const forgotRes = await client.post('/auth/forgot-password', { email: TEST_EMAIL });
  console.log(`[POST] /auth/forgot-password: Status ${forgotRes.status}`, forgotRes.data.success ? '✅ Success' : '❌ Failed');

  // Reset password mock endpoint check
  const resetRes = await client.post('/auth/reset-password', { email: TEST_EMAIL, code: '123456', newPassword: TEST_PASSWORD });
  console.log(`[POST] /auth/reset-password: Status ${resetRes.status}`, resetRes.data.success ? '✅ Success' : '❌ Failed');

  // Verify email mock endpoint check
  const verifyEmailRes = await client.post('/auth/verify-email', { email: TEST_EMAIL, code: '123456' });
  console.log(`[POST] /auth/verify-email: Status ${verifyEmailRes.status}`, verifyEmailRes.data.success ? '✅ Success' : '❌ Failed');


  // ==========================================
  // 2. JWT ROUTES
  // ==========================================
  console.log('\n--- JWT Routes ---');

  // Generate Admin Token
  const jwtGenRes = await client.post('/jwt/generate-token', {
    email: 'admin@cryptoversex.com',
    password: 'AdminPassword123!',
    role: 'admin',
  });
  console.log(`[POST] /jwt/generate-token: Status ${jwtGenRes.status}`, jwtGenRes.data.success ? '✅ Success' : '❌ Failed');
  if (jwtGenRes.data?.data?.token) {
    adminToken = jwtGenRes.data.data.token;
  }

  // Verify Token
  const jwtVerifyRes = await client.post('/jwt/verify-token', { token });
  console.log(`[POST] /jwt/verify-token: Status ${jwtVerifyRes.status}`, jwtVerifyRes.data.success ? '✅ Success' : '❌ Failed');

  // JWT Profile
  const jwtProfileRes = await client.get('/jwt/profile');
  console.log(`[GET] /jwt/profile: Status ${jwtProfileRes.status}`, jwtProfileRes.data.success ? '✅ Success' : '❌ Failed');

  // JWT Dashboard
  const jwtDashRes = await client.get('/jwt/dashboard');
  console.log(`[GET] /jwt/dashboard: Status ${jwtDashRes.status}`, jwtDashRes.data.success ? '✅ Success' : '❌ Failed');

  // JWT Admin (with adminToken)
  const clientAdmin = axios.create({ baseURL: BASE_URL, headers: { Authorization: `Bearer ${adminToken}` } });
  const jwtAdminRes = await clientAdmin.get('/jwt/admin');
  console.log(`[GET] /jwt/admin: Status ${jwtAdminRes.status}`, jwtAdminRes.data.success ? '✅ Success' : '❌ Failed');

  // JWT Private Stats
  const jwtStatsRes = await client.get('/jwt/private-stats');
  console.log(`[GET] /jwt/private-stats: Status ${jwtStatsRes.status}`, jwtStatsRes.data.success ? '✅ Success' : '❌ Failed');

  // JWT Refresh
  const jwtRefreshRes = await client.post('/jwt/refresh-token', { token });
  console.log(`[POST] /jwt/refresh-token: Status ${jwtRefreshRes.status}`, jwtRefreshRes.data.success ? '✅ Success' : '❌ Failed');

  // JWT Revoke
  const jwtRevokeRes = await client.delete('/jwt/revoke-token');
  console.log(`[DELETE] /jwt/revoke-token: Status ${jwtRevokeRes.status}`, jwtRevokeRes.data.success ? '✅ Success' : '❌ Failed');


  // ==========================================
  // 3. COINS CRUD & INFORMATION ROUTES
  // ==========================================
  console.log('\n--- Coins CRUD & Info Routes ---');

  // Get Coins (with pagination check)
  const coinsRes = await client.get('/coins');
  console.log(`[GET] /coins: Status ${coinsRes.status}`, coinsRes.data.success ? '✅ Success' : '❌ Failed');
  if (coinsRes.data?.data) {
    const raw = coinsRes.data.data;
    console.log('  Pagination Payload Properties Check:');
    console.log(`    coins: ${Array.isArray(raw.coins) ? '✅ Present' : '❌ Missing'}`);
    console.log(`    totalCoins: ${raw.totalCoins !== undefined ? '✅ Present' : '❌ Missing'} (${raw.totalCoins})`);
    console.log(`    totalPages: ${raw.totalPages !== undefined ? '✅ Present' : '❌ Missing'} (${raw.totalPages})`);
    console.log(`    currentPage: ${raw.currentPage !== undefined ? '✅ Present' : '❌ Missing'} (${raw.currentPage})`);
    if (raw.coins && raw.coins.length > 0) {
      coinId = raw.coins[0].coinId;
    }
  }

  // Get Coin by ID
  const coinByIdRes = await client.get(`/coins/${coinId}`);
  console.log(`[GET] /coins/:id (${coinId}): Status ${coinByIdRes.status}`, coinByIdRes.data.success ? '✅ Success' : '❌ Failed');

  // Check Exists
  const coinExistsRes = await client.get(`/coins/exists/${coinId}`);
  console.log(`[GET] /coins/exists/:id: Status ${coinExistsRes.status}`, coinExistsRes.data.success ? '✅ Success' : '❌ Failed');

  // Get Coin by Name
  const coinByNameRes = await client.get(`/coins/name/Bitcoin`);
  console.log(`[GET] /coins/name/:coinName: Status ${coinByNameRes.status}`, coinByNameRes.data.success ? '✅ Success' : '❌ Failed');

  // Get Coin by Symbol
  const coinBySymbolRes = await client.get(`/coins/symbol/BTC`);
  console.log(`[GET] /coins/symbol/:symbol: Status ${coinBySymbolRes.status}`, coinBySymbolRes.data.success ? '✅ Success' : '❌ Failed');

  // Get Coin by Rank
  const coinByRankRes = await client.get(`/coins/rank/1`);
  console.log(`[GET] /coins/rank/:rank: Status ${coinByRankRes.status}`, coinByRankRes.data.success ? '✅ Success' : '❌ Failed');

  // Get Coin by Month
  const coinByMonthRes = await client.get(`/coins/month/January`);
  console.log(`[GET] /coins/month/:month: Status ${coinByMonthRes.status}`, coinByMonthRes.data.success ? '✅ Success' : '❌ Failed');

  // Get Coin by Date
  const todayStr = new Date().toISOString().split('T')[0];
  const coinByDateRes = await client.get(`/coins/date/${todayStr}`);
  console.log(`[GET] /coins/date/:date (${todayStr}): Status ${coinByDateRes.status}`, coinByDateRes.data.success ? '✅ Success' : '❌ Failed');

  // Latest
  const coinLatestRes = await client.get('/coins/latest');
  console.log(`[GET] /coins/latest: Status ${coinLatestRes.status}`, coinLatestRes.data.success ? '✅ Success' : '❌ Failed');

  // History
  const coinHistoryRes = await client.get(`/coins/history/${coinId}`);
  console.log(`[GET] /coins/history/:coinId: Status ${coinHistoryRes.status}`, coinHistoryRes.data.success ? '✅ Success' : '❌ Failed');

  // Top Market Cap
  const coinTopMcapRes = await client.get('/coins/top-market-cap');
  console.log(`[GET] /coins/top-market-cap: Status ${coinTopMcapRes.status}`, coinTopMcapRes.data.success ? '✅ Success' : '❌ Failed');

  // Top Volume
  const coinTopVolRes = await client.get('/coins/top-volume');
  console.log(`[GET] /coins/top-volume: Status ${coinTopVolRes.status}`, coinTopVolRes.data.success ? '✅ Success' : '❌ Failed');

  // Top Gainers
  const coinTopGainRes = await client.get('/coins/top-gainers');
  console.log(`[GET] /coins/top-gainers: Status ${coinTopGainRes.status}`, coinTopGainRes.data.success ? '✅ Success' : '❌ Failed');

  // Top Losers
  const coinTopLoseRes = await client.get('/coins/top-losers');
  console.log(`[GET] /coins/top-losers: Status ${coinTopLoseRes.status}`, coinTopLoseRes.data.success ? '✅ Success' : '❌ Failed');

  // Oldest
  const coinOldestRes = await client.get('/coins/oldest');
  console.log(`[GET] /coins/oldest: Status ${coinOldestRes.status}`, coinOldestRes.data.success ? '✅ Success' : '❌ Failed');

  // Newest
  const coinNewestRes = await client.get('/coins/newest');
  console.log(`[GET] /coins/newest: Status ${coinNewestRes.status}`, coinNewestRes.data.success ? '✅ Success' : '❌ Failed');

  // Trending
  const coinTrendingRes = await client.get('/coins/trending');
  console.log(`[GET] /coins/trending: Status ${coinTrendingRes.status}`, coinTrendingRes.data.success ? '✅ Success' : '❌ Failed');

  // Recent
  const coinRecentRes = await client.get('/coins/recent');
  console.log(`[GET] /coins/recent: Status ${coinRecentRes.status}`, coinRecentRes.data.success ? '✅ Success' : '❌ Failed');


  // ==========================================
  // 4. ANALYTICS ROUTES
  // ==========================================
  console.log('\n--- Analytics Routes ---');

  const analyticsRoutes = [
    '/analytics/price/highest',
    '/analytics/price/lowest',
    '/analytics/price/average',
    `/analytics/price/history/${coinId}`,
    '/analytics/price/trend',
    '/analytics/price/growth',
    '/analytics/price/drop',
    '/analytics/volume/highest',
    '/analytics/volume/lowest',
    '/analytics/volume/average',
    '/analytics/volume/spike',
    '/analytics/returns/top',
    '/analytics/returns/negative',
    '/analytics/returns/cumulative',
    '/analytics/volatility/high',
  ];

  for (const route of analyticsRoutes) {
    const res = await client.get(route);
    console.log(`[GET] ${route}: Status ${res.status}`, res.data.success ? '✅ Success' : '❌ Failed');
  }


  // ==========================================
  // 5. STATS ROUTES
  // ==========================================
  console.log('\n--- Stats Routes ---');

  const statsRoutes = [
    '/stats/market-cap',
    '/stats/average-price',
    '/stats/average-volume',
    '/stats/highest-market-cap',
    '/stats/highest-volume',
    '/stats/top-gainers',
    '/stats/top-losers',
    '/stats/monthly-analysis',
    '/stats/coin-count',
    '/stats/rank-distribution',
    '/stats/price-distribution',
    '/stats/volatility-distribution',
    '/stats/market-summary',
    '/stats/daily-analysis',
    '/stats/yearly-analysis',
  ];

  for (const route of statsRoutes) {
    const res = await client.get(route);
    console.log(`[GET] ${route}: Status ${res.status}`, res.data.success ? '✅ Success' : '❌ Failed');
  }


  // ==========================================
  // 6. SEARCH ROUTES
  // ==========================================
  console.log('\n--- Search Routes ---');
  const searchRes = await client.get('/search/coins?q=bit');
  console.log(`[GET] /search/coins?q=bit: Status ${searchRes.status}`, searchRes.data.success ? '✅ Success' : '❌ Failed');


  // ==========================================
  // 7. FILTER ROUTES
  // ==========================================
  console.log('\n--- Filter Routes ---');

  const filterRoutes = [
    '/coins/filter/high-price',
    '/coins/filter/low-price',
    '/coins/filter/high-volume',
    '/coins/filter/low-volume',
    '/coins/filter/high-market-cap',
    '/coins/filter/low-market-cap',
    '/coins/filter/high-volatility',
    '/coins/filter/low-volatility',
    '/coins/filter/high-return',
    '/coins/filter/negative-return',
    '/coins/filter/bullish',
    '/coins/filter/bearish',
    '/coins/filter/profitable',
    '/coins/filter/loss-making',
    '/coins/filter/missing-values',
  ];

  for (const route of filterRoutes) {
    const res = await client.get(route);
    console.log(`[GET] ${route}: Status ${res.status}`, res.status === 200 ? '✅ Success' : '❌ Failed');
  }


  // ==========================================
  // 8. ADVANCED ROUTES
  // ==========================================
  console.log('\n--- Advanced Routes ---');

  const advancedRoutes = [
    '/coins/random',
    '/coins/recommendations',
    '/coins/predictions',
    '/coins/portfolio/simulate',
    '/coins/heatmap',
    '/coins/market-status',
    '/coins/performance/top-monthly',
    '/coins/performance/top-yearly',
    '/coins/alerts/high-volatility',
    '/coins/alerts/market-drop',
    '/coins/report', // this is post in specification, let's try POST and GET
    '/coins/cache/clear',
    '/coins/system/health',
    '/coins/system/version',
    '/coins/system/config',
  ];

  for (const route of advancedRoutes) {
    let res;
    if (route === '/coins/report') {
      res = await client.post(route, { issueType: 'data_error', description: 'test' });
    } else {
      res = await client.get(route);
    }
    console.log(`[${route === '/coins/report' ? 'POST' : 'GET'}] ${route}: Status ${res.status}`, res.data.success ? '✅ Success' : '❌ Failed');
  }

  // Logout
  const logoutRes = await client.post('/auth/logout');
  console.log(`\n[POST] /auth/logout: Status ${logoutRes.status}`, logoutRes.data.success ? '✅ Success' : '❌ Failed');

  console.log('\n🏁 API Route Verification Completed.');
}

runTests();
