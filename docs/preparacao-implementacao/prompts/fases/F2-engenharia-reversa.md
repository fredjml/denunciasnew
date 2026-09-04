# Fase 2 — Engenharia reversa de requisitos (execução registrada)

> Registro imutável da execução de F2 no ciclo de análise `denunciasnew`, conforme o roteiro em [`../analise-denunciasnew.md`](../analise-denunciasnew.md) (Seção 5 — Fase 2, Seção 6.2 — Prompt F2).
>
> Não substitui os deltas de requisitos e rastreabilidade — os arquivos canônicos criados nesta fase são:
> - [`../../06-REQUIREMENTS.delta-denunciasnew.md`](../../06-REQUIREMENTS.delta-denunciasnew.md)
> - [`../../07-TRACEABILITY.delta-denunciasnew.md`](../../07-TRACEABILITY.delta-denunciasnew.md)

## 1. Cabeçalho de execução

| Campo | Valor |
| --- | --- |
| Ciclo | Análise minuciosa de `denunciasnew/` |
| Fase | F2 — Engenharia reversa de requisitos |
| Data | 2026-09-03 |
| Workspace | `f:\ProjetosMPT\denunciasnew` |
| Commit/branch | N/A — sem repositório Git (D-DN-01) |
| Owner do ciclo | (declarado pelo owner na abertura da sessão) |
| Autorização vigente | `SOMENTE_LEITURA + DOCUMENTAÇÃO` |
| Subagente delegado | `requirements-engineer` ([`../../agents/requirements-engineer.md`](../../agents/requirements-engineer.md)) |
| Autorização recebida do owner para iniciar F2 | Mensagem 2026-09-03 pós-F1 |

## 2. Escopo declarado antes de iniciar

- **Dentro do escopo desta fase:**
  - Ler integralmente o PDF externo [`../../../Documento externo-outros 010970.2026.pdf`](../../../Documento%20externo-outros%20010970.2026.pdf).
  - Extrair requisitos atômicos com aceite Dado/Quando/Então, classificados por tipo (`RF/RS/RG/RNF`) e confiança (`CONF/PART/INF/HIP/ND`).
  - Produzir os deltas:
    - [`../../06-REQUIREMENTS.delta-denunciasnew.md`](../../06-REQUIREMENTS.delta-denunciasnew.md)
    - [`../../07-TRACEABILITY.delta-denunciasnew.md`](../../07-TRACEABILITY.delta-denunciasnew.md)
  - Consolidar perguntas ao owner (P-F2-\*) e decisões pendentes (DEC-DN-07..22).
- **Fora do escopo desta fase (bloqueado por autorização declarada):**
  - Ler ou usar qualquer conteúdo de `cidadania-canal-denuncias/**` (ausente + proibido).
  - Ler ou usar conteúdo de `docs/Analises/backups/**` (snapshots de código; P-F1-6 ainda pendente).
  - Sobrescrever [`../../06-REQUIREMENTS.md`](../../06-REQUIREMENTS.md) ou [`../../07-TRACEABILITY.md`](../../07-TRACEABILITY.md).
  - Consultar `https://www.techleads.club/` (TLC) — reservado para F4.
  - Instalar qualquer dependência.

## 3. Fontes reabertas nesta fase

| # | Fonte | Escopo lido |
| ---: | --- | --- |
| 1 | [`../analise-denunciasnew.md`](../analise-denunciasnew.md) | Seção 5 (F2) e Seção 6.2 (prompt F2) |
| 2 | [`F1-descoberta-preflight.md`](F1-descoberta-preflight.md) | integral (contexto de F1) |
| 3 | [`../../06-REQUIREMENTS.md`](../../06-REQUIREMENTS.md) | consultado (referência de convenção); não editado |
| 4 | [`../../07-TRACEABILITY.md`](../../07-TRACEABILITY.md) | consultado (referência de convenção); não editado |
| 5 | [`../../agents/requirements-engineer.md`](../../agents/requirements-engineer.md) | integral (charter do subagente) |
| 6 | `docs/Documento externo-outros 010970.2026.pdf` | integral (15 páginas), via `pymupdf 1.28.2` |
| 7 | [`F2-pdf-transcript.md`](F2-pdf-transcript.md) | integral (transcrição sanitizada gerada nesta fase) |

## 4. Comandos executados

Todos read-only. Sem instalação de dependências. Sem chamadas de rede.

```powershell
# C-03 — verificação de tooling nativo para extração de PDF
python --version                                # → Python 3.12.6
python -c "import pypdf; print(pypdf.__version__)"     # → 6.16.2 (já instalado)
python -c "import fitz; print(fitz.__doc__.split()[1])" # → 1.28.2 (PyMuPDF, já instalado)

# C-04 — extração sanitizada do PDF (15 páginas)
python docs\preparacao-implementacao\prompts\fases\F2-pdf-extract.py `
       docs\preparacao-implementacao\prompts\fases\F2-pdf-transcript.md
