"""Gera RELATORIO_REQUISITOS_DIRETORIA.docx com RF, RNF, conflitos, lacunas e questionário."""
from pathlib import Path
from docx import Document
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUT = Path(__file__).parent / "RELATORIO_REQUISITOS_DIRETORIA.docx"

NAVY = RGBColor(0x17, 0x33, 0x5C)
TEAL = RGBColor(0x0C, 0x6E, 0x64)
GOLD = RGBColor(0xBF, 0x95, 0x3F)
GRAY_D = RGBColor(0x5A, 0x5A, 0x5A)
GRAY_L_HEX = "F0F0F0"
NAVY_HEX = "17335C"
TEAL_HEX = "0C6E64"
GOLD_HEX = "BF953F"
RED = RGBColor(0xC6, 0x28, 0x28)
RED_HEX = "C62828"
GREEN = RGBColor(0x2E, 0x7D, 0x32)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)


def set_cell_shading(cell, hex_color: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tc_pr.append(shd)


def set_cell_borders(cell, color: str = "17335C", size: str = "6") -> None:
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


def add_paragraph(doc, text, *, size=11, bold=False, color=None,
                  align=WD_ALIGN_PARAGRAPH.LEFT, space_after=6, space_before=0):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(space_before)
    p.alignment = align
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(size)
    run.bold = bold
    if color:
        run.font.color.rgb = color
    return p


def add_heading(doc, text, level=1):
    sizes = {1: 20, 2: 15, 3: 12}
    colors = {1: NAVY, 2: TEAL, 3: NAVY}
    p = add_paragraph(doc, text, size=sizes[level], bold=True,
                      color=colors[level], space_before=12, space_after=6)
    if level == 1:
        pPr = p._p.get_or_add_pPr()
        pBdr = OxmlElement("w:pBdr")
        bottom = OxmlElement("w:bottom")
        bottom.set(qn("w:val"), "single")
        bottom.set(qn("w:sz"), "8")
        bottom.set(qn("w:space"), "1")
        bottom.set(qn("w:color"), NAVY_HEX)
        pBdr.append(bottom)
        pPr.append(pBdr)
    return p


def add_bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(11)
    return p


def add_numbered(doc, text):
    p = doc.add_paragraph(style="List Number")
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(11)
    return p


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
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.space_before = Pt(2)
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
            set_cell_borders(cell)

    if col_widths_cm:
        for c_idx, width in enumerate(col_widths_cm):
            for row in table.rows:
                row.cells[c_idx].width = Cm(width)
    return table


def main():
    doc = Document()

    section = doc.sections[0]
    section.top_margin = Cm(2)
    section.bottom_margin = Cm(2)
    section.left_margin = Cm(2)
    section.right_margin = Cm(2)

    style = doc.styles["Normal"]
    style.font.name = "Calibri"
    style.font.size = Pt(11)

    # ======== CAPA ========
    add_paragraph(doc, "MINISTÉRIO PÚBLICO DO TRABALHO",
                  size=10, bold=True, color=GRAY_D,
                  align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
    add_paragraph(doc, "Canal de Denúncias da Cidadania",
                  size=10, color=GRAY_D,
                  align=WD_ALIGN_PARAGRAPH.CENTER, space_after=12)

    add_paragraph(doc, "Relatório Executivo de Requisitos",
                  size=26, bold=True, color=NAVY,
                  align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)
    add_paragraph(doc, "Requisitos funcionais e não funcionais, conflitos, lacunas e questionário",
                  size=14, color=TEAL,
                  align=WD_ALIGN_PARAGRAPH.CENTER, space_after=12)
    add_paragraph(doc,
                  "Extraído do codebase em 24/07/2026  |  Branch: refactor/frontend-architecture",
                  size=10, color=GRAY_D,
                  align=WD_ALIGN_PARAGRAPH.CENTER, space_after=18)

    # ======== SUMÁRIO ========
    add_heading(doc, "Sumário executivo", 1)
    add_paragraph(doc,
        "Este relatório consolida os requisitos funcionais e não funcionais do Canal de Denúncias "
        "extraídos diretamente do código, dos documentos de especificação (planejamento.md, "
        "spec_design.md, AGENTS.md) e da configuração do backend. Aponta divergências entre "
        "documentação e implementação, lista lacunas de negócio que hoje não têm regra definida "
        "e propõe um questionário para que usuários, requisitantes e analistas de negócio validem "
        "e complementem o levantamento antes da entrega em produção.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY)

    resumo = [
        ["Categoria", "Quantidade"],
        ["Requisitos funcionais identificados",           "17"],
        ["Requisitos não funcionais identificados",       "14"],
        ["Conflitos entre documentos e implementação",    "7"],
        ["Requisitos ausentes ou insuficientes",          "20"],
        ["Perguntas do questionário para stakeholders",   "40"],
    ]
    add_table(doc, resumo, col_widths_cm=[10, 4])

    # ======== METODOLOGIA ========
    add_heading(doc, "Método de extração", 2)
    for t in [
        "Leitura dos documentos: planejamento.md, spec_design.md, AGENTS.md, server/README.md e server/env.template.",
        "Análise do modelo de domínio em src/app/models/complaint.model.ts.",
        "Análise das rotas, controller, middleware, clientes e store do backend em server/.",
        "Análise dos componentes do wizard e do serviço de estado no frontend.",
        "Cruzamento entre documentação, código e testes automatizados.",
    ]:
        add_bullet(doc, t)

    # ======== RF ========
    add_heading(doc, "Requisitos funcionais (RF)", 1)
    rf = [
        ["ID", "Requisito", "Origem"],
        ["RF-01", "Iniciar denúncia a partir da tela de acolhimento.", "acolhimento component"],
        ["RF-02", "Conduzir preenchimento em wizard de 6 passos (0 acolhimento + 5 formulário + 1 revisão + confirmação).", "ComplaintService (totalSteps = 6)"],
        ["RF-03", "Selecionar irregularidades a partir de 6 opções fixas (jornada, sem registro, EPI, assédio, atraso, outros).", "complaint.model.ts / IRREGULARIDADES"],
        ["RF-04", "Registrar relato textual descritivo da irregularidade.", "step-irregularidades"],
        ["RF-05", "Registrar detalhamento da ocorrência (período, modalidade, prejudicados, funções/setores, nomes/dados).", "step-ocorrencias"],
        ["RF-06", "Selecionar grupos vulneráveis afetados e informar se procurou outro órgão.", "step-evidencias"],
        ["RF-07", "Anexar múltiplas evidências (imagem, áudio, vídeo e documento) com pré-visualização.", "step-evidencias / FileAttachment"],
        ["RF-08", "Aceitar apenas os 15 tipos MIME permitidos: JPEG, PNG, GIF, WebP, MP3, M4A, WebM, OGG, WAV, MP4, MOV, PDF, DOC, DOCX.", "middleware/upload.js"],
        ["RF-09", "Escolher entre anônimo e identificado; se identificado, coletar nome, e-mail e telefone.", "step-identificacao"],
        ["RF-10", "Coletar UF e município (obrigatórios) entre as 27 UFs listadas.", "complaint.service.js validateComplaint"],
        ["RF-11", "Coletar dados da empresa denunciada (razão social, endereço, CNPJ com máscara).", "step-local"],
        ["RF-12", "Exibir tela de revisão com todos os dados e permitir edição em passos anteriores antes do envio.", "step-revisao"],
        ["RF-13", "Gerar protocolo único no formato MPT-XXXXXXXX (8 caracteres em alfabeto reduzido, sem 0/1/I/O).", "services/complaint.service.js"],
        ["RF-14", "Enviar a denúncia como multipart para o BFF e este encaminhar para a API interna do MPT.", "clients/mpt-api.client.js"],
        ["RF-15", "Exibir falha visível quando o backend responder 4xx/5xx e manter dados na revisão para nova tentativa.", "ComplaintService.submitComplaint"],
        ["RF-16", "Permitir iniciar nova denúncia a partir da tela de confirmação.", "confirmation component"],
        ["RF-17", "Disponibilizar health-check GET /health e documentação OpenAPI GET /api-docs (opt-in em produção).", "server/index.js"],
    ]
    add_table(doc, rf, col_widths_cm=[1.5, 10, 5])

    # ======== RNF ========
    add_heading(doc, "Requisitos não funcionais (RNF)", 1)
    rnf = [
        ["ID", "Requisito", "Origem"],
        ["RNF-01", "CORS restrito à origem configurada em produção; Helmet ativo.", "server/index.js"],
        ["RNF-02", "Rate limit padrão 20 requisições/15 min por IP no POST de denúncias, compartilhado via Redis nas 3 réplicas.", "index.js + redis-rate-limit-store"],
        ["RNF-03", "Todos os anexos passam por antivírus ClamAV (INSTREAM) antes de sair do servidor; falha fechada.", "clamav.client.js + controller"],
        ["RNF-04", "Upload gravado em disco temporário aleatório; limpeza automática após sucesso ou erro.", "middleware/upload.js"],
        ["RNF-05", "Contrato HTTP alinhado: 201 apenas com aceite real; 400/422 para dados; 502 para falha da integração; 503 para dependência ausente.", "controller + swagger"],
        ["RNF-06", "Logs sem UF, sigilo, dados pessoais ou mensagens brutas da integração.", "controller + AGENTS.md item 5"],
        ["RNF-07", "Acessibilidade WCAG 2.1 A e AA validada por axe-core; nenhuma violação critical/serious.", "e2e/complaint-journey.spec.ts"],
        ["RNF-08", "Layout Mobile-first e responsivo em desktop.", "planejamento.md + spec_design.md"],
        ["RNF-09", "Compatibilidade com Chromium desktop/mobile, Firefox e WebKit (Safari).", "playwright.config.ts"],
        ["RNF-10", "Budget de bundle: bruto < 500 kB e transferido < 120 kB.", "resultado 384/85 kB"],
        ["RNF-11", "Retenção de logs de 10 dias em produção (política declarada, não implementada no código).", "planejamento operacional"],
        ["RNF-12", "Disponibilidade sugerida de 99,5% (SLO não formalizado).", "requisito operacional"],
        ["RNF-13", "Capacidade alvo: 100 denúncias/hora, 500 usuários, 100 uploads simultâneos, 3 réplicas.", "requisito operacional"],
        ["RNF-14", "MPT_API_TOKEN e detalhes da API interna ficam apenas no BFF (nunca no navegador).", "AGENTS.md itens 1 e 7"],
    ]
    add_table(doc, rnf, col_widths_cm=[1.5, 10, 5])

    # ======== CONFLITOS ========
    add_heading(doc, "Conflitos entre documentação e implementação", 1)
    add_paragraph(doc,
        "Divergências reais que hoje podem induzir a diretoria, operadores ou novos "
        "desenvolvedores a decisões erradas.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    conflitos = [
        ["#", "Divergência", "O que está escrito", "O que o código faz", "Ação sugerida"],
        ["C-01", "Modelo prevê áudio no relato",
         "complaint.model.ts define relato_audio (Blob) e relato_audio_transcricao",
         "Nenhum componente captura áudio; o relatório final registrou 'Remoção de URL e logs de depuração de áudio'",
         "Decidir: manter e implementar ou remover do modelo"],
        ["C-02", "Storage de upload",
         "AGENTS.md: 'Multer uses in-memory storage'",
         "middleware/upload.js usa diskStorage em pasta temporária",
         "Atualizar AGENTS.md"],
        ["C-03", "Falso sucesso no envio",
         "AGENTS.md avisa que submitComplaint simula sucesso no catch",
         "ComplaintService.submitComplaint hoje expõe erro real (correção aplicada)",
         "Atualizar AGENTS.md"],
        ["C-04", "Versão do Angular",
         "spec_design.md diz Angular v21.2.0; planejamento diz v21.2.0",
         "package.json usa Angular v22.0.5",
         "Atualizar documentos"],
        ["C-05", "Porta do frontend",
         "README menciona porta 4200 (default CLI)",
         "package.json roda em 4201",
         "Atualizar README"],
        ["C-06", "Limite de upload citado",
         "planejamento.md fala em 'blocos de 10-20MB'",
         "MAX_FILE_SIZE default = 20 MB; MAX_FILES = 10; total 200 MB por denúncia",
         "Confirmar o limite oficial com a diretoria"],
        ["C-07", "Sass @import",
         "spec_design.md usa @import do Bootstrap 5.3",
         "Sass 3 removerá @import; hoje só há aviso",
         "Planejar migração para @use/@forward"],
    ]
    add_table(doc, conflitos, col_widths_cm=[1.2, 3.6, 4, 4, 3.2])

    # ======== LACUNAS ========
    add_heading(doc, "Requisitos ausentes ou insuficientes na lógica atual", 1)
    add_paragraph(doc,
        "Cada item abaixo é uma regra de negócio ou controle operacional que hoje não existe no "
        "código nem em documento formal e cuja definição afeta a operação em produção.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY)
    lacunas = [
        ["#", "Lacuna", "Risco / impacto", "Área"],
        ["L-01", "Sem validação de dígitos verificadores de CNPJ (só máscara).",
         "Denúncias apontando empresas inexistentes ou com CNPJ mistipado.", "Negócio"],
        ["L-02", "Sem validação de e-mail e telefone quando identificado.",
         "Impossibilidade de contato posterior; dados inválidos entram na base.", "Negócio"],
        ["L-03", "Opção 'Outros' em irregularidades não exige detalhamento específico.",
         "Perda de contexto e retrabalho da equipe de triagem.", "Negócio"],
        ["L-04", "Regra da obrigatoriedade de nome/e-mail/telefone quando identificado não é aplicada no backend.",
         "Denúncia identificada pode chegar sem contato utilizável.", "Negócio"],
        ["L-05", "Sem limite total de tamanho da denúncia (10 arquivos × 20 MB = 200 MB).",
         "Impacto de banda, disco, ClamAV e API interna.", "Operação"],
        ["L-06", "Sem política formal de retenção/exclusão dos anexos em falha parcial.",
         "Arquivos temporários órfãos em cenários de erro entre estágios.", "Operação"],
        ["L-07", "Sem consentimento LGPD explícito antes do envio.",
         "Exposição jurídica; falta de base legal registrada.", "LGPD"],
        ["L-08", "Sem chave de idempotência na submissão.",
         "Reenvios geram protocolos duplicados para a mesma denúncia.", "Negócio"],
        ["L-09", "Sem persistência local (rascunho) durante o preenchimento.",
         "Perda de dados ao fechar o navegador; abandono do fluxo.", "UX"],
        ["L-10", "Backend confia no mimetype declarado pelo cliente; sem checagem de magic number.",
         "Arquivos maliciosos travestidos podem passar pelo filtro.", "Segurança"],
        ["L-11", "Comportamento indefinido quando ClamAV retorna 'unknown' ou similar.",
         "Ambiguidade entre aceitar e rejeitar; decisão fica implícita.", "Segurança"],
        ["L-12", "Sem log de tentativas com falha (só sucesso é registrado).",
         "Dificulta auditoria e detecção de ataques ou instabilidade.", "Observabilidade"],
        ["L-13", "Sem confirmação de recebimento por e-mail ao denunciante identificado.",
         "Denunciante depende de anotar o protocolo manualmente.", "UX"],
        ["L-14", "Sem geração de comprovante em PDF do protocolo.",
         "Denunciante não tem prova formal do envio.", "UX / Jurídico"],
        ["L-15", "Sem captcha ou honeypot para bloquear bots distribuídos.",
         "Rate limit por IP é insuficiente contra ataques distribuídos.", "Segurança"],
        ["L-16", "Sem fila local (queue) se a API MPT ficar indisponível.",
         "Denúncia é perdida se usuário não repetir o envio.", "Operação"],
        ["L-17", "fetch do frontend sem AbortController / timeout explícito.",
         "Requisição pode ficar pendurada indefinidamente.", "UX / Robustez"],
        ["L-18", "Sem aceite explícito de termos de uso e política de privacidade.",
         "Exposição jurídica; falta de trilha de consentimento.", "LGPD / Jurídico"],
        ["L-19", "Sem SLI/SLO formalizados para 99,5% de disponibilidade.",
         "Impossível medir cumprimento da meta.", "Operação"],
        ["L-20", "Sem plano de resposta a incidente de vazamento de anexo/denúncia.",
         "LGPD exige plano documentado; hoje não existe.", "LGPD / Segurança"],
    ]
    add_table(doc, lacunas, col_widths_cm=[1.2, 7.5, 5.5, 2.0])

    # ======== QUESTIONÁRIO ========
    doc.add_page_break()
    add_heading(doc, "Questionário para stakeholders", 1)
    add_paragraph(doc,
        "Perguntas estruturadas para serem respondidas em conjunto por usuários, requisitantes e "
        "analista de negócio. Cada bloco fecha uma decisão pendente identificada nas seções anteriores.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY)

    add_heading(doc, "1. Escopo funcional da denúncia", 2)
    for q in [
        "A gravação de áudio para o relato deve fazer parte do produto (ver C-01)? Se sim, quem é responsável pela transcrição (usuário, sistema, backoffice)?",
        "Quais campos são obrigatórios em cada etapa? Existe alguma variação por perfil (trabalhador, sindicato, advogado)?",
        "A lista fixa de irregularidades (RF-03) está correta? Alguma classificação adicional deve entrar?",
        "Quando o usuário marcar 'Outros', deve ser exigido campo de detalhamento (L-03)?",
        "Que dados são absolutamente obrigatórios quando o denunciante escolhe 'Identificado' (L-04)?",
        "Existe requisito legal para validar o CNPJ da empresa denunciada (L-01)?",
        "Existe restrição de UF/município (ex.: apenas certas regiões atendidas neste release)?",
    ]:
        add_numbered(doc, q)

    add_heading(doc, "2. Anexos e evidências", 2)
    for q in [
        "Confirmar o tamanho máximo por arquivo e o número máximo de arquivos por denúncia (RF-07/C-06).",
        "Deve existir limite total por denúncia (L-05)? Qual?",
        "A lista de tipos MIME aceitos (RF-08) contempla o esperado (adicionar HEIC, PPTX, ZIP, etc.)?",
        "Como tratar formato não usual em zonas com internet ruim (ex.: fotos HEIC do iPhone)?",
        "Quando o antivírus estiver indisponível, a denúncia é aceita sem anexos ou é totalmente barrada (L-11)?",
        "Como lidar com arquivos suspeitos: alerta educativo ao denunciante ou apenas rejeição silenciosa?",
    ]:
        add_numbered(doc, q)

    add_heading(doc, "3. Identificação, sigilo e LGPD", 2)
    for q in [
        "Qual é a base legal (LGPD) para tratar os dados do denunciante identificado?",
        "É obrigatório coletar consentimento explícito antes do envio (L-07/L-18)?",
        "Qual é o tempo de retenção dos dados pessoais e dos anexos após a triagem?",
        "Denunciante anônimo pode receber acompanhamento (retorno) por algum canal (protocolo + PIN, e-mail temporário, outro)?",
        "Existe plano de resposta a incidente de vazamento com prazos e responsáveis (L-20)?",
    ]:
        add_numbered(doc, q)

    add_heading(doc, "4. Confirmação e pós-envio", 2)
    for q in [
        "O protocolo MPT-XXXXXXXX (RF-13) atende os sistemas internos ou deve seguir outro padrão?",
        "Deve haver envio de comprovante por e-mail ao denunciante identificado (L-13)?",
        "Deve ser gerado comprovante em PDF disponível para download (L-14)?",
        "O que acontece com uma denúncia após 502 na API interna? Fila local? Reenvio automático? Sinalização humana (L-16)?",
        "Como evitar duplicidade quando o usuário clicar 'Enviar' duas vezes ou tentar novamente após timeout (L-08)?",
    ]:
        add_numbered(doc, q)

    add_heading(doc, "5. Operação, capacidade e SLO", 2)
    for q in [
        "Confirmar as metas operacionais: 100 denúncias/hora, 500 usuários, 100 uploads simultâneos, 3 réplicas (RNF-13).",
        "Qual disponibilidade contratada (SLO) e como será medida (L-19)?",
        "Qual é a janela de manutenção e o comportamento esperado no site fora dela?",
        "Como serão dimensionados Redis (RNF-02) e ClamAV (RNF-03) para o pico esperado?",
        "Qual sistema receberá os logs? Retenção de 10 dias (RNF-11) atende a auditoria interna?",
        "Existe requisito de monitoramento/alerta em tempo real (protocolo, latência, taxa de 502/503)?",
    ]:
        add_numbered(doc, q)

    add_heading(doc, "6. Segurança e abuso", 2)
    for q in [
        "Precisa haver mecanismo antibot além do rate limit por IP (captcha, honeypot) (L-15)?",
        "Como tratar submissões suspeitas (grande número em curto período, mesmo IP, mesmo padrão de texto)?",
        "É aceitável armazenar temporariamente os anexos em disco do container (RNF-04) ou é necessário armazenamento cifrado dedicado?",
        "Precisa haver segregação por UF/PRT que rege a integração com a API interna?",
        "Como será feita a rotação de MPT_API_TOKEN?",
    ]:
        add_numbered(doc, q)

    add_heading(doc, "7. Acessibilidade, idioma e canais alternativos", 2)
    for q in [
        "Além de WCAG 2.1 AA (RNF-07), há requisito de conformidade com eMAG do governo brasileiro?",
        "O canal deve estar disponível em outros idiomas (inglês, espanhol, libras via vídeo)?",
        "Precisa haver canal alternativo (0800, chatbot, presencial) integrado?",
        "Deve existir modo de contraste alto ou tema escuro?",
    ]:
        add_numbered(doc, q)

    add_heading(doc, "8. UX e continuidade do fluxo", 2)
    for q in [
        "Salvamento local automático de rascunho é desejado (L-09)? Por quanto tempo?",
        "Que comportamento é esperado se o usuário atualizar a página no meio do wizard?",
        "É desejado enviar SMS/WhatsApp de acompanhamento a denunciantes identificados?",
        "Deve haver campo de 'avaliação da experiência' após a confirmação?",
    ]:
        add_numbered(doc, q)

    # ======== CONCLUSÃO ========
    add_heading(doc, "Recomendação", 1)
    add_paragraph(doc,
        "Solicitamos uma reunião de alinhamento com usuários responsáveis pelo negócio, "
        "requisitantes internos e o analista de negócio para responder o questionário. "
        "As respostas fecharão as lacunas de negócio (L-01 a L-20) e resolverão as divergências "
        "entre documentação e implementação (C-01 a C-07), permitindo priorizar as melhorias antes "
        "da entrada em produção.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY)

    add_paragraph(doc,
        "Status atual: código apto a homologação; requisitos formais aguardando validação da diretoria e do negócio.",
        size=12, bold=True, color=GOLD, space_before=6)

    add_heading(doc, "Documentos de referência", 3)
    for t in [
        "cidadania-canal-denuncias/planejamento.md — visão do produto e wizard.",
        "cidadania-canal-denuncias/spec_design.md — design system.",
        "cidadania-canal-denuncias/AGENTS.md — regras de execução e arquitetura.",
        "cidadania-canal-denuncias/server/env.template — variáveis de ambiente.",
        "cidadania-canal-denuncias/src/app/models/complaint.model.ts — modelo do domínio.",
        "Analises/RELATORIO_FINAL_SANITIZACAO_CODEBASE_DENUNCIAS.md — sanitização já realizada.",
    ]:
        add_bullet(doc, t)

    doc.save(OUT)
    print(f"Gerado: {OUT}")


if __name__ == "__main__":
    main()
