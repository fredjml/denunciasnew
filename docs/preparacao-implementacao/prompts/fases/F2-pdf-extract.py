"""Extrator sanitizado do PDF externo — evidência F2.

Uso: python F2-pdf-extract.py > F2-pdf-transcript.md

Regras (persona 4.0):
- Redige nomes de indivíduos citados nos metadados/rodapé.
- Redige URL de verificação de assinatura eletrônica.
- Colapsa quebras de linha em excesso.

Este script existe apenas como evidência do procedimento de F2. Não deve ser executado
em outros PDFs sem autorização.
"""
from __future__ import annotations
import re
import sys
import pymupdf

PDF_PATH = r"docs/Documento externo-outros 010970.2026.pdf"

NAME_PATTERNS = [
    r"FL[ÁA]VIA CHAVES DE ARA[ÚU]JO",
    r"Guilherme Almeida",
]
URL_PATTERN = r"https://protocoloadministrativo\.mpt\.mp\.br/[^\s]+"


def redact(text: str) -> str:
    for pat in NAME_PATTERNS:
        text = re.sub(pat, "[NOME-REDIGIDO]", text, flags=re.IGNORECASE)
    text = re.sub(URL_PATTERN, "[URL-VERIFICACAO-REDIGIDA]", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def main() -> int:
    doc = pymupdf.open(PDF_PATH)
    out_path = sys.argv[1] if len(sys.argv) > 1 else None
    out = open(out_path, "w", encoding="utf-8", newline="\n") if out_path else sys.stdout
    out.write("# Transcrição do PDF externo (F2 evidência)\n\n")
    out.write(f"> Origem: `{PDF_PATH}`.\n")
    out.write("> Extração: `pymupdf 1.28.2`, modo `text`, executada em 2026-09-03.\n")
    out.write("> Redações: nomes de indivíduos e URL de verificação de assinatura eletrônica.\n")
    out.write("> Evidência somente para F2; não substitui o PDF original.\n\n")
    out.write("## Metadados\n\n")
    for k in ("title", "subject", "format", "creator", "producer", "creationDate", "modDate", "trapped"):
        v = doc.metadata.get(k, "")
        out.write(f"- **{k}**: {v}\n")
    out.write(f"- **page_count**: {doc.page_count}\n")
    out.write("- **author**: [NOME-REDIGIDO]\n")
    out.write("- **keywords**: (identificadores internos do Canva; não material)\n\n")
    for i in range(doc.page_count):
        raw = doc[i].get_text("text")
        clean = redact(raw).strip() or "(sem texto extraível — provável imagem)"
        out.write(f"## Página {i + 1}\n\n")
        out.write("```text\n")
        out.write(clean)
        out.write("\n```\n\n")
    doc.close()
    if out is not sys.stdout:
        out.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
