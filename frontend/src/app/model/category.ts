export class Category {
    idCategory: number;
    name: string;
    description: string;
    //Activa / Inactiva en pantalla (AN050 sección 4.1)
    status: boolean;
    //Solo lectura: lo calcula el backend. Alimenta la columna LIBROS y el mensaje de RN-11.
    bookCount?: number;
}
