// Links institucionais externos ao mpt.mp.br — nenhum é implementado por este app (fora do
// contrato/backend-mock); todos abrem em nova aba. URLs confirmadas alcançáveis (HTTP 200,
// com user-agent de navegador — o WAF do domínio bloqueia requisições sem User-Agent) em
// 2026-09-05. Ver docs/preparacao-designvisualUIUX/modelos-telas/02-portal-institucional-home.md.
export const MPT_LINKS = {
  // FATIA-DN-CP1-03 — confirmada explicitamente pelo owner (não é domínio do MPT, ver
  // docs/preparacao-implementacao/12-DECISIONS.delta-denunciasnew.md). Reaproveitada aqui para
  // o tile "Ouvidoria" do portal ficar consistente com o mesmo botão do Acolhimento.
  ouvidoria: 'https://www.proteste.org.br/',
  peticionamento: 'https://peticionamento.prt17.mpt.mp.br',
  consultaProcessos: 'https://prt17.mpt.mp.br/servicos/movimentacao-de-procedimentos',
  // Nenhuma página dedicada de "Carta de Serviços" ou "Audiências Públicas" foi encontrada no
  // domínio do MPT-ES em 2026-09-05 — aponta para a página geral de serviços (real, verificada
  // 200), não uma URL inventada.
  cartaDeServicos: 'https://prt17.mpt.mp.br/servicos',
  audienciasPublicas: 'https://prt17.mpt.mp.br/servicos',
  transparencia: 'https://mpt.mp.br/MPTransparencia/',
} as const;
