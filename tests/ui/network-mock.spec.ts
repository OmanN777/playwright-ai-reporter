import { test, expect } from '@playwright/test';

test.describe('Advanced Testing: Network Mocking (Interception)', () => {

  test('should mock a product API response successfully', async ({ page }) => {
    // ดักจับ request แล้วส่ง mock data กลับไป
    await page.route('https://dummyjson.com/products/1', async route => {
      // Create fake JSON payload
      const mockResponse = {
        id: 1,
        title: "Mocked AI Augmented Product",
        description: "This product was injected by Playwright Network Interception!",
        price: 9999,
        discountPercentage: 10,
        rating: 5.0,
        stock: 100,
        brand: "Antigravity",
        category: "smartphones"
      };

      // ตอบกลับ request ด้วย mock data
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    });

    await page.goto('about:blank');
    
    // จำลอง frontend ยิง fetch
    const productData = await page.evaluate(async () => {
      const response = await fetch('https://dummyjson.com/products/1');
      return await response.json();
    });

    expect(productData.title).toBe("Mocked AI Augmented Product");
    expect(productData.price).toBe(9999);
    expect(productData.brand).toBe("Antigravity");
  });

});
