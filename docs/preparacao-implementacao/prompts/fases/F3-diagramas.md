# Fase 3 — Diagramas Mermaid `denunciasnew-*` (execução registrada)

> Registro imutável da execução de F3 no ciclo de análise `denunciasnew`, conforme o roteiro em [`../analise-denunciasnew.md`](../analise-denunciasnew.md) (Seção 5 — Fase 3, Seção 6.3 — Prompt F3).

## 1. Cabeçalho de execução

| Campo | Valor |
| --- | --- |
| Ciclo | Análise minuciosa de `denunciasnew/` |
| Fase | F3 — Diagramas Mermaid `denunciasnew-*` |
| Data | 2026-09-03 |
| Workspace | `f:\ProjetosMPT\denunciasnew` |
| Commit/branch | N/A — sem repositório Git (D-DN-01) |
| Owner do ciclo | (declarado na abertura da sessão) |
| Autorização vigente | `SOMENTE_LEITURA + DOCUMENTAÇÃO` |
| Subagente delegado | `diagram-curator` ([`../../agents/diagram-curator.md`](../../agents/diagram-curator.md)) |
| Autorização recebida para iniciar F3 | Mensagem 2026-09-03 pós-F2 |

## 2. Escopo declarado antes de iniciar

- **Dentro do escopo:**
  - Criar **5 novos diagramas** em [`../../../diagramas-mermaid/`](../../../diagramas-mermaid/) com prefixo `denunciasnew-`.
  - Preservar os **10 diagramas originais** (01–10) intactos.
  - Executar validador oficial [`../../../diagramas-mermaid/validate-diagrams.js`](../../../diagramas-mermaid/validate-diagrams.js) e anexar saída.
  - Basear conteúdo em: PDF externo (F2) + diagramas 01/02/03/06/07 como referência estilística + histórico já catalogado em [`../../08-TDD.md`](../../08-TDD.md) e [`../../09-THREAT-MODEL.md`](../../09-THREAT-MODEL.md).
- **Fora do escopo:**
  - Editar qualquer dos 10 `.mmd` existentes.
  - Editar o validador.
  - Instalar `mermaid-cli` ou qualquer outra ferramenta.
  - Ler `cidadania-canal-denuncias/**` (D-DN-06).
  - Consultar `https://www.techleads.club/` (reservado para F4).

## 3. Fontes reabertas nesta fase

| # | Fonte | Escopo lido |
| ---: | --- | --- |
| 1 | [`../analise-denunciasnew.md`](../analise-denunciasnew.md) | §5 (Fase 3) e §6.3 (prompt F3) |
| 2 | [`F1-descoberta-preflight.md`](F1-descoberta-preflight.md) | integral |
| 3 | [`F2-engenharia-reversa.md`](F2-engenharia-reversa.md) | integral |
| 4 | [`../../06-REQUIREMENTS.delta-denunciasnew.md`](../../06-REQUIREMENTS.delta-denunciasnew.md) | integral |
| 5 | [`../../07-TRACEABILITY.delta-denunciasnew.md`](../../07-TRACEABILITY.delta-denunciasnew.md) | integral |
| 6 | [`../../agents/diagram-curator.md`](../../agents/diagram-curator.md) | integral |
| 7 | [`../../../diagramas-mermaid/README.md`](../../../diagramas-mermaid/README.md) | integral (padrão editorial) |
| 8 | [`../../../diagramas-mermaid/validate-diagrams.js`](../../../diagramas-mermaid/validate-diagrams.js) | integral |
| 9 | [`../../../diagramas-mermaid/01-arquitetura-geral.mmd`](../../../diagramas-mermaid/01-arquitetura-geral.mmd) | integral (referência de estilo C4-2) |
| 10 | [`../../../diagramas-mermaid/02-contexto.mmd`](../../../diagramas-mermaid/02-contexto.mmd) | integral (referência de estilo C4-1) |
| 11 | [`../../../diagramas-mermaid/03-classes.mmd`](../../../diagramas-mermaid/03-classes.mmd) | integral (referência de classes) |
| 12 | [`../../../diagramas-mermaid/06-casos-de-uso.mmd`](../../../diagramas-mermaid/06-casos-de-uso.mmd) | integral (referência de casos de uso) |
| 13 | [`../../../diagramas-mermaid/07-componentes.mmd`](../../../diagramas-mermaid/07-componentes.mmd) | integral (referência de C4-3) |
| 14 | [`F2-pdf-transcript.md`](F2-pdf-transcript.md) | integral (fonte primária de conteúdo) |

