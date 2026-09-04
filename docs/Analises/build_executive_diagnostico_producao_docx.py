"""Gera o RELATORIO_EXECUTIVO_DIAGNOSTICO_FRONTEND_PRODUCAO.docx para a Diretoria do MPT."""
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
OUT = Path(__file__).parent / "RELATORIO_EXECUTIVO_DIAGNOSTICO_FRONTEND_PRODUCAO.docx"
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

def add_callout(doc, text, title="ALERTA EXECUTIVO DE PRODUÇÃO", color_hex="990000"):
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

def add_page_number(section):
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("MPT • Canal de Denúncias • Relatório Executivo de Diagnóstico de Produção  |  Página ")
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
    doc.core_properties.title = "Relatório Executivo de Diagnóstico de Prontidão para Produção"
    doc.core_properties.subject = "Análise de Gaps Críticos e Requisitos para Lançamento do Canal de Denúncias"
    doc.core_properties.author = "Equipe de Arquitetura de Software MPT"
    doc.core_properties.keywords = "MPT, Diretoria, Produção, Diagnóstico, Gaps, LGPD, Frontend"

    section = doc.sections[0]
    section.top_margin = Cm(1.8)
    section.bottom_margin = Cm(1.8)
    section.left_margin = Cm(1.7)
    section.right_margin = Cm(1.7)
    add_page_number(section)

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10.5)

    # 1. CAPA / CABEÇALHO INSTITUCIONAL
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
    
    add_paragraph(doc, "RELATÓRIO EXECUTIVO DE DIAGNÓSTICO DE PRODUÇÃO DO FRONTEND", size=20, bold=True,
                  color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
    add_paragraph(doc, "Análise de Requisitos Obrigatórios, Bugs Bloqueadores e Conformidade LGPD para Entrada em Operação Real",
                  size=11.5, italic=True, color=TEAL, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=16)
    
    add_paragraph(doc, "Data: 26 de Julho de 2026  |  Destinado à Diretoria Geral e Colegiado de TI do MPT",
                  size=9.5, color=GRAY_D, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=20)

    # 2. CONTROLE DO DOCUMENTO
    add_heading(doc, "Controle do Documento", 1)
    control_data = [
        ["Item", "Detalhamento Executivo"],
        ["Objetivo", "Informar à Diretoria o diagnóstico exato dos requisitos e falhas que impedem o lançamento imediato da aplicação em produção, estabelecendo um plano de ação para a liberação segura."],
        ["Escopo da Análise", "Código-fonte da Interface do Usuário (Frontend Angular), Mecanismo de Serialização Multipart, Tratamento de Privacidade (LGPD) e Resiliência em Conexões Móveis."],
        ["Resultado Global", "Sistema em avançado estágio de maturidade visual, porém com 2 BUGS BLOQUEADORES (P0) de transmissão de dados e privacidade que exigem correção prévia ao deploy."],
        ["Público Alvo", "Diretoria do MPT, Gestores de TI, Encarregado de Proteção de Dados (DPO/LGPD) e Equipe de Triagem."],
    ]
    add_table(doc, control_data, col_widths_cm=[4.2, 12.3])

    add_paragraph(doc, "", space_after=8)

    # 3. SUMÁRIO EXECUTIVO
    add_heading(doc, "1. Sumário Executivo", 1)
    add_paragraph(
        doc,
        "A análise minuciosa do código-fonte do Canal de Denúncias (SPA Angular) revelou que, para o sistema entrar em operação real (Produção), a implementação de melhorias visuais e de acessibilidade (WCAG 2.1 AA) **não é a única exigência**. Existem 2 bugs técnicos graves de transmissão e privacidade que precisam ser sanados de imediato para evitar prejuízos à sociedade e responsabilização jurídica do órgão.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_callout(
        doc,
        "O sistema atual apresenta dois riscos críticos de produção:\n"
        "1. Descarte silencioso dos relatos em áudio gravados pelo cidadão no formulário.\n"
        "2. Vazamento indevido de Nome, E-mail e Telefone caso o cidadão preencha seus dados e depois opte pela 'Denúncia Anônima'.\n\n"
        "A liberação em produção deve ser condicionada à correção prévia destes 2 itens bloqueadores.",
        title="ALERTA DE SEGURANÇA E PRIVACIDADE PARA A DIRETORIA"
    )

    doc.add_page_break()

    # 4. IMPEDITIVOS CRÍTICOS DE PRODUÇÃO (BUGS P0)
    add_heading(doc, "2. Impeditivos Críticos de Produção (Bugs Bloqueadores — P0)", 1)
    add_paragraph(
        doc,
        "Abaixo estão detalhadas as duas falhas técnicas graves identificadas pela arquitetura de software que impedem o deploy imediato:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_bullet(doc, "1. Perda Silenciosa de Áudio Gravado (Bug Técnico de Transmissão)",
               "No formulário, o cidadão pode gravar um depoimento em áudio. O sistema cria o arquivo na memória do celular/computador, porém, no momento de enviar ao servidor, o código tenta converter o áudio em texto comum (JSON). Isso faz com que o áudio seja transformado em um objeto nulo e DESCARTADO SILENCIOSAMENTE. O MPT recebe a denúncia sem o áudio anexado.")
    
    add_bullet(doc, "2. Transmissão Indevida de Dados Pessoais (Falha Grave de LGPD)",
               "Se o cidadão preencher seu Nome e E-mail no formulário e depois decidir marcar a opção 'Denúncia Anônima', o sistema não apaga os dados pessoais da memória. Ao clicar em enviar, o formulário transmite o Nome e o E-mail para o banco de dados do MPT, violando a promessa de anonimato total feita ao denunciante.")

    # 5. RESILIÊNCIA E EXPERIÊNCIA OPERACIONAL (P1)
    add_heading(doc, "3. Resiliência Operacional e Riscos em Dispositivos Móveis (P1)", 1)
    add_paragraph(
        doc,
        "Grande parte dos trabalhadores acessará o canal via celular e em redes móveis (3G/4G/5G). Três fragilidades de resiliência foram identificadas:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_bullet(doc, "a) Perda Total do Formulário ao Recarregar a Tela",
               "Caso o cidadão esteja no 5º passo do formulário e o celular receba uma chamada, perca sinal ou atualize a página (F5), todos os textos digitados e fotos anexadas são totalmente apagados. É indispensável implementar o salvamento temporário de rascunho (sessionStorage).")
    
    add_bullet(doc, "b) Travamento de Interface em Conexões Instáveis (Sem Timeout)",
               "O envio da denúncia não possui limite de tempo de resposta (timeout). Se a internet do cidadão oscilar durante o envio de fotos pesadas, o botão fica travado infinitamente em 'Enviando...' sem exibir mensagem de erro.")
    
    add_bullet(doc, "c) Elementos Visuais sem Ação na Interface ('Botões Mortos')",
               "O botão de Acessibilidade no topo, o reprodutor de Vídeo Explicativo e os cards de 'Ouvidoria' e 'Órgãos Públicos' na tela inicial são apenas figuras estáticas e não realizam nenhuma ação ao serem clicados pelo usuário.")

    # 6. MATRIZ INTEGRADA DE GAPS E ROADMAP PARA A DIRETORIA
    add_heading(doc, "4. Matriz Integrada de Prontidão para Produção (Roadmap)", 1)
    add_paragraph(
        doc,
        "Consolidação de todos os requisitos pendentes (técnicos, usabilidade, acessibilidade e governança) com seus respectivos níveis de criticidade:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    gap_table_data = [
        ["Classificação", "Requisito / Ponto de Atenção", "Impacto da Ausência em Produção", "Prazo Técnico"],
        ["🔴 BLOQUEADOR", "Corrigir envio do Blob de áudio no FormData", "Perda total do depoimento em áudio gravado", "3 dias"],
        ["🔴 BLOQUEADOR", "Reset de PII ao mudar para 'Denúncia Anônima'", "Vazamento de dados pessoais (Infração LGPD)", "2 dias"],
        ["🟡 ALTA PRIORIDADE", "Salvamento de rascunho (sessionStorage)", "Perda de dados ao recarregar a página no celular", "4 dias"],
        ["🟡 ALTA PRIORIDADE", "Timeout de 30s no envio (AbortController)", "Interface travada indefinidamente em rede ruim", "2 dias"],
        ["🟡 ALTA PRIORIDADE", "Bloqueio de avanço em etapas incompletas", "Recepção de denúncias sem relato ou sem local", "3 dias"],
        ["🟡 ALTA PRIORIDADE", "Acessibilidade por teclado e leitores de tela", "Incapacidade de uso por pessoas com deficiência", "4 dias"],
        ["🟡 ALTA PRIORIDADE", "Validação de CNPJ (Dígito Verificador)", "Cadastro de empresas fictícias ou inválidas", "2 dias"],
        ["🟢 MÉDIA PRIORIDADE", "Conectar ou ocultar botões/cards sem ação", "Frustração do usuário ao clicar em itens mortos", "2 dias"],
        ["🟢 MÉDIA PRIORIDADE", "Termos de Uso e Consentimento LGPD", "Falta de registro formal de ciência dos termos", "1 dia"],
    ]

    gap_table = add_table(doc, gap_table_data, col_widths_cm=[3.2, 5.8, 5.5, 2.0])
    set_repeat_table_header(gap_table.rows[0])

    for row in gap_table.rows[1:]:
        prio_cell = row.cells[0]
        text = prio_cell.text.strip()
        if "BLOQUEADOR" in text:
            set_cell_shading(prio_cell, RED_SOFT_HEX)
        elif "ALTA" in text:
            set_cell_shading(prio_cell, YELLOW_SOFT_HEX)
        elif "MÉDIA" in text:
            set_cell_shading(prio_cell, GREEN_SOFT_HEX)

    add_paragraph(doc, "", space_after=12)

    # 7. CONCLUÇÃO E RECOMENDAÇÃO FINAL
    add_heading(doc, "5. Conclusão e Recomendação Final", 1)
    add_paragraph(
        doc,
        "A equipe de arquitetura recomenda expressamente que a liberação do Canal de Denúncias em ambiente de produção ocorra **somente após a conclusão dos itens Bloqueadores (P0) e de Alta Prioridade (P1)**.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )
    add_paragraph(
        doc,
        "O esforço total estimado para sanar 100% dos pontos elencados nesta matriz é de aproximadamente **3 semanas de desenvolvimento**, garantindo que o Ministério Público do Trabalho entregue à sociedade uma plataforma confiável, juridicamente segura, totalmente acessível e resiliente.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY, bold=True, color=NAVY
    )

    add_paragraph(doc, "", space_after=24)
    add_paragraph(doc, "________________________________________________________", align=WD_ALIGN_PARAGRAPH.CENTER, color=GRAY_D)
    add_paragraph(doc, "Equipe de Arquitetura de Software e Segurança da Informação", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=10)
    add_paragraph(doc, "Ministério Público do Trabalho — PGT", align=WD_ALIGN_PARAGRAPH.CENTER, size=9.5, color=GRAY_D)

    doc.save(OUT)
    print(f"Relatório executivo de diagnóstico em DOCX gerado com sucesso em: {OUT}")

if __name__ == "__main__":
    main()
