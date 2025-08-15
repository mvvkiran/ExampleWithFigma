import { Builder, WebDriver, Capabilities } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';
import edge from 'selenium-webdriver/edge';
import { TestConfig } from '../config/test.config';

export class DriverFactory {
  private static instance: WebDriver | null = null;

  static async createDriver(): Promise<WebDriver> {
    if (this.instance) {
      return this.instance;
    }

    const builder = new Builder();

    switch (TestConfig.browser.toLowerCase()) {
      case 'chrome':
        this.instance = await this.createChromeDriver(builder);
        break;
      case 'firefox':
        this.instance = await this.createFirefoxDriver(builder);
        break;
      case 'edge':
        this.instance = await this.createEdgeDriver(builder);
        break;
      default:
        this.instance = await this.createChromeDriver(builder);
    }

    // Set timeouts
    await this.instance.manage().setTimeouts({
      implicit: TestConfig.timeout.implicit,
      pageLoad: TestConfig.timeout.pageLoad,
      script: TestConfig.timeout.script
    });

    // Set window size
    await this.instance.manage().window().setRect({
      width: TestConfig.viewport.width,
      height: TestConfig.viewport.height
    });

    return this.instance;
  }

  private static async createChromeDriver(builder: Builder): Promise<WebDriver> {
    const options = new chrome.Options();
    
    if (TestConfig.headless) {
      options.addArguments('--headless=new');
    }
    
    options.addArguments(
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-gpu',
      '--window-size=' + TestConfig.viewport.width + ',' + TestConfig.viewport.height,
      '--ignore-certificate-errors',
      '--disable-web-security'
    );

    return builder
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }

  private static async createFirefoxDriver(builder: Builder): Promise<WebDriver> {
    const options = new firefox.Options();
    
    if (TestConfig.headless) {
      options.addArguments('--headless');
    }
    
    options.addArguments(
      '--width=' + TestConfig.viewport.width,
      '--height=' + TestConfig.viewport.height
    );

    return builder
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();
  }

  private static async createEdgeDriver(builder: Builder): Promise<WebDriver> {
    const options = new edge.Options();
    
    if (TestConfig.headless) {
      options.addArguments('--headless');
    }
    
    options.addArguments(
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--window-size=' + TestConfig.viewport.width + ',' + TestConfig.viewport.height
    );

    return builder
      .forBrowser('MicrosoftEdge')
      .setEdgeOptions(options)
      .build();
  }

  static async quitDriver(): Promise<void> {
    if (this.instance) {
      await this.instance.quit();
      this.instance = null;
    }
  }

  static getDriver(): WebDriver {
    if (!this.instance) {
      throw new Error('Driver not initialized. Call createDriver() first.');
    }
    return this.instance;
  }
}