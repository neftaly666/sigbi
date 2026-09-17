#!/usr/bin/env bash
# Regenera los .docx de la documentación -AN y EST- a partir de sus .md, que son la fuente.
#
#   documentacion/herramientas/generar-docx.sh
#
# Hacen falta node -para `marked`, que ya trae el frontend- y LibreOffice.
# Ojo con dos cosas aprendidas a golpes:
#   - LibreOffice del snap no lee carpetas ocultas: el trabajo se hace en ~/tmp-docx.
#   - importa el HTML como documento web y dimensiona las tablas por contenido, así que
#     se salen del A4; por eso después pasa `ajustar-tablas.py`.
set -e
RAIZ="$(cd "$(dirname "$0")/../.." && pwd)"
DOCS="$RAIZ/documentacion"
TRABAJO="$HOME/tmp-docx"

mkdir -p "$TRABAJO"
rm -f "$TRABAJO"/*.html "$TRABAJO"/*.docx "$TRABAJO"/*.bak

for f in "$DOCS"/AN*.md "$DOCS"/EST*.md; do
  node "$DOCS/herramientas/md-a-html.js" "$f" "$TRABAJO/$(basename "${f%.md}").html"
done

cd "$TRABAJO"
libreoffice --headless --convert-to docx:"MS Word 2007 XML" *.html > /dev/null
python3 "$DOCS/herramientas/ajustar-tablas.py" *.docx
rm -f *.bak
cp *.docx "$DOCS/"
echo "Listo: $(ls -1 "$DOCS"/AN*.docx "$DOCS"/EST*.docx | wc -l) documentos en documentacion/"
