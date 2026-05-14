import { test, expect } from '@playwright/test';

test.describe('smoke', () => {
  test('home page renders the periodic table', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('grid', { name: /periodic table/i })).toBeVisible();
    // Hydrogen cell should always exist.
    await expect(page.locator('#element-H')).toBeVisible();
  });

  test('clicking an element navigates to its detail page', async ({ page }) => {
    await page.goto('/');
    await page.locator('#element-Au').click();
    await expect(page).toHaveURL(/\/elements\/Au$/);
    await expect(page.getByRole('heading', { name: /gold/i })).toBeVisible();
  });

  test('license page renders', async ({ page }) => {
    await page.goto('/#/license');
    await expect(page.getByRole('heading', { name: /license/i }).first()).toBeVisible();
  });

  test('unknown element shows the not-found state', async ({ page }) => {
    await page.goto('/#/elements/Zz');
    await expect(page.getByRole('heading', { name: /element not found/i })).toBeVisible();
  });
});
