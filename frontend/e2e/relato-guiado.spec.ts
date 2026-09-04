import { expect, test, type Page } from '@playwright/test';

async function enterRelatoGuiado(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await page.getByTestId('caminho-acolhimento').first().click();
  await page.getByTestId('avancar').click();
}

test('grava áudio com dispositivo de mídia falso e exibe preview de transcrição', async ({ page, context }) => {
  await context.grantPermissions(['microphone']);
  await enterRelatoGuiado(page);

  await page.getByTestId('usar-audio').click();
  await page.getByRole('button', { name: 'Concordar e habilitar áudio' }).click();

  await page.getByRole('button', { name: 'Iniciar gravação' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Parar gravação' }).click();

  await expect(page.getByLabel('Transcrição editável')).toBeVisible();
});

test('mostra fallback textual quando o microfone é negado', async ({ page }) => {
  // Simula NotAllowedError diretamente na API, sem depender do fluxo de
  // permissão nativo do Chromium (incompatível com --use-fake-ui-for-media-stream).
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = () =>
      Promise.reject(new DOMException('Permission denied', 'NotAllowedError'));
  });
  await enterRelatoGuiado(page);

  await page.getByTestId('usar-audio').click();
  await page.getByRole('button', { name: 'Concordar e habilitar áudio' }).click();
  await page.getByRole('button', { name: 'Iniciar gravação' }).click();

  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('status')).toContainText('O campo de texto continua disponível');
});
