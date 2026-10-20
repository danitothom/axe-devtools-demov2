import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'fs';
import Reporter from '@axe-devtools/reporter';

const resultsDir = './results/';
mkdirSync(resultsDir, { recursive: true });

const reporter = new Reporter('axeDevToolsPlaywright', resultsDir);

test.describe('Blog', () => {
  test('has expected landmarks', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    console.log(`axe found ${results.violations.length} violations`);
    reporter.logTestResult('blog', results);

    expect(results).toBeDefined();
  });

  test.afterAll(async () => {
    await reporter.buildHTML(resultsDir);
    await reporter.buildJUnitXML(resultsDir);
    console.log('Reports generated in:', resultsDir);
  });
});
