import { expect, test } from '@playwright/test';

test('percorre o wizard completo até a confirmação com protocolo SYN-*', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();

  await page.getByTestId('portal-denuncie').click();
  await page.getByTestId('caminho-acolhimento').first().click();
  await page.getByTestId('avancar').click();

  await page.locator('.checklist-item').first().click();
  await page.getByTestId('avancar-relato').click();

  await page.getByTestId('avancar-detalhamento').click();

  await page.getByTestId('avancar-evidencias').click();

  await page.getByTestId('opcao-anonimo').click();
  await page.getByTestId('confirmar-aviso').click();
  await page.getByTestId('avancar-sigilo').click();

  await page.selectOption('#uf', 'SP');
  await expect(page.locator('#municipio option')).toHaveCount(4);
  await page.selectOption('#municipio', { index: 1 });
  await page.getByTestId('avancar-local').click();

  await expect(page.getByRole('heading', { name: 'Revise suas informações' })).toBeVisible();
  await page.getByTestId('enviar-denuncia').click();

  await expect(page.getByRole('heading', { name: 'Denúncia enviada com sucesso!' })).toBeVisible();
  await expect(page.getByTestId('protocolo')).toHaveText(/^SYN-[A-Z0-9]{8}$/);
  const protocolo = await page.getByTestId('protocolo').textContent();

  // Regressão: o protocolo não pode desaparecer se a página recarregar na tela de confirmação.
  await page.reload();
  await expect(page.getByTestId('protocolo')).toHaveText(protocolo ?? '');

  await page.getByTestId('voltar-inicio').click();
  await expect(page.getByRole('heading', { name: 'Acesso Rápido' })).toBeVisible();
});
