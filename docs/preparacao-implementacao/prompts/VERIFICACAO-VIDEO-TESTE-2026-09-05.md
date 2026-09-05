# Verificação — vídeo institucional real para teste local (sessão 2026-09-05, rodada 5)

> Owner: Frederico José Monteiro Leite. Registro ação → motivo desta rodada específica.

## 1. Pedido e contexto

Owner pediu um vídeo institucional real do MPT para testar o player local (o componente
`video-institucional` só tinha um placeholder sem `src` até aqui). Busquei vídeos reais em
`prt17.mpt.mp.br` (Procuradoria Regional do Trabalho da 17ª Região — Espírito Santo): todos os
encontrados estão hospedados no YouTube, nenhum self-hosted no domínio do MPT.

**Conflito identificado e resolvido com o owner antes de agir:** usar um vídeo do YouTube
exigiria reabrir `DEC-DN-27` (self-hosted, sem embed de terceiro) ou baixar o vídeo via
ferramenta tipo `yt-dlp`, o que violaria os Termos de Serviço do YouTube — não fiz isso.
Ofereci 3 opções via `AskUserQuestion`; owner escolheu baixar o arquivo manualmente e me
entregar o `.mp4` pronto, evitando que eu fizesse qualquer scraping.

## 2. Ação → Motivo

| Ação | Motivo |
| --- | --- |
| Owner salvou `Vídeo Manifesto - MPT-ES 35 anos.mp4` (59.103.618 bytes) diretamente em `frontend/public/media/` | Contorna o problema de ToS do YouTube — o owner fez o download, não eu. |
| Renomeei para `video-institucional-mpt-es-35-anos.mp4` (sem espaços/acentos) | Nome de arquivo original tinha espaços duplos e acento, arriscando problemas de URL-encoding ao servir como asset estático. |
| Medi a duração real do vídeo com um parser de átomos MP4 escrito ad-hoc em Python (sem `ffprobe`/`ffmpeg` disponíveis no ambiente) | Necessário para exibir a duração correta na legenda do botão de play (o mockup original dizia "45s", o vídeo real tem 1min58s) — evitar informação enganosa na UI. |
| Confirmei codec `avc1` (H.264) presente no arquivo | H.264 é suportado nativamente por todos os navegadores relevantes (`<video>` sem plugin) — vídeo é tecnicamente compatível com o player já implementado. |
| Criei `video-institucional-mpt-es-35-anos.vtt` com uma nota explícita de que a legenda real não foi transcrita nesta rodada | O `.vtt` placeholder existente (5s de texto genérico) não corresponde ao áudio real de 1min58s — deixar aplicado seria uma legenda tecnicamente presente mas enganosa (falha de acessibilidade real, não só estética). Uma nota honesta é melhor que uma legenda fabricada que eu não posso verificar (não tenho STT real disponível offline). |
| `video-institucional.ts`: video/legenda/duração agora vêm de uma constante escolhida via `isDevMode()` — vídeo real em dev, placeholder vazio (comportamento anterior, sem `src`) em build de produção | O vídeo real baixado é conteúdo de terceiro não sintético (contra `R-DN-05` se fosse o default) e ainda não é o vídeo final aprovado para este produto (`DEC-DN-27` fixou só o *padrão* de hosting, não o *conteúdo*). Gate por `isDevMode()` garante que a build de produção nunca referencia esse arquivo, mesmo que ele exista em disco. |
| Adicionadas 2 linhas em `frontend/.gitignore` (`video-institucional-mpt-es-35-anos.mp4` e `.vtt`) | Nunca commitar: 59 MB infla o repositório, é conteúdo de terceiro baixado manualmente (não gerado por nós), e não é fixture sintética. Confirmado via `git status` que nenhum dos dois arquivos aparece como stageable. |
| `video-institucional.spec.ts`: teste de transcrição ajustado para aceitar tanto o texto do placeholder quanto o texto de "vídeo de teste local" | O teste unitário roda com `isDevMode()=true` (ambiente de teste do Angular/Vitest também conta como dev), então sempre bate no branch do vídeo real — ajustei a asserção para validar a *intenção* (deixar claro que não é o vídeo final), não o texto literal de um branch só. |
| `video-institucional.html`: `<source>` só é renderizado quando há `src` real (`@if (videoSrc())`) | Evita `<source src="">` (string vazia), que faria o navegador tentar carregar a própria URL da página como vídeo — comportamento inválido e ruidoso no console. |

## 3. Evidência

| Comando | Resultado |
| --- | --- |
| `npx eslint .` (frontend) | 0 erros |
| `npx ng test --watch=false` | 69/69 (ajuste de 1 teste, sem perda de cobertura) |
| `npx ng build` | sem erros |
| `npx playwright test` | 12/12, incluindo os 2 testes de acessibilidade WCAG 2.1 AA |
| `git status --short` | confirma que o `.mp4`/`.vtt` reais não aparecem como arquivo rastreável |
| Screenshot manual (Playwright, mobile viewport) | player mostra o vídeo real tocando, `0:01 / 1:58`, legenda de teste sobreposta, controles nativos presentes após o play |

## 4. Pendências relacionadas

- A legenda real (transcrição completa do áudio) não foi gerada — precisa de STT real ou
  transcrição manual antes de qualquer uso além de teste local do player.
- O vídeo institucional final para produção ainda não foi aprovado pelo owner/MPT — este
  arquivo é só para QA do componente, nunca deve aparecer em build de produção (já garantido
  por código, mas registrar aqui para quem ler este histórico depois).
- Se o vídeo final decidido futuramente também for só disponível via YouTube, a decisão
  `DEC-DN-27` precisará ser reaberta formalmente (self-hosted vs. embed) — não é o caso agora.
