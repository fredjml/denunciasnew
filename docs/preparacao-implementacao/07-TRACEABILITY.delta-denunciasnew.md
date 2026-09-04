# 07-TRACEABILITY — Delta `denunciasnew`

> **Delta proposto.** Não substitui [`07-TRACEABILITY.md`](07-TRACEABILITY.md). Cobre exclusivamente os requisitos `DN-*` criados em [`06-REQUIREMENTS.delta-denunciasnew.md`](06-REQUIREMENTS.delta-denunciasnew.md).
>
> **Fase:** F2. **Autorização:** `SOMENTE_LEITURA + DOCUMENTAÇÃO`.
> **Fonte primária citada:** `docs/Documento externo-outros 010970.2026.pdf` (pág. 1–15, transcrição em [`prompts/fases/F2-pdf-transcript.md`](prompts/fases/F2-pdf-transcript.md)).

## 1. Convenção

| Coluna | Definição |
| --- | --- |
| **Requisito** | ID do requisito em [`06-REQUIREMENTS.delta-denunciasnew.md`](06-REQUIREMENTS.delta-denunciasnew.md). |
| **Fonte** | PDF pág. N ou "PDF meta". |
| **Componente esperado** | Componente do produto que implementará o requisito (nome lógico; a mapear a artefato de código real quando disponível). |
| **Teste focal** | Camada/tipo esperado (unit, integ-sim, e2e-mock, a11y, security, perf). |
| **Evidência esperada** | Artefato gerado durante execução do teste. |
| **Ameaça relacionada** | Categoria STRIDE mais próxima ou `n/a`. |
| **Decisão bloqueadora** | DEC-DN-\* que impede finalização até resposta do owner. |
| **Estado** | `ND-CÓDIGO` (esperando código do produto), `ND-DECISÃO` (esperando decisão), `PRONTO-P/-F3` (pronto para virar diagrama). |

## 2. Matriz

