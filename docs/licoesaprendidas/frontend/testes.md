# Estratégia de testes do frontend

| Nível | Casos |
| --- | --- |
| service | defaults, limites de navegação, update, envio, erro, retry, reset |
| client | multipart, anexos, rede, status, detalhes 422 e protocolo inválido |
| component | DOM, validação, foco, ARIA, eventos e estados |
| E2E mockado | jornada, 503/retry, 201 sem protocolo, upload sintético e a11y |
| manual | 320 px, zoom, teclado, leitor de tela e mídia |
| integração | BFF real controlado, separado do E2E atual |

Prefira locators por papel/nome e comportamento observável. Não espere timeout arbitrário. Use fixture sintética sem PII e registre quais rotas foram interceptadas.
