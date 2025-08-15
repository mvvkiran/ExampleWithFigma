import { WebDriver, By, WebElement, until, Key } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
import { TestConfig } from '../config/test.config';

export class TestHelpers {
  constructor(private driver: WebDriver) {}

  async waitForElement(locator: By, timeout: number = TestConfig.timeout.implicit): Promise<WebElement> {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async waitForElementVisible(locator: By, timeout: number = TestConfig.timeout.implicit): Promise<WebElement> {
    const element = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  async waitForElementClickable(locator: By, timeout: number = TestConfig.timeout.implicit): Promise<WebElement> {
    const element = await this.waitForElementVisible(locator, timeout);
    await this.driver.wait(until.elementIsEnabled(element), timeout);
    return element;
  }

  async click(locator: By): Promise<void> {
    const element = await this.waitForElementClickable(locator);
    await this.retry(async () => await element.click());
  }

  async type(locator: By, text: string, clear: boolean = true): Promise<void> {
    const element = await this.waitForElementVisible(locator);
    if (clear) {
      await element.clear();
    }
    await element.sendKeys(text);
  }

  async getText(locator: By): Promise<string> {
    const element = await this.waitForElementVisible(locator);
    return await element.getText();
  }

  async getAttribute(locator: By, attribute: string): Promise<string> {
    const element = await this.waitForElement(locator);
    return await element.getAttribute(attribute);
  }

  async isElementPresent(locator: By): Promise<boolean> {
    try {
      await this.driver.findElement(locator);
      return true;
    } catch {
      return false;
    }
  }

  async isElementVisible(locator: By): Promise<boolean> {
    try {
      const element = await this.driver.findElement(locator);
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }

  async waitForUrl(urlPattern: string | RegExp, timeout: number = TestConfig.timeout.pageLoad): Promise<void> {
    await this.driver.wait(async () => {
      const currentUrl = await this.driver.getCurrentUrl();
      if (urlPattern instanceof RegExp) {
        return urlPattern.test(currentUrl);
      }
      return currentUrl.includes(urlPattern);
    }, timeout);
  }

  async waitForTitle(title: string, timeout: number = TestConfig.timeout.pageLoad): Promise<void> {
    await this.driver.wait(until.titleIs(title), timeout);
  }

  async takeScreenshot(name: string): Promise<void> {
    const screenshot = await this.driver.takeScreenshot();
    const screenshotPath = path.join(TestConfig.screenshots.path, `${name}_${Date.now()}.png`);
    
    if (!fs.existsSync(TestConfig.screenshots.path)) {
      fs.mkdirSync(TestConfig.screenshots.path, { recursive: true });
    }
    
    fs.writeFileSync(screenshotPath, screenshot, 'base64');
  }

  async scrollTo(locator: By): Promise<void> {
    const element = await this.waitForElement(locator);
    await this.driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"});', element);
    await this.sleep(500); // Wait for scroll animation
  }

  async selectDropdown(locator: By, value: string): Promise<void> {
    const select = await this.waitForElementClickable(locator);
    await select.click();
    const option = await this.waitForElementClickable(By.xpath(`//option[@value="${value}"]`));
    await option.click();
  }

  async clearAndType(locator: By, text: string): Promise<void> {
    const element = await this.waitForElementVisible(locator);
    await element.sendKeys(Key.chord(Key.CONTROL, 'a'));
    await element.sendKeys(Key.DELETE);
    await element.sendKeys(text);
  }

  async getElements(locator: By): Promise<WebElement[]> {
    await this.waitForElement(locator);
    return await this.driver.findElements(locator);
  }

  async getElementCount(locator: By): Promise<number> {
    const elements = await this.getElements(locator);
    return elements.length;
  }

  async refresh(): Promise<void> {
    await this.driver.navigate().refresh();
  }

  async navigateTo(url: string): Promise<void> {
    await this.driver.get(url);
  }

  async executeScript(script: string, ...args: any[]): Promise<any> {
    return await this.driver.executeScript(script, ...args);
  }

  async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retry<T>(fn: () => Promise<T>, retries: number = TestConfig.retry.count): Promise<T> {
    let lastError: Error | undefined;
    
    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < retries) {
          await this.sleep(TestConfig.retry.delay);
        }
      }
    }
    
    throw lastError;
  }
}