import { computed, inject, Service } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { Book } from "../model/book";
import { Category } from "../model/category";
import { Client } from "../model/client";
import { Reservation } from "../model/reservation";
import { BookService } from "../services/book.service";
import { CategoryService } from "../services/category.service";
import { ClientService } from "../services/client.service";
import { ReservationService } from "../services/reservation.service";

//Ventana de la cifra secundaria de la tarjeta de reservas
const DIAS_RECIENTES = 7;

/**
 * El panel no tiene endpoint propio: el backend no expone agregados y RF-17 es prioridad
 * B, así que no se le añade uno. Los cuatro indicadores y el gráfico se calculan aquí
 * sobre los cuatro listados que ya existen.
 *
 * El recuento por categoría NO se deduce de los libros: viene en `bookCount`, que lo
 * calcula el servicio. Contarlo aquí perderia las categorías con cero libros, que son
 * justo las que interesa ver en el grafico.
 */
@Service({autoProvided: false})
export class DashboardStore{

    private readonly bookService = inject(BookService);
    private readonly categoryService = inject(CategoryService);
    private readonly clientService = inject(ClientService);
    private readonly reservationService = inject(ReservationService);

    readonly booksResource = httpResource<Book[]>(() => this.bookService.resourceUrl, { defaultValue: [] });
    readonly categoriesResource = httpResource<Category[]>(() => this.categoryService.resourceUrl, { defaultValue: [] });
    readonly clientsResource = httpResource<Client[]>(() => this.clientService.resourceUrl, { defaultValue: [] });
    readonly reservationsResource = httpResource<Reservation[]>(() => this.reservationService.resourceUrl, { defaultValue: [] });

    private readonly recursos = [
        this.booksResource,
        this.categoriesResource,
        this.clientsResource,
        this.reservationsResource,
    ];

    readonly $loading = computed(() => this.recursos.some((r) => r.isLoading()));
    readonly $error = computed(() => this.recursos.map((r) => r.error()).find(Boolean));

    //`value()` LANZA cuando el recurso está en error, y los efectos que sincronizan la
    //tabla lo leen en cada ciclo: sin este guardia la excepción rompe el render y el
    //banner de error no llega a pintarse nunca. `hasValue()` es la comprobación que toca.
    readonly $books = computed(() => this.booksResource.hasValue() ? this.booksResource.value() : []);
    readonly $categories = computed(() => this.categoriesResource.hasValue() ? this.categoriesResource.value() : []);
    readonly $clients = computed(() => this.clientsResource.hasValue() ? this.clientsResource.value() : []);
    readonly $reservations = computed(() => this.reservationsResource.hasValue() ? this.reservationsResource.value() : []);

    // ---- Indicadores ------------------------------------------------------------------

    readonly $totalLibros = computed(() => this.$books().length);
    readonly $disponibles = computed(() => this.$books().filter((libro) => libro.available).length);
    readonly $reservados = computed(() => this.$totalLibros() - this.$disponibles());

    readonly $porcentajeReservado = computed(() => {
        const total = this.$totalLibros();

        return total ? Math.round((this.$reservados() / total) * 100) : 0;
    });

    readonly $categoriasActivas = computed(() => this.$categories().filter((c) => c.status).length);

    readonly $totalReservas = computed(() => this.$reservations().length);

    //Cifra secundaria real, no una tendencia inventada: no hay histórico que comparar
    readonly $reservasRecientes = computed(() => {
        const limite = Date.now() - DIAS_RECIENTES * 24 * 60 * 60 * 1000;

        return this.$reservations().filter((reserva) => {
            if (!reserva.reservationDate) return false;

            return new Date(reserva.reservationDate).getTime() >= limite;
        }).length;
    });

    readonly $totalClientes = computed(() => this.$clients().length);

    readonly $clientesConReserva = computed(() => {
        const ids = new Set(this.$reservations().map((reserva) => reserva.client?.idClient ?? reserva.idClient));

        return this.$clients().filter((cliente) => ids.has(cliente.idClient)).length;
    });

    // ---- Gráfico ----------------------------------------------------------------------

    readonly $porCategoria = computed(() => {
        const disponiblesPorCategoria = new Map<number, number>();

        for (const libro of this.$books()) {
            if (!libro.available) continue;

            disponiblesPorCategoria.set(libro.idCategory, (disponiblesPorCategoria.get(libro.idCategory) ?? 0) + 1);
        }

        return this.$categories()
            .map((categoria) => ({
                idCategory: categoria.idCategory,
                name: categoria.name,
                status: categoria.status,
                total: categoria.bookCount ?? 0,
                disponibles: disponiblesPorCategoria.get(categoria.idCategory) ?? 0,
            }))
            .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
    });

    //Denominador de las barras. Nunca cero: evita dividir por cero con el catálogo vacio.
    readonly $maximoPorCategoria = computed(() =>
        Math.max(1, ...this.$porCategoria().map((fila) => fila.total)),
    );

    reload(){
        for (const recurso of this.recursos) {
            recurso.reload();
        }
    }
}
