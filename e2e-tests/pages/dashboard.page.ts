import { WebDriver, By, WebElement } from 'selenium-webdriver';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  // Locators
  private get pageTitle(): By {
    return By.css('h1');
  }

  private get searchInput(): By {
    return By.css('input[type="search"], input[placeholder*="Search"]');
  }

  private get searchButton(): By {
    return By.css('button[type="submit"], button.search-button');
  }

  private get productGrid(): By {
    return By.css('.product-grid, .products-container');
  }

  private get productCards(): By {
    return By.css('.product-card, .product-item');
  }

  private get filterSection(): By {
    return By.css('.filters, .filter-section');
  }

  private get categoryFilter(): By {
    return By.css('select.category-filter, .category-dropdown');
  }

  private get priceFilter(): By {
    return By.css('select.price-filter, .price-dropdown');
  }

  private get sortDropdown(): By {
    return By.css('select.sort-dropdown, .sort-select');
  }

  private get loadingSpinner(): By {
    return By.css('.loading-spinner, .loader');
  }

  private get noResultsMessage(): By {
    return By.css('.no-results, .empty-state');
  }

  private get addToCartButtons(): By {
    return By.css('.add-to-cart, button[aria-label*="cart"]');
  }

  private get viewDetailsButtons(): By {
    return By.css('.view-details, a.product-link');
  }

  private get pagination(): By {
    return By.css('.pagination, .page-controls');
  }

  private get nextPageButton(): By {
    return By.css('.next-page, button[aria-label="Next"]');
  }

  private get previousPageButton(): By {
    return By.css('.prev-page, button[aria-label="Previous"]');
  }

  // Actions
  async navigateToDashboard(): Promise<void> {
    await this.navigate('/dashboard');
    await this.waitForAngular();
    await this.waitForProductsToLoad();
  }

  async getDashboardTitle(): Promise<string> {
    return await this.helpers.getText(this.pageTitle);
  }

  async searchProducts(searchTerm: string): Promise<void> {
    await this.helpers.clearAndType(this.searchInput, searchTerm);
    if (await this.helpers.isElementPresent(this.searchButton)) {
      await this.helpers.click(this.searchButton);
    } else {
      // Trigger search on enter if no button
      await this.helpers.type(this.searchInput, '\n', false);
    }
    await this.waitForProductsToLoad();
  }

  async clearSearch(): Promise<void> {
    const searchElement = await this.helpers.waitForElementVisible(this.searchInput);
    await searchElement.clear();
  }

  async getProductCount(): Promise<number> {
    await this.waitForProductsToLoad();
    return await this.helpers.getElementCount(this.productCards);
  }

  async getProductTitles(): Promise<string[]> {
    const products = await this.helpers.getElements(this.productCards);
    const titles: string[] = [];
    for (const product of products) {
      const titleElement = await product.findElement(By.css('h2, h3, .product-title'));
      titles.push(await titleElement.getText());
    }
    return titles;
  }

  async getProductPrices(): Promise<number[]> {
    const products = await this.helpers.getElements(this.productCards);
    const prices: number[] = [];
    for (const product of products) {
      const priceElement = await product.findElement(By.css('.price, .product-price'));
      const priceText = await priceElement.getText();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      prices.push(price);
    }
    return prices;
  }

  async filterByCategory(category: string): Promise<void> {
    if (await this.helpers.isElementPresent(this.categoryFilter)) {
      await this.helpers.selectDropdown(this.categoryFilter, category);
      await this.waitForProductsToLoad();
    }
  }

  async filterByPriceRange(priceRange: string): Promise<void> {
    if (await this.helpers.isElementPresent(this.priceFilter)) {
      await this.helpers.selectDropdown(this.priceFilter, priceRange);
      await this.waitForProductsToLoad();
    }
  }

  async sortProducts(sortOption: string): Promise<void> {
    if (await this.helpers.isElementPresent(this.sortDropdown)) {
      await this.helpers.selectDropdown(this.sortDropdown, sortOption);
      await this.waitForProductsToLoad();
    }
  }

  async clickProductByIndex(index: number): Promise<void> {
    const products = await this.helpers.getElements(this.productCards);
    if (index < products.length) {
      await products[index].click();
    }
  }

  async addProductToCart(productIndex: number): Promise<void> {
    const addButtons = await this.helpers.getElements(this.addToCartButtons);
    if (productIndex < addButtons.length) {
      await addButtons[productIndex].click();
    }
  }

  async viewProductDetails(productIndex: number): Promise<void> {
    const viewButtons = await this.helpers.getElements(this.viewDetailsButtons);
    if (productIndex < viewButtons.length) {
      await viewButtons[productIndex].click();
    }
  }

  async goToNextPage(): Promise<void> {
    if (await this.helpers.isElementPresent(this.nextPageButton)) {
      await this.helpers.click(this.nextPageButton);
      await this.waitForProductsToLoad();
    }
  }

  async goToPreviousPage(): Promise<void> {
    if (await this.helpers.isElementPresent(this.previousPageButton)) {
      await this.helpers.click(this.previousPageButton);
      await this.waitForProductsToLoad();
    }
  }

  async isNoResultsMessageVisible(): Promise<boolean> {
    return await this.helpers.isElementVisible(this.noResultsMessage);
  }

  async isPaginationVisible(): Promise<boolean> {
    return await this.helpers.isElementVisible(this.pagination);
  }

  async waitForProductsToLoad(): Promise<void> {
    // Wait for loading spinner to disappear if present
    if (await this.helpers.isElementPresent(this.loadingSpinner)) {
      await this.driver.wait(async () => {
        return !(await this.helpers.isElementVisible(this.loadingSpinner));
      }, 10000);
    }
    
    // Wait for either products or no results message
    await this.driver.wait(async () => {
      const hasProducts = await this.helpers.isElementPresent(this.productCards);
      const hasNoResults = await this.helpers.isElementPresent(this.noResultsMessage);
      return hasProducts || hasNoResults;
    }, 10000);
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.helpers.waitForElementVisible(this.pageTitle);
      return await this.isOnPage('/dashboard');
    } catch {
      return false;
    }
  }

  // Validation methods
  async verifyDashboardElements(): Promise<{[key: string]: boolean}> {
    const results = {
      pageTitle: await this.helpers.isElementVisible(this.pageTitle),
      searchInput: await this.helpers.isElementPresent(this.searchInput),
      productGrid: await this.helpers.isElementPresent(this.productGrid)
    };

    // Check optional elements
    if (await this.helpers.isElementPresent(this.filterSection)) {
      results['filterSection'] = true;
    }

    if (await this.helpers.isElementPresent(this.sortDropdown)) {
      results['sortDropdown'] = true;
    }

    return results;
  }

  async verifyProductSorting(sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'): Promise<boolean> {
    const products = await this.getProductTitles();
    const prices = await this.getProductPrices();

    switch (sortBy) {
      case 'price-asc':
        return prices.every((price, i) => i === 0 || price >= prices[i - 1]);
      case 'price-desc':
        return prices.every((price, i) => i === 0 || price <= prices[i - 1]);
      case 'name-asc':
        return products.every((name, i) => i === 0 || name >= products[i - 1]);
      case 'name-desc':
        return products.every((name, i) => i === 0 || name <= products[i - 1]);
      default:
        return false;
    }
  }

  async getAppleProducts(): Promise<WebElement[]> {
    // Specific method to get Apple products mentioned in the mock data
    const products = await this.helpers.getElements(this.productCards);
    const appleProducts: WebElement[] = [];
    
    for (const product of products) {
      const text = await product.getText();
      if (text.includes('iPhone') || text.includes('MacBook') || text.includes('iPad') || 
          text.includes('Apple Watch') || text.includes('AirPods')) {
        appleProducts.push(product);
      }
    }
    
    return appleProducts;
  }
}