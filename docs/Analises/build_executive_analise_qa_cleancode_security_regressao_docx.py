"""Gera o RELATORIO_EXECUTIVO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.docx para a Diretoria do MPT."""
from pathlib import Path
from datetime import date
from docx import Document
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
PROJECT = ROOT / "cidadania-canal-denuncias"
OUT = Path(__file__).parent / "RELATORIO_EXECUTIVO_ANALISE_QA_CLEANCODE_SECURITY_REGRESSAO.docx"
REPORT_DATE = date(2026, 7, 31)

# Paleta de Cores MPT e Executiva
NAVY = RGBColor(0x17, 0x33, 0x5C)
NAVY_HEX = "17335C"
RED_MPT = RGBColor(0x99, 0x00, 0x00)
RED_MPT_HEX = "990000"
TEAL = RGBColor(0x0C, 0x6E, 0x64)
GOLD = RGBColor(0xBF, 0x95, 0x3F)
GRAY_D = RGBColor(0x5A, 0x5A, 0x5A)
GREEN = RGBColor(0x2E, 0x7D, 0x32)
GRAY_L_HEX = "F4F6F9"
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

RED_SOFT_HEX = "F4CCCC"
YELLOW_SOFT_HEX = "FFF2CC"
GREEN_SOFT_HEX = "E2F0D9"
BLUE_SOFT_HEX = "D6E4F0"


