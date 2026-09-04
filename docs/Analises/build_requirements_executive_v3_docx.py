"""Gera o RELATORIO_REQUISITOS_DIRETORIA_V3.docx com análise aprofundada do codebase do Canal de Denúncias MPT."""
from collections import Counter
from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT / "cidadania-canal-denuncias"
OUT_V3 = Path(__file__).parent / "RELATORIO_REQUISITOS_DIRETORIA_V3.docx"
OUT_MAIN = Path(__file__).parent / "RELATORIO_REQUISITOS_DIRETORIA.docx"
REPORT_DATE = date(2026, 7, 26)

# Paleta de Cores MPT e Executiva
NAVY = RGBColor(0x17, 0x33, 0x5C)      # #17335C - Azul Marinho Institucional
NAVY_HEX = "17335C"
RED_MPT = RGBColor(0x99, 0x00, 0x00)   # #990000 - Vermelho MPT
RED_MPT_HEX = "990000"
TEAL = RGBColor(0x0C, 0x6E, 0x64)      # #0C6E64 - Teal / Destaque
GOLD = RGBColor(0xBF, 0x95, 0x3F)      # #BF953F - Dourado Alerta
GRAY_D = RGBColor(0x5A, 0x5A, 0x5A)    # #5A5A5A - Cinza Escuro
GRAY_L_HEX = "F4F6F9"                  # Fundo zebra suave
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

RED_SOFT_HEX = "FCE4D6"
YELLOW_SOFT_HEX = "FFF2CC"
GREEN_SOFT_HEX = "E2F0D9"

# ==============================================================================
# BASE DE DADOS DOS REQUISITOS E DIAGNÓSTICOS DO CODEBASE
# ==============================================================================

