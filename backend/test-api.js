import http from 'http';

const API_BASE = 'http://localhost:5000/api/v1';

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAPI() {
  console.log('=== API Runtime Verification ===\n');
  
  let token = null;
  let userId = null;
  const results = {
    passed: [],
    failed: [],
    skipped: []
  };

  // Test 1: Health Check
  console.log('1. Testing Health Endpoint...');
  try {
    const health = await makeRequest('GET', '/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, health.data);
    if (health.status === 200) {
      results.passed.push('Health Check');
      console.log('   ✅ Health check passed\n');
    } else {
      results.failed.push('Health Check');
      console.log('   ❌ Health check failed\n');
    }
  } catch (error) {
    results.failed.push('Health Check');
    console.log('   ❌ Health check failed:', error.message, '\n');
  }

  // Test 2: Register User
  console.log('2. Testing Register Endpoint...');
  try {
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123456'
    };
    const register = await makeRequest('POST', '/auth/register', registerData);
    console.log(`   Status: ${register.status}`);
    console.log(`   Response:`, register.data);
    if (register.data.success && register.data.data.token) {
      token = register.data.data.token;
      userId = register.data.data.user._id;
      results.passed.push('Register');
      console.log('   ✅ Registration successful, token obtained\n');
    } else {
      results.failed.push('Register');
      console.log('   ❌ Registration response unexpected\n');
    }
  } catch (error) {
    results.failed.push('Register');
    console.log('   ❌ Registration failed:', error.message, '\n');
  }

  // Test 3: Login (with existing user)
  console.log('3. Testing Login Endpoint...');
  try {
    const loginData = {
      email: 'test@example.com',
      password: 'test123456'
    };
    const login = await makeRequest('POST', '/auth/login', loginData);
    console.log(`   Status: ${login.status}`);
    console.log(`   Response:`, login.data);
    if (login.data.success && login.data.data.token) {
      token = login.data.data.token;
      userId = login.data.data.user._id;
      results.passed.push('Login');
      console.log('   ✅ Login successful, token obtained\n');
    } else {
      results.failed.push('Login');
      console.log('   ⚠️ Login response unexpected (user may not exist)\n');
    }
  } catch (error) {
    results.failed.push('Login');
    console.log('   ❌ Login failed:', error.message, '\n');
  }

  if (!token) {
    console.log('⚠️ No token available, skipping protected endpoint tests\n');
    results.skipped.push('All protected endpoints');
    console.log('=== Results ===');
    console.log(`Passed: ${results.passed.length}`);
    console.log(`Failed: ${results.failed.length}`);
    console.log(`Skipped: ${results.skipped.length}`);
    console.log('\nFailed tests:', results.failed);
    console.log('Skipped tests:', results.skipped);
    return;
  }

  // Test 4: Get Profile
  console.log('4. Testing Profile Endpoint...');
  try {
    const profile = await makeRequest('GET', '/auth/me', null, token);
    console.log(`   Status: ${profile.status}`);
    console.log(`   Response:`, profile.data);
    if (profile.status === 200) {
      results.passed.push('Profile');
      console.log('   ✅ Profile retrieval successful\n');
    } else {
      results.failed.push('Profile');
      console.log('   ❌ Profile retrieval failed\n');
    }
  } catch (error) {
    results.failed.push('Profile');
    console.log('   ❌ Profile retrieval failed:', error.message, '\n');
  }

  // Test 5: Get Coins
  console.log('5. Testing Coins Endpoint...');
  try {
    const coins = await makeRequest('GET', '/coins?page=1&limit=10');
    console.log(`   Status: ${coins.status}`);
    console.log(`   Response:`, coins.data);
    if (coins.status === 200) {
      results.passed.push('Coins List');
      console.log('   ✅ Coins retrieval successful\n');
    } else {
      results.failed.push('Coins List');
      console.log('   ❌ Coins retrieval failed\n');
    }
  } catch (error) {
    results.failed.push('Coins List');
    console.log('   ❌ Coins retrieval failed:', error.message, '\n');
  }

  // Test 6: Get Market Summary
  console.log('6. Testing Market Summary Endpoint...');
  try {
    const summary = await makeRequest('GET', '/coins/market/summary');
    console.log(`   Status: ${summary.status}`);
    console.log(`   Response:`, summary.data);
    if (summary.status === 200) {
      results.passed.push('Market Summary');
      console.log('   ✅ Market summary successful\n');
    } else {
      results.failed.push('Market Summary');
      console.log('   ❌ Market summary failed\n');
    }
  } catch (error) {
    results.failed.push('Market Summary');
    console.log('   ❌ Market summary failed:', error.message, '\n');
  }

  // Test 7: Get Top Gainers
  console.log('7. Testing Top Gainers Endpoint...');
  try {
    const gainers = await makeRequest('GET', '/coins/top-gainers?limit=5');
    console.log(`   Status: ${gainers.status}`);
    console.log(`   Response:`, gainers.data);
    if (gainers.status === 200) {
      results.passed.push('Top Gainers');
      console.log('   ✅ Top gainers successful\n');
    } else {
      results.failed.push('Top Gainers');
      console.log('   ❌ Top gainers failed\n');
    }
  } catch (error) {
    results.failed.push('Top Gainers');
    console.log('   ❌ Top gainers failed:', error.message, '\n');
  }

  // Test 8: Get Top Losers
  console.log('8. Testing Top Losers Endpoint...');
  try {
    const losers = await makeRequest('GET', '/coins/top-losers?limit=5');
    console.log(`   Status: ${losers.status}`);
    console.log(`   Response:`, losers.data);
    if (losers.status === 200) {
      results.passed.push('Top Losers');
      console.log('   ✅ Top losers successful\n');
    } else {
      results.failed.push('Top Losers');
      console.log('   ❌ Top losers failed\n');
    }
  } catch (error) {
    results.failed.push('Top Losers');
    console.log('   ❌ Top losers failed:', error.message, '\n');
  }

  // Test 9: Get Stats - Market Cap
  console.log('9. Testing Stats Market Cap Endpoint...');
  try {
    const marketCap = await makeRequest('GET', '/stats/market-cap');
    console.log(`   Status: ${marketCap.status}`);
    console.log(`   Response:`, marketCap.data);
    if (marketCap.status === 200) {
      results.passed.push('Stats Market Cap');
      console.log('   ✅ Market cap stats successful\n');
    } else {
      results.failed.push('Stats Market Cap');
      console.log('   ❌ Market cap stats failed\n');
    }
  } catch (error) {
    results.failed.push('Stats Market Cap');
    console.log('   ❌ Market cap stats failed:', error.message, '\n');
  }

  // Test 10: Get Stats - Market Summary
  console.log('10. Testing Stats Market Summary Endpoint...');
  try {
    const statsSummary = await makeRequest('GET', '/stats/market-summary');
    console.log(`   Status: ${statsSummary.status}`);
    console.log(`   Response:`, statsSummary.data);
    if (statsSummary.status === 200) {
      results.passed.push('Stats Market Summary');
      console.log('   ✅ Stats market summary successful\n');
    } else {
      results.failed.push('Stats Market Summary');
      console.log('   ❌ Stats market summary failed\n');
    }
  } catch (error) {
    results.failed.push('Stats Market Summary');
    console.log('   ❌ Stats market summary failed:', error.message, '\n');
  }

  // Test 11: Search
  console.log('11. Testing Search Endpoint...');
  try {
    const search = await makeRequest('GET', '/search?q=bitcoin');
    console.log(`   Status: ${search.status}`);
    console.log(`   Response:`, search.data);
    if (search.status === 200) {
      results.passed.push('Search');
      console.log('   ✅ Search successful\n');
    } else {
      results.failed.push('Search');
      console.log('   ❌ Search failed\n');
    }
  } catch (error) {
    results.failed.push('Search');
    console.log('   ❌ Search failed:', error.message, '\n');
  }

  // Test 12: Analytics - Price Analytics
  console.log('12. Testing Analytics Price Endpoint...');
  try {
    const priceAnalytics = await makeRequest('GET', '/analytics/price');
    console.log(`   Status: ${priceAnalytics.status}`);
    console.log(`   Response:`, priceAnalytics.data);
    if (priceAnalytics.status === 200) {
      results.passed.push('Analytics Price');
      console.log('   ✅ Price analytics successful\n');
    } else {
      results.failed.push('Analytics Price');
      console.log('   ❌ Price analytics failed\n');
    }
  } catch (error) {
    results.failed.push('Analytics Price');
    console.log('   ❌ Price analytics failed:', error.message, '\n');
  }

  // Test 13: Add to Watchlist
  console.log('13. Testing Add to Watchlist Endpoint...');
  try {
    const bookmarkData = { coinId: 'bitcoin' };
    const bookmark = await makeRequest('POST', '/bookmarks/bitcoin', bookmarkData, token);
    console.log(`   Status: ${bookmark.status}`);
    console.log(`   Response:`, bookmark.data);
    if (bookmark.status === 200 || bookmark.status === 201) {
      results.passed.push('Add Watchlist');
      console.log('   ✅ Add to watchlist successful\n');
    } else {
      results.failed.push('Add Watchlist');
      console.log('   ❌ Add to watchlist failed\n');
    }
  } catch (error) {
    results.failed.push('Add Watchlist');
    console.log('   ❌ Add to watchlist failed:', error.message, '\n');
  }

  // Test 14: Get Watchlist
  console.log('14. Testing Get Watchlist Endpoint...');
  try {
    const watchlist = await makeRequest('GET', '/bookmarks', null, token);
    console.log(`   Status: ${watchlist.status}`);
    console.log(`   Response:`, watchlist.data);
    if (watchlist.status === 200) {
      results.passed.push('Get Watchlist');
      console.log('   ✅ Get watchlist successful\n');
    } else {
      results.failed.push('Get Watchlist');
      console.log('   ❌ Get watchlist failed\n');
    }
  } catch (error) {
    results.failed.push('Get Watchlist');
    console.log('   ❌ Get watchlist failed:', error.message, '\n');
  }

  // Test 15: Add to Portfolio
  console.log('15. Testing Add to Portfolio Endpoint...');
  try {
    const portfolioData = {
      coinId: 'bitcoin',
      quantity: 1.5,
      buyPrice: 50000
    };
    const portfolio = await makeRequest('POST', '/portfolio', portfolioData, token);
    console.log(`   Status: ${portfolio.status}`);
    console.log(`   Response:`, portfolio.data);
    if (portfolio.status === 200 || portfolio.status === 201) {
      results.passed.push('Add Portfolio');
      console.log('   ✅ Add to portfolio successful\n');
    } else {
      results.failed.push('Add Portfolio');
      console.log('   ❌ Add to portfolio failed\n');
    }
  } catch (error) {
    results.failed.push('Add Portfolio');
    console.log('   ❌ Add to portfolio failed:', error.message, '\n');
  }

  // Test 16: Get Portfolio
  console.log('16. Testing Get Portfolio Endpoint...');
  try {
    const portfolio = await makeRequest('GET', '/portfolio', null, token);
    console.log(`   Status: ${portfolio.status}`);
    console.log(`   Response:`, portfolio.data);
    if (portfolio.status === 200) {
      results.passed.push('Get Portfolio');
      console.log('   ✅ Get portfolio successful\n');
    } else {
      results.failed.push('Get Portfolio');
      console.log('   ❌ Get portfolio failed\n');
    }
  } catch (error) {
    results.failed.push('Get Portfolio');
    console.log('   ❌ Get portfolio failed:', error.message, '\n');
  }

  // Test 17: Logout
  console.log('17. Testing Logout Endpoint...');
  try {
    const logout = await makeRequest('POST', '/auth/logout', null, token);
    console.log(`   Status: ${logout.status}`);
    console.log(`   Response:`, logout.data);
    if (logout.status === 200) {
      results.passed.push('Logout');
      console.log('   ✅ Logout successful\n');
    } else {
      results.failed.push('Logout');
      console.log('   ❌ Logout failed\n');
    }
  } catch (error) {
    results.failed.push('Logout');
    console.log('   ❌ Logout failed:', error.message, '\n');
  }

  console.log('=== API Runtime Verification Complete ===');
  console.log('\n=== Results ===');
  console.log(`Passed: ${results.passed.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log(`Skipped: ${results.skipped.length}`);
  console.log('\nPassed tests:', results.passed);
  console.log('Failed tests:', results.failed);
  console.log('Skipped tests:', results.skipped);
}

testAPI().catch(console.error);
