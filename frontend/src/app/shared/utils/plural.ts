/**
 * "1 libro(s)" es un texto sin terminar. AN050 sección 4.1 pide microcopia cuidada y da
 * sus ejemplos en plural, sin prever el caso de uno; esto lo cubre.
 *
 *   plural(1, 'libro', 'libros')  -> "1 libro"
 *   plural(4, 'libro', 'libros')  -> "4 libros"
 *
 * Cuando además cambian el verbo o el posesivo -"su libro volvera" frente a "sus libros
 * volveran"- no basta con el sustantivo y la frase se escribe entera en su sitio.
 */
export function plural(cantidad: number, singular: string, plural: string): string {
    return `${cantidad} ${cantidad === 1 ? singular : plural}`;
}