| Requisito | Fonte | Componente esperado | Teste focal | Evidência esperada | Ameaça | Decisão bloqueadora | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DN-RG-001 | PDF pág. 2 | curadoria editorial (Legal Design review) | processo (revisão editorial + a11y) | ata de curadoria + checklist Legal Design | n/a | — | PRONTO-P/-F3 |
| DN-RG-002 | PDF pág. 2 | wizard multipasso do frontend | e2e-mock (navegação linear) + a11y (foco/leitor) | vídeo/screenshots dos passos + `axe` report | Repudiation (usuário perde estado) | — | PRONTO-P/-F3 |
| DN-RNF-001 | PDF pág. 3 | frontend (todos os componentes) | a11y (`axe-core wcag21aa` ou `wcag22aa` — DEC-DN-07) | relatório axe zero-violations sérias/críticas | n/a | DEC-DN-07 | ND-DECISÃO |
| DN-RG-003 | PDF pág. 3 | textos de UI, labels, hints, erros | processo (revisão editorial) + a11y | glossário aplicado + amostragem revisada | n/a | — | PRONTO-P/-F3 |
| DN-RNF-002 | PDF pág. 4 | frontend em viewports ≤360 px | e2e-mock multi-device (Playwright) + a11y | screenshots por viewport + relatório axe | n/a | — | PRONTO-P/-F3 |
| DN-RNF-003 | PDF pág. 4 (inferido) | frontend/BFF | perf mobile (Lighthouse `Slow 3G`) | Lighthouse report LCP/TTI | DoS (payload pesado) | DEC-DN-08 | ND-DECISÃO |
| DN-RS-001 | PDF pág. 5 | bot WhatsApp externo + adaptador BFF | integ-sim (mock provedor WhatsApp) | ata de sandbox + logs sanitizados | Tampering / Info disclosure em canal externo | DEC-DN-09 | ND-DECISÃO |
| DN-RF-001 | PDF pág. 6 | tela de acolhimento (frontend) | unit + e2e-mock (3 caminhos) | screenshots + trace Playwright | n/a | — | PRONTO-P/-F3 |
| DN-RF-002 | PDF pág. 6 | player de vídeo + legendas | e2e-mock + a11y (captions, transcript) | axe report + trace | Info disclosure (autoplay com som) | — | PRONTO-P/-F3 |
| DN-RF-003 | PDF pág. 7 | componente checklist visual | unit + e2e-mock (seleção múltipla) | trace + snapshot | n/a | DEC-DN-10 | ND-DECISÃO |
| DN-RF-004 | PDF pág. 7 | textarea + gravador in-app | unit + e2e-mock cross-browser | trace Playwright (Chromium/Firefox/WebKit) | Info disclosure (permissão de mic) | — | PRONTO-P/-F3 |
| DN-RS-002 | PDF pág. 7 | serviço de transcrição de áudio | integ-sim (mock provedor STT) | fixture in/out sanitizada | Info disclosure (áudio com PII) | DEC-DN-11 | ND-DECISÃO |
| DN-RS-003 | PDF pág. 7 | classificador (regra/ML) | integ-sim + auditoria de decisão | log de classificação sanitizado | Elevation of privilege (bypass classificação) | DEC-DN-12 | ND-DECISÃO |
| DN-RF-005 | PDF pág. 8 | tela de detalhamento (faixa numérica) | unit + e2e-mock | trace | n/a | DEC-DN-13 | ND-DECISÃO |
| DN-RF-006 | PDF pág. 8 | tela de detalhamento (select modalidade) | unit + e2e-mock | trace | n/a | DEC-DN-14 | ND-DECISÃO |
| DN-RF-007 | PDF pág. 8 | tela de detalhamento (multi-select) | unit + e2e-mock | trace | n/a | — | PRONTO-P/-F3 |
| DN-RF-008 | PDF pág. 9 | uploader + validação MIME | integ-sim + security (ClamAV mock) | fixtures válidas/inválidas + log | Tampering / Malware upload | DEC-DN-15 | ND-DECISÃO |
| DN-RF-009 | PDF pág. 9 | subformulário de testemunhas | unit + e2e-mock | trace | Info disclosure (PII de terceiros) | DEC-DN-16 | ND-DECISÃO |
| DN-RG-004 | PDF pág. 9 | telemetria + relatório | processo | KPI trimestral com baseline | n/a | DEC-DN-17 | ND-DECISÃO |
| DN-RG-005 | PDF pág. 10 | aviso destacado + confirmação | a11y (contraste AAA) + e2e-mock | screenshot + axe | Repudiation (usuário alega não ter visto) | — | PRONTO-P/-F3 |
| DN-RF-010 | PDF pág. 10 | switch "anônima" + máscara | unit + e2e-mock + security (payload sem PII) | trace + inspeção do payload | Info disclosure (vazamento de identidade) | — | PRONTO-P/-F3 |
| DN-RNF-004 | PDF pág. 10 (inferido) | logs, telemetria, storage | security (redaction) + processo | amostra de log sanitizado + política | Info disclosure em log | DEC-DN-18 | ND-DECISÃO |
| DN-RF-011 | PDF pág. 11 | validação obrigatória município/estado | unit + e2e-mock (erro em linguagem simples) | trace + axe (foco no erro) | n/a | — | PRONTO-P/-F3 |
| DN-RF-012 | PDF pág. 11 | campos opcionais + hint | unit + e2e-mock | trace | n/a | — | PRONTO-P/-F3 |
| DN-RF-013 | PDF pág. 12 | tela de revisão (sumário editável) | unit + e2e-mock (editar/voltar/enviar) | trace | Tampering (edição após confirmar) | — | PRONTO-P/-F3 |
| DN-RF-014 | PDF pág. 13 | tela de confirmação + infográfico | unit + e2e-mock + a11y | trace + axe (descrição do infográfico) | Repudiation | DEC-DN-19, DEC-DN-20 | ND-DECISÃO |
| DN-RG-006 | PDF pág. 14 | telemetria consolidada | processo | relatório trimestral | Info disclosure (PII em métrica) | DEC-DN-21 | ND-DECISÃO |
| DN-RS-004 | PDF pág. 14 | motor de alertas | integ-sim + security (canal) | fixture de alerta sanitizado + regra | Info disclosure (alerta com PII) | DEC-DN-22 | ND-DECISÃO |
| DN-RG-007 | PDF metadata | governança do ciclo | processo | delta em `00-MAPA-ORIGENS.md` (após aprovação) | n/a | P-F1-2 / DEC-DN-03 | ND-DECISÃO |

## 3. Cobertura por diagrama Mermaid `denunciasnew-*` (a produzir em F3)

| Requisito | Diagrama previsto |
| --- | --- |
| DN-RG-002, DN-RF-001, DN-RF-002, DN-RF-003, DN-RF-004, DN-RF-005, DN-RF-006, DN-RF-007, DN-RF-008, DN-RF-009, DN-RG-005, DN-RF-010, DN-RF-011, DN-RF-012, DN-RF-013, DN-RF-014 | `denunciasnew-casos-de-uso.mmd` (jornada + fronteira) |
| DN-RG-002, DN-RF-001..DN-RF-014 | `denunciasnew-classes.mmd` (componentes do wizard + serviços) |
| DN-RS-001, DN-RS-002, DN-RS-003, DN-RS-004, DN-RG-007 | `denunciasnew-contexto.mmd` (C4 nível 1 — sistemas externos: WhatsApp, STT, alertas) |
| DN-RS-001..DN-RS-004, DN-RF-008, DN-RF-014 | `denunciasnew-c4-containers.mmd` (BFF, front, provedores externos) |
| DN-RG-002, DN-RF-001..DN-RF-014, DN-RF-008 | `denunciasnew-c4-componentes.mmd` (BFF + frontend) |

## 4. Bloqueios de rastreabilidade

- **BLK-TRC-01:** 14 requisitos estão em `ND-DECISÃO` (esperam DEC-DN-07..22). Nenhum vira fatia executável em F6 até que as decisões sejam emitidas.
- **BLK-TRC-02:** Componente físico (nomes de arquivo, classes, endpoints reais) está `ND-CÓDIGO` para todos os requisitos, pois `cidadania-canal-denuncias/**` é ausente por instrução do owner. O mapeamento a artefatos concretos será feito em ciclo posterior.
