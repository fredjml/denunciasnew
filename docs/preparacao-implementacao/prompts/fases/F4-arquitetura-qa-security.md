# Fase 4 — Arquitetura, ameaças e matriz de QA/Security (execução registrada)

> Registro imutável da execução de F4 no ciclo de análise `denunciasnew`, conforme o roteiro em [`../analise-denunciasnew.md`](../analise-denunciasnew.md) (Seção 5 — Fase 4, Seção 6.4 — Prompt F4).

## 1. Cabeçalho de execução

| Campo | Valor |
| --- | --- |
| Ciclo | Análise minuciosa de `denunciasnew/` |
| Fase | F4 — Arquitetura, ameaças e matriz de QA/Security |
| Data | 2026-09-03 |
| Workspace | `f:\ProjetosMPT\denunciasnew` |
| Commit/branch | N/A — sem repositório Git (D-DN-01) |
| Owner do ciclo | (declarado na abertura da sessão) |
| Autorização vigente | `SOMENTE_LEITURA + DOCUMENTAÇÃO` |
| Rede TLC | **NÃO AUTORIZADA** nesta fase |
| Subagente delegado | `security-architect` ([`../../agents/security-architect.md`](../../agents/security-architect.md)) |
| Autorização recebida para iniciar F4 | Mensagem 2026-09-03 pós-F3 |

## 2. Escopo declarado antes de iniciar

- **Dentro do escopo:**
  - Delta arquitetural em [`../../08-TDD.delta-denunciasnew.md`](../../08-TDD.delta-denunciasnew.md).
  - Delta de ameaças em [`../../09-THREAT-MODEL.delta-denunciasnew.md`](../../09-THREAT-MODEL.delta-denunciasnew.md).
  - Matriz de ferramentas em [`../../../Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md`](../../../Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md).
  - Inventário IA-Assist (skills, tools, rules, MCP, agents) integrado à matriz (§13).
- **Fora do escopo desta fase:**
  - Editar originais `08-TDD.md` e `09-THREAT-MODEL.md`.
  - Instalar qualquer ferramenta da matriz.
  - Executar SAST/DAST/`npm audit`/pentest.
  - Consultar `https://www.techleads.club/` — sem autorização de rede.
  - Ler `cidadania-canal-denuncias/**` (D-DN-06).

## 3. Fontes reabertas nesta fase

| # | Fonte | Escopo |
| ---: | --- | --- |
| 1 | [`../analise-denunciasnew.md`](../analise-denunciasnew.md) | §5 (Fase 4) e §6.4 (prompt F4) |
| 2 | [`F1-descoberta-preflight.md`](F1-descoberta-preflight.md) | integral |
| 3 | [`F2-engenharia-reversa.md`](F2-engenharia-reversa.md) | integral |
| 4 | [`F3-diagramas.md`](F3-diagramas.md) | integral |
| 5 | [`../../06-REQUIREMENTS.delta-denunciasnew.md`](../../06-REQUIREMENTS.delta-denunciasnew.md) | integral |
| 6 | [`../../07-TRACEABILITY.delta-denunciasnew.md`](../../07-TRACEABILITY.delta-denunciasnew.md) | integral |
| 7 | [`../../08-TDD.md`](../../08-TDD.md) | integral (referência canônica) |
| 8 | [`../../09-THREAT-MODEL.md`](../../09-THREAT-MODEL.md) | integral (referência canônica) |
| 9 | [`../../agents/security-architect.md`](../../agents/security-architect.md) | integral |
| 10 | [`../../../licoesaprendidas/backend/seguranca.md`](../../../licoesaprendidas/backend/seguranca.md) | integral |
| 11 | [`../../../licoesaprendidas/frontend/acessibilidade.md`](../../../licoesaprendidas/frontend/acessibilidade.md) | integral |
| 12 | [`../../../licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md`](../../../licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md) | integral |
| 13 | [`../../../licoesaprendidas/06-gates-qa-testes-seguranca.md`](../../../licoesaprendidas/06-gates-qa-testes-seguranca.md) | consultado |
| 14 | 5 `.mmd` `denunciasnew-*` produzidos em F3 | integral |

## 4. Comandos executados

Todos read-only. Nenhum `npm install`, `pip install` ou chamada externa. Nenhum comando de rede a TLC ou a serviço live.

Nenhum comando novo além dos já usados em F1–F3.

## 5. Artefatos produzidos

| Arquivo | Tamanho aprox. | Papel |
| --- | ---: | --- |
| [`../../08-TDD.delta-denunciasnew.md`](../../08-TDD.delta-denunciasnew.md) | ~7 kB | Delta arquitetural (topologia-alvo, contratos NOVO, endpoints, RNFs, ambientes) |
| [`../../09-THREAT-MODEL.delta-denunciasnew.md`](../../09-THREAT-MODEL.delta-denunciasnew.md) | ~9 kB | 23 novas ameaças `T-DN-01..T-DN-23`, ativos, controles, decisão APROVADO COM RISCO |
| [`../../../Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md`](../../../Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md) | ~11 kB | 46 ferramentas em 12 camadas + inventário IA-Assist |
| Este arquivo | — | Registro imutável de F4 |

