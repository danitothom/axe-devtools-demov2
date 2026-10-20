import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'fs';
import Reporter from '@axe-devtools/reporter';

const resultsDir = './results/';
mkdirSync(resultsDir, { recursive: true });

const reporter = new Reporter('axeDevToolsPlaywright', resultsDir);

test.describe('Dashboard', () => {
  test('has expected page structure', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    console.log(`axe found ${results.violations.length} violations`);
    reporter.logTestResult('dashboard', results);

    expect(results).toBeDefined();
  });

  test.afterAll(async () => {
    await reporter.buildHTML(resultsDir);
    await reporter.buildJUnitXML(resultsDir);
    console.log('Reports generated in:', resultsDir);
  });
});
