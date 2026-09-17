import { computed, inject, Service } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { Book } from "../model/book";
import { BookService } from "../services/book.service";

/**
 * El catálogo entero en una peticion. /v1/books no expone /pageable: son 24 libros en la
 * demostracion y unos pocos cientos en el peor caso real, así que la tabla página y filtra
 * en el cliente. Cambiar de idea más adelante es añadir el endpoint y mover el
 * paginador; la pantalla no cambia.
 */
@Service({autoProvided: false})
export class BookStore{

    private readonly bookService = inject(BookService);

    readonly booksResource = httpResource<Book[]>(
        () => this.bookService.resourceUrl,
        { defaultValue: [] },
    );

    //`value()` LANZA cuando el recurso está en error, y los efectos que sincronizan la
    //tabla lo leen en cada ciclo: sin este guardia la excepción rompe el render y el
    //banner de error no llega a pintarse nunca. `hasValue()` es la comprobación que toca.
    readonly $books = computed(() =>
        this.booksResource.hasValue() ? this.booksResource.value() : [],
    );
    readonly $loading = this.booksResource.isLoading;
    readonly $error = this.booksResource.error;

    //Alimenta los chips de filtro por categoría: solo las que tienen libros en la tabla
    readonly $categoriasPresentes = computed(() => {
        const nombres = new Map<number, string>();

        for (const book of this.$books()) {
            if (book.idCategory && book.categoryName) {
                nombres.set(book.idCategory, book.categoryName);
            }
        }

        return [...nombres].map(([idCategory, name]) => ({ idCategory, name }));
    });

    reload(){
        this.booksResource.reload();
    }
}