RF = [
    ("RF-01", "Apresentar acolhimento e permitir iniciar uma denúncia.", "Implementado",
     "src/app/components/acolhimento", "A ação “Denunciar” inicia o wizard."),
    ("RF-02", "Apresentar vídeo explicativo institucional de 45 segundos.", "Somente visual",
     "acolhimento.html#video-institucional", "Placeholder estático sem mídia ou reprodutor integrado."),
    ("RF-03", "Oferecer fluxos alternativos para denúncia de órgão público e Ouvidoria.", "Somente visual",
     "acolhimento.html", "Cards visuais sem tratadores de clique ou redirecionamento."),
    ("RF-04", "Conduzir o usuário em wizard com seis etapas, revisão e confirmação.", "Implementado",
     "app.html; ComplaintService", "Navegação por estado via Angular Signals."),
    ("RF-05", "Preservar os dados ao avançar e voltar etapas durante a sessão.", "Implementado",
     "ComplaintService", "Dados mantidos na memória RAM; recarregar a página (F5) apaga tudo."),
    ("RF-06", "Selecionar categorias de irregularidade entre seis opções fixas.", "Implementado",
     "complaint.model.ts#IRREGULARIDADES", "Jornada, CTPS, EPI, assédio, salários e outros."),
    ("RF-07", "Registrar relato textual livre da ocorrência.", "Implementado",
     "step-irregularidades", "Validação no backend exige relato ou ao menos 1 irregularidade."),
    ("RF-08", "Gravar relato em áudio via microfone e anexar à denúncia.", "BUG CRÍTICO",
     "step-irregularidades.ts; complaint-api.client.ts", "O Blob é criado no frontend, mas descartado pelo JSON.stringify antes do envio ao backend."),
    ("RF-09", "Registrar período, modalidade, prejudicados, funções e nomes envolvidos.", "Implementado",
     "step-ocorrencias", "Campos de detalhamento disponíveis (opcionais na lógica atual)."),
    ("RF-10", "Indicar grupos vulneráveis afetados e informe de outro órgão.", "Implementado",
     "step-evidencias", "Opções de grupos vulneráveis e resposta Sim/Não."),
    ("RF-11", "Anexar múltiplas fotos, áudios, vídeos e documentos.", "Implementado",
     "step-evidencias; upload.js", "O backend limita a 10 arquivos e 20 MB por arquivo."),
    ("RF-12", "Listar e remover anexos com pré-visualização de imagens.", "Implementado",
     "step-evidencias", "Prévia em base64 gerada para imagens."),
    ("RF-13", "Permitir opção entre denúncia anônima e identificada.", "BUG CRÍTICO LGPD",
     "step-identificacao.ts; complaint.service.js", "Ao alternar de 'Identificado' para 'Anônimo', os dados pessoais (nome/e-mail) permanecem na memória e são enviados ao backend."),
    ("RF-14", "Coletar Nome, E-mail e Telefone para denúncias identificadas.", "Parcial",
     "step-identificacao", "Campos exibidos, porém sem obrigatoriedade ou validação de formato."),
    ("RF-15", "Coletar UF e Município do local do fato.", "Implementado",
     "step-local; complaint.service.js", "Únicos campos obrigatórios de localização no backend."),
    ("RF-16", "Coletar Razão Social, Endereço e CNPJ da empresa denunciada.", "Parcial",
     "step-local", "Máscara de CNPJ presente, mas sem validação de Dígito Verificador (DV)."),
    ("RF-17", "Exibir tela de revisão com dados preenchidos e edição de etapas.", "Parcial",
     "step-revisao", "A revisão omite dados de contato, endereço da empresa, CNPJ e áudio."),
    ("RF-18", "Serializar denúncia e anexos em multipart e enviar ao BFF.", "Implementado",
     "complaint-api.client.ts", "POST /api/denuncias com JSON + FormData."),
    ("RF-19", "Validar integridade do JSON e conteúdo mínimo no servidor.", "Implementado",
     "complaint.controller.js; complaint.service.js", "Exige UF, Município e categoria/relato."),
    ("RF-20", "Restringir anexos por quantidade, tamanho e tipo MIME.", "Implementado",
     "middleware/upload.js", "Allowlist de 15 tipos MIME, max 10 arquivos de 20 MB."),
    ("RF-21", "Verificar anexos em antivírus (ClamAV INSTREAM) antes da entrega.", "Implementado",
     "clamav.client.js", "Verificação em tempo real com política de falha fechada."),
    ("RF-22", "Encaminhar denúncia à API interna do MPT sem expor segredos no browser.", "Implementado",
     "mpt-api.client.js", "BFF gerencia MPT_API_TOKEN com timeout de 30 segundos."),
    ("RF-23", "Gerar protocolo único MPT-XXXXXXXX após aceite da API MPT.", "Implementado",
     "complaint.service.js", "Alfabeto reduzido sem caracteres ambíguos (0, 1, I, O)."),
    ("RF-24", "Exibir tela de confirmação com protocolo retornado.", "Implementado",
     "confirmation component", "Exibição do protocolo oficial devolvido."),
    ("RF-25", "Permitir reiniciar nova denúncia a partir da confirmação.", "Implementado",
     "confirmation; ComplaintService.reset", "Limpa o estado da memória."),
    ("RF-26", "Disponibilizar rotas /health, /api-docs e /api/denuncias/info.", "Implementado",
     "server/index.js", "Endpoints de infraestrutura e documentação OpenAPI."),
    ("RF-27", "Consultar andamento da denúncia por protocolo.", "Ausente",
     "Geral", "O protocolo é exibido, mas não existe tela ou serviço de acompanhamento."),
    ("RF-28", "Acionar recurso de acessibilidade pelo botão do cabeçalho.", "Somente visual",
     "app.html#btn-accessibility", "Botão visual sem tratador de clique ou modal vinculado."),
]

