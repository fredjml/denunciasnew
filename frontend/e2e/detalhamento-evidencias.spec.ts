import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await page.getByTestId('portal-denuncie').click();
  await page.getByTestId('caminho-acolhimento').first().click();
  await page.getByTestId('avancar').click();
  await page.locator('.checklist-item').first().click();
  await page.getByTestId('avancar-relato').click();
});

test('navega de Relato Guiado até Detalhamento e depois Evidências', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Detalhamento da ocorrência' })).toBeVisible();

  await page.getByTestId('avancar-detalhamento').click();

  await expect(page.getByRole('heading', { name: 'Evidências' })).toBeVisible();
});

test('anexa um PDF sintético válido em Evidências', async ({ page }) => {
  await page.getByTestId('avancar-detalhamento').click();

  await page.setInputFiles('#evidencias-input', {
    name: 'SYN-laudo.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\nconteudo sintetico'),
  });

  await expect(page.locator('.lista-arquivos li')).toHaveCount(1);
  await expect(page.locator('.lista-arquivos li')).toContainText('SYN-laudo.pdf');
});

test('mostra erro ao anexar arquivo com MIME não permitido', async ({ page }) => {
  await page.getByTestId('avancar-detalhamento').click();

  await page.setInputFiles('#evidencias-input', {
    name: 'SYN-virus.exe',
    mimeType: 'application/x-msdownload',
    buffer: Buffer.from('binario'),
  });

  await expect(page.getByRole('alert')).toContainText('não permitido');
});
