import { test, expect } from '@playwright/test';

test.describe('Main UI smoke', () => {
  test('loads home and key UI elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Basic page sanity
    await expect(page).toHaveTitle(/fieldcrew/i);

    // Navigation present
    await expect(page.getByRole('navigation')).toBeVisible();

    // Primary heading visible
    await expect(
      page.getByRole('heading', { level: 1 })
    ).toBeVisible();

    // Example primary action (adjust text as needed)
    const primaryCta = page
      .getByRole('button', { name: /get started|book demo|add crew/i })
      .first();
    await expect(primaryCta).toBeVisible();
    await expect(primaryCta).toBeEnabled();

    // Quick accessibility-ish check: buttons should have some label
    const buttons = await page.getByRole('button').all();
    for (const btn of buttons) {
      const aria = await btn.getAttribute('aria-label');
      const text = (await btn.innerText())?.trim();
      expect((aria || text || '').length).toBeGreaterThan(0);
    }

    // Capture a baseline screenshot for future visual comparisons
    await page.screenshot({
      path: 'artifacts/home-baseline.png',
      fullPage: true,
    });
  });
});

