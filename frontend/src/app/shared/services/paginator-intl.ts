import { MatPaginatorIntl } from "@angular/material/paginator";

/**
 * Los rótulos del paginador vienen en inglés de serie y son texto de interfaz, que en
 * SIGBI va en español integro (RNF-03, TW-10).
 */
export function paginadorEnEspanol(): MatPaginatorIntl {
    const intl = new MatPaginatorIntl();

    intl.itemsPerPageLabel = 'Filas por página';
    intl.nextPageLabel = 'Página siguiente';
    intl.previousPageLabel = 'Página anterior';
    intl.firstPageLabel = 'Primera página';
    intl.lastPageLabel = 'Última página';

    intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) return `0 de ${length}`;

        const inicio = page * pageSize;
        const fin = Math.min(inicio + pageSize, length);

        return `${inicio + 1} - ${fin} de ${length}`;
    };

    return intl;
}