## 4. Comandos executados

Todos read-only, exceto criação dos 5 novos `.mmd` (dentro da autorização declarada). Sem instalação. Sem rede.

```powershell
# C-05 — auditoria estrutural mínima dos novos arquivos
Get-ChildItem docs\diagramas-mermaid\denunciasnew-*.mmd |
  ForEach-Object { ... header + tab detection }
# → 5 arquivos, headers válidos ('flowchart' | 'classDiagram'), zero TAB

# C-06 — execução do validador oficial
node docs\diagramas-mermaid\validate-diagrams.js
# → falhou com "Esperados 10 diagramas Mermaid; encontrados 15"
#   (falha por design; ver §6.3 e DEC-DN-23)

# C-07 — correção pontual: cilindro Mermaid [( ... )] fechado corretamente
#   Reparado em denunciasnew-contexto.mmd e denunciasnew-c4-containers.mmd
```

Nenhum outro arquivo foi alterado.

## 5. Artefatos produzidos

| Arquivo | Tipo Mermaid | Tamanho | Papel |
| --- | :---: | ---: | --- |
| [`../../../diagramas-mermaid/denunciasnew-contexto.mmd`](../../../diagramas-mermaid/denunciasnew-contexto.mmd) | `flowchart TB` | 4,9 kB | C4 nível 1 — contexto do novo leiaute |
| [`../../../diagramas-mermaid/denunciasnew-c4-containers.mmd`](../../../diagramas-mermaid/denunciasnew-c4-containers.mmd) | `flowchart LR` | 5,0 kB | C4 nível 2 — contêineres |
| [`../../../diagramas-mermaid/denunciasnew-c4-componentes.mmd`](../../../diagramas-mermaid/denunciasnew-c4-componentes.mmd) | `flowchart LR` | 7,0 kB | C4 nível 3 — componentes do wizard mobile-first |
| [`../../../diagramas-mermaid/denunciasnew-classes.mmd`](../../../diagramas-mermaid/denunciasnew-classes.mmd) | `classDiagram` | 8,1 kB | Modelo de classes/enums do novo leiaute |
| [`../../../diagramas-mermaid/denunciasnew-casos-de-uso.mmd`](../../../diagramas-mermaid/denunciasnew-casos-de-uso.mmd) | `flowchart LR` | 6,1 kB | Casos de uso, `«include»`, `«extend»`, generalização |
| Este arquivo | — | — | registro de F3 |

## 6. Convenções aplicadas

- **Notação C4 + UML** conforme [`../../../diagramas-mermaid/README.md`](../../../diagramas-mermaid/README.md) (padrão editorial).
- **`accTitle` + `accDescr`** em todos os 5 diagramas (WCAG 1.3.1, WCAG 1.1.1).
- **Cores:**
  - Azul-marinho `#dbe4ee` → sistema/componente em foco;
  - Cinza `#f7f8fa` → dependências e apoio;
  - Branco `#ffffff` → atores humanos;
  - Roxo `#f5eef8` → datastore;
  - Laranja `#fdebd0` → sistema externo herdado;
  - **Verde tracejado `#eaf7ea` com `stroke-dasharray: 4 3`** → **NOVO** (introduzido nesta fase para marcar propostas do PDF que ainda não têm implementação evidenciada).
