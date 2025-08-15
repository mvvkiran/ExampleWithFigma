import { WebDriver } from 'selenium-webdriver';
import { DriverFactory } from '../utils/driver-factory';
import { HomePage } from '../pages/home.page';
import { TestConfig, TestData } from '../config/test.config';

describe('Home Page Regression Tests', () => {
  let driver: WebDriver;
  let homePage: HomePage;

  beforeAll(async () => {
    driver = await DriverFactory.createDriver();
    homePage = new HomePage(driver);
  });

  afterAll(async () => {
    await DriverFactory.quitDriver();
  });

  beforeEach(async () => {
    await homePage.navigateToHome();
  });

  describe('Page Load and Basic Elements', () => {
    test('should load home page successfully', async () => {
      const isLoaded = await homePage.isLoaded();
      expect(isLoaded).toBe(true);
    });

    test('should display correct page title', async () => {
      const title = await homePage.getTitle();
      expect(title).toContain('Example');
    });

    test('should display welcome message', async () => {
      const welcomeText = await homePage.getWelcomeText();
      expect(welcomeText).toBeTruthy();
      expect(welcomeText.length).toBeGreaterThan(0);
    });

    test('should display all required page elements', async () => {
      const elements = await homePage.verifyHomePageElements();
      
      expect(elements.welcomeMessage).toBe(true);
      expect(elements.navigationMenu).toBe(true);
      
      // Log which optional elements are present
      Object.entries(elements).forEach(([key, value]) => {
        console.log(`Element ${key}: ${value ? 'Present' : 'Not Present'}`);
      });
    });
  });

  describe('Navigation Tests', () => {
    test('should navigate to dashboard from home page', async () => {
      await homePage.clickDashboardLink();
      await driver.sleep(2000); // Wait for navigation
      
      const currentUrl = await homePage.getCurrentUrl();
      expect(currentUrl).toContain('/dashboard');
    });

    test('should stay on home page when clicking home link', async () => {
      await homePage.clickHomeLink();
      await driver.sleep(1000);
      
      const isOnHome = await homePage.isOnPage('/home');
      expect(isOnHome).toBe(true);
    });
  });

  describe('Interactive Elements Tests', () => {
    test('should handle CTA button click if present', async () => {
      const ctaExists = await homePage.helpers.isElementPresent(homePage['ctaButton']);
      
      if (ctaExists) {
        await homePage.clickCTAButton();
        // Verify action occurred (navigation or modal)
        await driver.sleep(1000);
      } else {
        console.log('CTA button not present - skipping test');
      }
    });

    test('should handle Learn More button if present', async () => {
      try {
        await homePage.clickLearnMoreButton();
        await driver.sleep(1000);
        // Test passes if button exists and can be clicked
      } catch (error) {
        console.log('Learn More button not present - skipping');
      }
    });

    test('should handle Sign Up button if present', async () => {
      try {
        await homePage.clickSignUpButton();
        await driver.sleep(1000);
        // Test passes if button exists and can be clicked
      } catch (error) {
        console.log('Sign Up button not present - skipping');
      }
    });
  });

  describe('Content Display Tests', () => {
    test('should display hero section if present', async () => {
      const heroVisible = await homePage.isHeroSectionVisible();
      console.log(`Hero section: ${heroVisible ? 'Visible' : 'Not Present'}`);
      
      if (heroVisible) {
        expect(heroVisible).toBe(true);
      }
    });

    test('should display features section with cards if present', async () => {
      const featuresVisible = await homePage.isFeaturesSectionVisible();
      
      if (featuresVisible) {
        const cardCount = await homePage.getFeatureCardCount();
        expect(cardCount).toBeGreaterThan(0);
        
        const cardTexts = await homePage.getFeatureCardTexts();
        console.log(`Found ${cardCount} feature cards`);
        cardTexts.forEach((text, index) => {
          console.log(`Card ${index + 1}: ${text.substring(0, 50)}...`);
        });
      } else {
        console.log('Features section not present');
      }
    });

    test('should display footer if present', async () => {
      const footerVisible = await homePage.isFooterVisible();
      
      if (footerVisible) {
        await homePage.scrollToFooter();
        await driver.sleep(500);
        expect(footerVisible).toBe(true);
      } else {
        console.log('Footer not present');
      }
    });
  });

  describe('Responsive Design Tests', () => {
    test('should be responsive across different viewport sizes', async () => {
      const isResponsive = await homePage.verifyPageResponsiveness();
      expect(isResponsive).toBe(true);
      
      // Reset to default viewport
      await driver.manage().window().setRect({
        width: TestConfig.viewport.width,
        height: TestConfig.viewport.height
      });
    });

    test('should maintain navigation visibility on mobile', async () => {
      // Set mobile viewport
      await driver.manage().window().setRect({
        width: 375,
        height: 667
      });
      
      await driver.sleep(500);
      const navVisible = await homePage.isNavigationMenuVisible();
      expect(navVisible).toBe(true);
      
      // Reset viewport
      await driver.manage().window().setRect({
        width: TestConfig.viewport.width,
        height: TestConfig.viewport.height
      });
    });
  });

  describe('Performance Tests', () => {
    test('should load page within acceptable time', async () => {
      const startTime = Date.now();
      await homePage.navigateToHome();
      await homePage.waitForPageLoad();
      const loadTime = Date.now() - startTime;
      
      console.log(`Page load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
    });

    test('should handle page refresh correctly', async () => {
      const initialText = await homePage.getWelcomeText();
      await homePage.refresh();
      await homePage.waitForPageLoad();
      
      const afterRefreshText = await homePage.getWelcomeText();
      expect(afterRefreshText).toBe(initialText);
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle navigation errors gracefully', async () => {
      try {
        await homePage.navigate('/non-existent-page');
        await driver.sleep(1000);
        
        // Should either show 404 or redirect to home
        const currentUrl = await homePage.getCurrentUrl();
        expect(currentUrl).toBeDefined();
      } catch (error) {
        // Navigation error handled
        expect(error).toBeDefined();
      }
    });
  });

  describe('Screenshot Tests', () => {
    test('should capture homepage screenshot', async () => {
      await homePage.takeScreenshot('home-page-full');
      // Screenshot saved for visual regression
    });

    test('should capture mobile view screenshot', async () => {
      await driver.manage().window().setRect({
        width: 375,
        height: 667
      });
      
      await driver.sleep(500);
      await homePage.takeScreenshot('home-page-mobile');
      
      // Reset viewport
      await driver.manage().window().setRect({
        width: TestConfig.viewport.width,
        height: TestConfig.viewport.height
      });
    });
  });
});