## 6. Resultado — números

### 6.1 Arquitetura (delta 08-TDD)

- 4 novos módulos no BFF: `SttProxy`, `ClassifierProxy`, `AlertDispatcher`, `BotIngress`.
- 1 novo contêiner externo opcional: `WhatsApp Bot Adapter`.
- 1 novo endpoint condicional: `POST /api/denuncias/bot` (DEC-DN-09).
- 9 novos campos no JSON `Complaint` (incluindo enums e classificação).
- Wizard reformulado de 7 → 8 telas.

### 6.2 Ameaças (delta 09-THREAT-MODEL)

- **23 novas ameaças `T-DN-01..23`** categorizadas por STRIDE.
- Distribuição:
  - Transcrição/áudio: 4 (T-DN-01..04)
  - Classificador: 4 (T-DN-05..08)
  - Alertas: 3 (T-DN-09..11)
  - Chatbot WhatsApp: 6 (T-DN-12..17)
  - Wizard/UX: 3 (T-DN-18..20)
  - Cadeia de suprimentos: 3 (T-DN-21..23)
- 5 novas perguntas de segurança `P-F4-sec-1..5`.
- **Decisão do delta: APROVADO COM RISCO.**

### 6.3 Matriz de ferramentas

- **46 linhas** em 12 camadas (Test, A11y, Perf, SAST, DAST, LGPD, Chatbot, STT, Classificador, Alertas, Infra, IA-Assist).
- Status: 21 SUGERIDAS, 2 APROVADAS (ClamAV, Redis herdadas), 22 AUDITAR, 2 REJEITADAS.
- 5 linhas com custo `$$$` — todas com alternativa livre identificada.
- 5 rules candidatas `R-DN-01..05`.
- 4 skills (2 já existentes, 2 a criar condicionalmente).

### 6.4 Novas perguntas ao owner

| Origem | ID | Total |
| --- | --- | :---: |
| TDD delta | P-F4-1..6 (arquitetura) | 6 |
| Threat-model delta | P-F4-sec-1..5 (segurança) | 5 |
| Total F4 | **11** | — |

### 6.5 Decisões pendentes já criadas em fases anteriores que impactam F4

- `DEC-DN-07` (WCAG 2.1 vs 2.2) → afeta a11y, R-DN-03 futuro.
- `DEC-DN-08` (SLA mobile) → afeta escolha de Lighthouse/RUM.
- `DEC-DN-09` (chatbot MVP) → toda camada 8 fica dependente.
- `DEC-DN-11` (STT provider) → toda camada 9 fica dependente.
- `DEC-DN-12` (classificador ML vs regras) → toda camada 10 + revisão humana.
- `DEC-DN-15` (limites upload) → dimensionamento de ClamAV/STT.
- `DEC-DN-16` (testemunhas LGPD) → payload e política de retenção.
- `DEC-DN-18` (retenção logs) → escolha de pino / Presidio.
- `DEC-DN-22` (SLA alertas + canal) → toda camada 11.
- `DEC-DN-23` (validador Mermaid) → herança de F3; não bloqueia F4.

## 7. Cobertura da solicitação original (F4)

| Solicitação (§6.4 do roteiro) | Estado |
| --- | --- |
| Delta arquitetura em `08-TDD.delta-denunciasnew.md` | ✔ criado |
| Delta ameaças em `09-THREAT-MODEL.delta-denunciasnew.md` | ✔ criado |
| Matriz em `docs/Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md` | ✔ criado |
| Colunas exigidas (Objetivo/Ferramenta/Categoria/Licença/Custo/Integração/Alternativa livre/Origem/Status/Owner/Requisitos) | ✔ 11 colunas |
| Cada ameaça ligada a controle, teste, evidência, risco residual, owner | ✔ nas linhas T-DN-\* |
| Cobertura mobile e acessibilidade obrigatórias | ✔ camadas 3 e 4 |
| Ferramentas assistidas por IA marcadas como `AUDITAR` até auditoria em `12-DECISIONS.md` | ✔ política aplicada; skills IA marcadas |
| Sem instalação, sem DAST/pentest, sem chamada live | ✔ |
| Consulta a `<URL_TLC>` (opcional se rede autorizada) | ✖ não exercida — rede não autorizada; gap declarado no §15 da matriz |

## 8. Limitações desta fase

1. **Sem consulta a TLC** — a matriz cobre apenas o catálogo interno + inferências do stack. Owner pode adicionar linhas do TLC em ciclo futuro.
2. **Sem código do produto** — arquitetura-alvo é derivada do PDF + diagramas históricos + `denunciasnew-*`; a implementação real pode divergir.
3. **Todas as 23 ameaças `T-DN-*` são hipotéticas** enquanto os novos módulos não forem codificados.
4. **Owner de Segurança/DPO pendente** — matriz e threat-model precisam de assinatura antes de F6.
5. **Preços `$$$` são estimativas qualitativas** — cotações formais dependem de RFI/RFP fora deste ciclo.

