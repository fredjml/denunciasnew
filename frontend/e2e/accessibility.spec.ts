import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('página inicial não contém violações WCAG 2.1 AA serious ou critical', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blockingViolations = results.violations.filter(({ impact }) =>
    impact === 'serious' || impact === 'critical',
  );

  expect(blockingViolations).toEqual([]);
});
