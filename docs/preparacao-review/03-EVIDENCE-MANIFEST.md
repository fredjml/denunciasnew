# 03-EVIDENCE-MANIFEST — Passo 7 (Capturar evidência)

> Preenchido a partir do template `licoesaprendidas/templates/evidence-manifest.md`.

| ID | Requisito/alegação | Ambiente/modo | Fonte privada | Artifact publicável | Mostrar | Ocultar/redaction | Versão/hash | Owner/acesso | Retenção | Revisão |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-01 | Wizard completo funciona de ponta a ponta (DN-RF-001..014) | e2e-mock, mobile (Pixel 5) | screenshots locais (Playwright) | [Galeria "Telas do Canal de Denúncias"](https://claude.ai/code/artifact/bcf8590a-9f86-4da6-b69f-bd5c28f2e072) | 8 telas + guia de decisão | nenhum dado real (só `SYN-*`) | commit `a84e439`/`ff3db92` | Frontend | 30 d (default `DEC-DN-P-F5-1`) | privado, não compartilhado publicamente |
| EV-02 | Identidade visual bate com o mockup do PDF | manual + screenshots | idem EV-01 | idem EV-01 | header, abas, cards, ícones nas 8 telas | — | commit `a84e439` | Frontend + Produto | 30 d | comparado lado a lado com o PDF na sessão |
| EV-03 | Logo oficial aplicado corretamente (mobile + desktop) | manual, viewport 393×851 e 1440×900 | screenshots locais (descartados após inspeção) | não publicado | — | — | commit `03a7da1` | Frontend | N/A (não retido) | inspecionado visualmente na sessão |
| EV-04 | Protocolo real gerado e sobrevive a reload | e2e-mock | `frontend/e2e/fluxo-completo.spec.ts` | log de teste (CI) | asserção `toMatch(/^SYN-[A-Z0-9]{8}$/)` | N/A | commit `c24f910` | Frontend + Backend | 30 d | — |
| EV-05 | Upload malicioso rejeitado nas duas rotas | integ-sim | `backend-mock/test/denuncias.spec.mjs` | log de teste (CI) | 4 códigos de rejeição (`EXTENSAO_BLOQUEADA`, `MIME_NAO_PERMITIDO`, `MAGIC_BYTES_DIVERGENTE`, `ARQUIVO_INFECTADO`) | conteúdo EICAR é assinatura de teste padrão, não malware real | commit `58b5c57` | Backend + Segurança | 30 d | — |
| EV-06 | Zero violações WCAG 2.1 AA serious/critical no wizard completo | a11y-mock | `frontend/e2e/accessibility.spec.ts` | log de teste (CI) | axe-core `wcag2a/wcag2aa/wcag21a/wcag21aa` | N/A | commit `c24f910` | A11y + Frontend | 30 d | — |

## Shot list

| ID | Tela/estado | Viewport/AT | Resultado esperado | Nome final | Status |
| --- | --- | --- | --- | --- | --- |
| SH-DN-REV-01 | Acolhimento (header + vídeo + 3 caminhos) | 393×851 mobile | header MPT branco, logo legível, vídeo institucional visível | `1-acolhimento.png` | CAPTURADA (galeria) |
| SH-DN-REV-02 | Relato Guiado (checklist com ícone selecionado) | 393×851 mobile | card selecionado com borda vermelha, ícone visível | `2b-relato-selecionado.png` | CAPTURADA (galeria) |
| SH-DN-REV-03 | Detalhamento (seções com ícone) | 393×851 mobile | ícones relógio/pessoas nas seções | `3-detalhamento.png` | CAPTURADA (galeria) |
| SH-DN-REV-04 | Evidências (dropzone + testemunhas) | 393×851 mobile | dropzone tracejada, pergunta sim/não | `4-evidencias.png` | CAPTURADA (galeria) |
| SH-DN-REV-05 | Sigilo e Anonimato (aviso AAA) | 393×851 mobile | aviso com contraste alto, radios | `5-sigilo.png` | CAPTURADA (galeria) |
| SH-DN-REV-06 | Local (UF/Município + empresa) | 393×851 mobile | selects preenchidos, hint visível | `6-local.png` | CAPTURADA (galeria) |
| SH-DN-REV-07 | Revisão (sumário editável) | 393×851 mobile, full page | 5 seções com "Editar", botão "Enviar Denúncia" | `7-revisao.png` | CAPTURADA (galeria) |
| SH-DN-REV-08 | Confirmação (protocolo real + infográfico) | 393×851 mobile | protocolo `SYN-*` real, fluxo Recebimento→Triagem→Investigação | `8-confirmacao.png` | CAPTURADA (galeria) |
| SH-DN-REV-09 | Header no logo oficial | 393×851 mobile + 1440×900 desktop | logo MPT legível nos dois viewports | (inspeção direta, não retida) | INSPECIONADA — não publicada |

## Content freeze

- [x] fonte congelada — commits citados acima são imutáveis (histórico local, não reescrito).
- [x] derivado gerado — galeria HTML publicada como Artifact.
- [x] todas as páginas/telas inspecionadas — 8/8 telas do wizard + header em 2 viewports.
- [x] metadados e PII revisados — nenhum dado real; todo texto de exemplo usa `SYN-*`/dados
      fictícios; nenhum EXIF (screenshots gerados por Playwright, sem metadados de câmera).
- [x] ligado ao commit/requisito — cada linha do manifesto cita o commit correspondente.
- [ ] publicação verificada quando aplicável — a galeria está **privada** (não compartilhada
      publicamente); nenhuma verificação de publicação externa é aplicável neste MVP.