## 9. Riscos consolidados de F4

- **R-F4-01:** matriz sem entradas do TLC (rede não autorizada) → owner pode desconhecer ferramentas relevantes.
- **R-F4-02:** 22 linhas da matriz em `AUDITAR` — planejamento de F5/F6 pode precisar restringir escopo até que auditorias aconteçam.
- **R-F4-03:** 5 linhas com custo `$$$` (device farm, WAF comercial, WhatsApp BSP, SIEM, STT SaaS) → orçamento não previsto pode reduzir escopo do MVP.
- **R-F4-04:** ameaças da camada chatbot (T-DN-12..17) dependem de DEC-DN-09; se rejeitado, 6 ameaças e 4 controles são descartados — impacto no plano de F6.
- **R-F4-05:** revisão humana obrigatória para URGENTE (T-DN-07, T-DN-08) exige interface administrativa nova (P-F4-sec-3) — pode ser escopo separado.
- Herança: D-DN-01..06 (F1), R-F2-01..04 (F2), R-F3-01..04 (F3) permanecem abertos.

## 10. Decisão do gate F4

**APROVADO COM RISCO.**

Justificativa: arquitetura-alvo é implementável para o novo leiaute; ameaças novas foram mapeadas com controles associados; matriz oferece caminho de ferramentas com alternativas livres para cada camada `$$$`; inventário IA-Assist respeita o modelo do kit (todo IA passa por auditoria antes do uso). Nada foi executado que exigisse autorização adicional. F5 (plano de evidências e testes) pode iniciar quando o owner autorizar.

## 11. Próximo passo autorizado

**Nenhum sem autorização adicional do owner.** F5 (Plano de evidências e testes) está apta a iniciar mediante:

- Autorização explícita (regra §1 do prompt mestre).
- Idealmente: resposta às `P-F4-1..6` e `P-F4-sec-1..5` para dimensionar shot list.
- Confirmação de que o modo de teste padrão será `e2e-mock` (default do roteiro §6.5).

## 12. Assinatura padronizada (§4.0.9 do roteiro-mestre)

```text
Coordenador: Engenheiro de Software Sênior (Dev/DevOps/AIOps, 20a).
Fase: F4.
Autorização vigente: SOMENTE_LEITURA + DOCUMENTAÇÃO. Rede TLC: NÃO AUTORIZADA.
Fontes reabertas:
  - docs/preparacao-implementacao/prompts/analise-denunciasnew.md (§5, §6.4)
  - docs/preparacao-implementacao/prompts/fases/F1..F3
  - docs/preparacao-implementacao/06-REQUIREMENTS.delta-denunciasnew.md
  - docs/preparacao-implementacao/07-TRACEABILITY.delta-denunciasnew.md
  - docs/preparacao-implementacao/08-TDD.md
  - docs/preparacao-implementacao/09-THREAT-MODEL.md
  - docs/preparacao-implementacao/agents/security-architect.md
  - docs/licoesaprendidas/backend/seguranca.md
  - docs/licoesaprendidas/frontend/acessibilidade.md
  - docs/licoesaprendidas/04-ia-rules-skills-tools-mcp-agents.md
  - docs/licoesaprendidas/06-gates-qa-testes-seguranca.md
  - 5 diagramas denunciasnew-*.mmd (F3)
Artefatos criados:
  - docs/preparacao-implementacao/08-TDD.delta-denunciasnew.md
  - docs/preparacao-implementacao/09-THREAT-MODEL.delta-denunciasnew.md
  - docs/Analises/MATRIZ_FERRAMENTAS_DENUNCIASNEW.md
  - docs/preparacao-implementacao/prompts/fases/F4-arquitetura-qa-security.md (este arquivo)
Perguntas abertas: P-F4-1..6 (arquitetura), P-F4-sec-1..5 (segurança).
Decisões pendentes: DEC-DN-07..23 (F1..F3) permanecem abertas; nenhuma nova nesta fase.
Riscos e limitações:
  - R-F4-01: TLC não consultada (rede não autorizada).
  - R-F4-02: 22 linhas da matriz em AUDITAR.
  - R-F4-03: 5 linhas com custo $$$; alternativas livres identificadas.
  - R-F4-04: 6 ameaças chatbot dependem de DEC-DN-09.
  - R-F4-05: revisão humana URGENTE pode virar escopo separado.
  - Herança: D-DN-01..06, R-F2-01..04, R-F3-01..04 permanecem abertos.
Decisão de gate: APROVADO COM RISCO.
Próximo passo autorizado: aguardar autorização do owner para iniciar F5
  (Plano de evidências e testes).
```
