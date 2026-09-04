# Post-mortem, causa raiz e Five Whys

Use após incidente, rejeição, retrabalho relevante ou encerramento. O objetivo é converter problema em controle, sem culpabilização.

## Princípios

- reconstrua timeline com evidência;
- separe sintoma, causa imediata e causa raiz;
- classifique confiança;
- distinga retrabalho evitável, parcialmente evitável e inevitável;
- não culpe ferramenta/usuário por dependência que o processo deveria antecipar;
- faça contraprova e análise contrafactual;
- não invente horas, tokens, custo ou impacto quantitativo.

## Feedback e retrabalho

- A — erro nosso: requisito disponível não atendido;
- B — requisito ambíguo;
- C — requisito implícito;
- D — requisito novo;
- E — falha de validação.

Uma observação pode ter mais de uma classe. Registre fonte, momento, impacto e controle.

## Five Whys

~~~text
Problema e impacto:
Sintoma observado:
Evidência/confiança:
Por quê 1?
Por quê 2?
Por quê 3?
Por quê 4?
Por quê 5?
Causa imediata:
Causa raiz sistêmica:
Controle corretivo:
Controle preventivo verificável:
Como provar que funciona:
Owner/prazo:
~~~

Não force exatamente cinco respostas; pare quando chegar a condição controlável e sustentada.

## Contraprova

- existe evidência contraditória?
- a causa indicada é outro sintoma?
- o requisito existia ou surgiu depois?
- o problema era detectável antes da implementação/entrega?
- documentação/processo existiam, mas validaram premissa errada?
- dependência humana era legítima, mas descoberta tarde?
- o controle proposto realmente bloquearia a recorrência?
- qual fato refutaria esta causa?

## Análise contrafactual

| Problema | Processo ideal evitaria? | Classe | Controle |
| --- | --- | --- | --- |

Classes: certamente evitável, provavelmente evitável, parcialmente evitável, provavelmente inevitável, inevitável.

## Estrutura do relatório

O template de lessons learned cobre:

1. resumo executivo;
2. objetivo, escopo e resultado;
3. timeline;
4. acertos/falhas;
5. primeira entrega e feedback;
6. causas, demora e retrabalho;
7. ferramentas, autorização, humanos, MCPs, skills, rules e docs;
8. falhas de análise/plano/teste/review;
9. tokens/contexto e comportamento da IA;
10. Five Whys, matrizes e contraprova;
11. top lições/erros;
12. quick wins e melhorias;
13. DoR/DoD/gates/pre-flight;
14. métricas, plano P0–P3, scorecard;
15. cenário “começar amanhã”.

## Lição estrutural N3B aplicada

Processo abundante pode falhar se a fonte primária for substituída por resumo incorreto. Portanto, “criar mais documentação” não é causa/solução automática. O controle deve ligar fonte a requisito, teste e evidência, com review independente.

## Limitações

Five Whys pode simplificar sistemas complexos; use múltiplas cadeias quando necessário. Git não mede esforço. Correlação temporal não prova causalidade. Post-mortem não substitui investigação formal de incidente, perícia ou comunicação legal.

