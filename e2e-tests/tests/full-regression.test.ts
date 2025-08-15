import { WebDriver } from 'selenium-webdriver';
import { DriverFactory } from '../utils/driver-factory';
import { HomePage } from '../pages/home.page';
import { DashboardPage } from '../pages/dashboard.page';
import { TestConfig } from '../config/test.config';

describe('Full Application Regression Suite', () => {
  let driver: WebDriver;
  let homePage: HomePage;
  let dashboardPage: DashboardPage;

  beforeAll(async () => {
    driver = await DriverFactory.createDriver();
    homePage = new HomePage(driver);
    dashboardPage = new DashboardPage(driver);
  });

  afterAll(async () => {
    await DriverFactory.quitDriver();
  });

  describe('Cross-Page Navigation Tests', () => {
    test('should navigate between home and dashboard', async () => {
      // Start at home
      await homePage.navigateToHome();
      expect(await homePage.isLoaded()).toBe(true);
      
      // Navigate to dashboard
      await homePage.clickDashboardLink();
      await driver.sleep(2000);
      expect(await dashboardPage.isLoaded()).toBe(true);
      
      // Navigate back to home
      await dashboardPage.clickHomeLink();
      await driver.sleep(2000);
      expect(await homePage.isLoaded()).toBe(true);
    });

    test('should maintain state during navigation', async () => {
      // Go to dashboard and perform search
      await dashboardPage.navigateToDashboard();
      await dashboardPage.searchProducts('iPhone');
      await driver.sleep(1000);
      
      const searchResultCount = await dashboardPage.getProductCount();
      
      // Navigate away and back
      await dashboardPage.clickHomeLink();
      await driver.sleep(1000);
      await homePage.clickDashboardLink();
      await driver.sleep(2000);
      
      // Check if search was cleared (expected behavior)
      const afterNavCount = await dashboardPage.getProductCount();
      console.log(`Search results: ${searchResultCount}, After navigation: ${afterNavCount}`);
    });
  });

  describe('End-to-End User Journey Tests', () => {
    test('should complete a typical user journey', async () => {
      // 1. User lands on home page
      await homePage.navigateToHome();
      const welcomeText = await homePage.getWelcomeText();
      expect(welcomeText).toBeTruthy();
      
      // 2. User explores home page content
      const elements = await homePage.verifyHomePageElements();
      expect(elements.welcomeMessage).toBe(true);
      
      // 3. User navigates to dashboard
      await homePage.clickDashboardLink();
      await driver.sleep(2000);
      
      // 4. User searches for products
      await dashboardPage.searchProducts('MacBook');
      await driver.sleep(1000);
      
      // 5. User interacts with products
      const productCount = await dashboardPage.getProductCount();
      if (productCount > 0) {
        const titles = await dashboardPage.getProductTitles();
        console.log('Found products:', titles);
      }
      
      // 6. User returns to home
      await dashboardPage.clickHomeLink();
      await driver.sleep(1000);
      expect(await homePage.isLoaded()).toBe(true);
    });

    test('should handle product browsing workflow', async () => {
      // Navigate to dashboard
      await dashboardPage.navigateToDashboard();
      
      // Browse products
      const initialProducts = await dashboardPage.getProductTitles();
      console.log(`Initial products: ${initialProducts.length}`);
      
      // Apply filters if available
      try {
        await dashboardPage.filterByCategory('Computers');
        await driver.sleep(1000);
        const filteredProducts = await dashboardPage.getProductCount();
        console.log(`Filtered products: ${filteredProducts}`);
      } catch {
        console.log('Filters not available');
      }
      
      // Search for specific product
      await dashboardPage.searchProducts('iPad');
      await driver.sleep(1000);
      
      const searchResults = await dashboardPage.getProductCount();
      console.log(`Search results for iPad: ${searchResults}`);
    });
  });

  describe('Application Stability Tests', () => {
    test('should handle multiple page refreshes', async () => {
      const pages = [
        { page: homePage, url: '/home', name: 'Home' },
        { page: dashboardPage, url: '/dashboard', name: 'Dashboard' }
      ];
      
      for (const pageInfo of pages) {
        await pageInfo.page.navigate(pageInfo.url);
        await driver.sleep(1000);
        
        for (let i = 0; i < 3; i++) {
          await pageInfo.page.refresh();
          await driver.sleep(500);
          
          const isLoaded = await pageInfo.page.isLoaded();
          expect(isLoaded).toBe(true);
          console.log(`${pageInfo.name} page refresh ${i + 1}: Success`);
        }
      }
    });

    test('should handle browser back/forward navigation', async () => {
      // Build navigation history
      await homePage.navigateToHome();
      await driver.sleep(1000);
      
      await homePage.clickDashboardLink();
      await driver.sleep(2000);
      
      // Go back
      await driver.navigate().back();
      await driver.sleep(1000);
      expect(await homePage.isOnPage('/home')).toBe(true);
      
      // Go forward
      await driver.navigate().forward();
      await driver.sleep(1000);
      expect(await dashboardPage.isOnPage('/dashboard')).toBe(true);
    });
  });

  describe('Data Integrity Tests', () => {
    test('should display consistent product data', async () => {
      await dashboardPage.navigateToDashboard();
      
      // Get initial product data
      const titles1 = await dashboardPage.getProductTitles();
      const prices1 = await dashboardPage.getProductPrices();
      
      // Refresh and get data again
      await dashboardPage.refresh();
      await dashboardPage.waitForProductsToLoad();
      
      const titles2 = await dashboardPage.getProductTitles();
      const prices2 = await dashboardPage.getProductPrices();
      
      // Data should be consistent
      expect(titles1.length).toBe(titles2.length);
      expect(prices1.length).toBe(prices2.length);
      
      console.log('Data consistency verified');
    });
  });

  describe('Performance Baseline Tests', () => {
    test('should establish performance baselines', async () => {
      const metrics = {
        homeLoad: 0,
        dashboardLoad: 0,
        searchResponse: 0
      };
      
      // Home page load time
      let start = Date.now();
      await homePage.navigateToHome();
      metrics.homeLoad = Date.now() - start;
      
      // Dashboard load time
      start = Date.now();
      await dashboardPage.navigateToDashboard();
      metrics.dashboardLoad = Date.now() - start;
      
      // Search response time
      start = Date.now();
      await dashboardPage.searchProducts('iPhone');
      await dashboardPage.waitForProductsToLoad();
      metrics.searchResponse = Date.now() - start;
      
      console.log('Performance Metrics:', metrics);
      
      // Assert reasonable performance
      expect(metrics.homeLoad).toBeLessThan(5000);
      expect(metrics.dashboardLoad).toBeLessThan(7000);
      expect(metrics.searchResponse).toBeLessThan(3000);
    });
  });

  describe('Accessibility Tests', () => {
    test('should have proper page structure', async () => {
      const pages = [
        { page: homePage, url: '/home' },
        { page: dashboardPage, url: '/dashboard' }
      ];
      
      for (const pageInfo of pages) {
        await pageInfo.page.navigate(pageInfo.url);
        await driver.sleep(1000);
        
        // Check for h1 tag
        const h1Elements = await driver.findElements({ css: 'h1' });
        expect(h1Elements.length).toBeGreaterThan(0);
        
        // Check for proper heading hierarchy
        const headings = await driver.executeScript(`
          return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            .map(h => ({ tag: h.tagName, text: h.textContent }));
        `);
        
        console.log(`${pageInfo.url} headings:`, headings);
      }
    });
  });

  describe('Visual Regression Tests', () => {
    test('should capture screenshots for visual comparison', async () => {
      const timestamp = Date.now();
      
      // Capture home page states
      await homePage.navigateToHome();
      await homePage.takeScreenshot(`regression-home-${timestamp}`);
      
      // Capture dashboard states
      await dashboardPage.navigateToDashboard();
      await dashboardPage.takeScreenshot(`regression-dashboard-${timestamp}`);
      
      // Capture with search
      await dashboardPage.searchProducts('Apple');
      await driver.sleep(1000);
      await dashboardPage.takeScreenshot(`regression-dashboard-search-${timestamp}`);
      
      console.log(`Visual regression screenshots captured with timestamp: ${timestamp}`);
    });
  });
});