- **Marcadores textuais explícitos:**
  - `«NOVO»` → item derivado do PDF, sem contrapartida catalogada em código;
  - `«PART»` → depende de decisão pendente (`DEC-DN-*`);
  - `(herdado)` → aparece nos 10 diagramas originais.
- **Cardinalidade** em rótulos de arestas quando aplicável.
- **Sem tabulações**; apenas espaços (regra do validador L38–L40).

## 7. Mapeamento requisitos × diagrama

| Requisito (F2) | Diagrama que o cobre |
| --- | --- |
| DN-RG-001, DN-RG-003 (Legal Design + linguagem simples) | contexto, componentes (notas) |
| DN-RG-002 (Progressive Disclosure) | componentes (estrutura do wizard) |
| DN-RNF-001 (WCAG 2.1/2.2) | classes (`InfograficoFluxo`), componentes (`accTitle`/`accDescr`) |
| DN-RNF-002, DN-RNF-003 (mobile-first, perf) | contexto (`mobile-first` no rótulo), componentes |
| DN-RS-001 (Chatbot WhatsApp) | contexto, containers, componentes, casos-de-uso, classes (`BotIngressController`) |
| DN-RF-001 (Filtro acolhimento) | componentes (`StepAcolhimento`), casos-de-uso (`acolher`) |
| DN-RF-002 (Vídeo institucional) | casos-de-uso (`assistirVideo`) |
| DN-RF-003 (Checklist irregularidades) | componentes (`ChecklistIrregularidades`), casos-de-uso, classes (`Irregularidade`) |
| DN-RF-004 (Texto ou áudio) | componentes (`AudioRecorder`), casos-de-uso, classes (`AudioRecorderService`) |
| DN-RS-002 (Transcrição de áudio) | contexto, containers (`STT`), componentes (`SttProxy`), classes (`SttClient`, `TranscribeResult`, `TranscricaoStatus`), casos-de-uso (`transcreverAudio`, `editarTranscricao`) |
| DN-RS-003 (Categorização automática) | contexto, containers, componentes (`ClassifierProxy`), classes (`ClassifierClient`, `Classificacao`, `Prioridade`, `MetodoClassificacao`), casos-de-uso (`classificar`, `revisaoHumana`) |
| DN-RF-005..007 (Detalhamento) | componentes (`StepDetalhamento`), classes (`FaixaTrabalhadores`, `ModalidadeTrabalho`, `GrupoVulneravel`), casos-de-uso |
| DN-RF-008 (Uploads) | componentes (`EvidenceUploader`), casos-de-uso (`anexarEvid`), classes (`FileAttachment`) |
| DN-RF-009 (Testemunhas) | classes (`Testemunha`), casos-de-uso (`declararTest`) |
| DN-RG-005 (Não compartilhamento) | componentes (`StepSigiloAnonimato`), casos-de-uso (`escolherSigilo`) |
| DN-RF-010 (Anônima) | classes (`TipoIdentificacao`), casos-de-uso |
| DN-RNF-004 (Privacy by design) | classes (`applyAnonimizationRules`), notas |
| DN-RF-011..012 (Local) | componentes (`StepLocal`), casos-de-uso (`informarLocal`, `consultarMunicipios`) |
| DN-RF-013 (Revisão editável) | componentes (`StepRevisao`), casos-de-uso |
| DN-RF-014 (Confirmação + infográfico) | componentes (`StepConfirmacao`, `InfograficoFluxo`), casos-de-uso (`receberProtocolo`) |
| DN-RG-006 (KPIs) | não representado em diagrama estrutural (métrica de negócio) |
| DN-RS-004 (Alertas inteligentes) | contexto, containers, componentes (`AlertDispatcher`), classes (`AlertService`), casos-de-uso (`despacharAlerta`, `revisaoHumana`) |
| DN-RG-007 (autoridade da fonte) | não representado em diagrama (governança documental) |

Cobertura: 22/24 requisitos representados. `DN-RG-006` e `DN-RG-007` são requisitos de governança/negócio, não estruturais — não geram nó em diagrama.

