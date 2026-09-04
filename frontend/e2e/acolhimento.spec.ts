import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
});

test('apresenta os três caminhos e bloqueia o avanço sem escolha', async ({ page }) => {
  const choices = page.getByTestId('caminho-acolhimento');

  await expect(choices).toHaveCount(3);
  await expect(choices.nth(0)).toContainText('Denuncie');
  await expect(choices.nth(1)).toContainText('Faz parte de um órgão público e quer denunciar');
  await expect(choices.nth(2)).toContainText('Tem dúvida? Fale com a Ouvidoria');
  await expect(page.getByTestId('avancar')).toBeDisabled();
});

test('persiste a escolha na sessão após recarregar a página', async ({ page }) => {
  const citizenChoice = page.getByTestId('caminho-acolhimento').first();

  await citizenChoice.click();
  await expect(page.getByTestId('avancar')).toBeEnabled();
  await page.reload();

  await expect(citizenChoice).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('avancar')).toBeEnabled();
});

test('oferece vídeo opcional sem autoplay, com legenda e transcrição', async ({ page }) => {
  const video = page.locator('video');

  await expect(video).toHaveJSProperty('autoplay', false);
  await expect(video).toHaveJSProperty('controls', true);
  await expect(video.locator('track[kind="captions"]')).toHaveCount(1);
  await expect(page.getByTestId('transcricao-video')).toBeVisible();
});
