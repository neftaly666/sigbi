//Tonos de categoría de AN050 sección 2.3. Los seis nombres canonicos tienen clase propia en
//styles.css; cualquier otra categoría cae al par neutro. El tono es un adorno funcional,
//no una clave: el nombre va siempre escrito al lado (PX-03).
const TONOS = new Set([
    'narrativa',
    'informatica',
    'ciencia',
    'historia',
    'infantil',
    'hemeroteca',
]);

//Informatica lleva tilde en la base de datos y no en el nombre de la clase CSS
const normalizar = (nombre: string) =>
    nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .trim();

const clase = (prefijo: string, nombre: string | null | undefined) => {
    if (!nombre) return prefijo;

    const clave = normalizar(nombre);

    return TONOS.has(clave) ? `${prefijo} ${prefijo}--${clave}` : prefijo;
};

//Chip de categoría: fondo claro con texto oscuro del mismo matiz
export function categoryToneClass(nombre: string | null | undefined): string {
    return clase('sigbi-cat', nombre);
}

/**
 * Relleno de barra en el panel. Mismo matiz que el chip pero en un paso intermedio: el
 * fondo del chip está medido para llevar texto oscuro encima, y como mancha de color
 * sobre el panel blanco se queda en 1,1:1 - una barra que no se ve. El paso intermedio
 * da >= 3:1 sobre las dos superficies, claro y oscuro.
 */
export function chartToneClass(nombre: string | null | undefined): string {
    return clase('sigbi-chart', nombre);
}
