"""Normaliza el ancho de las tablas de un .docx al ancho de texto del A4.

LibreOffice importa el HTML como documento web y dimensiona las tablas por su contenido,
asi que al pasarlas a Word se salen del margen. Aqui se reescribe cada tabla al ancho
disponible -166 mm = 9412 twips- repartiendo las columnas en la misma proporcion, pero
**ninguna columna baja del ancho de su palabra mas larga**: si no, Word parte "D. Quispe"
o "2026-09-14" en dos lineas y la tabla queda ilegible.
"""
import re
import shutil
import sys
import zipfile

ANCHO = 9412          # twips: A4 (210 mm) menos 22 mm de margen a cada lado
POR_CARACTER = 105    # ancho aproximado de un caracter a 9 pt, en twips
RELLENO = 260         # los 4 pt de relleno de cada lado, mas el borde


def _palabra_mas_larga(celda: str) -> int:
    """Caracteres del trozo mas largo que Word no puede partir.

    Word corta despues de un guion, una barra o un punto, asi que
    `reservation-wizard-confirm` no necesita una columna de 26 caracteres: le basta con
    la mayor de sus partes. Pero eso solo vale para lo muy largo: una fecha como
    2026-09-14 tiene que caber entera, y por eso por debajo de 17 caracteres no se parte
    nada.
    """
    texto = ' '.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', celda))
    largo = 0
    for palabra in texto.split():
        if len(palabra) > 16:
            # solo lo muy largo se deja partir por sus guiones: un identificador parte
            # bien, pero una fecha como 2026-09-14 tiene que caber entera
            partes = re.split(r'[/.-]+', palabra)
            largo = max(largo, max((len(x) for x in partes), default=0))
        else:
            largo = max(largo, len(palabra))
    return largo


def ajustar(xml: str) -> tuple[str, int]:
    tablas = 0

    def una_tabla(m: re.Match) -> str:
        nonlocal tablas
        tabla = m.group(0)
        cols = [int(c) for c in re.findall(r'<w:gridCol w:w="(\d+)"', tabla)]
        if not cols:
            return tabla
        tablas += 1
        n = len(cols)

        # lo que cada columna necesita como minimo para no partir palabras
        minimos = [0] * n
        for fila in re.findall(r'<w:tr\b.*?</w:tr>', tabla, re.S):
            for i, celda in enumerate(re.findall(r'<w:tc>.*?</w:tc>', fila, re.S)[:n]):
                minimos[i] = max(minimos[i], _palabra_mas_larga(celda))
        minimos = [min(c * POR_CARACTER + RELLENO, 2900) for c in minimos]

        total = sum(cols) or 1
        nuevos = [max(minimos[i], round(c * ANCHO / total)) for i, c in enumerate(cols)]

        # si con los minimos se pasa del ancho, se recorta de las columnas con holgura
        exceso = sum(nuevos) - ANCHO
        while exceso > 0:
            holgadas = [i for i in range(n) if nuevos[i] - minimos[i] > 20]
            if not holgadas:
                break
            i = max(holgadas, key=lambda j: nuevos[j] - minimos[j])
            quita = min(exceso, nuevos[i] - minimos[i])
            nuevos[i] -= quita
            exceso -= quita
        # el redondeo se corrige en la columna mas ancha
        nuevos[nuevos.index(max(nuevos))] += ANCHO - sum(nuevos)

        it = iter(nuevos)
        tabla = re.sub(r'<w:gridCol w:w="\d+"',
                       lambda _: '<w:gridCol w:w="%d"' % next(it), tabla)
        tabla = re.sub(r'<w:tblW w:w="\d+" w:type="\w+"',
                       '<w:tblW w:w="%d" w:type="dxa"' % ANCHO, tabla)

        def una_fila(fm: re.Match) -> str:
            fila = fm.group(0)
            jt = iter(nuevos * 4)
            return re.sub(r'<w:tcW w:w="\d+" w:type="\w+"',
                          lambda _: '<w:tcW w:w="%d" w:type="dxa"' % next(jt), fila)

        return re.sub(r'<w:tr\b.*?</w:tr>', una_fila, tabla, flags=re.S)

    return re.sub(r'<w:tbl>.*?</w:tbl>', una_tabla, xml, flags=re.S), tablas


def procesar(ruta: str) -> int:
    with zipfile.ZipFile(ruta) as z:
        piezas = {n: z.read(n) for n in z.namelist()}
    xml = piezas['word/document.xml'].decode('utf8')
    xml, tablas = ajustar(xml)
    piezas['word/document.xml'] = xml.encode('utf8')
    shutil.move(ruta, ruta + '.bak')
    with zipfile.ZipFile(ruta, 'w', zipfile.ZIP_DEFLATED) as z:
        for nombre, datos in piezas.items():
            z.writestr(nombre, datos)
    return tablas


if __name__ == '__main__':
    for ruta in sys.argv[1:]:
        print('%-46s %2d tablas ajustadas' % (ruta, procesar(ruta)))
