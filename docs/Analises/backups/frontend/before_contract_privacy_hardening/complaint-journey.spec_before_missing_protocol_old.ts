import AxeBuilder from '@axe-core/playwright';
import { expect, Page, test } from '@playwright/test';

async function openComplaint(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Denuncie ao MPT' })).toBeVisible();
  await page.locator('#btn-denunciar').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'O que está acontecendo?' })).toBeVisible();
}

async function completeComplaintForm(page: Page): Promise<void> {
  await openComplaint(page);

  const harassmentOption = page.locator('#check-assedio');
  await harassmentOption.focus();
  await page.keyboard.press('Space');
  await expect(harassmentOption).toHaveAttribute('aria-checked', 'true');
  await page.locator('#relato-texto').fill('Relato fictício para teste automatizado de interface.');
  await page.locator('#btn-avancar-step1').click();

  await expect(page.getByRole('heading', { name: 'Detalhamento da Ocorrência' })).toBeVisible();
  await page.locator('#periodo-ocorrencia').fill('Desde janeiro de 2026');
  await page.locator('#modalidade-trabalho').fill('Presencial');
  await page.locator('#numero-prejudicados').fill('3 pessoas');
  await page.locator('#funcoes-setores').fill('Setor fictício');
  await page.locator('#nomes-dados').fill('Dados exclusivamente fictícios');

  await page.locator('#btn-voltar-step2').click();
  await expect(page.locator('#relato-texto')).toHaveValue(
    'Relato fictício para teste automatizado de interface.',
  );
  await page.locator('#btn-avancar-step1').click();
  await expect(page.locator('#periodo-ocorrencia')).toHaveValue('Desde janeiro de 2026');
  await page.locator('#btn-avancar-step2').click();

  await expect(page.getByRole('heading', { name: 'Evidências' })).toBeVisible();
  const vulnerableGroup = page.locator('#check-pcd');
  await vulnerableGroup.focus();
  await page.keyboard.press('Space');
  await expect(vulnerableGroup).toHaveAttribute('aria-checked', 'true');
  await page.locator('#file-upload').setInputFiles({
    name: 'evidencia-ficticia.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('arquivo fictício de teste'),
  });
  await expect(page.getByText('evidencia-ficticia.pdf')).toBeVisible();
  await page.locator('#orgao-nao').click();
  await expect(page.locator('#orgao-nao')).toHaveAttribute('aria-checked', 'true');
  await page.locator('#btn-avancar-step3').click();

  await expect(page.getByRole('heading', { name: 'Sigilo e Anonimato' })).toBeVisible();
  await page.locator('#opt-identificado').click();
  await page.locator('#nome-completo').fill('Pessoa Fictícia');
  await page.locator('#email-contato').fill('pessoa.ficticia@example.test');
  await page.locator('#telefone-contato').fill('(00) 00000-0000');
  await page.locator('#btn-avancar-step4').click();

  await expect(page.getByRole('heading', { name: 'Onde o fato ocorreu?' })).toBeVisible();
  await page.locator('#select-uf').selectOption('SP');
  await page.locator('#municipio').fill('Município Fictício');
  await page.locator('#nome-empresa').fill('Empresa Fictícia');
  await page.locator('#endereco-empresa').fill('Endereço Fictício, 123');
  await page.locator('#cnpj-empresa').fill('00.000.000/0001-00');
  await page.locator('#btn-revisar').click();

  await expect(page.getByRole('heading', { name: 'Revise suas informações' })).toBeVisible();
  await expect(page.getByText('Município Fictício / SP')).toBeVisible();
  await expect(page.getByText('Empresa Fictícia')).toBeVisible();
}

test('preenche campos, navega entre telas e conclui uma denúncia simulada', async ({ page }, testInfo) => {
  await page.route('**/api/denuncias', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ sucesso: true, protocolo: 'MPT-E2E12345' }),
    });
  });

  await completeComplaintForm(page);
  await page.screenshot({ path: testInfo.outputPath('revisao.png'), fullPage: true });
  await page.locator('#btn-enviar-denuncia').click();

  await expect(page.locator('#numero-protocolo')).toHaveText('MPT-E2E12345');
  await page.screenshot({ path: testInfo.outputPath('confirmacao.png'), fullPage: true });
});

test('mantém a revisão, exibe falha e permite nova tentativa', async ({ page }, testInfo) => {
  let shouldFail = true;
  await page.route('**/api/denuncias', async (route) => {
    if (shouldFail) {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ erro: 'Serviço de recebimento indisponível' }),
      });
      return;
    }

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ sucesso: true, protocolo: 'MPT-RETRYE2E' }),
    });
  });

  await completeComplaintForm(page);
  await page.locator('#btn-enviar-denuncia').click();
  await expect(page.getByRole('alert')).toContainText('Não foi possível enviar sua denúncia');
  await expect(page.getByRole('heading', { name: 'Revise suas informações' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('falha-envio.png'), fullPage: true });

  shouldFail = false;
  await page.locator('#btn-enviar-denuncia').click();
  await expect(page.locator('#numero-protocolo')).toHaveText('MPT-RETRYE2E');
});

test('registra baseline automatizada de acessibilidade', async ({ page }, testInfo) => {
  await openComplaint(page);
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `,
  });
  await page.waitForTimeout(100);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  await testInfo.attach('axe-results', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });

  const blockingViolations = results.violations.filter(
    ({ impact }) => impact === 'critical' || impact === 'serious',
  );
  expect(blockingViolations).toEqual([]);
});
