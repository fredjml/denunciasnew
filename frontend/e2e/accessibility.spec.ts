import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function semViolacoesBloqueantes(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blockingViolations = results.violations.filter(({ impact }) =>
    impact === 'serious' || impact === 'critical',
  );

  expect(blockingViolations).toEqual([]);
}

test('página inicial não contém violações WCAG 2.1 AA serious ou critical', async ({ page }) => {
  await page.goto('/');
  await semViolacoesBloqueantes(page);
});

test('wizard completo (relato, detalhamento, evidências) não contém violações WCAG 2.1 AA serious ou critical', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByTestId('caminho-acolhimento').first().click();
  await page.getByTestId('avancar').click();
  await semViolacoesBloqueantes(page);

  await page.locator('.checklist-item').first().click();
  await page.getByTestId('avancar-relato').click();
  await semViolacoesBloqueantes(page);

  await page.getByTestId('avancar-detalhamento').click();
  await semViolacoesBloqueantes(page);
});
