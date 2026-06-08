import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Advanced Testing: Visual Regression', () => {

  test('SauceDemo Login Page should match the baseline snapshot', async ({ page }) => {
    // รันครั้งแรกจะได้รูปต้นแบบ รันครั้งต่อไปจะเทียบกับครั้งแรก ถ้าเปลี่ยนเกิน 5% test จะ Fail
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const loginBox = page.locator('.login_wrapper-inner');
    
    await expect(loginBox).toHaveScreenshot('login-box-baseline.png', {
      maxDiffPixelRatio: 0.05 //5%
    });
  });

});
