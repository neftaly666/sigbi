/* Markdown -> HTML para que LibreOffice lo convierta a Word.
   El HTML lleva los estilos en linea porque LibreOffice no carga hojas externas. */
const fs = require('fs');
const path = require('path');
const { marked } = require('/home/dante/gitu26/dante/sigbi/frontend/node_modules/marked');

const [entrada, salida] = process.argv.slice(2);
const md = fs.readFileSync(entrada, 'utf8');

/* El título del documento es el primer encabezado de nivel 1 */
const titulo = (md.match(/^#\s+(.+)$/m) || [null, path.basename(entrada, '.md')])[1];

/* Los enlaces a otros .md apuntan al .docx hermano: dentro de Word no hay Markdown */
let cuerpo = marked.parse(md.replace(/\]\(([A-Za-z0-9._%\u00C0-\u024F-]+)\.md(#[^)]*)?\)/g, ']($1.docx)'));

/* El bloque de cabecera va centrado: el titulo, la linea del proyecto y el codigo del
   documento. Se hace con estilo en linea porque LibreOffice ignora los selectores de
   hermano adyacente al importar el HTML. */
let centrados = 0;
cuerpo = cuerpo.replace(/<(h1|p)>/g, (etiqueta, nombre) => {
  if (centrados >= 3) return etiqueta;
  centrados++;
  return `<${nombre} style="text-align:center">`;
});

const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><title>${titulo}</title>
<style>
  @page { size: A4; margin: 2.5cm 2.2cm; }
  body { font-family: 'Liberation Sans', 'Calibri', sans-serif; font-size: 10.5pt; line-height: 1.35;
         color: #1B1B34; width: 166mm; }
  h1 { font-size: 22pt; color: #312E81; margin: 0 0 12pt; page-break-after: avoid; }
  h2 { font-size: 15pt; color: #312E81; margin: 20pt 0 6pt; page-break-after: avoid; text-align: center; }
  h3 { font-size: 12.5pt; color: #4338CA; margin: 14pt 0 5pt; page-break-after: avoid; text-align: left; }
  h4 { font-size: 11pt; color: #4A4A6A; margin: 12pt 0 4pt; text-align: left; }
  /* El cuerpo va justificado; las celdas y el codigo no, que quedarian con huecos */
  p, li { margin: 0 0 6pt; text-align: justify; }
  /* El ancho va en milimetros y no en %, porque el 100% de LibreOffice se mide sobre el
     cuerpo del documento web y desborda el margen del A4: 210 - 22 - 22 = 166 mm */
  table { border-collapse: collapse; width: 100%; table-layout: fixed; margin: 8pt 0 12pt; }
  th, td { border: 0.5pt solid #C5CBEA; padding: 4pt 6pt; font-size: 9pt; vertical-align: top;
           text-align: left; word-wrap: break-word; overflow-wrap: break-word; }
  th { background: #EEF1FD; color: #1B1B34; font-weight: bold; }
  code { font-family: 'Liberation Mono', 'Consolas', monospace; font-size: 9pt; background: #F6F7FE; }
  pre { font-family: 'Liberation Mono', 'Consolas', monospace; font-size: 8.5pt; background: #F6F7FE;
        border: 0.5pt solid #C5CBEA; padding: 6pt; white-space: pre-wrap; }
  blockquote { margin: 8pt 0; padding: 6pt 10pt; border-left: 3pt solid #4F46E5; background: #F6F7FE; }
  hr { border: none; border-top: 0.5pt solid #C5CBEA; margin: 14pt 0; }
  a { color: #4F46E5; }
</style></head><body>
${cuerpo}
</body></html>`;

fs.writeFileSync(salida, html);
console.log(path.basename(salida), html.length, 'caracteres');