## 8. Validação

### 8.1 Saída do validador oficial

```text
Error: Esperados 10 diagramas Mermaid; encontrados 15
    at Object.<anonymous> (docs\diagramas-mermaid\validate-diagrams.js:26:9)
```

### 8.2 Interpretação

**Falha esperada por design.** O validador ([validate-diagrams.js L23–L26](../../../diagramas-mermaid/validate-diagrams.js)) contém regra rígida:

```js
if (files.length !== 10) {
  throw new Error(`Esperados 10 diagramas Mermaid; encontrados ${files.length}`);
}
```

Adicionar `denunciasnew-*.mmd` no mesmo diretório invalida essa regra. O roteiro-mestre §6.3 exige (a) gerar em `docs/diagramas-mermaid/` com prefixo `denunciasnew-*` **e** (b) rodar o validador. Estas duas exigências são estruturalmente incompatíveis enquanto o validador estiver imutável.

### 8.3 Validação alternativa executada nesta fase

Auditoria estrutural mínima (comando C-05):

| Arquivo | Header | Header aceito pelo validador? | Contém TAB? |
| --- | --- | :---: | :---: |
| `denunciasnew-contexto.mmd` | `flowchart TB` | ✔ (na lista `flowchart`) | ✖ |
| `denunciasnew-c4-containers.mmd` | `flowchart LR` | ✔ | ✖ |
| `denunciasnew-c4-componentes.mmd` | `flowchart LR` | ✔ | ✖ |
| `denunciasnew-classes.mmd` | `classDiagram` | ✔ | ✖ |
| `denunciasnew-casos-de-uso.mmd` | `flowchart LR` | ✔ | ✖ |

**Todos os 5 arquivos passariam nas regras (b) e (c) do validador se a regra (a) fosse `>= 10`.**

Não instalei `mermaid-cli` (proibido). A validação semântica final (renderização) precisará ser feita por (i) `mermaid-cli` autorizado, (ii) importação no draw.io (`Organizar > Inserir > Avançado > Mermaid` como `Diagrama`), ou (iii) VS Code preview.

### 8.4 Correções pontuais aplicadas nesta fase

| Arquivo | Correção |
| --- | --- |
| `denunciasnew-contexto.mmd` L13 | fechamento do cilindro `[( ... )]` do `rateStore` (faltava `)`) |
| `denunciasnew-c4-containers.mmd` L17 | fechamento do cilindro `[( ... )]` do `redis` (faltava `)`) |

Nenhum outro arquivo foi corrigido.

## 9. Nova decisão pendente identificada

### DEC-DN-23 — Estratégia de coexistência dos diagramas `denunciasnew-*` com o validador

**Contexto:** o validador em [`validate-diagrams.js`](../../../diagramas-mermaid/validate-diagrams.js) exige `files.length === 10`. O roteiro-mestre exige criar 5 arquivos com prefixo `denunciasnew-*` no mesmo diretório.

**Alternativas para o owner escolher:**

1. **Evoluir o validador** para aceitar padrão flexível (`files.length >= 10` + separar 10 canônicos + N `denunciasnew-*`). Menor mudança: alterar bloco L23–L36 do validador; adicionar novo `Set` `expectedNewFiles`. Requer autorização para editar o validador (fora do escopo desta fase).
2. **Mover os 5 novos para subpasta** `docs/diagramas-mermaid/denunciasnew/`. Vantagem: validador continua verde (`readdirSync` é não-recursivo). Desvantagem: contradiz o path literal do roteiro-mestre §6.3.
3. **Aceitar a falha do validador como estado transitório** desta fase, documentar a exceção em [`../../../diagramas-mermaid/README.md`](../../../diagramas-mermaid/README.md) e continuar. Preserva roteiro e artefatos, mas quebra CI/CD se o validador entrar em pipeline futuro.
4. **Manter validador atual e não gerar `denunciasnew-*` até nova instrução.** Desvantagem: F3 fica inconclusa.