def set_cell_shading(cell, hex_color: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tc_pr.append(shd)


def set_cell_borders(cell, color: str = "D0D7DE", size: str = "4") -> None:
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


def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


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


def add_bullet(doc, title, text, color=NAVY):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(4)
    run_t = p.add_run(title + ": ")
    run_t.font.name = "Calibri"
    run_t.font.size = Pt(10.5)
    run_t.bold = True
    run_t.font.color.rgb = color
    run_b = p.add_run(text)
    run_b.font.name = "Calibri"
    run_b.font.size = Pt(10.5)
    return p


def add_callout(doc, text, title="⚠️ ALERTA EXECUTIVO", color_hex="990000"):
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
    run_title = p.add_run(f"{title}\n")
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


def style_priority_column(table, col_idx=0):
    """Colore a coluna de prioridade baseado no texto."""
    for row in table.rows[1:]:
        cell = row.cells[col_idx]
        text = cell.text.strip().upper()
        if "BLOQUEADOR" in text or "P0" in text or "CRÍTICO" in text:
            set_cell_shading(cell, RED_SOFT_HEX)
        elif "ALTA" in text or "P1" in text or "ALTO" in text:
            set_cell_shading(cell, YELLOW_SOFT_HEX)
        elif "MÉDIA" in text or "P2" in text or "MÉDIO" in text:
            set_cell_shading(cell, GREEN_SOFT_HEX)
        elif "BAIXO" in text or "P3" in text:
            set_cell_shading(cell, BLUE_SOFT_HEX)


def add_page_number(section):
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("MPT • Canal de Denúncias • Relatório Executivo de Análise QA, Clean Code, Segurança e Regressão  |  Página ")
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
    doc.core_properties.title = "Relatório Executivo de Análise: QA, Clean Code, Segurança e Testes de Regressão"
    doc.core_properties.subject = "Análise Profunda do Codebase Canal de Denúncias — MPT"
    doc.core_properties.author = "Equipe de Arquitetura de Software MPT"
    doc.core_properties.keywords = "MPT, QA, Clean Code, Segurança, Testes, Regressão, LGPD"

    section = doc.sections[0]
    section.top_margin = Cm(1.8)
    section.bottom_margin = Cm(1.8)
    section.left_margin = Cm(1.7)
    section.right_margin = Cm(1.7)
    add_page_number(section)

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10.5)

    # ========================================
    # 1. CAPA / CABEÇALHO INSTITUCIONAL
    # ========================================
    logo = PROJECT / "public" / "logo-mpt.png"
    if logo.exists():
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_after = Pt(6)
        p_logo.add_run().add_picture(str(logo), width=Cm(3.5))

    add_paragraph(doc, "MINISTÉRIO PÚBLICO DO TRABALHO", size=10, bold=True,
                  color=RED_MPT, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
    add_paragraph(doc, "Procuradoria Regional do Trabalho — PRT17-ES • Canal de Denúncias da Cidadania", size=10.5, color=GRAY_D,
                  align=WD_ALIGN_PARAGRAPH.CENTER, space_after=14)

    add_paragraph(doc, "RELATÓRIO EXECUTIVO DE ANÁLISE PROFUNDA DO CODEBASE", size=20, bold=True,
                  color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
    add_paragraph(doc, "Quality Assurance • Clean Code • Segurança • Testes de Regressão",
                  size=13, italic=True, color=TEAL, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=16)

    add_paragraph(doc, f"Data: 31 de Julho de 2026  |  Destinado à Diretoria Geral e Colegiado de TI do MPT",
                  size=9.5, color=GRAY_D, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=20)

    # ========================================
    # 2. CONTROLE DO DOCUMENTO
    # ========================================
    add_heading(doc, "Controle do Documento", 1)
    control_data = [
        ["Item", "Detalhamento Executivo"],
        ["Objetivo", "Apresentar à Diretoria uma análise profunda e exaustiva do codebase do Canal de Denúncias, com sugestões concretas de melhoria em 4 eixos: QA, Clean Code, Segurança e Testes de Regressão."],
        ["Escopo", "Frontend Angular 22 (SPA com Signals), Backend Node.js/Express (BFF), Testes Vitest e Playwright E2E, Pipeline CI/CD GitHub Actions, Design System CSS, Configuração de Segurança."],
        ["Resultado Global", "47 pontos de melhoria identificados: 7 Críticos (P0), 16 Alta Prioridade (P1), 16 Média (P2) e 8 Baixa (P3). Correção dos P0 é pré-requisito para deploy em produção."],
        ["Público", "Diretoria do MPT, Gestores de TI, DPO/LGPD, Equipe de Desenvolvimento e QA."],
    ]
    add_table(doc, control_data, col_widths_cm=[3.5, 13.0])
    add_paragraph(doc, "", space_after=8)

    # ========================================
    # 3. SUMÁRIO EXECUTIVO
    # ========================================
    add_heading(doc, "1. Sumário Executivo", 1)
    add_paragraph(
        doc,
        "A análise completa do codebase do Canal de Denúncias (Frontend Angular 22 + Backend Express BFF + Testes Playwright) "
        "revelou 47 pontos de melhoria distribuídos em 4 eixos. A aplicação possui uma base sólida de código com boas práticas em "
        "várias áreas — injeção de dependência, Signals do Angular, ClamAV antimalware, rate limiting com Redis — porém apresenta "
        "7 achados críticos que devem ser corrigidos antes de qualquer deploy em produção.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_callout(
        doc,
        "Os 3 riscos mais graves identificados:\n"
        "1. VAZAMENTO DE DADOS PESSOAIS em denúncias anônimas — nome, email e telefone persistem quando cidadão muda de 'identificado' para 'anônimo'.\n"
        "2. DESCARTE SILENCIOSO DO ÁUDIO GRAVADO — Blob de áudio é perdido na serialização JSON sem aviso ao cidadão.\n"
        "3. AUSÊNCIA DE VALIDAÇÃO NO FRONTEND — formulário permite avançar sem preencher campos obrigatórios.\n\n"
        "A liberação em produção deve ser condicionada à correção prévia destes itens.",
        title="⚠️ ALERTA CRÍTICO PARA A DIRETORIA"
    )

    add_paragraph(doc, "", space_after=6)

    # Tabela resumo quantitativo
    add_heading(doc, "Resumo Quantitativo por Eixo", 2)
    summary = [
        ["Eixo de Análise", "Crítico (P0)", "Alto (P1)", "Médio (P2)", "Baixo (P3)", "Total"],
        ["Quality Assurance (QA)", "3", "5", "4", "2", "14"],
        ["Clean Code", "0", "3", "6", "3", "12"],
        ["Segurança", "2", "4", "3", "2", "11"],
        ["Testes de Regressão", "2", "4", "3", "1", "10"],
        ["TOTAL", "7", "16", "16", "8", "47"],
    ]
    summary_table = add_table(doc, summary, col_widths_cm=[4.5, 2.2, 2.2, 2.2, 2.2, 1.7])
    set_repeat_table_header(summary_table.rows[0])
    for cell in summary_table.rows[-1].cells:
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.bold = True

    add_paragraph(doc, "", space_after=8)

    # Volumetria e Linhas de Código (SLOC)
    add_heading(doc, "Volumetria e Métricas Quantitativas de Código (SLOC)", 2)
    sloc_data = [
        ["Linguagem / Módulo", "Arquivos", "Linhas Totais", "Linhas de Código (SLOC)", "Comentários", "Em Branco"],
        ["TypeScript (Frontend SPA & Specs)", "20", "1.450", "1.245", "28", "177"],
        ["JavaScript / ESM (Backend BFF & Specs)", "19", "1.486", "1.196", "88", "202"],
        ["CSS / SCSS (Design System)", "11", "1.860", "1.477", "106", "277"],
        ["HTML (Templates Angular)", "10", "782", "697", "27", "58"],
        ["JSON (Configurações e Tooling)", "7", "302", "302", "0", "0"],
        ["TOTAL DO CODEBASE", "67", "5.875", "4.917", "249", "714"],
    ]
    sloc_table = add_table(doc, sloc_data, col_widths_cm=[5.0, 2.0, 2.5, 3.5, 2.0, 1.8])
    set_repeat_table_header(sloc_table.rows[0])
    for cell in sloc_table.rows[-1].cells:
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.bold = True

    add_paragraph(doc, "", space_after=8)

    # Cobertura de Testes e Auditoria de Segurança
    add_heading(doc, "Suítes de Testes e Auditoria de Segurança (npm audit)", 2)
    test_sec_data = [
        ["Ambiente / Camada", "Ferramenta", "Arquivos / Dep.", "Testes / Cobertura", "Vulnerabilidades Altas", "Status de Produção"],
        ["Backend Express BFF", "Vitest", "8 arquivos", "30 testes (100% pass)", "0 em produção", "Aprovado (30/30)"],
        ["Frontend Angular SPA", "Vitest", "2 arquivos", "8 testes", "0 em produção", "Ajustar runner"],
        ["Interface E2E / Audit", "Playwright", "2 arquivos", "5 cenários", "0 em produção", "Execução local OK"],
        ["Segurança Dep. Frontend", "npm audit", "653 dependências", "0 prod / 6 dev", "2 (dev tools)", "Produção Limpa"],
        ["Segurança Dep. Backend", "npm audit", "335 dependências", "0 prod / 5 dev", "5 (dev tools)", "Produção Limpa"],
    ]
    test_sec_table = add_table(doc, test_sec_data, col_widths_cm=[4.0, 2.2, 2.8, 3.2, 2.5, 2.3])
    set_repeat_table_header(test_sec_table.rows[0])

    doc.add_page_break()

    # ========================================
    # 4. ACHADOS DE QA (QUALITY ASSURANCE)
    # ========================================
    add_heading(doc, "2. Quality Assurance (QA) — 14 Achados", 1)
    add_paragraph(
        doc,
        "A análise de QA focou em validação de dados, experiência do usuário, robustez e comportamento funcional da aplicação.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_heading(doc, "2.1 Achados Críticos (P0)", 2)
    qa_critical = [
        ["ID", "Camada", "Achado", "Arquivo", "Impacto"],
        ["QA-01", "Frontend", "Sem validação frontend antes de avançar etapas — formulário permite pular qualquer step sem preenchimento", "step-*.ts (todos)", "Denúncias incompletas chegam ao backend"],
        ["QA-02", "Frontend", "Dados pessoais não são limpos ao trocar para 'Anônimo' — PII persiste no objeto Complaint", "step-identificacao.ts", "Violação da promessa de anonimato / LGPD"],
        ["QA-03", "Frontend", "Áudio gravado (Blob) descartado na serialização JSON — cidadão perde evidência oral sem aviso", "complaint-api.client.ts", "Perda silenciosa de evidência crucial"],
    ]
    t = add_table(doc, qa_critical, col_widths_cm=[1.2, 2.3, 5.0, 3.5, 4.5])
    set_repeat_table_header(t.rows[0])
    style_priority_column(t, 0)

    add_paragraph(doc, "", space_after=4)
    add_heading(doc, "2.2 Achados de Alta Prioridade (P1)", 2)
    qa_high = [
        ["ID", "Camada", "Achado", "Sugestão de Melhoria"],
        ["QA-04", "Frontend", "Sem persistência de rascunho — recarga apaga todo o progresso", "Implementar auto-save em sessionStorage"],
        ["QA-05", "Frontend", "Sem timeout no envio HTTP (fetch) — botão trava indefinidamente", "Adicionar AbortController com timeout de 30s"],
        ["QA-06", "Frontend", "Botões/cards mortos (Acessibilidade, Vídeo, Ouvidoria)", "Implementar funcionalidade ou desabilitar visualmente"],
        ["QA-07", "Middleware", "upload.any() aceita campos arbitrários de arquivo", "Usar upload.array() ou upload.fields()"],
        ["QA-08", "Frontend", "Stepper permite pular para qualquer etapa não completada", "Restringir navegação a steps já completados"],
    ]
    t = add_table(doc, qa_high, col_widths_cm=[1.2, 2.3, 6.0, 7.0])
    set_repeat_table_header(t.rows[0])

    add_paragraph(doc, "", space_after=4)
    add_heading(doc, "2.3 Achados de Média e Baixa Prioridade (P2/P3)", 2)
    qa_medium = [
        ["ID", "Prioridade", "Camada", "Achado", "Sugestão"],
        ["QA-09", "P2 — Médio", "Frontend", "Sem validação de dígito verificador do CNPJ", "Implementar algoritmo de validação"],
        ["QA-10", "P2 — Médio", "Frontend", "Sem validação de formato de email", "Adicionar regex ou Validators.email"],
        ["QA-11", "P2 — Médio", "Frontend", "Sem validação de formato de telefone", "Adicionar máscara de telefone brasileiro"],
        ["QA-12", "P2 — Médio", "Frontend", "Inputs sem <label> associado (acessibilidade)", "Adicionar <label for='id'>"],
        ["QA-13", "P3 — Baixo", "Frontend", "Sem indicação visual de campos obrigatórios", "Padronizar asterisco/badge obrigatório"],
        ["QA-14", "P3 — Baixo", "Frontend", "Sem feedback visual de progresso de upload", "Adicionar barra de progresso"],
    ]
    t = add_table(doc, qa_medium, col_widths_cm=[1.2, 2.2, 2.3, 5.0, 5.8])
    set_repeat_table_header(t.rows[0])
    style_priority_column(t, 1)

    doc.add_page_break()

    # ========================================
    # 5. ACHADOS DE CLEAN CODE
    # ========================================
    add_heading(doc, "3. Clean Code — 12 Achados", 1)
    add_paragraph(
        doc,
        "A análise de Clean Code avaliou legibilidade, manutenibilidade, consistência de padrões e eliminação de code smells.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    cc_all = [
        ["ID", "Prioridade", "Camada", "Achado", "Sugestão de Refatoração"],
        ["CC-01", "P1 — Alto", "Frontend", "Números mágicos (0-6) para steps hardcoded em múltiplos arquivos", "Criar enum ComplaintStep"],
        ["CC-02", "P1 — Alto", "Frontend", "Padrão de state management inconsistente entre componentes", "Padronizar: signals locais com save ou binding direto"],
        ["CC-03", "P1 — Alto", "Backend", "Função parsePositiveInteger duplicada em 3 arquivos do backend", "Extrair para utils/parse.js compartilhado"],
        ["CC-04", "P2 — Médio", "Frontend", "Uso excessivo de !important no CSS (12+ ocorrências)", "Refatorar hierarquia de seletores CSS"],
        ["CC-05", "P2 — Médio", "Frontend", "Typo: funcoesSentores → funcoesSetores", "Corrigir nome da propriedade"],
        ["CC-06", "P2 — Médio", "Frontend/Backend", "Mix de line endings (CRLF/LF) nos arquivos", "Configurar .gitattributes com text=auto eol=lf"],
        ["CC-07", "P2 — Médio", "Frontend", "Rotas Angular vazias (routes: Routes = [])", "Remover provideRouter ou implementar routing"],
        ["CC-08", "P2 — Médio", "Frontend", "Sem provideHttpClient() — usa fetch() nativo em vez do Angular HttpClient", "Migrar para HttpClient ou documentar decisão"],
        ["CC-09", "P2 — Médio", "Frontend", "Dependências não utilizadas (multer, opencode-ai, bootstrap) no frontend", "Remover do package.json"],
        ["CC-10", "P3 — Baixo", "Frontend", "CSS global monolítico com 1320 linhas", "Modularizar em arquivos separados"],
        ["CC-11", "P3 — Baixo", "Backend", "Sem JSDoc nos services e controllers do backend", "Adicionar documentação padronizada"],
        ["CC-12", "P3 — Baixo", "Backend", "express-validator instalado mas não utilizado", "Remover ou migrar validação para a lib"],
    ]
    t = add_table(doc, cc_all, col_widths_cm=[1.2, 2.2, 2.5, 5.1, 5.5])
    set_repeat_table_header(t.rows[0])
    style_priority_column(t, 1)

    doc.add_page_break()

    # ========================================
    # 6. ACHADOS DE SEGURANÇA
    # ========================================
    add_heading(doc, "4. Segurança — 11 Achados", 1)
    add_paragraph(
        doc,
        "A análise de segurança avaliou proteção de dados pessoais (LGPD), robustez contra ataques (XSS, upload malicioso, DoS), "
        "e conformidade com boas práticas de segurança web.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_heading(doc, "4.1 Achados Críticos (P0)", 2)
    sec_critical = [
        ["ID", "Camada", "Achado", "Impacto", "Sugestão de Correção"],
        ["SEC-01", "Frontend/Backend", "Vazamento de PII em denúncia anônima — nome, email, telefone transmitidos mesmo com tipo_identificacao = 'anonimo'", "Violação LGPD — responsabilidade jurídica", "Limpar PII no frontend ao mudar para anônimo E sanitizar no backend"],
        ["SEC-02", "Backend", "Geração de protocolo com Math.random() — não-criptográfico e previsível", "Protocolo pode ser adivinhado por atacante", "Migrar para crypto.randomBytes() ou crypto.randomUUID()"],
    ]
    t = add_table(doc, sec_critical, col_widths_cm=[1.2, 2.5, 5.0, 3.5, 4.3])
    set_repeat_table_header(t.rows[0])

    add_paragraph(doc, "", space_after=4)
    add_heading(doc, "4.2 Achados de Alta Prioridade (P1)", 2)
    sec_high = [
        ["ID", "Camada", "Achado", "Sugestão"],
        ["SEC-03", "Middleware", "upload.any() aceita upload em campos arbitrários — atacante pode enviar em campos inesperados", "Restringir para upload.array() ou upload.fields()"],
        ["SEC-04", "Middleware", "Verificação de MIME type apenas pelo header HTTP (sem magic bytes) — bypass possível", "Adicionar verificação com library file-type"],
        ["SEC-05", "Middleware", "Sem Content Security Policy (CSP) — Helmet sem diretiva CSP explícita", "Configurar CSP com diretivas para fonts e scripts"],
        ["SEC-06", "Backend", "mpt-api.client.js lê process.env diretamente em vez de injeção de dependência", "Passar env como parâmetro como nos outros módulos"],
    ]
    t = add_table(doc, sec_high, col_widths_cm=[1.2, 2.3, 6.0, 7.0])
    set_repeat_table_header(t.rows[0])

    add_paragraph(doc, "", space_after=4)
    add_heading(doc, "4.3 Achados de Média e Baixa Prioridade (P2/P3)", 2)
    sec_medium = [
        ["ID", "Prioridade", "Camada", "Achado", "Sugestão"],
        ["SEC-07", "P2 — Médio", "Middleware", "Sem rate limiting no endpoint informacional /api/denuncias/info", "Aplicar rate limit permissivo"],
        ["SEC-08", "P2 — Médio", "Backend", "Sem sanitização de inputs de texto livre contra XSS stored", "Sanitizar no backend antes de armazenar"],
        ["SEC-09", "P2 — Médio", "Middleware", "Handler 404 retorna req.originalUrl — information disclosure", "Remover path da resposta em produção"],
        ["SEC-10", "P3 — Baixo", "Frontend", "Sem termos de uso / consentimento LGPD antes do envio", "Adicionar aceite de termos obrigatório"],
        ["SEC-11", "P3 — Baixo", "Middleware", "Sem cabeçalho X-Request-ID para rastreabilidade", "Gerar e propagar identificador único"],
    ]
    t = add_table(doc, sec_medium, col_widths_cm=[1.2, 2.2, 2.3, 5.0, 5.8])
    set_repeat_table_header(t.rows[0])
    style_priority_column(t, 1)

    doc.add_page_break()

    # ========================================
    # 7. ACHADOS DE TESTES DE REGRESSÃO
    # ========================================
    add_heading(doc, "5. Testes de Regressão — 10 Achados", 1)
    add_paragraph(
        doc,
        "A análise avaliou a cobertura e eficácia dos testes existentes (Vitest unitários, Playwright E2E) e a integração com o pipeline CI/CD.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_heading(doc, "5.1 Achados Críticos (P0)", 2)
    reg_critical = [
        ["ID", "Camada", "Achado", "Impacto", "Sugestão"],
        ["REG-01", "CI/CD", "CI/CD não executa testes E2E — Playwright não roda no pipeline GitHub Actions", "Regressões visuais e funcionais passam despercebidas", "Adicionar job de E2E com upload de artefatos"],
        ["REG-02", "E2E / Testes", "ui-audit.spec.ts nunca falha o pipeline — achados CRÍTICO são apenas logados", "Bugs críticos documentados mas não bloqueiam merge", "Adicionar expect(criticalFindings).toEqual([])"],
    ]
    t = add_table(doc, reg_critical, col_widths_cm=[1.2, 2.3, 4.5, 4.0, 4.5])
    set_repeat_table_header(t.rows[0])

    add_paragraph(doc, "", space_after=4)
    add_heading(doc, "5.2 Todos os Achados de Regressão", 2)
    reg_all = [
        ["ID", "Prioridade", "Camada", "Achado", "Sugestão"],
        ["REG-01", "P0 — Crítico", "CI/CD", "CI não executa testes E2E (Playwright)", "Adicionar job E2E no GitHub Actions"],
        ["REG-02", "P0 — Crítico", "E2E / Testes", "ui-audit.spec.ts não falha em achados críticos", "Tornar assertivo com expect()"],
        ["REG-03", "P1 — Alto", "E2E / Testes", "Sem teste E2E para fluxo anônimo", "Criar teste completeAnonymousForm()"],
        ["REG-04", "P1 — Alto", "Frontend", "0% cobertura de componentes Angular (sem .spec.ts)", "Criar testes para os 8 componentes"],
        ["REG-05", "P1 — Alto", "E2E / Testes", "Axe acessibilidade apenas na tela inicial", "Executar Axe em cada step"],
        ["REG-06", "P1 — Alto", "CI/CD", "Backend tests não rodam no CI (job audit-server)", "Adicionar npm run test ao job"],
        ["REG-07", "P2 — Médio", "E2E / Testes", "Zero integração real frontend↔backend nos E2E", "Criar teste com backend real local"],
        ["REG-08", "P2 — Médio", "Backend", "Sem teste de upload oversized (>20MB)", "Adicionar teste de limite de tamanho"],
        ["REG-09", "P2 — Médio", "Frontend", "Sem teste de timeout/rede lenta no frontend", "Simular delay com page.route()"],
        ["REG-10", "P3 — Baixo", "E2E / Testes", "ui-audit escreve fora do repositório em CI", "Usar path.resolve('./playwright-report/Analises')"],
    ]
    t = add_table(doc, reg_all, col_widths_cm=[1.2, 2.2, 2.3, 5.0, 5.8])
    set_repeat_table_header(t.rows[0])
    style_priority_column(t, 1)
    set_repeat_table_header(t.rows[0])
    style_priority_column(t, 1)

    doc.add_page_break()

    # ========================================
    # 8. MATRIZ CONSOLIDADA E ROADMAP
    # ========================================
    add_heading(doc, "6. Matriz Consolidada de Priorização e Roadmap", 1)
    add_paragraph(
        doc,
        "Consolidação de todos os 47 achados organizados por nível de criticidade com estimativa de esforço:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    roadmap = [
        ["Prioridade", "Quantidade", "Eixos Afetados", "Esforço Estimado", "Recomendação"],
        ["🔴 P0 — BLOQUEADOR", "7 itens", "QA (3), Segurança (2), Regressão (2)", "~2 semanas", "CORRIGIR ANTES DO DEPLOY"],
        ["🟡 P1 — ALTA", "16 itens", "QA (5), Clean Code (3), Segurança (4), Regressão (4)", "~3 semanas", "Sprint imediata"],
        ["🟢 P2 — MÉDIA", "16 itens", "QA (4), Clean Code (6), Segurança (3), Regressão (3)", "~2 semanas", "Próximas 2 sprints"],
        ["⚪ P3 — BAIXA", "8 itens", "QA (2), Clean Code (3), Segurança (2), Regressão (1)", "~1 semana", "Backlog contínuo"],
    ]
    t = add_table(doc, roadmap, col_widths_cm=[3.0, 1.8, 5.5, 2.5, 3.7])
    set_repeat_table_header(t.rows[0])
    style_priority_column(t, 0)

    add_paragraph(doc, "", space_after=12)

    # ========================================
    # 9. AÇÕES RECOMENDADAS
    # ========================================
    add_heading(doc, "7. Plano de Ação Recomendado", 1)

    add_heading(doc, "Semana 1-2: Ações Imediatas (P0)", 2)
    add_bullet(doc, "1", "Corrigir vazamento de PII em denúncias anônimas (SEC-01/QA-02) — limpar campos no frontend e sanitizar no backend")
    add_bullet(doc, "2", "Corrigir serialização de áudio Blob no FormData (QA-03) — enviar como arquivo binário separado")
    add_bullet(doc, "3", "Implementar validação frontend em todos os steps (QA-01) — impedir avanço sem campos obrigatórios")
    add_bullet(doc, "4", "Migrar geração de protocolo para crypto.randomBytes() (SEC-02)")
    add_bullet(doc, "5", "Adicionar testes E2E e backend ao pipeline CI/CD (REG-01, REG-06)")
    add_bullet(doc, "6", "Tornar ui-audit.spec.ts assertivo em achados críticos (REG-02)")

    add_heading(doc, "Semana 3-5: Curto Prazo (P1)", 2)
    add_bullet(doc, "7", "Implementar persistência de rascunho via sessionStorage (QA-04)")
    add_bullet(doc, "8", "Adicionar timeout com AbortController no envio frontend (QA-05)")
    add_bullet(doc, "9", "Restringir upload.any() para campos específicos (SEC-03/QA-07)")
    add_bullet(doc, "10", "Adicionar verificação de magic bytes nos uploads (SEC-04)")
    add_bullet(doc, "11", "Criar testes unitários para todos os 8 componentes Angular (REG-04)")
    add_bullet(doc, "12", "Criar testes E2E para fluxo anônimo (REG-03)")

    add_heading(doc, "Semana 6-8: Médio Prazo (P2)", 2)
    add_bullet(doc, "13", "Refatorar números mágicos para enums (CC-01)")
    add_bullet(doc, "14", "Extrair funções duplicadas para módulos utilitários (CC-03)")
    add_bullet(doc, "15", "Adicionar validação de CNPJ, email e telefone (QA-09/10/11)")
    add_bullet(doc, "16", "Configurar CSP no Helmet (SEC-05)")
    add_bullet(doc, "17", "Criar teste E2E com integração real frontend↔backend (REG-07)")
    add_bullet(doc, "18", "Modularizar CSS global (CC-10)")

    add_paragraph(doc, "", space_after=12)

    # ========================================
    # 10. CONCLUSÃO
    # ========================================
    add_heading(doc, "8. Conclusão e Recomendação Final", 1)
    add_paragraph(
        doc,
        "O Canal de Denúncias do MPT possui uma base sólida de código com boas práticas em várias áreas: "
        "injeção de dependência no backend, uso de Angular Signals, design system CSS customizado, "
        "integração com ClamAV antimalware, e rate limiting distribuído com Redis.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )
    add_paragraph(
        doc,
        "No entanto, os 7 achados críticos (P0) — especialmente o vazamento de dados pessoais em denúncias anônimas, "
        "o descarte silencioso de áudio e a ausência de validação no frontend — representam riscos concretos à privacidade "
        "dos cidadãos e à confiabilidade operacional do sistema.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )
    add_paragraph(
        doc,
        "RECOMENDAÇÃO: Corrigir todos os itens P0 e habilitar E2E no CI antes de qualquer deploy em ambiente de produção. "
        "O esforço total estimado para sanar 100% dos pontos elencados neste relatório é de aproximadamente 8 semanas de desenvolvimento.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY, bold=True, color=NAVY
    )

    add_paragraph(doc, "", space_after=24)
    add_paragraph(doc, "________________________________________________________", align=WD_ALIGN_PARAGRAPH.CENTER, color=GRAY_D)
    add_paragraph(doc, "Equipe de Arquitetura de Software e Segurança da Informação", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=10)
    add_paragraph(doc, "Ministério Público do Trabalho — PRT17-ES", align=WD_ALIGN_PARAGRAPH.CENTER, size=9.5, color=GRAY_D)

    doc.save(OUT)
    print(f"Relatório executivo DOCX gerado com sucesso em: {OUT}")


if __name__ == "__main__":
    main()
