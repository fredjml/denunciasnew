# Fase 1 — Descoberta e pre-flight documental (execução registrada)

> Registro imutável da execução de F1 no ciclo de análise `denunciasnew`, conforme o roteiro em [`../analise-denunciasnew.md`](../analise-denunciasnew.md) (Seção 5 — Fase 1, Seção 6.1 — Prompt F1).
>
> **Este arquivo documenta o que foi feito e os riscos catalogados. Não substitui os documentos canônicos de `docs/preparacao-implementacao/`. Alterações posteriores neste registro são proibidas — correções devem ser feitas em um `Fx-*.md` novo com referência cruzada.**

## 1. Cabeçalho de execução

| Campo | Valor |
| --- | --- |
| Ciclo | Análise minuciosa de `denunciasnew/` |
| Fase | F1 — Descoberta e pre-flight documental |
| Data da execução | 2026-09-03 |
| Workspace | `f:\ProjetosMPT\denunciasnew` |
| Commit/branch | N/A — workspace sem repositório Git (ver D-DN-01) |
| Owner do ciclo | (declarado pelo owner na abertura da sessão) |
| Autorização vigente | `SOMENTE_LEITURA + DOCUMENTAÇÃO` |
| Coordenador | Engenheiro de Software Sênior (Dev/DevOps/AIOps, 20a) — persona da Seção 4.0 de `analise-denunciasnew.md` |
| Subagente delegado | `analyst-preflight` ([`../../agents/analyst-preflight.md`](../../agents/analyst-preflight.md)) |
| Roteiro-mestre | [`../analise-denunciasnew.md`](../analise-denunciasnew.md) |

## 2. Escopo declarado antes de iniciar

- **Dentro do escopo desta fase:**
  - Mapear árvore recursiva de `denunciasnew/` sem executar código.
  - Classificar cada item como `FONTE_PRIMÁRIA (FP)`, `DOCUMENTAÇÃO_DERIVADA (DD)`, `ARTEFATO_GERADO (AG)` ou `EXCLUÍDO (EXC)`.
  - Identificar arquivos esperados e ausentes.
  - Comparar contra [`../../00-MAPA-ORIGENS.md`](../../00-MAPA-ORIGENS.md) e catalogar drift.
  - Listar limitações da leitura estática.
  - Emitir decisão do gate F1.
- **Fora do escopo desta fase:**
  - Ler o PDF externo (responsabilidade de F2).
  - Consultar `https://www.techleads.club/` — TLC (previsto para F4).
  - Editar quaisquer arquivos em `docs/preparacao-implementacao/` originais.
  - Alterar qualquer arquivo em `docs/Analises/backups/**`.
  - Instalar dependências, executar `npm`/`pip`, chamar rede.

## 3. Fontes reabertas nesta fase

| # | Fonte | Escopo lido | Papel |
| ---: | --- | --- | --- |
| 1 | [`../analise-denunciasnew.md`](../analise-denunciasnew.md) | integral | roteiro-mestre |
| 2 | [`../../00-MAPA-ORIGENS.md`](../../00-MAPA-ORIGENS.md) | integral | Passo 0 canônico do pacote |
| 3 | [`../../README.md`](../../README.md) | L1–L120 (trecho normativo) | índice do pacote e precedência de fontes |
| 4 | [`../../agents/analyst-preflight.md`](../../agents/analyst-preflight.md) | integral | charter do subagente delegado |
| 5 | [`../../../licoesaprendidas/00-mapa-origens-baseline-drift.md`](../../../licoesaprendidas/00-mapa-origens-baseline-drift.md) | integral | mapa canônico do kit |
| 6 | Árvore recursiva de `f:\ProjetosMPT\denunciasnew\` | inventário completo | leitura estática do workspace |
| 7 | Estado Git do workspace | `Test-Path .git` → `False` | verificação de versionamento |

## 4. Comandos executados

Todos read-only, sem rede, sem instalação, sem chamada a serviço live.

```powershell
# C-01 — verificação de repositório Git
Set-Location -LiteralPath 'f:\ProjetosMPT\denunciasnew'
Test-Path .git    # → False (sem repositório)

