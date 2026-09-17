export class Book {
    idBook: number;
    title: string;
    author: string;
    isbn: string;
    //Disponible / Reservado en pantalla (AN050 sección 4.1)
    available: boolean;
    //La relación viaja como identificador, no como objeto anidado
    idCategory: number;
    //Solo lectura: evita pedir la categoría aparte para pintar la tabla
    categoryName?: string;
}