RNF = [
    ("RNF-01", "Arquitetura desacoplada em SPA Angular e BFF Express.", "Atendido",
     "src/; server/", "Integrações e segredos restritos ao servidor."),
    ("RNF-02", "Cabeçalhos de segurança (Helmet) e restrição de CORS em produção.", "Atendido",
     "server/index.js", "Helmet ativo e FRONTEND_URL restrita em produção."),
    ("RNF-03", "Rate limit por IP compartilhado via Redis nas réplicas.", "Parcial",
     "redis-rate-limit-store.js", "Código estruturado; dependente de instância Redis em produção."),
    ("RNF-04", "Antimalware obrigatório com verificação antes da transmissão.", "Parcial",
     "clamav.client.js", "Código e simulador testados; serviço ClamAV real a homologar."),
    ("RNF-05", "Armazenamento temporário de upload em disco com limpeza pós-envio.", "Atendido",
     "middleware/upload.js", "Limpeza executada em bloco finally; ausente rotina para crash."),
    ("RNF-06", "Acessibilidade WCAG 2.1 A/AA validada por testes automatizados.", "Parcial",
     "e2e/ui-audit.spec.ts", "Zero violações graves no axe-core; faltam anéis :focus-visible e aria-live."),
    ("RNF-07", "Layout Mobile-first responsivo.", "Atendido",
     "spec_design.md; styles.css", "Design adaptável para celulares, tablets e desktop."),
    ("RNF-08", "Budget de bundle frontend leve.", "Atendido",
     "angular.json", "Bundle gerado em ~384 kB bruto (~85 kB transferido gzippeado)."),
    ("RNF-09", "Sanitização de logs (sem PII ou dados sensíveis).", "Atendido",
     "complaint.controller.js", "Logs registram apenas protocolo e metadados HTTP."),
    ("RNF-10", "Validação de assinatura real de arquivos (Magic Bytes).", "Não atendido",
     "middleware/upload.js", "Validação baseada exclusivamente no Content-Type informado pelo cliente."),
    ("RNF-11", "Health check com verificação de dependências (Readiness).", "Não atendido",
     "GET /health", "Endpoint /health responde status 200 estático sem testar Redis ou ClamAV."),
    ("RNF-12", "Persistência temporária de rascunho (sessionStorage).", "Não atendido",
     "ComplaintService", "Atualizar a página no celular limpa todo o formulário preenchido."),
    ("RNF-13", "Timeout explícito no cliente HTTP Angular (`AbortController`).", "Não atendido",
     "complaint-api.client.ts", "Envio utiliza fetch simples sem tempo limite configurado."),
    ("RNF-14", "Prevenção de duplicidade por chave de idempotência.", "Não atendido",
     "complaint.controller.js", "Reenvios após oscilação de rede geram novos protocolos."),
    ("RNF-15", "Termos de Uso e Consentimento LGPD no frontend.", "Não atendido",
     "step-revisao / step-identificacao", "Ausente checkbox ou aviso de ciência antes da submissão."),
]

CRITICAL_BUGS = [
    ("BUG-01", "Descarte do Áudio Gravado (`relato_audio`)",
     "No `StepIrregularidadesComponent`, o áudio gravado é salvo como `Blob`. No envio, `ComplaintApiClient` executa `JSON.stringify(complaint)`, que converte o `Blob` em um JSON vazio `{}`. O áudio nunca é anexado ao `FormData` nem enviado ao servidor.",
     "Ajustar `ComplaintApiClient` para converter o `Blob` de áudio em arquivo multipart e anexá-lo ao `FormData`."),
    ("BUG-02", "Vazamento de PII ao Alternar para 'Denúncia Anônima'",
     "Se o usuário preencher Nome, E-mail e Telefone no modo 'Identificado' e alterar para 'Anônimo', o `ComplaintService` preserva os dados na memória. Ao enviar, o JSON transmite o Nome e E-mail mesmo com `tipo_identificacao = 'anonimo'`.",
     "Implementar a limpeza imediata (`reset`) dos campos de identificação pessoal sempre que o modo anônimo for selecionado."),
    ("BUG-03", "Conexão de Rate Limit Redis sem Fallback Gracioso em Produção",
     "Em ambiente de produção (`assertProductionConfiguration`), se a variável `REDIS_URL` estiver ausente ou o servidor Redis estiver inoperante, a aplicação interrompe a inicialização no boot sem fallback.",
     "Tratar falha de conexão do Redis para operar com store em memória degradation mode com log de alerta."),
]

