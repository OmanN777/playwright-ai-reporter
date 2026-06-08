import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Inventory & Filter Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user');
  });

  test('should add and remove item from cart', async ({ page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');
    
    await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe('0');
  });

  test('should sort items by price (low to high)', async ({ page }) => {
    await inventoryPage.filterBy('lohi');
    
    // เรียงราคาจากน้อยไปมาก
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
    
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sortedPrices);
  });
});
