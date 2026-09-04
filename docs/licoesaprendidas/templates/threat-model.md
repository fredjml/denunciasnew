# SECURITY / Threat model — template

> Preencha a partir do código e de evidências reproduzíveis. Diferencie controle existente, controle planejado e hipótese. A ausência de evidência bloqueia a conclusão, mas não prova sozinha um defeito do produto.

## 1. Escopo

- Versão/commit:
- Mudança ou fluxo analisado:
- Responsável:
- Data:
- Ambientes considerados:
- Fora de escopo:

## 2. Ativos e classificação

| Ativo | Classificação | Impacto de exposição/alteração/indisponibilidade | Retenção esperada | Evidência |
| --- | --- | --- | --- | --- |
| Denúncia e descrição | | | | |
| Identidade e opção de sigilo | | | | |
| Anexos | | | | |
| Protocolo gerado pelo BFF | | | | |
| Credenciais/tokens | | | | |
| Logs e telemetria | | | | |
| Disponibilidade do serviço | | | | |

## 3. Atores e zonas de confiança

- Usuários legítimos:
- Usuários maliciosos ou automatizados:
- Operadores e administradores:
- Serviços externos:
- Atores internos ou credenciais comprometidas:

Zonas a considerar no projeto Denúncias:

1. navegador;
2. frontend Angular;
3. BFF Express;
4. armazenamento temporário de upload;
5. ClamAV;
6. Redis/rate limiting;
7. API MPT;
8. logs, métricas e ferramentas de observabilidade.

Inclua um diagrama de fluxo quando a análise envolver três ou mais zonas.

## 4. Fluxos relevantes

| ID | Origem | Destino | Dados | Protocolo/autenticação | Validações | Evidência |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | | | | | | |

Para anexos, rastreie explicitamente o mesmo arquivo do recebimento no BFF até a decisão do ClamAV e, quando permitido, até o envio à API MPT. Um teste isolado de cada componente não demonstra essa correlação.

## 5. Ameaças, controles e risco residual

| ID | Fluxo/ativo | Ameaça ou cenário de abuso | Controle atual comprovado | Evidência | Impacto | Probabilidade | Ação/teste | Owner | Risco residual |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-01 | | | | | | | | | |

### Ameaças concretas herdadas dos relatórios em Analises/

As linhas abaixo são o baseline mínimo de ameaças a considerar. Cada linha deve ser preenchida com evidência do commit atual antes de ser fechada; nenhuma pode ser descartada por leitura de relatório histórico.

