import { test, expect } from '@playwright/test';

test.describe('API Testing: User Management (jsonplaceholder)', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';
  let userId: number;

  test('GET - Should fetch a list of users successfully', async ({ request }) => {
    const response = await request.get(`${baseURL}/users`);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBeTruthy();
    expect(responseBody.length).toBeGreaterThan(0);
    // เช็คข้อมูล user คนแรก
    expect(responseBody[0]).toHaveProperty('id');
    expect(responseBody[0]).toHaveProperty('email');
    expect(responseBody[0]).toHaveProperty('name');
  });

  test('POST - Should create a new user', async ({ request }) => {
    const payload = {
      name: 'Natawat QA',
      job: 'QA Automation Engineer'
    };

    const response = await request.post(`${baseURL}/users`, {
      data: payload
    });

    expect(response.status()).toBe(201); // เช็ค status 201 ว่าสร้างสำเร็จ
    
    const responseBody = await response.json();
    expect(responseBody.name).toBe(payload.name);
    expect(responseBody.job).toBe(payload.job);
    expect(responseBody).toHaveProperty('id');

    // เก็บ ID ไว้ใช้ต่อ
    userId = responseBody.id;
  });

  test('PUT - Should update user details', async ({ request }) => {
    const payload = {
      name: 'Natawat QA Lead',
      job: 'QA Manager'
    };

    // แก้ข้อมูล user คนที่ 2
    const response = await request.put(`${baseURL}/users/2`, {
      data: payload
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.name).toBe(payload.name);
    expect(responseBody.job).toBe(payload.job);
    expect(responseBody).toHaveProperty('id');
  });

  test('DELETE - Should remove a user', async ({ request }) => {
    // ลบ user คนที่ 2
    const response = await request.delete(`${baseURL}/users/2`);
    
    // เช็ค status 200 ว่าลบสำเร็จ
    expect(response.status()).toBe(200); 
  });
});
