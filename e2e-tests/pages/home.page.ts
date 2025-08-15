import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  // Locators
  private get welcomeMessage(): By {
    return By.css('h1');
  }

  private get heroSection(): By {
    return By.css('.hero-section');
  }

  private get featuresSection(): By {
    return By.css('.features-section');
  }

  private get featureCards(): By {
    return By.css('.feature-card');
  }

  private get ctaButton(): By {
    return By.css('.cta-button');
  }

  private get navigationMenu(): By {
    return By.css('nav');
  }

  private get footerSection(): By {
    return By.css('footer');
  }

  private get learnMoreButton(): By {
    return By.xpath('//button[contains(text(), "Learn More")]');
  }

  private get signUpButton(): By {
    return By.xpath('//button[contains(text(), "Sign Up")]');
  }

  // Actions
  async navigateToHome(): Promise<void> {
    await this.navigate('/home');
    await this.waitForAngular();
  }

  async getWelcomeText(): Promise<string> {
    return await this.helpers.getText(this.welcomeMessage);
  }

  async isHeroSectionVisible(): Promise<boolean> {
    return await this.helpers.isElementVisible(this.heroSection);
  }

  async isFeaturesSectionVisible(): Promise<boolean> {
    return await this.helpers.isElementVisible(this.featuresSection);
  }

  async getFeatureCardCount(): Promise<number> {
    return await this.helpers.getElementCount(this.featureCards);
  }

  async clickCTAButton(): Promise<void> {
    await this.helpers.scrollTo(this.ctaButton);
    await this.helpers.click(this.ctaButton);
  }

  async clickLearnMoreButton(): Promise<void> {
    if (await this.helpers.isElementPresent(this.learnMoreButton)) {
      await this.helpers.scrollTo(this.learnMoreButton);
      await this.helpers.click(this.learnMoreButton);
    }
  }

  async clickSignUpButton(): Promise<void> {
    if (await this.helpers.isElementPresent(this.signUpButton)) {
      await this.helpers.scrollTo(this.signUpButton);
      await this.helpers.click(this.signUpButton);
    }
  }

  async isNavigationMenuVisible(): Promise<boolean> {
    return await this.helpers.isElementVisible(this.navigationMenu);
  }

  async isFooterVisible(): Promise<boolean> {
    return await this.helpers.isElementVisible(this.footerSection);
  }

  async scrollToFooter(): Promise<void> {
    if (await this.helpers.isElementPresent(this.footerSection)) {
      await this.helpers.scrollTo(this.footerSection);
    }
  }

  async getFeatureCardTexts(): Promise<string[]> {
    const cards = await this.helpers.getElements(this.featureCards);
    const texts: string[] = [];
    for (const card of cards) {
      texts.push(await card.getText());
    }
    return texts;
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.helpers.waitForElementVisible(this.welcomeMessage);
      return await this.isOnPage('/home');
    } catch {
      return false;
    }
  }

  // Validation methods
  async verifyHomePageElements(): Promise<{[key: string]: boolean}> {
    const results = {
      welcomeMessage: await this.helpers.isElementVisible(this.welcomeMessage),
      navigationMenu: await this.isNavigationMenuVisible(),
      heroSection: await this.isHeroSectionVisible()
    };

    // Check for optional elements
    if (await this.helpers.isElementPresent(this.featuresSection)) {
      results['featuresSection'] = await this.isFeaturesSectionVisible();
    }

    if (await this.helpers.isElementPresent(this.footerSection)) {
      results['footer'] = await this.isFooterVisible();
    }

    return results;
  }

  async verifyPageResponsiveness(): Promise<boolean> {
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await this.driver.manage().window().setRect({
        width: viewport.width,
        height: viewport.height
      });
      
      await this.helpers.sleep(500); // Wait for resize
      
      const isVisible = await this.helpers.isElementVisible(this.welcomeMessage);
      if (!isVisible) {
        console.error(`Home page not responsive at ${viewport.name} size`);
        return false;
      }
    }

    return true;
  }
}