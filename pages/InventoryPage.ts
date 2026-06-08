import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly shoppingCartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('.product_sort_container');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async addItemToCart(itemName: string) {
    const itemContainer = this.inventoryItems.filter({ hasText: itemName });
    await itemContainer.locator('button', { hasText: 'Add to cart' }).click();
  }

  async removeItemFromCart(itemName: string) {
    const itemContainer = this.inventoryItems.filter({ hasText: itemName });
    await itemContainer.locator('button', { hasText: 'Remove' }).click();
  }

  async filterBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getCartBadgeCount() {
    // If the badge is not visible (empty cart), return '0'
    if (await this.shoppingCartBadge.isVisible()) {
      return await this.shoppingCartBadge.textContent();
    }
    return '0';
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
