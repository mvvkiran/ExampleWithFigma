import { WebDriver, By } from 'selenium-webdriver';
import { TestHelpers } from '../utils/test-helpers';
import { TestConfig } from '../config/test.config';

export abstract class BasePage {
  protected driver: WebDriver;
  protected helpers: TestHelpers;
  protected url: string;

  constructor(driver: WebDriver) {
    this.driver = driver;
    this.helpers = new TestHelpers(driver);
    this.url = TestConfig.baseUrl;
  }

  async navigate(path: string = ''): Promise<void> {
    const fullUrl = `${this.url}${path}`;
    await this.driver.get(fullUrl);
  }

  async getTitle(): Promise<string> {
    return await this.driver.getTitle();
  }

  async getCurrentUrl(): Promise<string> {
    return await this.driver.getCurrentUrl();
  }

  async isLoaded(): Promise<boolean> {
    return true; // Override in child classes
  }

  async waitForPageLoad(): Promise<void> {
    await this.helpers.executeScript('return document.readyState').then(async (readyState) => {
      if (readyState !== 'complete') {
        await this.helpers.sleep(1000);
        await this.waitForPageLoad();
      }
    });
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.helpers.takeScreenshot(name);
  }

  async refresh(): Promise<void> {
    await this.helpers.refresh();
  }

  // Common navigation elements
  protected get navHomeLink(): By {
    return By.css('a[routerlink="/home"]');
  }

  protected get navDashboardLink(): By {
    return By.css('a[routerlink="/dashboard"]');
  }

  async clickHomeLink(): Promise<void> {
    await this.helpers.click(this.navHomeLink);
  }

  async clickDashboardLink(): Promise<void> {
    await this.helpers.click(this.navDashboardLink);
  }

  async isOnPage(urlPattern: string | RegExp): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    if (urlPattern instanceof RegExp) {
      return urlPattern.test(currentUrl);
    }
    return currentUrl.includes(urlPattern);
  }

  async verifyPageTitle(expectedTitle: string): Promise<boolean> {
    const actualTitle = await this.getTitle();
    return actualTitle === expectedTitle;
  }

  async waitForAngular(): Promise<void> {
    try {
      await this.helpers.executeScript(`
        return new Promise((resolve) => {
          if (window.getAllAngularTestabilities) {
            Promise.all(
              window.getAllAngularTestabilities().map(testability =>
                new Promise((res) => testability.whenStable(res))
              )
            ).then(resolve);
          } else {
            resolve();
          }
        });
      `);
    } catch (error) {
      // If Angular is not present or there's an error, continue
      console.log('Could not wait for Angular:', error);
    }
  }
}