# C-02 — inventário recursivo completo
Get-ChildItem -Recurse -Force |
  Select-Object @{n='Path';e={$_.FullName.Substring((Get-Location).Path.Length+1)}},
                @{n='Type';e={ if ($_.PSIsContainer) {'DIR'} else {'FILE'} }},
                @{n='Size';e={ if ($_.PSIsContainer) {''} else {$_.Length} }},
                @{n='LastWriteTime';e={$_.LastWriteTime.ToString('yyyy-MM-dd HH:mm')}} |
  Sort-Object Path |
  Format-Table -AutoSize
```

Nenhum outro comando foi executado. Nenhum arquivo foi alterado nesta fase.

## 5. Resultado de T1.1 — classificação da árvore de `denunciasnew/`

Legenda: **FP** = fonte primária, **DD** = documentação derivada, **AG** = artefato gerado, **EXC** = excluído do escopo.

| Caminho (relativo a `denunciasnew/`) | Classe | Observação |
| --- | :---: | --- |
| `docs/` | DD | contêiner de documentação; não é fonte primária de código |
| `docs/README.md` | DD | índice de documentação |
| `docs/desenho_arq (1).png` | DD | ativo visual (2026-08-25) |
| `docs/DiagramaDenuncias.drawio` | DD | diagrama editável draw.io |
| `docs/.$DiagramaDenuncias.drawio.bkp` | AG | backup automático do draw.io |
| `docs/DiagramaDenuncias-sobreposto.drawio` | DD | diagrama derivado |
| `docs/Documento externo-outros 010970.2026.pdf` | **FP** | **única fonte primária vigente neste workspace** (2.13 MB, 2026-09-03) |
| `docs/Analises/` | DD | relatórios executivos (janela 2026-07) |
| `docs/Analises/RELATORIO_*.md` (7 arquivos) | DD | fonte histórica datada; não substitui código atual |
| `docs/Analises/RELATORIO_*.docx` (8 arquivos) | AG | publicações executivas geradas de `build_*.py` |
| `docs/Analises/build_*_docx.py` (8 scripts) | AG | geradores de `.docx` |
| `docs/Analises/vitest-backend.json` | AG | saída de teste histórica (2026-07-24) |
| `docs/Analises/__pycache__/` | AG | cache Python; pode ser descartado |
| `docs/Analises/scratch/analyze_codebase.py` | AG | script pontual (2026-07-31) |
| `docs/Analises/scratch/sloc_stats.json` | AG | métrica SLOC histórica |
| `docs/Analises/backups/backend/**` | AG | **snapshots datados 2026-07** do código do produto — não é fonte primária atual |
| `docs/Analises/backups/frontend/**` | AG | **snapshots datados 2026-07** — não é fonte primária atual |
| `docs/Analises/backups/before_contract_privacy_hardening/` (raiz) | AG | duplicidade de snapshots anterior à separação por camada |
| `docs/diagramas-mermaid/` | DD | 10 `.mmd` canônicos (01–10) + assets |
| `docs/diagramas-mermaid/01–10*.mmd` | DD | fonte editorial dos diagramas históricos (2026-09-03) |
| `docs/diagramas-mermaid/01-arquitetura-geralB*.drawio` (3 arquivos) | DD | variantes .drawio do C4 nível 2 |
| `docs/diagramas-mermaid/DiagramaUML.pdf`, `UML *.jpg/.pdf` | AG | templates UML externos, não catalogados no [README dos diagramas](../../../diagramas-mermaid/README.md) |
| `docs/diagramas-mermaid/desenho_arq (1).png` | AG | cópia do ativo visual da raiz `docs/` |
| `docs/diagramas-mermaid/miro-markdown.md`, `miro-markdown (1).md` | DD (vazios) | 4 bytes cada; sem conteúdo material |
| `docs/diagramas-mermaid/README.md` | DD | padrão editorial dos diagramas |
| `docs/diagramas-mermaid/validate-diagrams.js` | AG | validador Node.js |
| `docs/docs/` (nested) | DD | subpasta duplicada com hierarquia própria |
| `docs/docs/README.md` | DD | índice paralelo; não referenciado no pacote de preparação |
| `docs/docs/architecture/baseline.md` | DD | baseline arquitetural paralelo |
| `docs/docs/security/README.md` | DD | índice de segurança paralelo |
| `docs/docs/security/CHANGELOG-security.md` | DD | changelog paralelo |
| `docs/docs/security/triage-alertas-88-55.md` | DD | triagem histórica |
| `docs/licoesaprendidas/` | DD | kit reutilizável; não é fonte de fato |
| `docs/licoesaprendidas/00–15*.md` (16 arquivos) | DD | conforme precedência definida em [`../../README.md`](../../README.md) §Precedência de fontes |
| `docs/licoesaprendidas/backend/*.md` (3) | DD | controles reutilizáveis |
| `docs/licoesaprendidas/contrato/README.md` | DD | controles reutilizáveis |
| `docs/licoesaprendidas/frontend/*.md` (3) | DD | controles reutilizáveis |
| `docs/licoesaprendidas/scripts/preflight-denuncias.ps1` | AG | script de pre-flight (não executado — sem código do produto) |
| `docs/licoesaprendidas/scripts/validate-kit.ps1` | AG | validador do kit |
| `docs/licoesaprendidas/skill/denuncias-quality-review/**` | DD | skill de review (`SKILL.md` + 5 `references/`) |
| `docs/licoesaprendidas/templates/*.md` (16) | DD | templates operacionais |
| `docs/licoesaprendidas/fontes.md` | DD | inventário de fontes |
| `docs/preparacao-implementacao/` | DD | pacote consolidado |
| `docs/preparacao-implementacao/00–14*.md` (15) | DD | passos 0–11 + prompts |
| `docs/preparacao-implementacao/PROJECT_CONTEXT.md` | DD | contexto do projeto |
| `docs/preparacao-implementacao/README.md` | DD | índice do pacote |
| `docs/preparacao-implementacao/agents/*.md` (7) | DD | charters de subagentes (6 + README) |
| `docs/preparacao-implementacao/skills/denuncias-preparacao-implementacao/SKILL.md` | DD | skill do pacote |
| `docs/preparacao-implementacao/prompts/analise-denunciasnew.md` | DD | prompt aprimorado criado nesta sessão |

Contagem aproximada: **10 pastas normativas**, **~200 arquivos** classificados. Nenhum item marcado como `EXC` — todo o conteúdo é elegível para leitura.

## 6. Resultado de T1.2 — arquivos esperados e ausentes

| Item esperado (por [`../../00-MAPA-ORIGENS.md`](../../00-MAPA-ORIGENS.md)) | Estado | Impacto |
| --- | :---: | --- |
| `cidadania-canal-denuncias/AGENTS.md` (raiz do produto) | **AUSENTE** | fonte primária de governança do produto indisponível |
| `cidadania-canal-denuncias/frontend/AGENTS.md` | **AUSENTE** | camada frontend sem governança local |
| `cidadania-canal-denuncias/backend/AGENTS.md` | **AUSENTE** | camada backend sem governança local |
| `cidadania-canal-denuncias/planejamento.md` | **AUSENTE** | referência histórica de planejamento |
| `cidadania-canal-denuncias/spec_design.md` | **AUSENTE** | referência de design |
| `cidadania-canal-denuncias/**` (código, testes, Swagger) | **AUSENTE** | toda alegação sobre código atual será `ND` |
| `.git/` na raiz do workspace | **AUSENTE** | sem controle de versão |
| `AGENTS.md` na raiz do workspace | **AUSENTE** | sem governança local para `denunciasnew/` |
| Diagramas novos `denunciasnew-*.mmd` | **AUSENTE (esperado)** | a produzir em F3 |

**Owner declarou explicitamente na abertura da sessão:** "Workspace do produto não disponível — trate requisitos derivados do código como ND" e "Não utilize nada do workspace irmão cidadania-canal-denuncias/". Portanto, as ausências acima são **condições declaradas de execução**, não bloqueios.

## 7. Resultado de T1.3 — drift em relação a `00-MAPA-ORIGENS.md`

### 7.1 Drift previamente catalogado (D-01 a D-12)

Estado nesta sessão: **NÃO FOI POSSÍVEL DETERMINAR**. Todos os itens D-01..D-12 dependem de leitura do código do produto, que está ausente por instrução do owner. Nenhum item foi promovido a fato nem descartado.

### 7.2 Drift novo identificado nesta análise (candidatos a `DEC-DN-*`)

| ID | Evidência | Impacto | Ação recomendada |
| --- | --- | :---: | --- |
| **D-DN-01** | Workspace `denunciasnew/` não é repositório Git (`Test-Path .git` → `False`). Cita [`../../00-MAPA-ORIGENS.md`](../../00-MAPA-ORIGENS.md) L5 que assume "branch `stg`". | **alto** | decidir modelo de versionamento antes de F6 (fatias reversíveis exigem git) |
| **D-DN-02** | `docs/Analises/backups/**` são snapshots de código datados 2026-07, não fonte primária atual. Estão fora do escopo autorizado ("não utilize nada do workspace irmão"). | médio | tratar backups apenas como referência histórica em F2 se autorizado |
| **D-DN-03** | `docs/Documento externo-outros 010970.2026.pdf` (2026-09-03, 2.13 MB) é a **única fonte primária vigente** para requisitos, mas não está catalogada em `00-MAPA-ORIGENS.md` §Fontes com precedência. | **alto** | promover PDF a `Ordem 1` para este ciclo em delta documental |
| **D-DN-04** | `docs/docs/` (nested) contém `architecture/baseline.md`, `security/*.md`, `README.md` paralelos, não referenciados no pacote de preparação. | médio | decidir precedência entre `docs/docs/` e `docs/preparacao-implementacao/`; risco de fontes conflitantes |
| **D-DN-05** | `docs/diagramas-mermaid/` contém assets adicionais não catalogados: 3 `.drawio` de `01-arquitetura-geralB*`, `DiagramaUML.pdf`, 8 imagens UML `.jpg/.pdf`, 2 `.md` vazios de 4 bytes (`miro-markdown*.md`). | baixo | catalogar ou marcar como EXC antes de F3 |
| **D-DN-06** | Ausência total de fonte primária de código no workspace conforme instrução do owner. Todas as afirmações que exigiriam código atual (versões de framework, dependências, runtime, testes, contratos) serão `ND` nas fases seguintes. | **alto** | registrado como condição-de-execução; owner ciente |

## 8. Resultado de T1.4 — limitações da leitura estática

1. Sem execução de comandos além de `Test-Path`, `Get-ChildItem`, `read_file`, `list_dir`.
2. Sem `npm install`, `npm audit`, `npx`, `pip`, chamadas de rede, DAST ou testes.
3. Sem controle de versão → não há `git rev-parse`, `git status`, `git log`, `git remote -v`.
4. Sem código do produto → nenhuma alegação sobre Angular 22.0.5, TS 6.0.2, Express 4.22, ClamAV INSTREAM, Redis, `fetch`/`FormData`, `diskStorage`, protocolo local `MPT-XXXXXXXX`, `axe-core`, Playwright pode ser verificada. Todas ficam `ND` até que o owner autorize acesso.
5. PDF `Documento externo-outros 010970.2026.pdf` **não foi lido nesta fase** — leitura integral é responsabilidade de F2.
6. Consulta a `https://www.techleads.club/` (TLC) **não foi exercida em F1** — reservada para F4 (matriz de ferramentas).
7. `docs/Analises/backups/**` contém snapshots de código; a instrução do owner é para **não utilizar** conteúdo derivado do produto — respeitado.

## 9. Perguntas pendentes desta fase (P-F1-\*)

| ID | Pergunta | Owner esperado |
| --- | --- | --- |
| **P-F1-1** | Confirma que `denunciasnew/` permanece sem repositório Git ou o próximo ciclo criará versionamento antes de F6? | owner técnico |
| **P-F1-2** | Autoriza promover `docs/Documento externo-outros 010970.2026.pdf` a **Ordem 1** de precedência para este ciclo (delta sobre `00-MAPA-ORIGENS.md`)? | owner do ciclo |
| **P-F1-3** | Qual a precedência entre `docs/docs/architecture/baseline.md` + `docs/docs/security/*.md` e os arquivos correspondentes em `docs/preparacao-implementacao/08-TDD.md` / `09-THREAT-MODEL.md`? | arquitetura |
| **P-F1-4** | Os assets extras em `docs/diagramas-mermaid/` (`.drawio`, PDFs, JPGs, `miro-markdown*.md`) devem ser catalogados no README dos diagramas ou marcados como EXC? | responsável pelos diagramas |
| **P-F1-5** | Confirma que todas as afirmações que dependeriam do código do produto serão registradas como `ND` nas fases 2 a 6? | owner do ciclo |
| **P-F1-6** | `docs/Analises/backups/**` pode ser utilizado apenas como **inferência histórica** em F2 (marcada `INF`), ou está totalmente fora de escopo? | owner do ciclo |

## 10. Riscos consolidados

- **D-DN-01** — workspace sem Git (alto).
- **D-DN-02** — backups históricos fora do escopo autorizado (médio).
- **D-DN-03** — PDF externo não catalogado em `00-MAPA-ORIGENS.md` (alto).
- **D-DN-04** — duplicidade `docs/docs/` vs `docs/preparacao-implementacao/` (médio).
- **D-DN-05** — assets não catalogados em `docs/diagramas-mermaid/` (baixo).
- **D-DN-06** — código-fonte do produto indisponível (declarado; alto).

## 11. Decisão do gate F1

**PASSOU COM RISCOS.**

Justificativa: o workspace é apto para prosseguir para F2 (leitura do PDF) e F3 (diagramas `denunciasnew-*`) sob a autorização declarada, mas os riscos **D-DN-01**, **D-DN-03**, **D-DN-04** e **D-DN-06** precisam de decisão do owner antes de F4/F6, sob pena de bloquear a matriz de ferramentas e a decomposição em fatias.

## 12. Autorizações do owner registradas ao final de F1

| Item | Registro |
| --- | --- |
| Persistência deste relatório em `.md` | **Autorizada** pelo owner (mensagem de 2026-09-03). |
| Início de F2 | **Autorizada** pelo owner (mensagem de 2026-09-03), sujeita ao escopo declarado no roteiro-mestre. |
| Promoção do PDF a `Ordem 1` de precedência (D-DN-03) | **Pendente** — resposta a P-F1-2. |
| Utilização de `docs/Analises/backups/**` como `INF` em F2 (D-DN-02) | **Pendente** — resposta a P-F1-6. |
| Consulta a `https://www.techleads.club/` (TLC) em F4 | Autorização declarada na abertura da sessão; será exercida em F4. |
| Instalação de qualquer dependência (ex.: extrator de PDF) | **Não autorizada** — F2 deve operar sem instalar nada; se leitura do PDF exigir tooling ausente, F2 é interrompido e escalado ao owner. |

## 13. Assinatura padronizada (Seção 4.0.9 do roteiro-mestre)

```text
Coordenador: Engenheiro de Software Sênior (Dev/DevOps/AIOps, 20a).
Fase: F1.
Autorização vigente: SOMENTE_LEITURA + DOCUMENTAÇÃO.
Fontes reabertas:
  - docs/preparacao-implementacao/prompts/analise-denunciasnew.md
  - docs/preparacao-implementacao/00-MAPA-ORIGENS.md
  - docs/preparacao-implementacao/README.md
  - docs/preparacao-implementacao/agents/analyst-preflight.md
  - docs/licoesaprendidas/00-mapa-origens-baseline-drift.md
  - inventário recursivo de f:\ProjetosMPT\denunciasnew\
Artefatos alterados: nenhum durante a execução;
                    após autorização, criado
                    docs/preparacao-implementacao/prompts/fases/F1-descoberta-preflight.md
                    (este arquivo, registro imutável de F1).
Perguntas abertas: P-F1-1, P-F1-2, P-F1-3, P-F1-4, P-F1-5, P-F1-6
                  (candidatas a DEC-DN-01..06 em 12-DECISIONS.md).
Riscos e limitações:
  - D-DN-01: workspace sem Git.
  - D-DN-02: backups históricos fora do escopo autorizado.
  - D-DN-03: PDF externo não catalogado em 00-MAPA-ORIGENS.md.
  - D-DN-04: duplicidade docs/docs/ vs preparacao-implementacao/.
  - D-DN-05: assets não catalogados em diagramas-mermaid/.
  - D-DN-06: código-fonte do produto indisponível (declarado).
Decisão de gate: PASSOU COM RISCOS.
Próximo passo autorizado: iniciar F2 — Engenharia reversa de requisitos
                          (leitura integral do PDF externo, sem instalar nada).
```
