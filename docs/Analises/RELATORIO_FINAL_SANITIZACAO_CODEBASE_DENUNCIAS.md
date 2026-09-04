# Relatório final de sanitização — Canal de Denúncias

Data local: 21/07/2026

## Escopo e critérios

O trabalho foi executado somente no repositório local, sem commit, push ou pull
request. O frontend permaneceu na raiz Angular e o backend permaneceu em
`server/`. Os backups foram separados em `Analises/backups/frontend` e
`Analises/backups/backend`, com sufixo `_old` nos arquivos anteriores.

A régua acordada priorizou custo-benefício para o porte da aplicação: no máximo
três incrementos finais, até cinco arquivos de produção e aproximadamente 200
linhas por incremento, salvo risco concreto de produção. O objetivo arquitetural
foi modularidade, baixo acoplamento, alta coesão, clareza e simplicidade, sem
perseguir Clean Architecture ou Clean Code de forma dogmática.

Parâmetros informados para produção: 100 denúncias/hora, 500 usuários, 100
uploads simultâneos, três réplicas, Safari obrigatório, antimalware obrigatório,
retenção de logs de 10 dias e disponibilidade sugerida de 99,5%.

## Incrementos executados e justificativas

### 1. Planejamento brownfield e proteção do trabalho existente

- Inspeção da especificação e do codebase antes das alterações.
- Identificação do frontend Angular e backend Express sem reorganização física
  arriscada do repositório.
- Preservação das alterações locais preexistentes do usuário.
- Separação dos backups de frontend e backend.

Justificativa: permitir evolução incremental e reversível sem perder trabalho
anterior nem produzir uma migração estrutural desproporcional.

### 2. Toolchain reproduzível

- Volta 2.0.2 instalado.
- Node 22.22.3 e npm 11.11.0 fixados para execução local.
- Comandos automatizados executados pelo binário do Volta.

Justificativa: reduzir diferenças entre máquinas e tornar lint, testes e build
repetíveis.

### 3. Falhas visíveis no frontend

- Remoção da geração de protocolo fictício em erro HTTP ou de rede.
- Remoção da confirmação quando uma resposta `201` não contém protocolo válido.
- Mensagem de falha visível, permanência na revisão e possibilidade de tentar
  novamente.

Justificativa: impedir falso sucesso, perda de confiança e impressão de que uma
denúncia foi entregue sem confirmação real.

### 4. Contrato de sucesso no backend

- `201` somente depois que a API interna do MPT aceita a denúncia.
- `502` quando a API interna falha ou rejeita o envio.
- `503` quando a integração obrigatória não está configurada.
- Documentação Swagger e README alinhadas aos status reais.

Justificativa: manter o mesmo contrato de entrega entre frontend e backend e
evitar confirmação enganosa.

### 5. Qualidade estática e testes backend

- ESLint configurado no frontend e backend.
- Vitest e Supertest adicionados ao backend.
- Testes de validação, protocolo, controller, cliente HTTP, perímetro e falhas de
  integração.
- Redocly incorporado para validação do contrato OpenAPI.

Justificativa: detectar regressões de baixo custo antes de executar navegadores
ou implantar o serviço.

### 6. Acessibilidade sem alteração de UI/UX

- Ajustes de teclado, foco, rótulos, ARIA, contraste e semântica.
- Correções incrementais em acolhimento, stepper, irregularidades, evidências e
  identificação.
- Baseline automatizada com axe.

Justificativa: melhorar uso por tecnologia assistiva e teclado preservando o
desenho e o fluxo já aprovados.

### 7. Privacidade, tipagem e padronização Angular

- Remoção de URL e logs de depuração de áudio.
- Erros tipados sem exposição desnecessária de detalhes.
- Injeção Angular padronizada com `inject()`.
- Logs backend reduzidos a protocolo, contagem e códigos técnicos, sem UF,
  sigilo ou mensagem bruta da integração.

Justificativa: reduzir dados pessoais em logs e tornar o código mais uniforme e
manutenível sem mudar comportamento.

