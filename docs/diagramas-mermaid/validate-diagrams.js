const fs = require('node:fs');
const path = require('node:path');

const directory = __dirname;
const expectedHeaders = new Set([
  'flowchart',
  'classDiagram',
  'sequenceDiagram',
  'stateDiagram-v2',
]);
const files = fs.readdirSync(directory).filter((name) => name.endsWith('.mmd'));
const expectedFiles = new Set([
  '01-arquitetura-geral.mmd',
  '02-contexto.mmd',
  '03-classes.mmd',
  '04-atividade-envio.mmd',
  '05-sequencia-envio.mmd',
  '06-casos-de-uso.mmd',
  '07-componentes.mmd',
  '08-estados-wizard.mmd',
  '09-implantacao-seguranca.mmd',
  '10-fluxo-dados.mmd',
]);

if (files.length !== 10) {
  throw new Error(`Esperados 10 diagramas Mermaid; encontrados ${files.length}`);
}

for (const file of expectedFiles) {
  if (!files.includes(file)) {
    throw new Error(`Diagrama esperado não encontrado: ${file}`);
  }
}

for (const file of files) {
  const source = fs.readFileSync(path.join(directory, file), 'utf8').trim();
  const header = source.split(/\s+/, 1)[0];
  if (!expectedHeaders.has(header)) {
    throw new Error(`${file}: declaração Mermaid desconhecida: ${header}`);
  }
  if (source.includes('\t')) {
    throw new Error(`${file}: tabulação encontrada; use espaços`);
  }
}

const drawioPath = path.resolve(directory, '..', 'DiagramaDenuncias-sobreposto.drawio');
const drawio = fs.readFileSync(drawioPath, 'utf8');
const requiredFragments = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<mxfile ',
  '<diagram ',
  '<mxGraphModel ',
  '<root>',
  '</root>',
  '</mxGraphModel>',
  '</diagram>',
  '</mxfile>',
  'mermaidSource="diagramas-mermaid/01-arquitetura-geral.mmd"',
];

for (const fragment of requiredFragments) {
  if (!drawio.includes(fragment)) {
    throw new Error(`draw.io sem fragmento obrigatório: ${fragment}`);
  }
}

const cellCount = (drawio.match(/<mxCell\b/g) || []).length;
if (cellCount < 20) {
  throw new Error(`draw.io parece incompleto: apenas ${cellCount} células`);
}

console.log(`OK: ${files.length} fontes Mermaid e draw.io com ${cellCount} células.`);
