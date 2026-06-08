import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Authentication & Security Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('should fail login with incorrect username', async ({ page }) => {
    await loginPage.login('wrong_user', 'secret_sauce');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
  });

  test('should fail login with incorrect password', async ({ page }) => {
    await loginPage.login('standard_user', 'wrong_password');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
  });

  test('should be case-sensitive for username', async ({ page }) => {
    await loginPage.login('STANDARD_USER', 'secret_sauce');
    const errorMessage = await loginPage.getErrorMessage();
    // เช็คตัวพิมพ์ใหญ่/เล็กตอน login
    expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
  });

  test('should prevent accessing inventory directly without login (Bypass test)', async ({ page }) => {
    // ลองเข้าหน้า inventory โดยไม่ login
    await page.goto('https://www.saucedemo.com/inventory.html');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Epic sadface: You can only access '/inventory.html' when you are logged in.");
  });

  test('should prevent access after logout', async ({ page }) => {
    await loginPage.login('standard_user');
    await expect(inventoryPage.title).toHaveText('Products');
    await inventoryPage.logout();
    
    // เช็คว่าเด้งกลับมาหน้า login
    await expect(loginPage.loginButton).toBeVisible();

    // ลองเข้าหน้า inventory อีกรอบ
    await page.goto('https://www.saucedemo.com/inventory.html');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain("Epic sadface: You can only access '/inventory.html' when you are logged in.");
  });
});