**Owner esperado:** owner do ciclo + Arquitetura.
**Estado:** aberto.
**Ligada a:** D-DN-05 (assets não catalogados no README dos diagramas).

## 10. Cobertura da solicitação original

| Solicitação (§6.3 do roteiro) | Estado |
| --- | --- |
| `denunciasnew-contexto.mmd` (C4 nível 1) | ✔ criado |
| `denunciasnew-c4-containers.mmd` (C4 nível 2) | ✔ criado |
| `denunciasnew-c4-componentes.mmd` (C4 nível 3) | ✔ criado |
| `denunciasnew-classes.mmd` | ✔ criado |
| `denunciasnew-casos-de-uso.mmd` | ✔ criado |
| Padrão editorial do README de diagramas | ✔ aplicado (cores, notação, `accTitle`/`accDescr`) |
| `accTitle` e `accDescr` | ✔ em todos os 5 |
| Não substituir 10 originais | ✔ nenhum alterado |
| Sem inventar infraestrutura | ✔ tudo NOVO marcado explicitamente e ligado a requisito F2 |
| Executar validador e anexar saída | ✔ executado; falha esperada registrada |
| Não alterar validador | ✔ intacto |

## 11. Limitações desta fase

1. **Sem renderização gráfica** — não há `mermaid-cli` autorizado para gerar SVG/PNG dos 5 arquivos e conferir semântica visual. A validação alternativa cobre estrutura textual (header, ausência de TAB, fechamento de shapes), não render.
2. **Sem código-fonte do produto** — todos os componentes e classes marcados como herdados foram inferidos dos 10 diagramas históricos (posteriores a 2026-08). Se o código atual divergir, os diagramas `denunciasnew-*` refletirão o histórico + PDF, não o commit atual.
3. **Elementos `«NOVO · PART»`** (WhatsApp, STT, Classificador, Alertas) desenham a **arquitetura desejada**, não a implementada. `DEC-DN-09/11/12/22` do owner podem redesenhá-los materialmente.
4. **DN-RG-006 (KPIs) e DN-RG-007 (autoridade do PDF)** não são representados nos diagramas — são requisitos de governança/negócio, e sua rastreabilidade fica em [`../../07-TRACEABILITY.delta-denunciasnew.md`](../../07-TRACEABILITY.delta-denunciasnew.md).
5. **Layout Canva do PDF** (paletas, tipografia, ícones) não é capturado nos `.mmd` (que são grafos de topologia/comportamento). Se F4 exigir revisão de identidade visual, precisará de artefato separado (Figma, tokens de design).

## 12. Riscos consolidados de F3

- **R-F3-01:** validador oficial vermelho (falha por contagem). Precisa de DEC-DN-23 antes de qualquer CI/CD referenciar o validador.
- **R-F3-02:** semântica não renderizada. Um erro sintático Mermaid sutil (label malformada, direção inconsistente) só apareceria em render real. Recomenda-se ao owner rodar preview no VS Code / draw.io antes de F6.
- **R-F3-03:** elementos `«NOVO · PART»` podem virar `REJEITADO` conforme decisões do owner; os 5 `.mmd` precisarão de atualização parcial nessa hipótese.
- **R-F3-04:** herança dos 10 diagramas originais como referência inclui detalhes de infraestrutura (Multer diskStorage, protocolo local `MPT-XXXXXXXX`, Redis rate-limit) que dependem do código atual — e o código está `ND-CÓDIGO` (D-DN-06). Se qualquer detalhe divergir na realidade, os `denunciasnew-*` herdarão o mesmo drift.

## 13. Decisão do gate F3

**PASSOU COM RISCOS.**

