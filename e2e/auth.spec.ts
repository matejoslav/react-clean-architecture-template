import { test, expect } from '@playwright/test';

const mockToken = 'QpwL5tke4Pnpja7X4';

function mockLoginSuccess(page: import('@playwright/test').Page) {
  return page.route('**/api/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: mockToken }),
    }),
  );
}

function mockLoginFailure(page: import('@playwright/test').Page) {
  return page.route('**/api/login', (route) =>
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'user not found' }),
    }),
  );
}

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test('shows sign-in page when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/sign-in/);
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
  });

  test('successful sign in redirects to home', async ({ page }) => {
    await mockLoginSuccess(page);

    await page.goto('/sign-in');
    await page.getByPlaceholder('Email').fill('user@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('failed sign in shows error message', async ({ page }) => {
    await mockLoginFailure(page);

    await page.goto('/sign-in');
    await page.getByPlaceholder('Email').fill('wrong@example.com');
    await page.getByPlaceholder('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText(/failed|error|invalid/i)).toBeVisible();
  });

  test('sign out redirects to sign-in page', async ({ page }) => {
    await mockLoginSuccess(page);

    await page.goto('/sign-in');
    await page.getByPlaceholder('Email').fill('user@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();

    await page.getByRole('button', { name: 'Sign Out' }).click();

    await expect(page).toHaveURL(/sign-in/);
    await expect(page.getByPlaceholder('Email')).toBeVisible();
  });

  test('session persists after page reload', async ({ page }) => {
    await mockLoginSuccess(page);

    await page.goto('/sign-in');
    await page.getByPlaceholder('Email').fill('user@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();

    // Mock the login endpoint for session restoration (uses stored token)
    await page.reload();

    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('session restoration redirects to home when token exists', async ({ page }) => {
    // Set a token in localStorage before navigating
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'QpwL5tke4Pnpja7X4');
    });

    await page.goto('/');

    // Session is restored from localStorage, user lands on home
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
    await expect(page).toHaveURL('/');
  });
});