### 8. QA real de interface

- Playwright configurado para preencher campos, clicar, voltar e avançar,
  preservar dados, anexar PDF fictício e concluir a jornada.
- Cenários de sucesso, falha com nova tentativa, resposta sem protocolo e
  acessibilidade.
- API interceptada nos testes para não enviar dados reais.

Justificativa: validar comportamento observável da aplicação, além de testes
unitários isolados.

### 9. Segurança de dependências

- Axios fixado em 1.18.1 e Morgan em 1.11.0.
- Correções transitivas de `body-parser`, `brace-expansion`, `fast-uri` e
  `immutable` por versões/overrides compatíveis.
- Correção do peer de YAML sem downgrade forçado.
- Auditoria de dependências de produção zerada no frontend e backend.

Justificativa: eliminar vulnerabilidades de execução conhecidas sem atualizações
maiores incompatíveis ou refatorações sem retorno proporcional.

### 10. Bundle frontend proporcional

- Bootstrap completo substituído por módulos Sass necessários à aplicação.
- Bundle inicial reduzido de aproximadamente 601,09 kB para 384,38 kB.
- Transferência estimada final de 85,26 kB.

Justificativa: ficar abaixo dos budgets de 500 kB bruto e 120 kB transferido sem
alterar UI/UX.

### 11. Modularidade backend

- Cliente da API MPT extraído para `server/clients/mpt-api.client.js`.
- Regras de protocolo, payload e validação extraídas para
  `server/services/complaint.service.js`.
- Controller reduzido à coordenação HTTP.

Justificativa: separar integração externa de regras da denúncia, reduzindo
acoplamento e facilitando testes.

### 12. Perímetro backend

- Rate limit somente no `POST /api/denuncias`.
- CORS de produção restrito a `FRONTEND_URL`.
- Swagger desabilitado por padrão em produção.
- `trust proxy` configurável.
- Inicialização falha quando variáveis essenciais não existem.

Justificativa: proteger o endpoint público sem limitar health check nem aumentar
desnecessariamente a complexidade.

### 13. Modularidade frontend

- Serialização, multipart, chamada HTTP e validação do protocolo extraídas para
  `src/app/clients/complaint-api.client.ts`.
- `ComplaintService` mantido como fachada de estado e navegação.
- Testes separados entre cliente e serviço.

Justificativa: isolar o contrato HTTP da gestão de estado, mantendo componentes
simples e sem alterar o fluxo visual.

### 14. Cobertura Firefox

- Firefox 151/Playwright build 1532 instalado no cache do usuário.
- Projeto `firefox-desktop` incorporado à suíte.
- Resultado do incremento: 12/12 jornadas aprovadas.

Justificativa: reduzir dependência exclusiva do Chromium.

### 15. Cobertura WebKit/Safari

- WebKit 26.5/Playwright build 2311 instalado no cache do usuário.
- Projeto `webkit-desktop` com perfil Desktop Safari.
- Resultado do incremento: 16/16 jornadas aprovadas.

Justificativa: cobrir o motor usado pelo Safari. Ainda é necessária homologação
final em Safari real sobre macOS ou iPhone.

### 16. Rate limiting compartilhado para três réplicas

- `redis@6.1.0` e `rate-limit-redis@6.0.0` instalados com versões exatas.
- Store Redis externo compartilhado entre réplicas.
- `REDIS_URL` obrigatória em produção, com suporte a `rediss://`.
- Memória permitida somente em desenvolvimento e testes sem Redis.
- Falha do store bloqueia submissões; conexão é encerrada com o servidor.

Justificativa: o armazenamento em memória anterior criava três contadores
independentes e inconsistentes. Redis mantém uma política única sem incorporar
um gateway ou servidor Redis ao codebase.

Backups: `Analises/backups/backend/before_shared_redis_rate_limit`.

### 17. Upload seguro e antimalware

- `multer.memoryStorage()` substituído por armazenamento temporário em disco com
  nomes aleatórios.
