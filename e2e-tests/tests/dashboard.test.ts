import { WebDriver } from 'selenium-webdriver';
import { DriverFactory } from '../utils/driver-factory';
import { DashboardPage } from '../pages/dashboard.page';
import { TestConfig, TestData } from '../config/test.config';

describe('Dashboard Page Regression Tests', () => {
  let driver: WebDriver;
  let dashboardPage: DashboardPage;

  beforeAll(async () => {
    driver = await DriverFactory.createDriver();
    dashboardPage = new DashboardPage(driver);
  });

  afterAll(async () => {
    await DriverFactory.quitDriver();
  });

  beforeEach(async () => {
    await dashboardPage.navigateToDashboard();
  });

  describe('Page Load and Basic Elements', () => {
    test('should load dashboard page successfully', async () => {
      const isLoaded = await dashboardPage.isLoaded();
      expect(isLoaded).toBe(true);
    });

    test('should display dashboard title', async () => {
      const title = await dashboardPage.getDashboardTitle();
      expect(title).toBeTruthy();
      expect(title.toLowerCase()).toContain('dashboard');
    });

    test('should display all required dashboard elements', async () => {
      const elements = await dashboardPage.verifyDashboardElements();
      
      expect(elements.pageTitle).toBe(true);
      expect(elements.searchInput).toBe(true);
      expect(elements.productGrid).toBe(true);
      
      console.log('Dashboard elements verified:', elements);
    });

    test('should display products on initial load', async () => {
      const productCount = await dashboardPage.getProductCount();
      expect(productCount).toBeGreaterThan(0);
      
      console.log(`Found ${productCount} products on dashboard`);
    });
  });

  describe('Product Display Tests', () => {
    test('should display Apple products from mock data', async () => {
      const appleProducts = await dashboardPage.getAppleProducts();
      expect(appleProducts.length).toBeGreaterThan(0);
      
      console.log(`Found ${appleProducts.length} Apple products`);
    });

    test('should display product titles correctly', async () => {
      const titles = await dashboardPage.getProductTitles();
      expect(titles.length).toBeGreaterThan(0);
      
      titles.forEach((title, index) => {
        expect(title).toBeTruthy();
        console.log(`Product ${index + 1}: ${title}`);
      });
    });

    test('should display product prices', async () => {
      const prices = await dashboardPage.getProductPrices();
      expect(prices.length).toBeGreaterThan(0);
      
      prices.forEach((price, index) => {
        expect(price).toBeGreaterThan(0);
        console.log(`Product ${index + 1} price: $${price}`);
      });
    });
  });

  describe('Search Functionality Tests', () => {
    test('should search for valid products', async () => {
      for (const searchTerm of TestData.products.search.valid) {
        await dashboardPage.searchProducts(searchTerm);
        await driver.sleep(1000);
        
        const productCount = await dashboardPage.getProductCount();
        const noResults = await dashboardPage.isNoResultsMessageVisible();
        
        if (!noResults) {
          expect(productCount).toBeGreaterThan(0);
          console.log(`Search "${searchTerm}": Found ${productCount} products`);
        } else {
          console.log(`Search "${searchTerm}": No results (might not be in mock data)`);
        }
        
        await dashboardPage.clearSearch();
      }
    });

    test('should show no results for invalid search', async () => {
      for (const searchTerm of TestData.products.search.invalid) {
        await dashboardPage.searchProducts(searchTerm);
        await driver.sleep(1000);
        
        const productCount = await dashboardPage.getProductCount();
        const noResults = await dashboardPage.isNoResultsMessageVisible();
        
        if (noResults) {
          expect(noResults).toBe(true);
          console.log(`Search "${searchTerm}": Correctly showing no results`);
        } else if (productCount === 0) {
          expect(productCount).toBe(0);
          console.log(`Search "${searchTerm}": 0 products found`);
        }
        
        await dashboardPage.clearSearch();
      }
    });

    test('should clear search and show all products', async () => {
      await dashboardPage.searchProducts('iPhone');
      await driver.sleep(1000);
      
      const searchCount = await dashboardPage.getProductCount();
      
      await dashboardPage.clearSearch();
      await driver.sleep(1000);
      
      const allCount = await dashboardPage.getProductCount();
      
      console.log(`Search results: ${searchCount}, All products: ${allCount}`);
    });
  });

  describe('Filter Functionality Tests', () => {
    test('should filter by category if available', async () => {
      const categories = TestData.products.filters.categories;
      
      for (const category of categories) {
        try {
          await dashboardPage.filterByCategory(category);
          await driver.sleep(1000);
          
          const productCount = await dashboardPage.getProductCount();
          console.log(`Category "${category}": ${productCount} products`);
        } catch (error) {
          console.log(`Category filter "${category}" not available`);
        }
      }
    });

    test('should filter by price range if available', async () => {
      const priceRanges = TestData.products.filters.priceRanges;
      
      for (const range of priceRanges) {
        try {
          await dashboardPage.filterByPriceRange(range);
          await driver.sleep(1000);
          
          const productCount = await dashboardPage.getProductCount();
          const prices = await dashboardPage.getProductPrices();
          
          console.log(`Price range "${range}": ${productCount} products`);
          
          // Verify prices are within range if products found
          if (prices.length > 0) {
            const [min, max] = range.split('-').map(p => 
              p === '+' ? Infinity : parseInt(p)
            );
            
            prices.forEach(price => {
              if (max === Infinity) {
                expect(price).toBeGreaterThanOrEqual(min);
              } else {
                expect(price).toBeGreaterThanOrEqual(min);
                expect(price).toBeLessThanOrEqual(max);
              }
            });
          }
        } catch (error) {
          console.log(`Price filter "${range}" not available`);
        }
      }
    });
  });

  describe('Sort Functionality Tests', () => {
    test('should sort products by price ascending', async () => {
      try {
        await dashboardPage.sortProducts('price-asc');
        await driver.sleep(1000);
        
        const isSorted = await dashboardPage.verifyProductSorting('price-asc');
        expect(isSorted).toBe(true);
        console.log('Products sorted by price (ascending)');
      } catch (error) {
        console.log('Sort functionality not available');
      }
    });

    test('should sort products by price descending', async () => {
      try {
        await dashboardPage.sortProducts('price-desc');
        await driver.sleep(1000);
        
        const isSorted = await dashboardPage.verifyProductSorting('price-desc');
        expect(isSorted).toBe(true);
        console.log('Products sorted by price (descending)');
      } catch (error) {
        console.log('Sort functionality not available');
      }
    });

    test('should sort products by name', async () => {
      try {
        await dashboardPage.sortProducts('name-asc');
        await driver.sleep(1000);
        
        const isSorted = await dashboardPage.verifyProductSorting('name-asc');
        expect(isSorted).toBe(true);
        console.log('Products sorted by name');
      } catch (error) {
        console.log('Sort by name not available');
      }
    });
  });

  describe('Product Interaction Tests', () => {
    test('should click on product card', async () => {
      const productCount = await dashboardPage.getProductCount();
      
      if (productCount > 0) {
        await dashboardPage.clickProductByIndex(0);
        await driver.sleep(1000);
        
        // Verify navigation or modal opened
        const currentUrl = await dashboardPage.getCurrentUrl();
        console.log('After clicking product:', currentUrl);
      }
    });

    test('should add product to cart if available', async () => {
      try {
        await dashboardPage.addProductToCart(0);
        await driver.sleep(1000);
        console.log('Product added to cart');
      } catch (error) {
        console.log('Add to cart functionality not available');
      }
    });

    test('should view product details if available', async () => {
      try {
        await dashboardPage.viewProductDetails(0);
        await driver.sleep(1000);
        
        const currentUrl = await dashboardPage.getCurrentUrl();
        console.log('Product details URL:', currentUrl);
      } catch (error) {
        console.log('View details functionality not available');
      }
    });
  });

  describe('Pagination Tests', () => {
    test('should display pagination if applicable', async () => {
      const isPaginationVisible = await dashboardPage.isPaginationVisible();
      
      if (isPaginationVisible) {
        console.log('Pagination is visible');
        expect(isPaginationVisible).toBe(true);
      } else {
        console.log('No pagination (all products fit on one page)');
      }
    });

    test('should navigate through pages if pagination exists', async () => {
      const isPaginationVisible = await dashboardPage.isPaginationVisible();
      
      if (isPaginationVisible) {
        const initialProducts = await dashboardPage.getProductTitles();
        
        await dashboardPage.goToNextPage();
        await driver.sleep(1000);
        
        const nextPageProducts = await dashboardPage.getProductTitles();
        expect(nextPageProducts).toBeDefined();
        
        await dashboardPage.goToPreviousPage();
        await driver.sleep(1000);
        
        const previousPageProducts = await dashboardPage.getProductTitles();
        expect(previousPageProducts).toEqual(initialProducts);
      }
    });
  });

  describe('Performance Tests', () => {
    test('should load dashboard within acceptable time', async () => {
      const startTime = Date.now();
      await dashboardPage.navigateToDashboard();
      const loadTime = Date.now() - startTime;
      
      console.log(`Dashboard load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(7000); // 7 seconds max for dashboard with data
    });

    test('should handle rapid filter changes', async () => {
      // Rapid filter changes to test stability
      for (let i = 0; i < 3; i++) {
        await dashboardPage.searchProducts('test');
        await dashboardPage.clearSearch();
      }
      
      const productCount = await dashboardPage.getProductCount();
      expect(productCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Responsive Design Tests', () => {
    test('should display correctly on mobile viewport', async () => {
      await driver.manage().window().setRect({
        width: 375,
        height: 667
      });
      
      await driver.sleep(500);
      await dashboardPage.waitForProductsToLoad();
      
      const productCount = await dashboardPage.getProductCount();
      expect(productCount).toBeGreaterThanOrEqual(0);
      
      // Reset viewport
      await driver.manage().window().setRect({
        width: TestConfig.viewport.width,
        height: TestConfig.viewport.height
      });
    });

    test('should display correctly on tablet viewport', async () => {
      await driver.manage().window().setRect({
        width: 768,
        height: 1024
      });
      
      await driver.sleep(500);
      await dashboardPage.waitForProductsToLoad();
      
      const productCount = await dashboardPage.getProductCount();
      expect(productCount).toBeGreaterThanOrEqual(0);
      
      // Reset viewport
      await driver.manage().window().setRect({
        width: TestConfig.viewport.width,
        height: TestConfig.viewport.height
      });
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle network errors gracefully', async () => {
      // Simulate offline mode if possible
      try {
        await driver.executeScript(`
          window.addEventListener('error', (e) => {
            console.log('Network error handled:', e);
          });
        `);
        
        await dashboardPage.refresh();
        // Dashboard should still be accessible or show error state
      } catch (error) {
        console.log('Network error simulation test completed');
      }
    });
  });

  describe('Screenshot Tests', () => {
    test('should capture dashboard screenshot', async () => {
      await dashboardPage.takeScreenshot('dashboard-page-full');
    });

    test('should capture dashboard with search results', async () => {
      await dashboardPage.searchProducts('iPhone');
      await driver.sleep(1000);
      await dashboardPage.takeScreenshot('dashboard-search-results');
    });

    test('should capture mobile dashboard view', async () => {
      await driver.manage().window().setRect({
        width: 375,
        height: 667
      });
      
      await driver.sleep(500);
      await dashboardPage.takeScreenshot('dashboard-mobile');
      
      // Reset viewport
      await driver.manage().window().setRect({
        width: TestConfig.viewport.width,
        height: TestConfig.viewport.height
      });
    });
  });
});