QUESTION_GROUPS = [
    ("A. Requisitos de Negócio e Jornada", [
        ("Negócio", "P0", "O relato em áudio é um requisito obrigatório para produção? Se sim, qual o limite de tempo e formato aceito?"),
        ("Negócio", "P0", "Quais campos do wizard devem ser bloqueantes para o avanço das etapas?"),
        ("Negócio", "P1", "Como deve ser tratada a denúncia de Órgãos Públicos e o botão de Ouvidoria na tela inicial?"),
    ]),
    ("B. Privacidade, LGPD e Sigilo", [
        ("Jurídico/DPO", "P0", "Qual o termo de consentimento LGPD exato que deve ser exibido antes da submissão?"),
        ("Privacidade", "P0", "Confirmar a regra de limpeza imediata de dados pessoais ao alternar para o modo anônimo."),
        ("Jurídico", "P1", "Qual a política formal de retenção dos anexos e logs no servidor após a triagem?"),
    ]),
    ("C. Segurança e Infraestrutura", [
        ("Segurança", "P0", "É obrigatória a verificação de Magic Bytes nos arquivos anexados no middleware de upload?"),
        ("Infraestrutura", "P0", "Qual a estratégia de alta disponibilidade para as instâncias de Redis e ClamAV em produção?"),
        ("Infraestrutura", "P1", "Como estruturar o endpoint /ready separado do /health para orquestração em contêineres?"),
    ]),
]

# ==============================================================================
# FUNÇÕES DE FORMATAÇÃO E CONSTRUÇÃO DO DOCX
# ==============================================================================

def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)

