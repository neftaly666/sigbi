"""Sustituye los caracteres de dibujo de caja por ASCII en los diagramas.

Son de ancho simple, asi que el cambio es uno por uno y la alineacion de los diagramas no
se mueve. Las lineas pasan a `-` y `|`, y todo lo demas -esquinas, cruces y ramas- a `+`:
el mismo caracter sirve para la esquina de una caja y para la rama de un arbol, asi que
unificarlo evita que una caja termine en comilla.
"""
import glob
import sys

MAPA = {
    '─': '-',   # horizontal
    '│': '|',   # vertical
    '├': '+',   # ramas, esquinas y cruces: el mismo caracter sirve para la esquina de
    '└': '+',   # una caja y para la rama de un arbol, asi que se unifican en '+'
    '┌': '+',
    '┐': '+',
    '┘': '+',
    '┬': '+',
    '┴': '+',
    '┤': '+',
    '┼': '+',
}


def limpiar(texto: str) -> tuple[str, int]:
    cambios = sum(texto.count(ch) for ch in MAPA)
    for viejo, nuevo in MAPA.items():
        texto = texto.replace(viejo, nuevo)
    return texto, cambios


if __name__ == '__main__':
    escribir = '--aplicar' in sys.argv
    total = 0
    for ruta in sorted(glob.glob('*.md')) + sorted(glob.glob('diseño/*.md')):
        texto = open(ruta, encoding='utf8').read()
        nuevo, cambios = limpiar(texto)
        if not cambios:
            continue
        total += cambios
        if escribir:
            open(ruta, 'w', encoding='utf8').write(nuevo)
        print('%-52s %5d caracteres' % (ruta, cambios))
    print('total: %d' % total, '(aplicado)' if escribir else '(simulacion)')
