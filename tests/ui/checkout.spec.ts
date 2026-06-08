import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout Flow Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user');
  });

  test('should complete full checkout successfully', async ({ page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.shoppingCartBadge.click();
    
    expect(await cartPage.getCartItemsCount()).toBe(1);
    await cartPage.proceedToCheckout();
    
    await checkoutPage.fillInformation('Natawat', 'Tephassadin', '10110');
    await checkoutPage.finishCheckout();
    
    const completeMessage = await checkoutPage.getCompleteMessage();
    expect(completeMessage).toContain('Thank you for your order!');
  });

  test('should prevent checkout with empty cart', async ({ page }) => {
    await inventoryPage.shoppingCartBadge.click(); // เข้าตะกร้าว่าง
    expect(await cartPage.getCartItemsCount()).toBe(0);
    
    await cartPage.proceedToCheckout();
    
    // ตะกร้าว่างต้อง checkout ไม่ได้
    await checkoutPage.fillInformation('Natawat', 'Tephassadin', '10110');
    await checkoutPage.finishCheckout();
    
    // ตรวจสอบ error
    const url = page.url();
    if (url.includes('checkout-complete.html')) {
        throw new Error('Business Logic Error: System allowed checkout with an empty cart!');
    }
  });
});