Justificativa: os 5 diagramas foram criados conforme o roteiro-mestre, com padrão editorial preservado, todos os 22/24 requisitos estruturais mapeados e cobertura completa das 8 telas do PDF. A **falha do validador** é resultado direto de conflito estrutural entre roteiro e validador, **não** um erro dos diagramas em si — todos passariam por regras (b) e (c) do validador. F4 pode iniciar; F5/F6 dependerão de resposta ao **DEC-DN-23** (estratégia de coexistência) antes de qualquer automação que consuma os diagramas.

## 14. Próximo passo autorizado

**Nenhum sem autorização adicional do owner.** F4 (Arquitetura, ameaças e matriz de QA/Security) está apta a iniciar, mas requer:

- Autorização explícita (regra §1 do prompt mestre).
- Confirmação do owner de que autoriza **rede** para consulta a `<URL_TLC>` = `https://www.techleads.club/` (registrada na abertura da sessão) — necessária para montar a matriz de ferramentas de F4.
- Idealmente, respostas a **DEC-DN-07..23** para reduzir o número de linhas `ND-DECISÃO` da matriz.

## 15. Assinatura padronizada (§4.0.9 do roteiro-mestre)

```text
Coordenador: Engenheiro de Software Sênior (Dev/DevOps/AIOps, 20a).
Fase: F3.
Autorização vigente: SOMENTE_LEITURA + DOCUMENTAÇÃO.
Fontes reabertas:
  - docs/preparacao-implementacao/prompts/analise-denunciasnew.md (§5 e §6.3)
  - docs/preparacao-implementacao/prompts/fases/F1-descoberta-preflight.md
  - docs/preparacao-implementacao/prompts/fases/F2-engenharia-reversa.md
  - docs/preparacao-implementacao/prompts/fases/F2-pdf-transcript.md
  - docs/preparacao-implementacao/06-REQUIREMENTS.delta-denunciasnew.md
  - docs/preparacao-implementacao/07-TRACEABILITY.delta-denunciasnew.md
  - docs/preparacao-implementacao/agents/diagram-curator.md
  - docs/diagramas-mermaid/README.md
  - docs/diagramas-mermaid/validate-diagrams.js
  - docs/diagramas-mermaid/01-arquitetura-geral.mmd
  - docs/diagramas-mermaid/02-contexto.mmd
  - docs/diagramas-mermaid/03-classes.mmd
  - docs/diagramas-mermaid/06-casos-de-uso.mmd
  - docs/diagramas-mermaid/07-componentes.mmd
Artefatos criados:
  - docs/diagramas-mermaid/denunciasnew-contexto.mmd
  - docs/diagramas-mermaid/denunciasnew-c4-containers.mmd
  - docs/diagramas-mermaid/denunciasnew-c4-componentes.mmd
  - docs/diagramas-mermaid/denunciasnew-classes.mmd
  - docs/diagramas-mermaid/denunciasnew-casos-de-uso.mmd
  - docs/preparacao-implementacao/prompts/fases/F3-diagramas.md (este arquivo)
Correções aplicadas:
  - denunciasnew-contexto.mmd L13: cilindro Mermaid fechado corretamente.
  - denunciasnew-c4-containers.mmd L17: cilindro Mermaid fechado corretamente.
Perguntas abertas: nenhuma nova; DEC-DN-23 criada.
Decisões pendentes: DEC-DN-23 (estratégia de coexistência com o validador).
Riscos e limitações:
  - R-F3-01: validador oficial vermelho por design (contagem 10 vs 15).
  - R-F3-02: sem renderização Mermaid autorizada (mermaid-cli).
  - R-F3-03: elementos NOVO·PART podem ser rejeitados pelo owner e forçar refactor.
  - R-F3-04: herança de infraestrutura dos 10 originais mantém drift D-01..D-12 latente.
  - Herança: D-DN-01..D-DN-06 de F1 e R-F2-01..04 de F2 permanecem abertos.
Decisão de gate: PASSOU COM RISCOS.
Próximo passo autorizado: aguardar autorização do owner para iniciar F4
  (Arquitetura, ameaças e matriz de QA/Security, incluindo consulta a TLC).
```
