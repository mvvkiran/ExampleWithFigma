export const TestConfig = {
  baseUrl: process.env.BASE_URL || 'http://localhost:4200',
  browser: process.env.BROWSER || 'chrome',
  headless: process.env.HEADLESS === 'true',
  timeout: {
    implicit: 10000,
    pageLoad: 30000,
    script: 30000
  },
  viewport: {
    width: 1920,
    height: 1080
  },
  screenshots: {
    onFailure: true,
    path: './e2e-tests/reports/screenshots'
  },
  retry: {
    count: 2,
    delay: 1000
  }
};

export const TestData = {
  users: {
    admin: {
      username: 'admin@test.com',
      password: 'Admin123!'
    },
    standard: {
      username: 'user@test.com', 
      password: 'User123!'
    }
  },
  products: {
    search: {
      valid: ['iPhone', 'MacBook', 'iPad'],
      invalid: ['InvalidProduct123', 'XYZ789']
    },
    filters: {
      categories: ['Phones', 'Computers', 'Tablets', 'Accessories'],
      priceRanges: ['0-500', '500-1000', '1000-2000', '2000+']
    }
  },
  navigation: {
    routes: [
      { name: 'Home', path: '/home' },
      { name: 'Dashboard', path: '/dashboard' }
    ]
  }
};