# → gerou F2-pdf-transcript.md (~11,5 kB, UTF-8, com redação de nomes e URL de verificação)
```

**Nota de execução:** o extrator ([`F2-pdf-extract.py`](F2-pdf-extract.py)) foi criado apenas dentro da pasta autorizada. Ele redige nomes de indivíduos citados nos metadados/rodapé e a URL de verificação de assinatura eletrônica (`protocoloadministrativo.mpt.mp.br/...`) para respeitar o princípio §4.0.3.2 (sem PII / sem URL interna). O PDF original **não foi alterado**.

## 5. Resultado

### 5.1 Artefatos produzidos

| Arquivo | Papel | Tamanho |
| --- | --- | --- |
| [`F2-pdf-extract.py`](F2-pdf-extract.py) | script de extração sanitizada (evidência do procedimento) | 1,7 kB |
| [`F2-pdf-transcript.md`](F2-pdf-transcript.md) | transcrição UTF-8 das 15 páginas com redações | 11,5 kB |
| [`../../06-REQUIREMENTS.delta-denunciasnew.md`](../../06-REQUIREMENTS.delta-denunciasnew.md) | 24 requisitos atômicos com Dado/Quando/Então | ~19 kB |
| [`../../07-TRACEABILITY.delta-denunciasnew.md`](../../07-TRACEABILITY.delta-denunciasnew.md) | matriz requisito × componente × teste × ameaça × decisão | ~5 kB |
| Este arquivo | registro de F2 | — |

### 5.2 Requisitos criados

- **Total:** 24 (`DN-RF-*`: 14, `DN-RS-*`: 4, `DN-RG-*`: 7, `DN-RNF-*`: 4).
- **Classificação `CONF`:** 19 requisitos vindos diretamente do PDF.
- **Classificação `PART`:** 4 (`DN-RS-001`, `DN-RS-002`, `DN-RS-003`, `DN-RS-004`) — dependem de decisão material do owner (provedor, política, taxonomia).
- **Classificação `INF`:** 2 (`DN-RNF-003`, `DN-RNF-004`) — inferidos do público-alvo mobile e do princípio geral de privacidade.
- **Tópicos `ND`:** 8 (dependem do código do produto, indisponível).

### 5.3 Perguntas P-F2-\*

10 perguntas ao owner (ver §4 do delta de requisitos). Todas necessárias antes de F4/F6.

### 5.4 Decisões pendentes DEC-DN-\* criadas em F2

16 decisões abertas (`DEC-DN-07` a `DEC-DN-22`), listadas em §5 do delta de requisitos.

## 6. Cobertura da solicitação original

Verificação item-a-item do que o owner pediu no roteiro-mestre para F2:

| Solicitação | Estado |
| --- | --- |
| Ler o PDF integralmente | ✔ 15 páginas transcritas com redação |
| Requisitos atômicos com aceite Dado/Quando/Então | ✔ 24 requisitos |
| Classificar `RF/RS/RG/RNF` e `CONF/PART/INF/HIP/ND` | ✔ |
| Cruzar com código do produto | ✖ **`ND` por instrução do owner** — `cidadania-canal-denuncias/**` ausente e proibido |
| Delta em arquivos espelho, sem sobrescrever originais | ✔ `06-REQUIREMENTS.delta-*.md`, `07-TRACEABILITY.delta-*.md` |
| Requisitos mobile/UX citando página do PDF | ✔ (todas as fontes citam página) |
| Ambiguidades viram `DEC-DN-*` sem decisão autônoma | ✔ 16 decisões abertas |
| Perguntas P-F2-\* | ✔ 10 perguntas |

## 7. Limitações desta fase

1. Nenhuma leitura de código de produto — todo item que dependeria de contrato/comportamento atual permanece `ND`.
2. PDF é design proposal (Canva), não especificação técnica: **taxonomia oficial de irregularidades, modalidade de trabalho, catálogo de pautas urgentes** não estão declarados; ficam como `DEC-DN-*`.
3. WCAG 2.1 vs 2.2 AA (DEC-DN-07): PDF declara 2.1; pacote existente adota 2.2 AA. Sem decisão do owner, requisito de acessibilidade tem alvo ambíguo.
4. Chatbot WhatsApp, transcrição automática e classificação automatizada exigem **LGPD art. 20** (decisão automatizada) e política de revisão humana — nenhum tratamento definido no PDF.
5. KPIs de negócio (DN-RG-006) precisam de baseline pré-implantação — o pacote histórico [`docs/Analises/`](../../../Analises/) traz números de 2026-07 (RELATORIO_TESTES, RELATORIO_FINAL) mas nenhum baseline de **usuário/negócio** (taxa de conclusão etc.) foi encontrado nas fontes autorizadas.
6. Extração via `pymupdf` captura texto mas **não** imagens, wireframes, layouts. O PDF é um documento gráfico com layout Canva; requisitos visuais (paleta, hierarquia tipográfica, iconografia) precisarão de análise específica com screenshots quando F3 iniciar.

## 8. Riscos consolidados de F2

- **R-F2-01:** 14/24 requisitos ficam em `ND-DECISÃO` até que o owner emita DEC-DN-07..22. Fatias em F6 **não podem ser autorizadas** para esses até lá.
- **R-F2-02:** transcrição textual perde contexto visual do PDF (cores, layout, tipografia, ícones). F3 deve compensar reconstruindo intenção nos diagramas, **sem inventar** o que o PDF não mostra em texto.
- **R-F2-03:** `DN-RS-001` (chatbot WhatsApp), `DN-RS-002` (transcrição de áudio) e `DN-RS-003` (categorização automática) trazem superfície de LGPD/DPO significativa. Sem owner de segurança nomeado, F4 fica bloqueada nesses ramos.
- **R-F2-04:** ausência de baseline de KPI (DEC-DN-21) impede validar `DN-RG-006` no ciclo seguinte.

## 9. Decisão do gate F2

**PASSOU COM RISCOS.**

Justificativa: os 24 requisitos derivados do PDF cobrem 100% das telas descritas (acolhimento → confirmação) e dos princípios de design. A rastreabilidade cobre cada requisito × componente lógico × teste × ameaça × decisão. Requisitos `PART` (chatbot, transcrição, categorização, alertas) e todos os `ND-DECISÃO` **não bloqueiam** F3 (diagramas) porque F3 usa apenas o inventário lógico, não a decisão material. F3 pode iniciar; F4/F5/F6 dependerão do owner responder às DEC-DN-\*.

## 10. Perguntas pendentes desta fase

10 perguntas em [§4 do delta de requisitos](../../06-REQUIREMENTS.delta-denunciasnew.md#4-perguntas-ao-owner-geradas-em-f2-p-f2-).

## 11. Próximo passo autorizado

**Nenhum sem autorização adicional do owner.** F3 (Diagramas Mermaid `denunciasnew-*`) está apta a iniciar, mas exige autorização explícita conforme regra de execução §1 do prompt mestre.

## 12. Assinatura padronizada (Seção 4.0.9 do roteiro-mestre)

```text
Coordenador: Engenheiro de Software Sênior (Dev/DevOps/AIOps, 20a).
Fase: F2.
Autorização vigente: SOMENTE_LEITURA + DOCUMENTAÇÃO.
Fontes reabertas:
  - docs/preparacao-implementacao/prompts/analise-denunciasnew.md (§5 e §6.2)
  - docs/preparacao-implementacao/prompts/fases/F1-descoberta-preflight.md
  - docs/preparacao-implementacao/06-REQUIREMENTS.md (referência)
  - docs/preparacao-implementacao/07-TRACEABILITY.md (referência)
  - docs/preparacao-implementacao/agents/requirements-engineer.md
  - docs/Documento externo-outros 010970.2026.pdf (integral, 15 páginas)
  - docs/preparacao-implementacao/prompts/fases/F2-pdf-transcript.md
Artefatos criados:
  - docs/preparacao-implementacao/prompts/fases/F2-pdf-extract.py
  - docs/preparacao-implementacao/prompts/fases/F2-pdf-transcript.md
  - docs/preparacao-implementacao/06-REQUIREMENTS.delta-denunciasnew.md
  - docs/preparacao-implementacao/07-TRACEABILITY.delta-denunciasnew.md
  - docs/preparacao-implementacao/prompts/fases/F2-engenharia-reversa.md (este arquivo)
Perguntas abertas: P-F2-1..P-F2-10 (10 perguntas).
Decisões pendentes: DEC-DN-07..DEC-DN-22 (16 decisões abertas nesta fase).
Riscos e limitações:
  - R-F2-01: 14 requisitos em ND-DECISÃO até resposta do owner.
  - R-F2-02: transcrição textual perde layout visual do PDF.
  - R-F2-03: chatbot/transcrição/categorização exigem LGPD art. 20 e DPO.
  - R-F2-04: ausência de baseline de KPI (DEC-DN-21).
  - Herança: D-DN-01..D-DN-06 de F1 permanecem abertos.
Decisão de gate: PASSOU COM RISCOS.
Próximo passo autorizado: aguardar autorização do owner para iniciar F3
  (Diagramas Mermaid denunciasnew-*).
```