- Arquivos enviados ao ClamAV externo pelo protocolo oficial `INSTREAM`.
- Arquivo limpo encaminhado à API MPT por stream, sem carregar todo o conteúdo
  na memória.
- Ameaça retorna `422`; indisponibilidade, timeout ou resposta inválida do
  scanner retorna `503` e não encaminha a denúncia.
- Temporários removidos no sucesso, nas falhas do controller e nos erros do
  middleware de upload.
- `CLAMAV_HOST` obrigatória em produção; porta e timeout configuráveis.
- Teste integrado percorre endpoint Express, disco, ClamAV TCP simulado,
  multipart e API MPT HTTP simulada.

Justificativa: o limite anterior permitia até 200 MB por denúncia em memória e
não verificava malware. Com 100 uploads simultâneos, isso não era compatível com
produção. A solução usa somente módulos nativos e mantém o ClamAV fora da
aplicação.

Backups: `Analises/backups/backend/before_secure_upload_antimalware`.

## Resultado final da QA local

| Verificação | Resultado |
|---|---:|
| Frontend ESLint | 0 erros |
| Backend ESLint | 0 erros |
| Testes unitários frontend | 8/8 |
| Testes backend | 30/30 |
| UI/UX Playwright + axe | 16/16 |
| Navegadores | Chromium desktop/mobile, Firefox, WebKit |
| Bundle inicial bruto | 384,38 kB |
| Transferência estimada | 85,26 kB |
| Auditoria frontend de produção | 0 vulnerabilidades |
| Auditoria backend de produção | 0 vulnerabilidades |
| Integridade do diff | aprovada |

## Pendências para produção

O codebase está apto a seguir para ambiente de homologação, mas não deve ser
classificado como pronto para produção até que as dependências externas sejam
provisionadas e testadas:

1. Provisionar Azure Managed Redis ou Redis compatível e testar `REDIS_URL` real
   com as três réplicas.
2. Provisionar ClamAV com assinaturas atualizadas em rede privada. Configurar
   `StreamMaxLength` acima de 20 MB e dimensionar `MaxThreads`/`MaxQueue` para a
   concorrência esperada.
3. Executar teste de carga em staging com 100 uploads simultâneos e arquivos de
   tamanho representativo. O teste local não simula capacidade real de disco,
   rede, Redis, ClamAV ou API interna.
4. Testar a API interna real do MPT em ambiente de homologação, inclusive
   timeout, indisponibilidade e idempotência operacional.
5. Homologar as jornadas em Safari real no macOS e/ou iPhone.
6. Configurar a plataforma de logs para retenção de 10 dias e confirmar que
   segredos, IPs e conteúdos de denúncia não são exportados indevidamente.
7. Definir plataforma de hospedagem, certificados, DNS, secrets, réplicas,
   health/readiness probes, monitoramento e alertas.
8. Realizar homologação funcional por usuários responsáveis pelo negócio.

## Riscos aceitos e itens não bloqueantes

- O Sass informa depreciação de `@import` usado pelo Bootstrap 5.3. O build passa
  e a migração não foi forçada por não oferecer retorno proporcional agora.
- A árvore de desenvolvimento frontend mantém avisos moderados ligados à
  ferramenta Angular/CLI sem correção compatível segura; dependências de
  produção estão sem vulnerabilidades conhecidas pela auditoria executada.
- O OpenAPI possui avisos documentais não bloqueantes já identificados: licença,
  servidor localhost, `operationId` ausente e resposta 4xx no endpoint de
  informações.
- Existe uma pasta antiga de backup combinado em
  `Analises/backups/before_contract_privacy_hardening`; ela foi preservada para
  não executar exclusão sem autorização.

## Conclusão

A sanitização proporcional do codebase foi concluída. Não há recomendação de
novas refatorações estruturais neste momento. O próximo investimento com melhor
retorno é homologar infraestrutura e carga reais, não continuar reorganizando o
código.