def set_cell_shading(cell, hex_color: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tc_pr.append(shd)

def set_cell_borders(cell, color: str = "17335C", size: str = "4") -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_borders = OxmlElement("w:tcBorders")
    for side in ("top", "left", "bottom", "right"):
        border = OxmlElement(f"w:{side}")
        border.set(qn("w:val"), "single")
        border.set(qn("w:sz"), size)
        border.set(qn("w:space"), "0")
        border.set(qn("w:color"), color)
        tc_borders.append(border)
    tc_pr.append(tc_borders)

def add_paragraph(doc, text, *, size=10.5, bold=False, italic=False, color=None,
                  align=WD_ALIGN_PARAGRAPH.LEFT, space_after=6, space_before=0):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(space_before)
    p.alignment = align
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    if color:
        run.font.color.rgb = color
    return p

def add_heading(doc, text, level=1):
    sizes = {1: 18, 2: 14, 3: 12}
    colors = {1: NAVY, 2: TEAL, 3: RED_MPT}
    p = add_paragraph(doc, text, size=sizes[level], bold=True,
                      color=colors[level], space_before=14, space_after=6)
    if level == 1:
        pPr = p._p.get_or_add_pPr()
        pBdr = OxmlElement("w:pBdr")
        bottom = OxmlElement("w:bottom")
        bottom.set(qn("w:val"), "single")
        bottom.set(qn("w:sz"), "8")
        bottom.set(qn("w:space"), "2")
        bottom.set(qn("w:color"), NAVY_HEX)
        pBdr.append(bottom)
        pPr.append(pBdr)
    return p

def add_bullet(doc, title, text):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(4)
    run_t = p.add_run(title + ": ")
    run_t.font.name = "Calibri"
    run_t.font.size = Pt(10.5)
    run_t.bold = True
    run_t.font.color.rgb = NAVY

    run_b = p.add_run(text)
    run_b.font.name = "Calibri"
    run_b.font.size = Pt(10.5)
    return p

def add_callout(doc, text, title="ALERTA EXECUTIVO DE ANÁLISE DO CODEBASE", color_hex="990000"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.cell(0, 0)
    cell.width = Cm(16.5)
    set_cell_shading(cell, "FDF2F2")
    set_cell_borders(cell, color=color_hex, size="12")
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    run_title = p.add_run(f"⚠️ {title}\n")
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(11)
    run_title.bold = True
    run_title.font.color.rgb = RED_MPT
    
    run_body = p.add_run(text)
    run_body.font.name = "Calibri"
    run_body.font.size = Pt(10)
    run_body.italic = True

def add_table(doc, rows, col_widths_cm=None, header_hex=NAVY_HEX):
    n_rows = len(rows)
    n_cols = len(rows[0])
    table = doc.add_table(rows=n_rows, cols=n_cols)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    for r_idx, row_data in enumerate(rows):
        for c_idx, value in enumerate(row_data):
            cell = table.cell(r_idx, c_idx)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            cell.text = ""
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.space_before = Pt(3)
            run = p.add_run(str(value))
            run.font.name = "Calibri"
            run.font.size = Pt(10)
            if r_idx == 0:
                set_cell_shading(cell, header_hex)
                run.font.color.rgb = WHITE
                run.bold = True
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                if r_idx % 2 == 0:
                    set_cell_shading(cell, GRAY_L_HEX)
            set_cell_borders(cell, color="D0D7DE", size="4")

    if col_widths_cm:
        for c_idx, width in enumerate(col_widths_cm):
            for row in table.rows:
                row.cells[c_idx].width = Cm(width)
    return table

def style_status_cells(table, status_column=2):
    colors = {
        "Implementado": GREEN_SOFT_HEX,
        "Atendido": GREEN_SOFT_HEX,
        "Parcial": YELLOW_SOFT_HEX,
        "Somente visual": YELLOW_SOFT_HEX,
        "BUG CRÍTICO": RED_SOFT_HEX,
        "BUG CRÍTICO LGPD": RED_SOFT_HEX,
        "Ausente": RED_SOFT_HEX,
        "Não atendido": RED_SOFT_HEX,
    }
    set_repeat_table_header(table.rows[0])
    for row in table.rows[1:]:
        value = row.cells[status_column].text.strip()
        if value in colors:
            set_cell_shading(row.cells[status_column], colors[value])

def add_page_number(section):
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("MPT • Canal de Denúncias • Relatório de Requisitos e Análise do Codebase  |  Página ")
    run.font.name = "Calibri"
    run.font.size = Pt(8.5)
    run.font.color.rgb = GRAY_D
    fld_char1 = OxmlElement("w:fldChar")
    fld_char1.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = "PAGE"
    fld_char2 = OxmlElement("w:fldChar")
    fld_char2.set(qn("w:fldCharType"), "end")
    run._r.extend([fld_char1, instr, fld_char2])

def main():
    doc = Document()
    doc.core_properties.title = "Relatório Executivo de Requisitos e Análise de Prontidão do Codebase V3"
    doc.core_properties.subject = "Consolidação de Requisitos, Diagnóstico de Bugs e Guia de Homologação"
    doc.core_properties.author = "Arquitetura de Software e Auditoria de Código MPT"
    doc.core_properties.keywords = "MPT, Diretoria, Codebase, Requisitos, Bugs, LGPD, Produção"

    section = doc.sections[0]
    section.top_margin = Cm(1.8)
    section.bottom_margin = Cm(1.8)
    section.left_margin = Cm(1.7)
    section.right_margin = Cm(1.7)
    add_page_number(section)

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10.5)

    # 1. CAPA INSTITUCIONAL
    logo = PROJECT / "public" / "logo-mpt.png"
    if logo.exists():
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_after = Pt(6)
        p_logo.add_run().add_picture(str(logo), width=Cm(3.5))

    add_paragraph(doc, "MINISTÉRIO PÚBLICO DO TRABALHO", size=10, bold=True,
                  color=RED_MPT, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
    add_paragraph(doc, "Procuradoria-Geral do Trabalho • Canal de Denúncias da Cidadania", size=10.5, color=GRAY_D,
                  align=WD_ALIGN_PARAGRAPH.CENTER, space_after=14)
    
    add_paragraph(doc, "RELATÓRIO EXECUTIVO DE REQUISITOS E ANÁLISE DO CODEBASE", size=20, bold=True,
                  color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
    add_paragraph(doc, "Diagnóstico Profundo de Requisitos Funcionais, Não Funcionais, Falhas Críticas e Matriz de Homologação (Versão V3)",
                  size=11.5, italic=True, color=TEAL, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=16)
    
    add_paragraph(doc, "Data: 26 de Julho de 2026  |  Base: Leitura Integral do Repositório cidadania-canal-denuncias",
                  size=9.5, color=GRAY_D, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=20)

    # 2. CONTROLE DO DOCUMENTO
    add_heading(doc, "Controle do Documento", 1)
    control_data = [
        ["Item", "Detalhamento Executivo V3"],
        ["Objetivo", "Apresentar o mapeamento atualizado e auditado dos requisitos do sistema, destacando inconsistências entre especificação e código, além de bugs bloqueadores identificados no repositório."],
        ["Escopo Analisado", "SPA Angular (src/app), BFF Express (server/), Middlewares, Antivírus ClamAV, Redis, E2E Playwright e Documentação."],
        ["Versão Documental", "Versão 3.0 — Incorpora auditoria profunda de código, diagnóstico de bugs LGPD/envio e validação de produção."],
        ["Público Alvo", "Diretoria do MPT, Gestores de Projeto, Analistas de Negócio, Auditoria de TI e DPO/LGPD."],
    ]
    add_table(doc, control_data, col_widths_cm=[4.2, 12.3])

    add_paragraph(doc, "", space_after=8)

    # 3. SUMÁRIO EXECUTIVO
    add_heading(doc, "1. Sumário Executivo", 1)
    add_paragraph(
        doc,
        "A auditoria aprofundada realizada no codebase do repositório 'cidadania-canal-denuncias' confirmou a existência de uma arquitetura moderna e coberta por testes automatizados. O núcleo do formulário wizard, a integração com o BFF Express e os filtros de segurança estão bem estruturados.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )
    add_paragraph(
        doc,
        "Contudo, o cruzamento rigoroso entre os documentos de requisitos e a implementação revelou 3 BUGS CRÍTICOS (que causam descarte de mídias e vazamento de dados pessoais em denúncias anônimas) e 5 lacunas operacionais que precisam ser sanadas antes da entrada em produção.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_callout(
        doc,
        "Atenção da Diretoria: Foram identificadas duas falhas graves no código atual:\n"
        "1. O relato gravado em áudio pelo cidadão é apagado durante a transmissão para o servidor devido a um erro de conversão JSON.\n"
        "2. Se o cidadão preencher dados pessoais e mudar para denúncia anônima, seus dados pessoais continuam sendo enviados ao MPT.\n\n"
        "Estes itens exigem correção imediata para resguardar o MPT juridicamente e operacionalmente.",
        title="DIAGNOSTICO DE RISCO DE SEGURANÇA E PRIVACIDADE"
    )

    # 4. DIAGNÓSTICO DOS BUGS CRÍTICOS IDENTIFICADOS NO CODEBASE
    add_heading(doc, "2. Diagnóstico dos Bugs Críticos Identificados no Repositório", 1)
    add_paragraph(
        doc,
        "A análise direta dos arquivos fonte (`.ts` e `.js`) revelou as seguintes falhas que não haviam sido mapeadas na documentação original:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    for b_id, title, desc, fix in CRITICAL_BUGS:
        add_bullet(doc, f"{b_id} — {title}", f"{desc}\nAção Recomendada: {fix}")

    doc.add_page_break()

    # 5. REQUISITOS FUNCIONAIS (RF) AUDITADOS
    add_heading(doc, "3. Matriz de Requisitos Funcionais (RF) Auditados", 1)
    add_paragraph(
        doc,
        "Rastreabilidade completa de cada funcionalidade declarada versus sua implementação real no código:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    rf_rows = [["ID", "Requisito Funcional", "Situação no Código", "Localização no Repositório", "Observação da Auditoria"]]
    rf_rows.extend(RF)
    rf_table = add_table(doc, rf_rows, col_widths_cm=[1.3, 5.8, 2.4, 3.5, 3.5])
    style_status_cells(rf_table, status_column=2)

    doc.add_page_break()

    # 6. REQUISITOS NÃO FUNCIONAIS (RNF) AUDITADOS
    add_heading(doc, "4. Matriz de Requisitos Não Funcionais (RNF) Auditados", 1)
    add_paragraph(
        doc,
        "Auditoria dos parâmetros de arquitetura, segurança, desempenho e infraestrutura:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    rnf_rows = [["ID", "Requisito Não Funcional", "Situação no Código", "Localização no Repositório", "Observação da Auditoria"]]
    rnf_rows.extend(RNF)
    rnf_table = add_table(doc, rnf_rows, col_widths_cm=[1.4, 5.7, 2.3, 3.4, 3.7])
    style_status_cells(rnf_table, status_column=2)

    # 7. QUESTIONÁRIO DE HOMOLOGAÇÃO PARA STAKEHOLDERS
    add_heading(doc, "5. Questionário Estruturado para Homologação", 1)
    add_paragraph(
        doc,
        "Perguntas objetivas agrupadas por área para direcionar os workshops de validação final com a Diretoria, Negócio e TI:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    for title, questions in QUESTION_GROUPS:
        add_heading(doc, title, 2)
        q_rows = [["Área Responsável", "Prioridade", "Pergunta / Decisão Requerida"]]
        for area, prio, q_text in questions:
            q_rows.append([area, prio, q_text])
        q_table = add_table(doc, q_rows, col_widths_cm=[3.2, 1.8, 11.5])
        set_repeat_table_header(q_table.rows[0])

    # 8. CONCLUSÃO E RECOMENDAÇÃO FINAL
    add_heading(doc, "6. Recomendação Executiva V3", 1)
    add_paragraph(
        doc,
        "O codebase do Canal de Denúncias apresenta excelente qualidade arquitetural, modularidade e cobertura de testes automatizados. Contudo, **a ida para produção deve ser suspensa até a correção dos 3 bugs críticos mapeados (áudio, vazamento de PII e tratamento do Redis em produção)**.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )
    add_paragraph(
        doc,
        "Estima-se um prazo de **2 a 3 semanas de desenvolvimento focado** para resolver os bugs bloqueadores, aplicar o plano de acessibilidade WCAG 2.1 AA e finalizar os workshops de homologação.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY, bold=True, color=NAVY
    )

    add_paragraph(doc, "", space_after=24)
    add_paragraph(doc, "________________________________________________________", align=WD_ALIGN_PARAGRAPH.CENTER, color=GRAY_D)
    add_paragraph(doc, "Equipe de Arquitetura de Software e Engenharia da Informação", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=10)
    add_paragraph(doc, "Ministério Público do Trabalho — PGT", align=WD_ALIGN_PARAGRAPH.CENTER, size=9.5, color=GRAY_D)

    doc.save(OUT_V3)
    doc.save(OUT_MAIN)
    print(f"Gerado com sucesso em V3: {OUT_V3}")
    print(f"Atualizado arquivo principal: {OUT_MAIN}")

if __name__ == "__main__":
    main()