| ID | Fluxo/ativo | Ameaça | Referência | Controle esperado |
| --- | --- | --- | --- | --- |
| T-DEN-01 | Wizard → payload | PII (nome, e-mail, telefone) segue no payload após alternar para "anônimo" | RELATORIO_ANALISE §5.1 SEC-01; RELATORIO_DIAGNOSTICO §2.2 | Limpeza no `ComplaintService` **e** defesa em profundidade no BFF |
| T-DEN-02 | Wizard → BFF | Áudio `Blob` do relato descartado pelo `JSON.stringify` — perda silenciosa de evidência | RELATORIO_ANALISE §3.1 QA-03; RELATORIO_DIAGNOSTICO §2.1 | Anexar como parte multipart nomeada com teste de contrato |
| T-DEN-03 | BFF | Protocolo gerado com `Math.random()` — previsível | RELATORIO_ANALISE §5.1 SEC-02 | `crypto.randomUUID()` ou `crypto.randomBytes()` com teste determinístico separado |
| T-DEN-04 | Middleware de upload | `upload.any()` aceita campos arbitrários | RELATORIO_ANALISE §3.2 QA-07 / §5.2 SEC-03 | `upload.array('arquivo', 10)` ou `upload.fields([...])` |
| T-DEN-05 | Middleware de upload | MIME verificado apenas por cabeçalho HTTP; sem magic bytes | RELATORIO_ANALISE §5.2 SEC-04 | Validação de assinatura (`file-type` ou equivalente) e rejeição fail-closed |
| T-DEN-06 | BFF/Frontend | CSP não configurada explicitamente no Helmet | RELATORIO_ANALISE §5.2 SEC-05 | CSP restritiva com nonce/hash e revisão de fontes externas |
| T-DEN-07 | BFF/cliente MPT | `mpt-api.client.js` lê `process.env` direto — testabilidade e vazamento de configuração | RELATORIO_ANALISE §5.2 SEC-06 | Injeção de configuração como em `clamav.client.js` |
| T-DEN-08 | Endpoint informacional | `/api/denuncias/info` sem rate limit | RELATORIO_ANALISE §5.3 SEC-07 | Rate limit permissivo por rota |
| T-DEN-09 | Handler 404 | `req.originalUrl` na resposta pode expor rotas internas | RELATORIO_ANALISE §5.3 SEC-09 | Ocultar `path` em produção |
| T-DEN-10 | Frontend | Texto livre enviado sem sanitização (`relato_texto`, `nomes_dados`, `funcoes_setores`) | RELATORIO_ANALISE §5.3 SEC-08 | Sanitização server-side antes de encaminhar/armazenar |
| T-DEN-11 | Frontend | UI trava em rede lenta (fetch sem `AbortController`) | RELATORIO_ANALISE §3.2 QA-05; RELATORIO_DIAGNOSTICO §3.2 | Timeout ≤ 30 s + verificação `navigator.onLine` |
| T-DEN-12 | Frontend | Wizard permite avançar sem preencher campos obrigatórios ou pular etapas via stepper | RELATORIO_ANALISE §3.1 QA-01 / §3.2 QA-08 | Validação por etapa e restrição de navegação |
| T-DEN-13 | Frontend | Ausência de `<label for>`, `aria-describedby`, foco visível e anúncio `aria-live` de transição | RELATORIO_SUGESTOES §2 | Corrigir semântica, foco no `h1` da etapa e região `aria-live="polite"` |
| T-DEN-14 | Frontend | Sem termos LGPD / consentimento antes do envio | RELATORIO_ANALISE §5.4 SEC-10; RELATORIO_DIAGNOSTICO §5.1 | Checkbox obrigatório com link para a política vigente |
| T-DEN-15 | CI/CD | E2E Playwright e Vitest do backend fora do pipeline | RELATORIO_ANALISE §6.1 REG-01 / §6.2 REG-06 | Adicionar jobs com upload de artefatos e falhar em regressão |
| T-DEN-16 | Rastreabilidade | Falta `X-Request-ID` correlacionando frontend↔backend | RELATORIO_ANALISE §5.4 SEC-11 | Middleware que gera/propaga ID por requisição |
| T-DEN-17 | Upload | Sem persistência de rascunho — cidadão perde progresso em recarga/backgrounding mobile | RELATORIO_DIAGNOSTICO §3.1 | Auto-save em `sessionStorage` com limpeza no sucesso |

Considere, no mínimo:

- falsificação de identidade ou origem;
- alteração de payload, anexos ou resposta;
- repúdio e insuficiência de trilha de auditoria;
- exposição de dados pessoais, conteúdo sigiloso, tokens ou caminhos locais;
- negação de serviço por volume, tamanho, concorrência ou dependências indisponíveis;
- elevação de privilégio e falhas de autorização;
- abuso de regras de negócio;
- dependências vulneráveis e cadeia de suprimentos;
- diferenças de comportamento entre desenvolvimento, teste e produção.

## 6. Checklist específico de upload

- [ ] Limites de tamanho, quantidade e tipos permitidos foram verificados no código e testados.
- [ ] Validação considera conteúdo real, não somente extensão ou `Content-Type` informado pelo cliente.
- [ ] Diretório temporário, permissões, quota e limpeza em sucesso, erro, timeout e cancelamento foram testados.
- [ ] O mesmo anexo foi correlacionado entre upload, varredura e encaminhamento.
- [ ] ClamAV foi exercitado nos estados limpo, infectado, timeout e indisponível.
- [ ] O comportamento fail-open/fail-closed foi registrado separadamente por ambiente.
- [ ] Zip bomb, arquivo poliglota, nomes maliciosos e alta concorrência foram considerados.
- [ ] Arquivos rejeitados ou não varridos não alcançam a API MPT quando a política exigir bloqueio.
- [ ] Logs e evidências não expõem conteúdo, token, dados pessoais ou metadados desnecessários.

## 7. Decisão

- Resultado: `APROVADO` / `APROVADO COM RISCO` / `BLOQUEADO`
- Riscos aceitos, justificativa e aprovador:
- Correções obrigatórias antes da entrega:
- Evidências ainda pendentes:
- Testes de regressão necessários:
- Prazo de reavaliação:

## Limitações

- Este template orienta a análise; não executa scanner, pentest ou validação de configuração em ambiente real.
- Declarações sobre produção exigem evidência daquele ambiente.
- E2E de frontend com interceptação/mocks não comprova BFF, Redis, ClamAV nem API MPT reais.
