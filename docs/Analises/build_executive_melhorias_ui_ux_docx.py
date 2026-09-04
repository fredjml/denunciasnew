"""Gera o RELATORIO_EXECUTIVO_MELHORIAS_UI_UX_ACESSABILIDADE.docx para a Diretoria do MPT."""
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
OUT = Path(__file__).parent / "RELATORIO_EXECUTIVO_MELHORIAS_UI_UX_ACESSABILIDADE.docx"
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

def add_callout(doc, text, title="NOTA EXECUTIVA", color_hex="17335C"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.cell(0, 0)
    cell.width = Cm(16.5)
    set_cell_shading(cell, "F0F4F8")
    set_cell_borders(cell, color=color_hex, size="12")
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    run_title = p.add_run(f"📌 {title}\n")
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(11)
    run_title.bold = True
    run_title.font.color.rgb = NAVY
    
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
    run = p.add_run("MPT • Canal de Denúncias • Relatório Executivo de UI/UX e Acessibilidade  |  Página ")
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
    doc.core_properties.title = "Relatório Executivo de Melhorias de UI/UX e Acessibilidade"
    doc.core_properties.subject = "Propostas para Diretoria do MPT — Usabilidade, Acessibilidade e Integridade"
    doc.core_properties.author = "Equipe de Arquitetura de Software e UX MPT"
    doc.core_properties.keywords = "MPT, Diretoria, UI/UX, Acessibilidade, WCAG 2.1 AA, Relatório Executivo"

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
    
    add_paragraph(doc, "RELATÓRIO EXECUTIVO DE MELHORIAS DE UI/UX E ACESSABILIDADE", size=22, bold=True,
                  color=NAVY, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
    add_paragraph(doc, "Plano Estratégico de Inclusão Digital (WCAG 2.1 AA), Usabilidade e Integridade de Dados",
                  size=12, italic=True, color=TEAL, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=16)
    
    add_paragraph(doc, "Data: 26 de Julho de 2026  |  Destinado à Diretoria e Gestores de TI do MPT",
                  size=9.5, color=GRAY_D, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=20)

    # 2. CONTROLE DO DOCUMENTO
    add_heading(doc, "Controle do Documento", 1)
    control_data = [
        ["Item", "Detalhamento Executivo"],
        ["Objetivo", "Apresentar à Diretoria as melhorias recomendadas para transformar o Canal de Denúncias numa plataforma 100% inclusiva, segura e à prova de erros de preenchimento."],
        ["Base Diagnóstica", "Análise de usabilidade, simulações com leitores de tela e testes automatizados de acessibilidade web (WCAG 2.1 Nível AA)."],
        ["Escopo de Aplicação", "Interface do Cidadão (Frontend Angular), Formulários em Etapas (Wizard) e Conexão com o Servidor de Validação (BFF)."],
        ["Público Alvo", "Diretores, Gestores do Projeto, Analistas de Negócio e Equipe de Comunicação/Acessibilidade."],
    ]
    add_table(doc, control_data, col_widths_cm=[4.2, 12.3])

    add_paragraph(doc, "", space_after=8)

    # 3. SUMÁRIO EXECUTIVO
    add_heading(doc, "1. Sumário Executivo e Visão Geral", 1)
    add_paragraph(
        doc,
        "O Canal de Denúncias do Ministério Público do Trabalho (MPT) é a principal porta de entrada digital para que cidadãos e trabalhadores formalizem queixas sobre irregularidades trabalhistas. Para cumprir com excelência essa missão institucional, a plataforma precisa aliar alta simplicidade visual a uma total acessibilidade inclusiva.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )
    add_paragraph(
        doc,
        "Este relatório executivo sintetiza o plano estratégico de aprimoramento da interface. O plano visa solucionar pontos onde o usuário atualmente pode cometer equívocos de preenchimento (como avançar sem dados essenciais) e garantir que pessoas com deficiência (visual, motora ou cognitiva) consigam navegar e enviar denúncias com total autonomia.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_callout(
        doc,
        "A implementação destas melhorias garantirá 100% de conformidade com as diretrizes governamentais de acessibilidade (eMAG e WCAG 2.1 AA), aumentará a qualidade das denúncias que chegam à triagem do MPT e eliminará retrabalhos causados por formulários incompletos.",
        title="VALOR E IMPACTO INSTITUCIONAL"
    )

    add_paragraph(doc, "", space_after=6)
    add_heading(doc, "Indicadores das Melhorias Propostas", 2)
    summary_table_data = [
        ["Eixo de Melhoria", "Nº de Ações", "Benefício Direto para o MPT e Cidadão"],
        ["1. Acessibilidade Inclusiva (WCAG 2.1 AA)", "4 Ações", "Garante acesso autônomo para pessoas com deficiência visual (leitores de tela) e navegação exclusiva por teclado."],
        ["2. Proteção de Formulário (Wizard UX)", "3 Ações", "Impede o envio de denúncias sem informações mínimas, reduzindo chamados inválidos na triagem."],
        ["3. Validação Inteligente (CNPJ e Documentos)", "2 Ações", "Valida a autenticidade lógica de CNPJs e bloqueia o upload de arquivos nocivos no computador do cidadão."],
        ["4. Transparência e Comunicação de Protocolo", "2 Ações", "Anuncia com clareza o protocolo emitido e orienta o cidadão em caso de oscilação na internet."],
    ]
    summary_table = add_table(doc, summary_table_data, col_widths_cm=[5.0, 2.5, 9.0])
    set_repeat_table_header(summary_table.rows[0])

    doc.add_page_break()

    # 4. EIXO 1: ACESSIBILIDADE E INCLUSÃO DIGITAL
    add_heading(doc, "2. Eixo 1 — Acessibilidade e Inclusão Digital (WCAG 2.1 AA)", 1)
    add_paragraph(
        doc,
        "A acessibilidade web garante que qualquer cidadão, independentemente de limitações físicas ou sensoriais, utilize os serviços públicos digitais. Abaixo estão as 4 ações prioritárias para atingir conformidade total com o padrão WCAG 2.1 AA:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_bullet(doc, "a) Indicadores Visuais de Foco por Teclado",
               "Pessoas com limitações motoras costumam navegar usando a tecla 'Tab' do teclado em vez do mouse. Será implementado um anel visual de alto contraste ao redor do elemento selecionado para que o usuário saiba exatamente onde está na página.")
    add_bullet(doc, "b) Leitura de Voz para Deficientes Visuais (Rótulos ARIA)",
               "Todos os botões, caixas de seleção de irregularidades e campos de formulário receberão etiquetas invisíveis (atributos ARIA e labels) para que programas leitores de tela (como NVDA ou VoiceOver) leiam o conteúdo com clareza para pessoas cegas.")
    add_bullet(doc, "c) Anúncio Automático ao Mudar de Etapa",
               "Ao clicar para avançar no formulário, o sistema anunciará em voz alta para o leitor de tela o título da nova etapa (ex: 'Etapa 2 de 6: Detalhamento da Ocorrência') e moverá o foco da tela para o topo da página.")
    add_bullet(doc, "d) Leitura Audível do Número de Protocolo",
               "Após a confirmação do envio, o número do protocolo gerado (ex: MPT-8X2K9P) será lido imediatamente em voz alta, garantindo que o cidadão cego consiga registrar a comprovação da sua denúncia.")

    # 5. EIXO 2: EXPERIÊNCIA DO CIDADÃO E PREVENÇÃO DE ERROS
    add_heading(doc, "3. Eixo 2 — Experiência do Cidadão e Prevenção de Erros (UX)", 1)
    add_paragraph(
        doc,
        "Formulários longos costumam gerar dúvidas. O modelo em etapas (Wizard) fraciona o processo, reduzindo o cansaço visual. As melhorias neste eixo garantem que o cidadão só avance se os dados essenciais forem preenchidos com qualidade:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_bullet(doc, "a) Bloqueio Inteligente de Etapas Incompletas",
               "Atualmente, é possível clicar em 'Avançar' mesmo sem escolher nenhuma irregularidade ou sem digitar a descrição. A nova regra exibirá uma mensagem explicativa amigável indicando o que falta preencher antes de liberar o avanço.")
    add_bullet(doc, "b) Validação dos Dados do Denunciante Identificado",
               "Quando a pessoa escolher se identificar (em vez do anonimato), o sistema passará a exigir obrigatoriamente um nome e um canal válido de contato (e-mail ou telefone), evitando denúncias identificadas 'em branco'.")
    add_bullet(doc, "c) Validação Matemática de CNPJ (Dígito Verificador)",
               "Será adicionada a validação do Dígito Verificador (DV) do CNPJ. Se o cidadão digitar uma sequência fictícia (ex: 11.111.111/1111-11), o sistema avisará que o CNPJ é inválido, prevenindo erros de digitação.")
    add_bullet(doc, "d) Proteção e Filtro no Upload de Provas",
               "O seletor de arquivos no celular ou computador exibirá apenas formatos permitidos (fotos, documentos PDF, áudios e vídeos), bloqueando imediatamente tentativas de anexar arquivos de programas perigosos (.js, .exe).")

    # 6. EIXO 3: SIGILO, PRIVACIDADE E LGPD
    add_heading(doc, "4. Eixo 3 — Sigilo, Privacidade e Conformidade LGPD", 1)
    add_paragraph(
        doc,
        "A garantia de sigilo e anonimato é o pilar de confiança do cidadão no MPT. O plano assegura total transparência nas escolhas de privacidade:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    add_bullet(doc, "a) Limpeza Automática de Dados ao Optar por Anonimato",
               "Caso o usuário digite seu nome e e-mail e depois mude de ideia clicando em 'Denúncia Anônima', o sistema apagará automaticamente os dados pessoais da memória, garantindo que nada seja transmitido.")
    add_bullet(doc, "b) Distinção Clara entre Anonimato e Sigilo",
               "Serão incluídos textos explicativos curtos diferenciando 'Anonimato Total' (onde o MPT não recebe nenhum dado do denunciante) de 'Denúncia Sigilosa' (onde o MPT conhece a identidade mas a mantém protegida da empresa denunciada).")

    doc.add_page_break()

    # 7. MATRIZ DE PRIORIZAÇÃO E ROADMAP ESTRATÉGICO
    add_heading(doc, "5. Matriz de Priorização e Plano de Ação (Roadmap)", 1)
    add_paragraph(
        doc,
        "Para orientar a equipe técnica, as ações foram organizadas por nível de prioridade e esforço de implementação. Recomenda-se a execução no formato de 3 Sprints curtas:",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )

    roadmap_data = [
        ["Prioridade", "Melhoria / Funcionalidade", "Esforço", "Sprint Sugerida"],
        ["🔴 ALTA", "Bloqueio de avanço em etapas incompletas (Irregularidades e Identificação)", "Baixo", "Sprint 1 (Imediata)"],
        ["🔴 ALTA", "Anel de foco visível por teclado (:focus-visible) em todos os botões", "Baixo", "Sprint 1 (Imediata)"],
        ["🔴 ALTA", "Filtro de extensões nocivas no upload de anexos (.js, .exe)", "Baixo", "Sprint 1 (Imediata)"],
        ["🟡 MÉDIA", "Validação de Dígito Verificador (DV) de CNPJ e obrigatoriedade de UF/Município", "Médio", "Sprint 2 (Sequencial)"],
        ["🟡 MÉDIA", "Rótulos para leitores de tela em caixas de seleção e formulários", "Médio", "Sprint 2 (Sequencial)"],
        ["🟡 MÉDIA", "Anúncio audível de mudança de etapa e leitura do protocolo", "Médio", "Sprint 2 (Sequencial)"],
        ["🟢 BAIXA", "Mover foco automático para o título h1 ao carregar a página", "Baixo", "Sprint 3 (Polimento)"],
        ["🟢 BAIXA", "Aprimoramento dos textos educativos de Sigilo vs Anonimato", "Baixo", "Sprint 3 (Polimento)"],
    ]
    
    roadmap_table = add_table(doc, roadmap_data, col_widths_cm=[3.0, 8.2, 2.3, 3.0])
    set_repeat_table_header(roadmap_table.rows[0])
    
    # Colorir células de prioridade
    for row in roadmap_table.rows[1:]:
        prio_cell = row.cells[0]
        text = prio_cell.text.strip()
        if "ALTA" in text:
            set_cell_shading(prio_cell, RED_SOFT_HEX)
        elif "MÉDIA" in text:
            set_cell_shading(prio_cell, YELLOW_SOFT_HEX)
        elif "BAIXA" in text:
            set_cell_shading(prio_cell, GREEN_SOFT_HEX)

    add_paragraph(doc, "", space_after=12)

    # 8. RECOMENDAÇÃO FINAL À DIRETORIA
    add_heading(doc, "6. Recomendação Final da Equipe Técnica", 1)
    add_paragraph(
        doc,
        "Recomenda-se à Diretoria a aprovação deste Plano Executivo de Melhorias. Por se tratar de ajustes focados em acessibilidade, usabilidade e validações de interface, o cronograma estimado para conclusão total é de 2 a 3 semanas, sem a necessidade de paralisação ou alteração na estrutura do backend do MPT.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY
    )
    add_paragraph(
        doc,
        "Com esta entrega, o Ministério Público do Trabalho reafirma seu compromisso com a inclusão social, a transparência pública e a inovação tecnológica voltada à proteção do trabalhador.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY, bold=True, color=NAVY
    )

    add_paragraph(doc, "", space_after=24)
    add_paragraph(doc, "________________________________________________________", align=WD_ALIGN_PARAGRAPH.CENTER, color=GRAY_D)
    add_paragraph(doc, "Equipe de Arquitetura de Software e Desenvolvimento Web", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size=10)
    add_paragraph(doc, "Ministério Público do Trabalho — PGT", align=WD_ALIGN_PARAGRAPH.CENTER, size=9.5, color=GRAY_D)

    doc.save(OUT)
    print(f"Relatório executivo DOCX gerado com sucesso em: {OUT}")

if __name__ == "__main__":
    main()
